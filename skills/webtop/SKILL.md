# Webtop SmartSchool Skill

Fetch school data from Webtop SmartSchool for Amit.

## Authentication

Session cookie stored at:
- Script: `~/.openclaw/workspace/agents/school/webtop-client.js`
- Cookies: `~/.openclaw/workspace/agents/school/cookies.json`
- The key cookie is `webToken` — it expires periodically (~6 months based on expiry dates)

When cookies expire, Amit needs to log in at https://webtop.smartschool.co.il and re-export cookies via Cookie-Editor Chrome extension.

## Usage

Run the client directly:
```bash
node ~/.openclaw/workspace/agents/school/webtop-client.js
```

Or import in other scripts:
```js
const webtop = require('./agents/school/webtop-client.js');
const counters = await webtop.getMenuCounters();
const messages = await webtop.getUnreadMessages(5);
const notifs = await webtop.getUnreadNotifications();
```

## Available API Endpoints (all POST to webtopserver.smartschool.co.il/server)

| Endpoint | Description |
|---|---|
| `/api/Menu/GetMenuCounters` | Unread messages + notification counts |
| `/api/Menu/GetPreviewUnreadMessages` | Preview of unread messages |
| `/api/Menu/GetPreviewUnreadNotifications` | Unread notifications (homework updates, absences) |
| `/api/shotef/ChangesAndMessagesDataForToday` | Today's schedule changes, events, exams |
| `/api/messageBox/GetMessagesInboxData` | Full inbox (may need params) |
| `/api/dashboard/GetHomeWork` | Homework (may need user/class params) |
| `/api/dashboard/GetLatestPopupForUser` | Latest popup/alert |

## What to Surface

**In morning briefing:**
- Unread notification count if > 0
- Any homework due today (from notifications)
- Schedule changes or cancelled classes today
- Any urgent messages from teachers

**Proactively (heartbeat):**
- New homework assignments
- Absence recordings
- Class cancellations or room changes
- Messages from teachers

## Cookie Refresh

If requests return `status: false` or redirect to login, cookies have expired.
Tell Amit: "Webtop session expired — please log in at webtop.smartschool.co.il and export cookies via Cookie-Editor."
Then update `agents/school/cookies.json`.

## Cron Job

The school fetch cron runs every 20 minutes as an isolated agent session named `school-fetch`.

To check if it's registered:
```bash
openclaw cron list
```

To run manually (debug):
```bash
openclaw cron run school-fetch
```

To re-register if lost, see the full cron message in:
`docs/superpowers/specs/2026-04-14-school-alerts-design.md` (Section 2)

## Urgent Dispatch — Verification Status

The cron prompt uses `openclaw system event --text "SCHOOL_ALERT: ..." --mode now` for urgent items.
This command requires a paired OpenClaw session to run — it cannot be tested from a bare shell.
The cron agent runs as a paired session, so it should work.

**TODO:** Verify on first real urgent item (absence, cancellation, schedule change). If the event does not
fire, re-register the cron replacing `--mode now` with:
```bash
--url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
```
