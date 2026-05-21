import re

from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

from config import TELEGRAM_BOT_TOKEN
from intent_router import detect_intent, Intent

from storage import (
    get_tasks,
    get_context,
    add_constraint,
    add_task_dict,
    mark_meal_done,
    set_meal_duration,
    reset_user,
)

from scheduler import build_plan
from llm_extractor import extract_tasks_with_llm

from formatter import (
    format_plan,
    format_chat_response,
    format_constraint_saved,
)


PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"
ENGLISH_DIGITS = "0123456789"

NUMBER_WORDS = {
    "یک": 1,
    "یه": 1,
    "دو": 2,
    "سه": 3,
    "چهار": 4,
    "پنج": 5,
    "شش": 6,
    "هفت": 7,
    "هشت": 8,
    "نه": 9,
    "ده": 10,
    "یازده": 11,
    "دوازده": 12,
    "پونزده": 15,
    "پانزده": 15,
    "بیست": 20,
    "سی": 30,
    "چهل": 40,
    "پنجاه": 50,
    "شصت": 60,
}

SOCIAL_WORDS = [
    "مامان",
    "بابا",
    "دوست",
    "حرف",
    "صحبت",
    "زنگ",
    "تماس",
    "پیام",
    "چت",
]

MEAL_WORDS = [
    "ناهار",
    "ناهارو",
    "ناهارم",
    "ناهارمو",
    "ناهامو",
    "شام",
    "شامو",
    "شامم",
    "شاممو",
    "صبحانه",
    "صبحونه",
    "صبحونمو",
    "صبحانمو",
]

ADD_HINT_WORDS = [
    "باید",
    "میخوام",
    "می خوام",
    "لازمه",
    "کار دارم",
    "انجام بدم",
    "برم",
    "بخورم",
    "بخونم",
    "بنویسم",
    "درست کنم",
    "مرتب کنم",
    "جمع کنم",
    "نبستم",
    "نکردم",
    "مونده",
    "هنوز",
]


def normalize(text):
    text = str(text).strip().lower()

    for p, e in zip(PERSIAN_DIGITS, ENGLISH_DIGITS):
        text = text.replace(p, e)

    for a, e in zip(ARABIC_DIGITS, ENGLISH_DIGITS):
        text = text.replace(a, e)

    return (
        text
        .replace("ي", "ی")
        .replace("ك", "ک")
        .replace("‌", " ")
        .replace("مين", "مین")
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    reset_user(update.effective_user.id)

    await update.message.reply_text(
        "سلام 🌿 Calma آماده‌ست."
    )


async def plan_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await send_plan(update, update.effective_user.id)


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    text = update.message.text

    intent = detect_intent(text)

    if intent == Intent.CHAT:
        await update.message.reply_text(format_chat_response())
        return

    if intent == Intent.PLAN_REQUEST:
        await send_plan(update, user_id)
        return

    if intent == Intent.CONSTRAINT:
        add_constraint(user_id, text)
        await update.message.reply_text(format_constraint_saved())
        await send_plan(update, user_id)
        return

    await process_message(update, user_id, text)


async def process_message(update, user_id, text):
    tasks = get_tasks(user_id)
    parts = split_message(text)

    if not parts:
        return

    add_parts = []

    for part in parts:
        if try_status(user_id, part):
            continue

        changed = try_modify(user_id, tasks, part)

        if changed:
            continue

        if should_try_add_task(part):
            add_parts.append(part)

    if add_parts:
        await add_new_tasks_once(user_id, "\n".join(add_parts))

    await send_plan(update, user_id)


async def add_new_tasks_once(user_id, text):
    try:
        extracted = extract_tasks_with_llm(text)

        for task_data in extracted:
            add_task_dict(user_id, task_data)

    except Exception as e:
        print("LLM error:", e)


def should_try_add_task(text):
    text = normalize(text)

    if not text:
        return False

    if any(word in text for word in ADD_HINT_WORDS):
        return True

    if len(text.split()) >= 2 and infer_duration(text) is None:
        return True

    return False


def split_message(text):
    return [
        line.strip()
        for line in str(text).split("\n")
        if line.strip()
    ]


def try_status(user_id, text):
    text = normalize(text)

    if "خوردم" not in text:
        return False

    if "ناهار" in text:
        mark_meal_done(user_id, "lunch")
        return True

    if "شام" in text:
        mark_meal_done(user_id, "dinner")
        return True

    if "صبحانه" in text or "صبحونه" in text:
        mark_meal_done(user_id, "breakfast")
        return True

    return False


def try_modify(user_id, tasks, text):
    normalized = normalize(text)

    meal_subtype = infer_meal_subtype_from_text(normalized)

    if meal_subtype:
        changed_meal = try_modify_meal(
            user_id,
            tasks,
            meal_subtype,
            normalized,
        )

        if changed_meal:
            return changed_meal

    if not tasks:
        return None

    target = find_task_match(tasks, normalized)

    if not target:
        return None

    duration = infer_duration(normalized)

    if duration is None and wants_shorter(normalized):
        duration = infer_shorter_duration(target, normalized)

    if duration is None:
        return None

    duration = clamp_duration_for_task(target, duration, normalized)
    target["duration"] = duration

    if target.get("task_type") == "meal" and target.get("meal_subtype"):
        set_meal_duration(user_id, target["meal_subtype"], duration)

    return target


def try_modify_meal(user_id, tasks, meal_subtype, text):
    duration = infer_duration(text)
    current_duration = get_current_meal_duration(tasks, meal_subtype)

    if duration is None and wants_shorter(text):
        duration = max(15, current_duration - 10)

    if duration is None:
        return None

    duration = max(15, int(duration))
    set_meal_duration(user_id, meal_subtype, duration)

    for task in tasks:
        if (
            task.get("task_type") == "meal"
            and task.get("meal_subtype") == meal_subtype
        ):
            task["duration"] = duration
            return task

    return {
        "title": get_meal_title(meal_subtype),
        "duration": duration,
        "task_type": "meal",
        "meal_subtype": meal_subtype,
    }


def get_current_meal_duration(tasks, meal_subtype):
    for task in tasks:
        if (
            task.get("task_type") == "meal"
            and task.get("meal_subtype") == meal_subtype
        ):
            return int(task.get("duration", 40))

    defaults = {
        "breakfast": 25,
        "lunch": 40,
        "dinner": 40,
    }

    return defaults.get(meal_subtype, 40)


def get_meal_title(meal_subtype):
    titles = {
        "breakfast": "صبحانه",
        "lunch": "ناهار",
        "dinner": "شام",
    }

    return titles.get(meal_subtype, "غذا")


def infer_meal_subtype_from_text(text):
    text = normalize(text)

    if any(word in text for word in ["ناهار", "ناهارو", "ناهارم", "ناهارمو", "ناهامو"]):
        return "lunch"

    if any(word in text for word in ["شام", "شامو", "شامم", "شاممو"]):
        return "dinner"

    if any(word in text for word in ["صبحانه", "صبحونه", "صبحونمو", "صبحانمو"]):
        return "breakfast"

    return None


def infer_duration(text):
    text = normalize(text)

    if "نیم ساعت" in text or "نیمساعت" in text:
        return 30

    if (
        "یک ساعت و نیم" in text
        or "یه ساعت و نیم" in text
        or "1 ساعت و نیم" in text
    ):
        return 90

    digit_minute = re.search(
        r"(\d+)\s*(دقیقه|دقيقه|مین|min|minute)",
        text,
    )

    if digit_minute:
        return int(digit_minute.group(1))

    digit_hour = re.search(
        r"(\d+)\s*(ساعت|hour)",
        text,
    )

    if digit_hour:
        return int(digit_hour.group(1)) * 60

    for word, number in NUMBER_WORDS.items():
        if f"{word} دقیقه" in text or f"{word} مین" in text:
            return number

        if f"{word} ساعت" in text:
            return number * 60

    return None


def wants_shorter(text):
    shorter_words = [
        "کوتاه",
        "کوتاهتر",
        "کوتاه تر",
        "کوتاه‌تر",
        "کوتاهش",
        "کمتر",
        "کمترش",
        "زیاده",
        "زیاد گذاشتی",
    ]

    return any(word in text for word in shorter_words)


def infer_shorter_duration(task, text):
    current = int(task.get("duration", 60))

    if is_social_task(task, text):
        if current > 20:
            return 15

        return max(5, current - 5)

    if is_meal_task(task, text):
        return max(15, current - 10)

    return max(15, current - 15)


def clamp_duration_for_task(task, duration, text):
    duration = int(duration)

    if is_social_task(task, text):
        return max(5, duration)

    if is_meal_task(task, text):
        return max(15, duration)

    return max(15, duration)


def is_social_task(task, text):
    if task.get("task_type") == "social":
        return True

    combined = normalize(str(task.get("title", "")) + " " + str(text))
    return any(word in combined for word in SOCIAL_WORDS)


def is_meal_task(task, text):
    if task.get("task_type") == "meal":
        return True

    combined = normalize(str(task.get("title", "")) + " " + str(text))
    return any(word in combined for word in MEAL_WORDS)


def find_task_match(tasks, text):
    normalized_text = normalize(text)
    query_words = extract_meaningful_words(normalized_text)

    best = None
    best_score = 0

    for task in tasks:
        title = normalize(task.get("title", ""))
        title_words = extract_meaningful_words(title)

        score = len(query_words.intersection(title_words))

        if title and title in normalized_text:
            score += 3

        if score > best_score:
            best_score = score
            best = task

    if best_score >= 1:
        return best

    return None


def extract_meaningful_words(text):
    stop_words = {
        "من",
        "رو",
        "را",
        "یه",
        "یک",
        "با",
        "برای",
        "که",
        "این",
        "اون",
        "هم",
        "میخوام",
        "می",
        "کنم",
        "میکنم",
        "می‌کنم",
        "وقت",
        "بذارم",
        "بگذارم",
        "کافیه",
    }

    words = set()

    for word in normalize(text).split():
        word = word.strip()

        if len(word) <= 1:
            continue

        if word in stop_words:
            continue

        words.add(word)

    return words


async def send_plan(update, user_id):
    tasks = get_tasks(user_id)
    ctx = get_context(user_id)

    plan = build_plan(tasks, ctx)
    msg = format_plan(plan, ctx, tasks)

    await update.message.reply_text(msg)


def main():
    print("Starting Calma...")

    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("plan", plan_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("Calma running...")

    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
