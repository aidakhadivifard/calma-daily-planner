# Next Steps

## Immediate

1. Commit current stable files
2. Test current planner locally
3. Add error handling for Telegram network errors

## Next Development Phase

### Step 1: Persistent Storage

Implement file-backed storage:

```text
data/users.json
```

Keep storage functions the same where possible.

### Step 2: Routine Onboarding

After `/start`, ask:

```text
سلام 🌿
برای اینکه برنامه‌ات واقعی‌تر و مهربون‌تر با بدنت باشه،
چندتا روتین روزانه‌ات رو بهم بگو
(مثل صبحانه، دارو، پیاده‌روی، جمع‌وجور کردن اتاق)

خط‌به‌خط بنویس.
اگر فعلاً نمی‌خوای بگو «رد شو».
```

### Step 3: Wellness Nudges

Add small nudges in breaks:

```text
☕ استراحت کوتاه + یه جرعه آب 💧
```

### Step 4: Local Test Tool

Add `test_local.py` so planner logic can be tested without Telegram.
