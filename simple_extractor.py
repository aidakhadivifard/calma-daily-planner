def extract_simple_tasks(text: str):
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    tasks = []

    ignore_phrases = [
        "سلام",
        "سلام خوبی",
        "گفتم",
        "خب",
    ]

    for line in lines:
        clean = line.strip()

        if clean in ignore_phrases:
            continue

        if "باید" in clean:
            clean = clean.replace("من باید", "")
            clean = clean.replace("باید", "")
            clean = clean.strip()

        if "میخوام" in clean:
            clean = clean.replace("میخوام", "").strip()

        if "می‌خوام" in clean:
            clean = clean.replace("می‌خوام", "").strip()

        if len(clean) < 3:
            continue

        tasks.append({
            "title": clean,
            "duration": guess_duration(clean),
            "type": "task",
            "time": None,
        })

    return tasks


def guess_duration(title: str):
    if "دو سه ساعت" in title or "۲ ۳ ساعت" in title:
        return 150

    if "کتاب" in title or "بخونم" in title:
        return 45

    if "شام" in title or "بپزم" in title:
        return 60

    if "کد" in title or "بات" in title:
        return 120

    if "ورزش" in title or "پیاده" in title or "چرخی" in title:
        return 30

    return 60