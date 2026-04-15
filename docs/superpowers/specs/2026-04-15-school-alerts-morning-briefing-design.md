# School Alerts — Morning Briefing Integration

**Date:** 2026-04-15
**Status:** Approved

---

## Problem

Non-urgent school alerts (lost/found notices, book returns, announcements) accumulate in `agents/school/state.json` → `pendingAlerts` but are never surfaced to Amit. The morning briefing doesn't read them. Urgent alerts are dispatched immediately by the cron agent via `openclaw system event`, but this path has not been tested yet.

---

## Goals

1. Non-urgent alerts appear in the morning briefing (once, then marked delivered)
2. Urgent alerts fire immediately when the cron detects them (verify existing path works)

---

## Non-Urgent Alerts: Morning Briefing Integration

### Step 1.5 — Read school alerts (parallel with existing fetches)

Read `~/.openclaw/workspace/agents/school/state.json`.
Extract all items in `pendingAlerts` where `delivered: false`.
If the file is missing or unreadable, skip silently.

### Briefing layout

Add `🏫 **School Alerts**` as the last section, only when there are undelivered alerts.
Surface urgent items first (`urgent: true`), then non-urgent.

```
---

🏫 **School Alerts**

- [alert text]
- [alert text]
```

If no undelivered alerts: omit the section entirely (no heading, no divider).

### After composing the briefing

Set `delivered: true` on each surfaced alert in `state.json` and write the file back.
This prevents the same alerts from appearing in future briefings.

---

## Urgent Alerts: Verify Cron Dispatch

The cron prompt already contains:
```
For each URGENT item: run `openclaw system event --text "SCHOOL_ALERT: <summary>" --mode now`
```

**Test plan:**
1. Run `openclaw cron run school-fetch` manually
2. Temporarily inject a Webtop notification containing "חיסור" (absence) to trigger urgent classification
3. Confirm a `SCHOOL_ALERT` system event fires in the main session

**If `--mode now` works:** no changes needed to the cron.
**If it fails:** update the cron prompt to use the explicit form:
```bash
openclaw system event --text "SCHOOL_ALERT: <summary>" --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
```

---

## Files Changed

| File | Change |
|---|---|
| `skills/morning-briefing/SKILL.md` | Add Step 1.5 (read school alerts), add `🏫 School Alerts` section to layout, mark delivered after surfacing |
| `skills/morning-briefing/references/briefing-format.md` | Add `🏫 School Alerts` section to layout reference |

---

## Out of Scope

- Changing how the cron classifies items (urgent vs non-urgent logic is correct)
- Changing how `fetch-and-alert.js` works
- Delivering non-urgent alerts via heartbeat (user explicitly does not want hourly summaries)
