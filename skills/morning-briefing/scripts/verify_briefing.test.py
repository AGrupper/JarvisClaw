"""Unit tests for verify_briefing.py"""

import subprocess
import sys
import unittest
from pathlib import Path

SCRIPT = Path(__file__).parent / "verify_briefing.py"

FIXTURE_STATE1 = """
Good morning! Training readiness 75 (High) — your sleep score of 92 last night
means you're well-recovered. 🌤 Tel Aviv 22°C, light breeze.
"""

FIXTURE_STATE2 = """
Good morning! ⚠️ Garmin sync produced no data today — health metrics unavailable.
Tel Aviv 22°C, partly cloudy. No calendar events today.
"""

FIXTURE_STATE3 = """
Good morning! Tel Aviv 22°C, light breeze. No calendar events today.
You have 3 unread emails.
"""


def _run(text: str) -> int:
    result = subprocess.run(
        [sys.executable, str(SCRIPT)],
        input=text,
        capture_output=True,
        text=True,
    )
    return result.returncode


class TestVerifyBriefing(unittest.TestCase):
    def test_state1_health_insight_passes(self):
        self.assertEqual(_run(FIXTURE_STATE1), 0)

    def test_state2_no_data_warning_passes(self):
        self.assertEqual(_run(FIXTURE_STATE2), 0)

    def test_state3_no_garmin_fails(self):
        self.assertEqual(_run(FIXTURE_STATE3), 1)


if __name__ == "__main__":
    unittest.main()
