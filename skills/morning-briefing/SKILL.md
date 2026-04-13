---
name: morning-briefing
description: "Fetch and deliver Amit's daily briefing: weather (Tel Aviv), Google Calendar events for today, and unread Gmail highlights. Use when Amit asks for his briefing, morning briefing, or daily summary. Composes and returns the briefing directly — no status updates mid-way."
---

# Morning Briefing

Fetch calendar, weather, email, and Garmin health data, then compose and return the briefing in one shot. No intermediate status messages.

## Steps

### 1. Fetch in parallel

Run all four fetches simultaneously:

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
uv run ~/.openclaw/workspace/skills/garmin-connect/scripts/sync_garmin.py
```
This writes to `~/.openclaw/workspace/skills/garmin-connect/health/YYYY-MM-DD.md`. Read that file after the sync completes.

### 2. Filter email

Keep only actionable emails — real senders, meaningful subjects. Skip newsletters, promos, and marketing blasts. If nothing actionable, omit the section or note "Nothing actionable."

### 3. Compose the briefing

See `references/briefing-format.md` for the exact layout and voice spec. Include the 💪 Body section using the Garmin health file data.

### 4. Return

Return the composed briefing directly as the reply. No preamble, no "here's your briefing", no status update before fetching.
