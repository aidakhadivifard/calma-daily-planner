# Product Brief: Calma

## One-liner

Calma is a gentle AI daily planner that turns messy human messages into a realistic day plan.

## Problem

People do not naturally write structured task lists. They write things like:

```text
ناهار خوردم
چمدون نبستم
بات بیشتر طول میکشه
با مامانم ۱۰ مین حرف میزنم
```

Classic task managers expect clean input. Calma accepts messy input and converts it into a plan.

## Product Principle

Calma should feel like:

```text
a calm planner friend, not a strict productivity app
```

It should help the user move forward without making the day feel heavy.

## Core Product Rules

1. The LLM understands messy language.
2. Python owns product logic.
3. Scheduling should be deterministic and explainable.
4. Avoid task-specific hardcoding.
5. Prefer generic behavior that scales to many user inputs.

## Current Capabilities

- Add tasks from free text
- Modify task duration
- Handle mixed messages
- Mark meals as already eaten
- Skip automatic meals after reasonable windows
- Split long focus work into chunks
- Add breaks between demanding tasks
- Generate friendly plan copy

## Near-term Product Goals

1. Persistent memory
2. Routine setup
3. Wellness nudges
4. Better local testing without Telegram dependency
