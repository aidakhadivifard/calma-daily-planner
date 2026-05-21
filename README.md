# Calma Daily Planner

Calma is a Telegram-based AI daily planner.

Core idea:

```text
LLM = language understanding
Python = product logic and scheduling decisions
```

Calma helps users turn messy daily thoughts into a practical schedule. It understands tasks, constraints, meal updates, and duration changes, then rebuilds the plan.

## Current Version

Calma v2.1 focuses on:

- Multi-user task storage
- Mixed-message handling
- Meal awareness
- Duration modification
- Long-task chunking
- Friendly coaching copy

## Main Flow

```text
User message
↓
intent_router.py
↓
bot.py
↓
storage.py
↓
scheduler.py
↓
formatter.py
↓
Telegram response
```

## Run Locally

```bash
cd C:\Users\aidak\calma\calma-v2
.venv\Scripts\activate.bat
python bot.py
```

## Important Note

Telegram connectivity may require a stable network/proxy depending on location. If the bot starts but fails at `reply_text`, it is usually a network issue, not a scheduling bug.
