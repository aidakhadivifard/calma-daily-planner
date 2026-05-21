from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo


try:
    from config import CALMA_TIMEZONE
except ImportError:
    CALMA_TIMEZONE = "Asia/Tehran"


DAY_END_HOUR = 23
DAY_END_MINUTE = 30

LUNCH_START_HOUR = 12
LUNCH_END_HOUR = 14

DINNER_START_HOUR = 19
DINNER_END_HOUR = 22

DINNER_WORDS = ["شام", "dinner"]
LUNCH_WORDS = ["ناهار", "lunch"]
BREAKFAST_WORDS = ["صبحانه", "صبحونه", "breakfast"]

FOCUS_TASK_TYPES = ["work", "study", "admin"]
DO_NOT_SPLIT_TYPES = ["meal", "social", "break"]

DEFAULT_BREAK_MINUTES = 10
LOW_ENERGY_BREAK_MINUTES = 15
MAX_FOCUS_CHUNK_MINUTES = 50

DEFAULT_MEAL_DURATIONS = {
    "breakfast": 25,
    "lunch": 40,
    "dinner": 40,
}

DEFAULT_EATEN_MEALS = {
    "breakfast": False,
    "lunch": False,
    "dinner": False,
}


def build_plan(tasks, context):
    context = normalize_context(context)
    tasks = sanitize_tasks(tasks)
    tasks = remove_done_meals(tasks, context)
    tasks = prepare_tasks_for_schedule(tasks, context)

    if not tasks:
        return []

    now = get_now()
    current_time = round_to_next_quarter(now)

    day_end = current_time.replace(
        hour=DAY_END_HOUR,
        minute=DAY_END_MINUTE,
        second=0,
        microsecond=0,
    )

    plan = []
    energy = context.get("energy", "normal")
    deferred_tasks = []

    current_time = maybe_add_meal(plan, tasks, current_time, day_end, context)

    for task in tasks:
        duration = int(task.get("duration", 60))

        if task.get("task_type") == "meal":
            duration = min(duration, 45)

        start = current_time
        end = start + timedelta(minutes=duration)

        if end > day_end:
            deferred_tasks.append(task)
            continue

        plan.append({
            "title": task["title"],
            "start": start.strftime("%H:%M"),
            "end": end.strftime("%H:%M"),
            "duration": duration,
            "type": task.get("type", "task"),
            "task_type": task.get("task_type", "generic"),
            "meal_subtype": task.get("meal_subtype"),
            "condition": task.get("condition"),
            "generated_by": task.get("generated_by", "user"),
            "is_chunk": task.get("is_chunk", False),
            "parent_title": task.get("parent_title"),
            "chunk_index": task.get("chunk_index"),
            "chunk_count": task.get("chunk_count"),
        })

        current_time = end

        if task.get("task_type") == "break":
            continue

        current_time += timedelta(minutes=15 if energy == "low" else 5)
        current_time = maybe_add_meal(plan, tasks, current_time, day_end, context)

    if deferred_tasks:
        plan.append({
            "title": "بقیه کارها برای فردا بماند",
            "start": None,
            "end": None,
            "duration": 0,
            "type": "deferred",
            "tasks": [task["title"] for task in deferred_tasks],
        })

    if plan and not has_deferred_only(plan):
        last_time = get_last_real_end_time(plan)

        if last_time and last_time.hour >= 22:
            plan.append({
                "title": "آماده شدن برای خواب",
                "start": None,
                "end": None,
                "duration": 0,
                "type": "sleep_note",
            })

    return plan


def get_now():
    try:
        return datetime.now(ZoneInfo(CALMA_TIMEZONE))
    except Exception:
        return datetime.now()


def normalize_context(context):
    if context is None:
        context = {}

    context.setdefault("energy", "normal")
    context.setdefault("constraints", [])

    if "meal_durations" not in context:
        context["meal_durations"] = DEFAULT_MEAL_DURATIONS.copy()
    else:
        for meal_subtype, duration in DEFAULT_MEAL_DURATIONS.items():
            context["meal_durations"].setdefault(meal_subtype, duration)

    if "eaten_meals" not in context:
        context["eaten_meals"] = DEFAULT_EATEN_MEALS.copy()
    else:
        for meal_subtype, value in DEFAULT_EATEN_MEALS.items():
            context["eaten_meals"].setdefault(meal_subtype, value)

    return context


def prepare_tasks_for_schedule(tasks, context):
    prepared = []
    normal_tasks = []
    conditional_tasks = []

    for task in tasks:
        if task.get("condition"):
            conditional_tasks.append(task)
        else:
            normal_tasks.append(task)

    ordered_tasks = normal_tasks + conditional_tasks

    for task in ordered_tasks:
        prepared.extend(expand_task(task, context))

    return prepared


def expand_task(task, context):
    task_type = task.get("task_type", "generic")

    if task_type in DO_NOT_SPLIT_TYPES:
        return [task]

    if not should_split_task(task):
        return [task]

    return split_task_into_chunks(task, context)


def should_split_task(task):
    duration = int(task.get("duration", 60))
    task_type = task.get("task_type", "generic")

    if duration >= 90:
        return True

    if task_type in FOCUS_TASK_TYPES and duration >= 75:
        return True

    return False


def split_task_into_chunks(task, context):
    duration = int(task.get("duration", 60))
    energy = context.get("energy", "normal")
    break_duration = LOW_ENERGY_BREAK_MINUTES if energy == "low" else DEFAULT_BREAK_MINUTES

    chunks = []
    remaining = duration
    chunk_count = calculate_chunk_count(duration)
    chunk_index = 1

    while remaining > 0:
        chunk_duration = min(MAX_FOCUS_CHUNK_MINUTES, remaining)

        chunks.append({
            **task,
            "title": f"{task['title']} - بخش {chunk_index}",
            "duration": chunk_duration,
            "is_chunk": True,
            "parent_title": task["title"],
            "chunk_index": chunk_index,
            "chunk_count": chunk_count,
        })

        remaining -= chunk_duration

        if remaining > 0:
            chunks.append({
                "title": "استراحت کوتاه",
                "duration": break_duration,
                "type": "break",
                "task_type": "break",
                "meal_subtype": None,
                "time": None,
                "condition": None,
                "generated_by": "scheduler",
                "is_chunk": False,
                "parent_title": task["title"],
            })

        chunk_index += 1

    return chunks


def calculate_chunk_count(duration):
    return (duration + MAX_FOCUS_CHUNK_MINUTES - 1) // MAX_FOCUS_CHUNK_MINUTES


def sanitize_tasks(tasks):
    seen = set()
    clean = []

    for task in tasks:
        title = str(task.get("title", "")).strip()

        if not title:
            continue

        task.setdefault("duration", 60)
        task.setdefault("task_type", "generic")
        task.setdefault("meal_subtype", None)
        task.setdefault("condition", None)
        task.setdefault("generated_by", "user")
        task.setdefault("type", "task")

        inferred_meal = infer_meal_subtype_from_title(title)

        if inferred_meal:
            task["task_type"] = "meal"
            task["meal_subtype"] = inferred_meal
            task["duration"] = min(int(task.get("duration", 40)), 45)
            key = ("meal", inferred_meal)

        elif task.get("task_type") == "meal":
            key = ("meal", task.get("meal_subtype") or normalize_title(title))

        else:
            key = normalize_title(title)

        if key in seen:
            continue

        seen.add(key)
        clean.append(task)

    return clean


def remove_done_meals(tasks, context):
    clean = []

    for task in tasks:
        meal_subtype = get_task_meal_subtype(task)

        if meal_subtype and is_meal_done(context, meal_subtype):
            continue

        clean.append(task)

    return clean


def get_task_meal_subtype(task):
    if task.get("task_type") == "meal" and task.get("meal_subtype"):
        return task.get("meal_subtype")

    return infer_meal_subtype_from_title(task.get("title", ""))


def infer_meal_subtype_from_title(title):
    normalized = normalize_title(title)

    if any(word in normalized for word in DINNER_WORDS):
        return "dinner"

    if any(word in normalized for word in LUNCH_WORDS):
        return "lunch"

    if any(word in normalized for word in BREAKFAST_WORDS):
        return "breakfast"

    return None


def normalize_title(title):
    return (
        str(title)
        .strip()
        .lower()
        .replace("ي", "ی")
        .replace("ك", "ک")
        .replace("‌", " ")
        .replace("  ", " ")
    )


def has_meal_in_tasks(tasks, subtype):
    for task in tasks:
        if get_task_meal_subtype(task) == subtype:
            return True

    return False


def has_meal_in_plan(plan, subtype):
    for item in plan:
        if item.get("task_type") == "meal" and item.get("meal_subtype") == subtype:
            return True

    return False


def maybe_add_meal(plan, tasks, current_time, day_end, context):
    if should_add_auto_lunch(plan, tasks, current_time, context):
        duration = get_meal_duration_from_context(context, "lunch", 40)
        return add_auto_meal(plan, current_time, day_end, "ناهار", "lunch", duration)

    if should_add_auto_dinner(plan, tasks, current_time, context):
        duration = get_meal_duration_from_context(context, "dinner", 40)
        return add_auto_meal(plan, current_time, day_end, "شام", "dinner", duration)

    return current_time


def should_add_auto_lunch(plan, tasks, current_time, context):
    if is_meal_done(context, "lunch"):
        return False

    if has_meal_in_tasks(tasks, "lunch"):
        return False

    if has_meal_in_plan(plan, "lunch"):
        return False

    return time(LUNCH_START_HOUR, 0) <= current_time.time() < time(LUNCH_END_HOUR, 0)


def should_add_auto_dinner(plan, tasks, current_time, context):
    if is_meal_done(context, "dinner"):
        return False

    if has_meal_in_tasks(tasks, "dinner"):
        return False

    if has_meal_in_plan(plan, "dinner"):
        return False

    return time(DINNER_START_HOUR, 0) <= current_time.time() < time(DINNER_END_HOUR, 0)


def is_meal_done(context, subtype):
    return bool(context.get("eaten_meals", {}).get(subtype, False))


def get_meal_duration_from_context(context, subtype, default):
    durations = context.get("meal_durations", {})
    return int(durations.get(subtype, default))


def add_auto_meal(plan, current_time, day_end, title, subtype, duration):
    start = current_time
    end = start + timedelta(minutes=int(duration))

    if end > day_end:
        return current_time

    plan.append({
        "title": title,
        "start": start.strftime("%H:%M"),
        "end": end.strftime("%H:%M"),
        "duration": int(duration),
        "type": "meal",
        "task_type": "meal",
        "meal_subtype": subtype,
        "generated_by": "scheduler",
    })

    return end + timedelta(minutes=5)


def round_to_next_quarter(dt):
    minute = dt.minute
    add_minutes = 15 - (minute % 15)

    if add_minutes == 15:
        add_minutes = 0

    rounded = dt + timedelta(minutes=add_minutes)
    return rounded.replace(second=0, microsecond=0)


def get_last_real_end_time(plan):
    real_items = [
        item for item in plan
        if item.get("start") and item.get("end")
    ]

    if not real_items:
        return None

    last = real_items[-1]
    now = get_now()
    hour, minute = map(int, last["end"].split(":"))

    return now.replace(
        hour=hour,
        minute=minute,
        second=0,
        microsecond=0,
    )


def has_deferred_only(plan):
    return all(item.get("type") == "deferred" for item in plan)
