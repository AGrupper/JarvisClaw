---
name: morning-briefing
description: "Fetch and deliver Amit's daily briefing: weather (Tel Aviv), Google Calendar events for today, unread Gmail highlights, today's Readwise email, Things3 tasks, Garmin health, and Five Fingers state. Use when Amit asks for his briefing, morning briefing, or daily summary. Composes and returns the briefing directly with no status updates or process narration unless user help is required."
---

# Morning Briefing

## HARD CONSTRAINT — read before doing anything else

**Output zero text until the final composed briefing.** There are exactly two turns:

- **Turn 1:** Tool calls only — one bash block that fetches all data in parallel, then a second bash block to read results. No assistant text between or before these calls.
- **Turn 2:** The composed briefing and nothing else. No preamble. No "here's your briefing". The first character of your reply is the ☀️ emoji.

If you find yourself typing words before the briefing, stop. You are violating this constraint.

If a dependency fails but can be repaired locally, repair it first and continue. Only surface an issue to Amit when his input or credentials are actually required.

---

## Model Routing

The main agent (`openai-codex/gpt-5.4`) composes the final briefing. If future versions introduce LLM subagents for email filtering, Readwise extraction, Five Fingers classification, or any other fetch/classification work, those workers must use `minimax/MiniMax-M2.7` with `anthropic/claude-haiku-4-5` as fallback.

Do not replace deterministic script/API fetches with LLM subagents. Garmin, weather, calendar, Gmail, Things3, and Readwise fetches should stay in the parallel bash pipeline unless a source genuinely needs model judgment. Worker subagents return raw or structured data only; the main agent writes the final user-facing briefing.

---

## Turn 1 — Fetch all data (no text, tool calls only)

### Step 1a — Parallel fetch

Run this single bash block. All fetches run in the background simultaneously. Do not output any text before this call.

```bash
set -e

# Garmin sync (writes to health/<today>.md)
uv run /Users/amitgrupper/.openclaw/workspace/skills/garmin-connect/scripts/sync_garmin.py \
  > /tmp/oc-garmin.log 2>&1 &
PIDS=($!)

# Weather
curl -s "wttr.in/Tel+Aviv?format=j1" > /tmp/oc-weather.json 2>&1 &
PIDS+=($!)

# Calendar
gws calendar +agenda --today --timezone Asia/Jerusalem --format json \
  > /tmp/oc-calendar.json 2>&1 &
PIDS+=($!)

# Gmail — list unread from last 24h
gws gmail users messages list \
  --params '{"userId":"me","maxResults":10,"q":"is:unread newer_than:1d"}' \
  --format json > /tmp/oc-gmail-list.json 2>&1 &
PIDS+=($!)

# Readwise — today's daily email only
python3 /Users/amitgrupper/.openclaw/workspace/skills/morning-briefing/scripts/fetch_readwise_digest.py \
  > /tmp/oc-readwise.json 2>/tmp/oc-readwise.log &
PIDS+=($!)

# Things3 — today + overdue + due-today, grouped by area
bash /Users/amitgrupper/.openclaw/workspace/skills/things3/briefing_tasks.sh \
  > /tmp/oc-things.json 2>/tmp/oc-things.log &
PIDS+=($!)

# Wait for all
wait "${PIDS[@]}"
echo "FETCH_DONE"
```

### Step 1b — Read results

Immediately after Step 1a completes, run this second bash block (still no text output):

```bash
TODAY=$(date +%Y-%m-%d)
HEALTH_FILE="/Users/amitgrupper/.openclaw/workspace/skills/garmin-connect/health/${TODAY}.md"

echo "=== GARMIN LOG ==="; cat /tmp/oc-garmin.log
echo "=== GARMIN HEALTH ==="; [ -f "$HEALTH_FILE" ] && cat "$HEALTH_FILE" || echo "MISSING"
echo "=== WEATHER ==="; cat /tmp/oc-weather.json
echo "=== CALENDAR ==="; cat /tmp/oc-calendar.json
echo "=== GMAIL LIST ==="; cat /tmp/oc-gmail-list.json
echo "=== READWISE DIGEST ==="; cat /tmp/oc-readwise.json 2>/dev/null || echo '{"found":false,"error":"readwise fetch output missing"}'
echo "=== READWISE LOG ==="; cat /tmp/oc-readwise.log 2>/dev/null || true

# Fetch Gmail message metadata (up to 5 message IDs from the list above)
python3 - <<'EOF'
import json, subprocess, sys

try:
    data = json.load(open("/tmp/oc-gmail-list.json"))
    msgs = data.get("messages", [])[:5]
except Exception as e:
    print(f"GMAIL_LIST_ERROR: {e}")
    sys.exit(0)

for m in msgs:
    mid = m.get("id", "")
    if not mid:
        continue
    try:
        result = subprocess.run(
            ["gws", "gmail", "users", "messages", "get",
             "--params", json.dumps({"userId":"me","id":mid,"format":"metadata",
               "metadataHeaders":["From","Subject","Date"]}),
             "--format", "json"],
            capture_output=True, text=True, timeout=10
        )
        print(f"=== EMAIL {mid} ===")
        print(result.stdout)
    except Exception as e:
        print(f"EMAIL_FETCH_ERROR {mid}: {e}")
EOF

echo "=== THINGS3 TASKS ==="; cat /tmp/oc-things.json 2>/dev/null || echo "MISSING"

echo "=== FIVE FINGERS ==="
FF="/Users/amitgrupper/.openclaw/workspace/agents/five-fingers/state.json"
[ -f "$FF" ] && cat "$FF" || echo '{"exampleMessages":[],"teammates":[],"lastMorningBriefingMention":null}'
```

---

## Turn 2 — Compose, verify, deliver

Now compose the briefing from everything returned above. Follow `references/briefing-format.md` exactly for layout, voice, and Garmin health interpretation.

**Email filtering:** Keep only actionable emails — real senders with meaningful subjects. Skip newsletters, promotions, and marketing. If nothing actionable, omit the section or note "Nothing actionable."

**Readwise section:** Always include `📚 **Readwise**`. Use `=== READWISE DIGEST ===`, which contains today's Readwise email only. Include the full daily Readwise content: all highlight snippets from the email, preserving book/source attribution when present. Do not summarize down to 1-3 bullets, do not omit highlights, and do not look beyond today's email. If `found` is false or the body is empty, include `⚠️ Today's Readwise email was not found.` in the Readwise section.

**Five Fingers section:** Apply the logic in `skills/five-fingers/SKILL.md`, passing today's calendar events and the Five Fingers state. Include the section if practice is today or relevant.

**Garmin states:**
- Health file found with data → weave health insight into summary line (see briefing-format.md)
- Health file missing or empty → include `⚠️ Garmin sync produced no data today` in summary line
- Sync was never attempted → this is a bug; go back and run Step 1a now

### Garmin guard — run before returning

```bash
printf '%s' "<your composed briefing>" | uv run /Users/amitgrupper/.openclaw/workspace/skills/morning-briefing/scripts/verify_briefing.py
```

- Exit 0 → deliver the briefing as your reply (first character: ☀️)
- Exit non-zero → re-run Step 1a for Garmin only, recompose, re-verify. Up to 2 retries. If still failing, reply with an explicit error — do not deliver a Garmin-less briefing silently.
