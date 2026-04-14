# School Alerts System — Design Spec

**Date:** 2026-04-14
**Status:** Approved

---

## Overview

A background fetch-and-alert pipeline that monitors Webtop SmartSchool and Google Classroom every 20 minutes. New items are classified as URGENT or NON_URGENT by an isolated Claude agent. URGENT items fire immediate system events to Jarvis (main session). NON_URGENT items queue in `state.json` for surfacing at the next heartbeat.

---

## Components

1. `agents/school/fetch-and-alert.js` — standalone Node.js fetcher/deduplicator
2. `skills/school-subagent/SKILL.md` — how Jarvis handles school data and alerts
3. `HEARTBEAT.md` — addition: surface pending school alerts
4. OpenClaw cron job — isolated agent session, every 20 minutes

---

## Data Flow

```
Every 20 min
    ↓
OpenClaw cron (isolated agent session)
    ↓
Agent execs: node ~/.openclaw/workspace/agents/school/fetch-and-alert.js
    ↓
Script outputs JSON to stdout:
  { ok: bool, error?, items: [...], meta: { fetchedAt } }
    ↓
Agent classifies each item: URGENT / NON_URGENT
    ↓
URGENT     → openclaw system event --text "SCHOOL_ALERT: ..." --mode now
               → Jarvis (main session) wakes up, handles alert
NON_URGENT → append to state.json pendingAlerts
    ↓
Agent updates state.json: seenIds, lastFetch, pendingAlerts
```

**Key principle:** The script is a pure data fetcher with no side effects. It reads `state.json` (for seen IDs), fetches, deduplicates, pre-computes signals, and emits clean JSON to stdout. All state mutations and event dispatch are owned by the agent.

---

## 1. `fetch-and-alert.js`

### Args

- `--verbose` — log fetch details (counts, skipped items) to stderr. Silent by default (only stdout JSON matters to agent).

### Steps

**Step 1 — Load state**
Read `agents/school/state.json`. Extract `seenMessageIds`, `seenNotificationIds`, `seenClassroomIds`.

**Step 2 — Fetch (parallel)**

- Webtop: `getUnreadMessages`, `getUnreadNotifications`, `getChangesAndMessagesToday`
- Classroom: `fetchAllClassroomData` (coursework + announcements)

**Failure handling:**
- If any Webtop call returns `status: false` → emit `{ ok: false, error: "webtop_auth_expired" }` and exit
- If any fetch throws → emit `{ ok: false, error: "fetch_failed", detail: "<message>" }` and exit
- On any failure: exit without touching `state.json` (agent skips all mutations, retries next cycle)

**Step 3 — Filter to new items only**
Cross-reference seen ID sets. Skip items whose IDs are already in the seen sets.

With `--verbose`, log to stderr:
```
[webtop] fetched 3 messages, 1 new, 2 already seen
[webtop] fetched 5 notifications, 0 new
[classroom] fetched 4 assignments, 2 new (1 submitted, skipped)
[classroom] fetched 2 announcements, 2 new
[state] lastFetch was 18 minutes ago
```

**Step 4 — Emit structured JSON to stdout**

```json
{
  "ok": true,
  "meta": { "fetchedAt": "2026-04-14T08:00:00Z" },
  "items": [
    {
      "id": "...",
      "source": "webtop|classroom",
      "type": "message|notification|change|assignment|announcement",
      "title": "...",
      "text": "...",
      "daysUntilDue": 1,
      "submitted": false,
      "fetchedAt": "2026-04-14T08:00:00Z"
    }
  ]
}
```

- `daysUntilDue` — null for non-assignment items
- `submitted` — false for non-assignment items
- Submitted assignments (submitted: true) are excluded entirely — not emitted even if new

---

## 2. Cron Message (Isolated Agent Prompt)

The full `--message` payload the isolated agent receives:

```
Run: node ~/.openclaw/workspace/agents/school/fetch-and-alert.js

Read the JSON from stdout.

If ok is false:
- If error is "webtop_auth_expired": run `openclaw system event --text "SCHOOL_ALERT: Webtop session expired — re-export cookies" --mode now`
- Otherwise: exit silently (will retry next cycle)

For each item in items[], classify as URGENT or NON_URGENT:
URGENT:
  - Any Webtop item about an absence, cancellation, or schedule change
  - Classroom assignment with daysUntilDue <= 2 and submitted false
  - Classroom announcement mentioning a cancellation, date change, due date, exam, or test
NON_URGENT:
  - Everything else

For each URGENT item: run `openclaw system event --text "SCHOOL_ALERT: <concise one-line summary>" --mode now`
For each NON_URGENT item: append to pendingAlerts in agents/school/state.json with delivered: false

Then update agents/school/state.json:
- Add all item IDs to the appropriate seen set (seenMessageIds, seenNotificationIds, seenClassroomIds)
- Set lastFetch to fetchedAt from meta
```

### Cron Setup Command

```bash
openclaw cron add \
  --name "school-fetch" \
  --every 20m \
  --session isolated \
  --light-context \
  --message "<full prompt above>"
```

---

## 3. `state.json` Schema

```json
{
  "lastFetch": "2026-04-14T08:00:00Z",
  "seenMessageIds": [],
  "seenNotificationIds": [],
  "seenClassroomIds": [],
  "pendingAlerts": [
    {
      "id": "...",
      "source": "classroom",
      "type": "announcement",
      "summary": "New announcement in Math: office hours moved to Thursday",
      "addedAt": "2026-04-14T08:00:00Z",
      "delivered": false
    }
  ]
}
```

`delivered: false` → undelivered, surface at next heartbeat
`delivered: true` → already surfaced, kept for short audit trail

---

## 4. `HEARTBEAT.md` Addition

```markdown
## School Alerts

Read agents/school/state.json. If pendingAlerts contains any entries where delivered is false:
- Surface each one to Amit (one line per alert)
- Set delivered: true on each surfaced entry in state.json
```

---

## 5. `skills/school-subagent/SKILL.md`

### Triggers

- Receives `SCHOOL_ALERT: ...` system event → surface immediately, no re-fetch needed
- Amit asks about school, assignments, schedule, homework, or teachers

### Handling SCHOOL_ALERT Events

Surface the alert text clearly to Amit. The cron agent has already classified it as urgent — no need to re-fetch or cross-reference state.json.

### Handling Amit's Questions

1. Read `agents/school/state.json` first
2. If `lastFetch` is more than 25 minutes old, or Amit asks for "latest", run the script live:
   ```bash
   node ~/.openclaw/workspace/agents/school/fetch-and-alert.js
   ```
   Read stdout and answer. Do not fire system events from here — just answer.
3. Answer concisely in Jarvis voice. If nothing pending: "No pending school alerts."

---

## Urgency Classification Reference

| Signal | Classification |
|---|---|
| Webtop: absence recorded | URGENT |
| Webtop: class cancelled / room changed | URGENT |
| Webtop: schedule change today | URGENT |
| Classroom: assignment due ≤ 2 days, not submitted | URGENT |
| Classroom: announcement with cancellation/change/exam/due date | URGENT |
| Classroom: assignment due > 2 days | NON_URGENT |
| Classroom: general announcement (no urgent signals) | NON_URGENT |
| Webtop: regular teacher message | NON_URGENT |

---

## Files To Create/Modify

| File | Action |
|---|---|
| `agents/school/fetch-and-alert.js` | Create |
| `skills/school-subagent/SKILL.md` | Create |
| `HEARTBEAT.md` | Append school alerts section |
| OpenClaw cron | Register via CLI |
