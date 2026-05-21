# Architecture

## High-level Design

```text
Telegram
↓
bot.py
↓
intent_router.py
↓
llm_extractor.py
↓
storage.py
↓
scheduler.py
↓
formatter.py
```

## Philosophy

```text
LLM = language understanding
Python = decision-making
```

The LLM should extract structured information from messy text. It should not decide product behavior such as scheduling rules, meal windows, or chunking logic.

## Files

### bot.py

Main Telegram interface.

Responsibilities:

- Receive user messages
- Route simple intents
- Process mixed messages
- Apply status updates
- Apply duration modifications
- Call LLM only when needed
- Rebuild and send the current plan

### intent_router.py

Lightweight coarse router.

Current intents:

- `CHAT`
- `PLAN_REQUEST`
- `CONSTRAINT`
- `MESSAGE`
- `UNKNOWN`

Important: detailed classification is handled inside `bot.py`, because many user messages contain multiple intents.

### storage.py

In-memory per-user storage.

Current data:

```python
user_tasks = {}
user_contexts = {}
```

Context includes:

```python
{
    "energy": "normal",
    "constraints": [],
    "meal_durations": {
        "breakfast": 25,
        "lunch": 40,
        "dinner": 40
    },
    "eaten_meals": {
        "breakfast": False,
        "lunch": False,
        "dinner": False
    }
}
```

Limitation: data is not persistent yet.

### scheduler.py

Owns scheduling behavior.

Responsibilities:

- Sanitize tasks
- Infer meal task subtype
- Remove meals already marked done
- Add automatic lunch/dinner when appropriate
- Respect meal duration overrides
- Split long focus tasks
- Add breaks
- Defer tasks that do not fit

### formatter.py

Converts the plan into a user-facing Telegram message.

Responsibilities:

- Friendly intro/outro
- Icons
- Plan formatting
- Deferred task formatting

### coach.py

Generates friendly explanation copy.

Should stay generic and product-level.

Good:

```text
کارهای طولانی رو تکه‌تکه کردم.
بین کارهای سنگین استراحت گذاشتم.
برای غذا هم یه زمان جدا گذاشتم که برنامه خیلی فشرده نشه.
```

Bad:

```text
رزومه را چون مهم بود...
```

## Scheduling Rules

### Meal Rules

- Auto lunch only before 14:00
- Auto dinner within dinner window
- If user says meal is done, do not schedule it again
- If user manually adds a meal, do not duplicate it
- Meal duration can be modified through context

### Chunking Rules

Long tasks are split if:

```python
duration >= 90
```

or:

```python
task_type in ["work", "study", "admin"] and duration >= 75
```

Chunks are usually 50 minutes with breaks.

## Known Architectural Issue

Current storage is RAM-only. Next phase should introduce persistent storage:

```text
data/users.json
```

This is required before routines can work properly.
