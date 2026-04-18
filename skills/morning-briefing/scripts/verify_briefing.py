# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""Verify a morning briefing has a Garmin health mention before delivery.

Reads briefing text from stdin. Exits 0 if Garmin State 1 or State 2 is
present; exits 1 (with diagnostic on stderr) if Garmin was not attempted.

Usage:
    echo "<briefing text>" | uv run verify_briefing.py
"""

import sys

# State 1: health insight woven into summary
STATE1_KEYWORDS = {
    "sleep score", "training readiness", "hrv", "heart rate variability",
    "recovery", "body battery", "stress score", "resting heart rate",
    "sleep quality", "readiness",
}

# State 2: sync ran but produced no data
STATE2_PHRASE = "garmin sync produced no data today"


def check(text: str) -> tuple[bool, str]:
    lower = text.lower()
    if STATE2_PHRASE in lower:
        return True, "state-2: sync ran, no data (warning present)"
    for kw in STATE1_KEYWORDS:
        if kw in lower:
            return True, f"state-1: health insight found ('{kw}')"
    return False, (
        "state-3 bug: Garmin not mentioned in briefing. "
        "Garmin sync was likely skipped. Return to Step 1 and re-run sync."
    )


def main() -> int:
    text = sys.stdin.read()
    ok, msg = check(text)
    if ok:
        return 0
    print(f"GARMIN GUARD FAILED: {msg}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
