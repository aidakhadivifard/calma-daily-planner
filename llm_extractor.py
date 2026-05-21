import json
from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def _safe_int(value, default=60):
    try:
        value = int(value)
        if value <= 0:
            return default
        return value
    except Exception:
        return default


def _normalize_task_type(value):
    allowed = {"meal", "study", "social", "admin", "work", "personal", "generic"}
    if value in allowed:
        return value
    return "generic"


def _normalize_meal_subtype(value):
    allowed = {"breakfast", "lunch", "dinner"}
    if value in allowed:
        return value
    return None


def extract_tasks_with_llm(text: str):
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not set in .env")

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {
                "role": "system",
                "content": """
You extract planning tasks from user messages.

User may speak casually in Persian, English, Finglish, or with typos.

Core rule:
LLM understands language.
Python decides scheduling.

Be permissive, but do not turn opinions or emotions into tasks.

Anything the user wants to do, plans to do, should do, might do,
or mentions as an activity should usually be treated as a task.

Classify each item kind as one of:
- task
- fixed_event
- constraint
- non_task

Classify each task_type as one of:
- meal
- study
- social
- admin
- work
- personal
- generic

For meal tasks, set meal_subtype as one of:
- breakfast
- lunch
- dinner

Meal examples:
"شام بخورم" -> task_type="meal", meal_subtype="dinner", title="شام خوردن"
"باید شام بخورم" -> task_type="meal", meal_subtype="dinner"
"ناهار بخورم" -> task_type="meal", meal_subtype="lunch"
"صبحونه بخورم" -> task_type="meal", meal_subtype="breakfast"

Important:
- Never output duplicate meal tasks.
- If user says "شام" and "شام خوردن", return only one dinner task.
- Do not create an extra generic task for a meal.
- Do not convert opinions into tasks.
- Do not convert "از امین بدم میاد" into a task.
- Conditional activities are still tasks.

Examples:
"میخوام دو ساعت بات بنویسم"
-> task, title="بات نوشتن", duration_minutes=120, task_type="work"

"شام درست کنم"
-> task, title="شام درست کردن", duration_minutes=45, task_type="meal", meal_subtype="dinner"

"باید شام بخورم"
-> task, title="شام خوردن", duration_minutes=40, task_type="meal", meal_subtype="dinner"

"اگر هانا بیدار شد باهاش بازی کنم"
-> task, title="بازی کردن با هانا", duration_minutes=30, task_type="personal", condition="اگر هانا بیدار شد"

"از امین بدم میاد"
-> non_task

"حوصله ندارم"
-> constraint

Return only valid JSON in this exact format:

{
  "items": [
    {
      "text": "...",
      "kind": "task",
      "title": "...",
      "duration_minutes": 60,
      "time": null,
      "task_type": "generic",
      "meal_subtype": null,
      "condition": null
    }
  ]
}
"""
            },
            {
                "role": "user",
                "content": text
            }
        ],
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    data = json.loads(content)

    items = data.get("items", [])
    tasks = []

    seen_meals = set()

    for item in items:
        kind = item.get("kind")

        if kind not in ["task", "fixed_event"]:
            continue

        title = item.get("title") or item.get("text")
        if not title:
            continue

        task_type = _normalize_task_type(item.get("task_type"))
        meal_subtype = None

        if task_type == "meal":
            meal_subtype = _normalize_meal_subtype(item.get("meal_subtype"))

            if meal_subtype in seen_meals:
                continue

            if meal_subtype:
                seen_meals.add(meal_subtype)

        duration = _safe_int(
            item.get("duration_minutes", item.get("duration", 60)),
            default=60
        )

        if task_type == "meal":
            duration = min(duration, 45)

        tasks.append({
            "title": title.strip(),
            "duration": duration,
            "type": kind,
            "task_type": task_type,
            "meal_subtype": meal_subtype,
            "time": item.get("time"),
            "condition": item.get("condition"),
            "generated_by": "user",
        })

    return tasks