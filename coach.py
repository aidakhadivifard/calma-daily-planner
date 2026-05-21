def build_plan_intro(plan: list, tasks: list, context: dict):
    if not plan:
        return ""

    notes = []

    energy = context.get("energy", "normal")

    if energy == "low":
        notes.append("امروز برنامه رو سبک‌تر چیدم چون گفتی انرژی‌ات کمه.")

    if has_chunked_tasks(plan):
        notes.append("کارهای طولانی رو تکه‌تکه کردم که خسته‌کننده نشه.")

    if has_breaks(plan):
        notes.append("بین کارهای سنگین کمی استراحت گذاشتم.")

    if has_deferred_tasks(plan):
        notes.append("چیزهایی که امشب جا نمی‌شدن رو برای فردا گذاشتم.")

    if has_conditional_tasks(plan):
        notes.append("کارهایی که به شرطی بستگی دارن رو عقب‌تر گذاشتم.")

    if has_auto_meals(plan):
        notes.append("برای غذا هم یه زمان جدا گذاشتم که برنامه خیلی فشرده نشه.")

    if not notes:
        notes.append("برنامه رو طوری چیدم که کارها پشت‌سرهم ولی قابل انجام باشن.")

    return "چیدمانم اینطوریه: " + " ".join(notes[:3]) + "\n\n"


def build_plan_outro(plan: list, tasks: list, context: dict):
    suggestions = []

    if has_chunked_tasks(plan):
        suggestions.append("اگر یکی از بخش‌ها زیادی کوتاه یا طولانیه، بگو تا تنظیمش کنم.")

    if has_deferred_tasks(plan):
        suggestions.append("برای فردا می‌تونیم فقط مهم‌ترین عقب‌افتاده‌ها رو نگه داریم.")

    if has_conditional_tasks(plan):
        suggestions.append("اگر شرط یکی از کارها اتفاق نیفتاد، می‌تونم جاش رو عوض کنم.")

    if has_auto_meals(plan):
        suggestions.append("اگر غذا رو قبلاً خوردی یا زمانش فرق داره، بگو تا اصلاح کنم.")

    if not suggestions:
        suggestions.append("اگر یه بخشش با واقعیت روزت نمی‌خونه، بگو تا جابه‌جاش کنم.")

    return " ".join(suggestions[:2])


def has_chunked_tasks(plan: list):
    return any(item.get("is_chunk") for item in plan)


def has_breaks(plan: list):
    return any(item.get("task_type") == "break" for item in plan)


def has_deferred_tasks(plan: list):
    return any(item.get("type") == "deferred" for item in plan)


def has_conditional_tasks(plan: list):
    return any(item.get("condition") for item in plan)


def has_auto_meals(plan: list):
    return any(
        item.get("task_type") == "meal"
        and item.get("generated_by") == "scheduler"
        for item in plan
    )