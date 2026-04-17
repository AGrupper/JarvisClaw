---
name: morning-briefing
description: "Fetch and deliver Amit's daily briefing: weather (Tel Aviv), Google Calendar events for today, and unread Gmail highlights. Use when Amit asks for his briefing, morning briefing, or daily summary. Composes and returns the briefing directly — no status updates mid-way."
---

# Morning Briefing

Fetch calendar, weather, email, and Garmin health data, then compose and return the briefing in one shot. No intermediate status messages.

## Steps

### 1. Fetch in parallel

Run all five fetches simultaneously:

**Weather** (Tel Aviv):
```bash
curl -s "wttr.in/Tel+Aviv?format=j1"
```
Extract: `weatherDesc`, `FeelsLikeC`, `windspeedKmph` from `current_condition[0]`.

**Calendar** (today):
```bash
gws calendar +agenda --today --timezone Asia/Jerusalem --format json
```
Skip the "Holidays in Israel" calendar entirely.

**Email** (unread, last 24h):
```bash
gws gmail users messages list --params '{"userId": "me", "maxResults": 10, "q": "is:unread newer_than:1d"}' --format json
```
Then fetch metadata for each message ID:
```bash
gws gmail users messages get --params '{"userId": "me", "id": "<ID>", "format": "metadata", "metadataHeaders": ["From","Subject","Date"]}' --format json
```

**Garmin health data** (today):
```bash
uv run /Users/amitgrupper/.openclaw/workspace/skills/garmin-connect/scripts/sync_garmin.py
```
This writes to `/Users/amitgrupper/.openclaw/workspace/skills/garmin-connect/health/YYYY-MM-DD.md`. You MUST run this command and then read that file — do not skip it. If the command fails or the file does not exist after running, note the error in the briefing output (e.g. "⚠️ Garmin sync failed") so the user knows.

**School alerts** (pending undelivered):
Read `~/.openclaw/workspace/agents/school/state.json`.
Extract all items in `pendingAlerts` where `delivered: false`.
If the file is missing, unreadable, or `pendingAlerts` is empty: skip silently — treat as no alerts.

### 2. Filter email

Keep only actionable emails — real senders, meaningful subjects. Skip newsletters, promos, and marketing blasts. If nothing actionable, omit the section or note "Nothing actionable."

### 3. Compose the briefing

See `references/briefing-format.md` for the exact layout, voice spec, and how to weave the Garmin health insight into the summary line. There is no separate Body section — the health recommendation belongs in the opening summary.

If there are undelivered school alerts, include the `🏫 School Alerts` section as the last section. Surface urgent alerts first (`urgent: true`), then non-urgent. Use the alert's `summary` field as the bullet content.

### 3.5. Mark school alerts delivered

If school alerts were surfaced in Step 3:
- Re-read `~/.openclaw/workspace/agents/school/state.json`
- For each alert you surfaced, find the matching entry by `id` and set `delivered: true`. If an entry with that `id` is not found in the re-read file, skip it silently.
- Write the updated file back

If the write fails, note the failure in the briefing output but still return the briefing.

### 4. Return

Return the composed briefing directly as the reply. No preamble, no "here's your briefing", no status update before fetching.
