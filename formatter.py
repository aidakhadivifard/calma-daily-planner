from coach import build_plan_intro, build_plan_outro


def format_plan(plan: list, context: dict, tasks: list | None = None):
    if not plan:
        return "فعلاً کاری برای برنامه‌ریزی ندارم 🌿"

    tasks = tasks or []
    energy = context.get("energy", "normal")

    if energy == "low":
        message = "برنامه امروزت رو سبک‌تر چیدم، چون گفتی انرژی‌ات کمه 🌿\n\n"
    else:
        message = "برنامه امروزت آماده‌ست 🌿\n\n"

    intro = build_plan_intro(plan, tasks, context)
    if intro:
        message += intro

    for item in plan:
        item_type = item.get("type")

        if item_type == "deferred":
            message += "\n⏳ اینا امشب جا نمی‌شن و بهتره برای فردا بمونن:\n"
            for task_title in item.get("tasks", []):
                message += f"• {task_title}\n"
            continue

        if item_type == "sleep_note":
            message += "\n🌙 چون برنامه تا دیر وقت کشیده، بهتره بعدش بری سمت آماده شدن برای خواب.\n"
            continue

        start = item.get("start")
        end = item.get("end")
        title = item.get("title", "بدون عنوان")
        condition = item.get("condition")

        icon = get_item_icon(item)

        if condition:
            message += f"{icon} {start} تا {end} — {title}؛ اگر {clean_condition(condition)}\n"
        else:
            message += f"{icon} {start} تا {end} — {title}\n"

    outro = build_plan_outro(plan, tasks, context)
    if outro:
        message += f"\n{outro}"

    message += "\n\nاگر چیزی رو می‌خوای جابه‌جا یا سبک‌تر کنم، بهم بگو 🌿"

    return message


def get_item_icon(item: dict):
    item_type = item.get("type")
    task_type = item.get("task_type")
    meal_subtype = item.get("meal_subtype")

    if item_type == "break" or task_type == "break":
        return "☕"

    if item_type == "meal" or task_type == "meal":
        if meal_subtype == "breakfast":
            return "🍳"
        if meal_subtype == "lunch":
            return "🍽️"
        if meal_subtype == "dinner":
            return "🍽️"
        return "🍽️"

    if task_type == "work":
        return "💻"

    if task_type == "study":
        return "📚"

    if task_type == "social":
        return "🤝"

    if task_type == "admin":
        return "🗂️"

    if task_type == "personal":
        return "🌿"

    return "•"


def clean_condition(condition: str):
    condition = str(condition).strip()

    if condition.startswith("اگر "):
        condition = condition[4:]

    return condition


def format_task_added(task: dict):
    return f"اوکی، «{task['title']}» رو اضافه کردم ✅"


def format_constraint_saved():
    return "باشه، اینو توی برنامه‌ریزی امروز در نظر می‌گیرم 🌿"


def format_chat_response():
    return "سلام 🌿 بگو امروز چه کارهایی داری؟"


def format_unknown_response():
    return "درست متوجه نشدم. می‌خوای یه کار اضافه کنم یا برنامه امروزت رو بسازم؟"