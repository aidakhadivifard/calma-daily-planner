from enum import Enum


class Intent(Enum):
    CHAT = "chat"
    PLAN_REQUEST = "plan_request"
    CONSTRAINT = "constraint"
    MESSAGE = "message"
    UNKNOWN = "unknown"


CHAT_WORDS = [
    "سلام",
    "hello",
    "hi",
    "درود",
]

PLAN_WORDS = [
    "برنامه",
    "/plan",
    "پلن",
    "plan",
    "چی کار کنم",
    "چیکار کنم",
]

CONSTRAINT_WORDS = [
    "خسته",
    "حال ندارم",
    "حوصله ندارم",
    "انرژی ندارم",
    "سرم شلوغه",
    "وقت ندارم",
]


def normalize_text(text):
    return (
        str(text)
        .strip()
        .lower()
        .replace("ي", "ی")
        .replace("ك", "ک")
        .replace("‌", " ")
    )


def contains_any(text, words):
    return any(word in text for word in words)


def detect_intent(text):
    text = normalize_text(text)

    if not text:
        return Intent.UNKNOWN

    if text in CHAT_WORDS:
        return Intent.CHAT

    if contains_any(text, PLAN_WORDS):
        return Intent.PLAN_REQUEST

    if contains_any(text, CONSTRAINT_WORDS):
        return Intent.CONSTRAINT

    return Intent.MESSAGE
