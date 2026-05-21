# Roadmap

## Phase 1: Stabilize Current Planner

Status: mostly done

Goals:

- Mixed-message handling
- Duration parsing
- Persian and English digits
- Meal duration updates
- Better social task duration
- Avoid unnecessary LLM calls

Example inputs:

```text
ناهار رو ۲۰ دقیقه کن
با مامانم ۵ مین حرف میزنم
چمدون نبستم
```

## Phase 2: Persistent Storage

Goal: user data survives bot restart.

Add:

```text
data/users.json
```

New persistent structure:

```python
{
    "user_id": {
        "tasks": [],
        "context": {},
        "routines": [],
        "routine_history": {}
    }
}
```

Required before routines.

## Phase 3: Routine Layer

Goal: Calma remembers repeated activities.

Example:

```text
هفته‌ای سه روز ورزش
هر روز دارو بخورم
صبح‌ها تخت رو مرتب کنم
```

Routine object:

```python
{
    "id": 1,
    "title": "ورزش",
    "duration": 45,
    "frequency": {
        "type": "weekly",
        "days_per_week": 3
    },
    "preferred_time": "evening",
    "active": True
}
```

Routines should not be copied into `tasks`. Scheduler should merge them temporarily when building the daily plan.

## Phase 4: Wellness Nudges

Goal: make Calma healthier and cuter without being annoying.

Examples:

```text
💧 یه جرعه آب بخور
🌿 دو دقیقه کشش
🫶 یه نفس عمیق
```

Rules:

- Nudges are not heavy tasks
- Add inside breaks or after focus chunks
- Avoid too many reminders
- Contextual, not every 30 minutes

## Phase 5: Local Test Harness

Goal: test planner without Telegram.

Add:

```text
test_local.py
```

It should allow:

```bash
python test_local.py
```

And simulate messages locally.
