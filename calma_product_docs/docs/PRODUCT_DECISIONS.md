# Product Decisions

## Decision 1: LLM does not own scheduling

The LLM extracts meaning. Python owns scheduling decisions.

Reason:

- More reliable
- Easier to debug
- Avoids unpredictable plans

## Decision 2: Mixed messages are processed part-by-part

A message can include multiple intents.

Example:

```text
ناهار خوردم
چمدون نبستم
بات دو ساعت طول میکشه
```

This should not become one global intent.

## Decision 3: Routines are not daily tasks

Routines are long-term memory.

Daily tasks are temporary.

This avoids duplicates and makes future persistence cleaner.

## Decision 4: Wellness nudges are not normal tasks

Hydration/stretch prompts should feel light.

They should appear inside breaks or as small notes.

## Decision 5: Avoid task-title hardcoding

Do not write logic like:

```python
if title == "رزومه":
    ...
```

Prefer generic rules based on:

- duration
- task_type
- meal subtype
- frequency
- user context
