# Test Plan

## Basic Bot Startup

```bash
python bot.py
```

Expected:

```text
Starting Calma...
Calma running...
```

If Telegram errors with `httpx.ConnectError`, it is a network issue.

## Core Tests

### Add Tasks

Input:

```text
چمدون نبستم
```

Expected:

- Adds packing task
- Does not treat as modify

### Meal Done

Input:

```text
ناهار خوردم
```

Expected:

- Marks lunch as done
- Removes/skips lunch from current plan
- Auto lunch should not return

### Meal Duration

Input:

```text
ناهار رو ۲۰ دقیقه کن
```

Expected:

- Lunch duration becomes 20 minutes
- Auto lunch uses context duration

### Social Duration

Input:

```text
با مامانم ۵ مین حرف میزنم
```

Expected:

- Matches existing mom/social task if present
- Allows duration below 15 minutes for social tasks

### Long Task Chunking

Input:

```text
روی پروژه ۳ ساعت کار کنم
```

Expected:

- Split into focus chunks
- Add breaks between chunks

### Mixed Message

Input:

```text
کلاس دو ساعت طول میکشه
با مامانم ۱۰ دقیقه حرف میزنم
چمدون نبستم
```

Expected:

- Modify existing class if present
- Modify social task if present
- Add packing as new task
- Only one LLM call for new task parts

## Regression Tests

- No duplicate meals
- No lunch auto-added after 14:00
- No global task leakage between users
- No string duration like `"shorter"` enters scheduler
