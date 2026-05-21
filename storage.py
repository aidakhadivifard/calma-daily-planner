user_tasks = {}
user_contexts = {}


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


def _default_context():
    return {
        "energy": "normal",
        "constraints": [],
        "meal_durations": DEFAULT_MEAL_DURATIONS.copy(),
        "eaten_meals": DEFAULT_EATEN_MEALS.copy(),
    }


def _normalize_context(context: dict):
    if "energy" not in context:
        context["energy"] = "normal"

    if "constraints" not in context:
        context["constraints"] = []

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


def _get_user_task_list(user_id: int):
    if user_id not in user_tasks:
        user_tasks[user_id] = []

    return user_tasks[user_id]


def _get_user_context(user_id: int):
    if user_id not in user_contexts:
        user_contexts[user_id] = _default_context()

    return _normalize_context(user_contexts[user_id])


def add_task(
    user_id: int,
    title: str,
    duration: int = 60,
    task_type: str = "generic",
    time: str | None = None,
    meal_subtype: str | None = None,
    condition: str | None = None,
    generated_by: str = "user",
):
    tasks = _get_user_task_list(user_id)

    task = {
        "id": len(tasks) + 1,
        "title": title,
        "duration": int(duration),
        "type": "task",
        "task_type": task_type,
        "meal_subtype": meal_subtype,
        "time": time,
        "condition": condition,
        "generated_by": generated_by,
        "done": False,
    }

    tasks.append(task)
    return task


def add_task_dict(user_id: int, task_data: dict):
    tasks = _get_user_task_list(user_id)

    title = task_data.get("title")
    if not title:
        return None

    task = {
        "id": len(tasks) + 1,
        "title": title,
        "duration": int(task_data.get("duration", 60)),
        "type": task_data.get("type", "task"),
        "task_type": task_data.get("task_type", "generic"),
        "meal_subtype": task_data.get("meal_subtype"),
        "time": task_data.get("time"),
        "condition": task_data.get("condition"),
        "generated_by": task_data.get("generated_by", "user"),
        "done": bool(task_data.get("done", False)),
    }

    tasks.append(task)
    return task


def get_tasks(user_id: int):
    return _get_user_task_list(user_id)


def clear_tasks(user_id: int):
    _get_user_task_list(user_id).clear()


def add_constraint(user_id: int, text: str):
    context = _get_user_context(user_id)
    context["constraints"].append(text)

    normalized = str(text).lower()

    if (
        "خسته" in normalized
        or "حوصله ندارم" in normalized
        or "حال ندارم" in normalized
        or "انرژی ندارم" in normalized
    ):
        context["energy"] = "low"

    return context


def get_context(user_id: int):
    return _get_user_context(user_id)


def set_meal_duration(user_id: int, meal_subtype: str, duration: int):
    context = _get_user_context(user_id)

    if meal_subtype not in DEFAULT_MEAL_DURATIONS:
        return context

    context["meal_durations"][meal_subtype] = max(15, int(duration))
    return context


def get_meal_duration(user_id: int, meal_subtype: str):
    context = _get_user_context(user_id)
    return context["meal_durations"].get(meal_subtype)


def mark_meal_done(user_id: int, meal_subtype: str):
    context = _get_user_context(user_id)

    if meal_subtype in context["eaten_meals"]:
        context["eaten_meals"][meal_subtype] = True

    return context


def mark_meal_not_done(user_id: int, meal_subtype: str):
    context = _get_user_context(user_id)

    if meal_subtype in context["eaten_meals"]:
        context["eaten_meals"][meal_subtype] = False

    return context


def is_meal_done(context: dict, meal_subtype: str):
    context = _normalize_context(context)
    return bool(context["eaten_meals"].get(meal_subtype, False))


def clear_eaten_meals(user_id: int):
    context = _get_user_context(user_id)
    context["eaten_meals"] = DEFAULT_EATEN_MEALS.copy()
    return context


def clear_context(user_id: int):
    user_contexts[user_id] = _default_context()
    return user_contexts[user_id]


def reset_user(user_id: int):
    clear_tasks(user_id)
    clear_context(user_id)
