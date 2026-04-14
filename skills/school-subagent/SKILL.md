---
name: school-subagent
description: "Handle school alerts and answer questions about Amit's school schedule, assignments, and notifications. Use when a SCHOOL_ALERT system event arrives, or when Amit asks about school, homework, assignments, classes, teachers, or schedule."
---

# School Subagent

Handle incoming school alerts and answer Amit's school-related questions.

## Triggers

- A `SCHOOL_ALERT: ...` system event arrives
- Amit asks about school, homework, assignments, schedule, classes, or teachers

## Handling SCHOOL_ALERT Events

Surface the alert immediately, verbatim. The cron agent has already classified it as urgent — do not re-fetch or second-guess.

Format:
> **School alert:** <alert text>

If the alert is "Webtop session expired — re-export cookies", tell Amit clearly:
> Webtop session expired. Log in at webtop.smartschool.co.il and export cookies via Cookie-Editor, then save to `~/.openclaw/workspace/agents/school/cookies.json`.

## Answering Amit's Questions

**Step 1 — Read state first**

```bash
cat ~/.openclaw/workspace/agents/school/state.json
```

Check `lastFetch`. If it was more than 25 minutes ago, or if Amit asks for "latest" / "right now", run a live fetch:

```bash
node ~/.openclaw/workspace/agents/school/fetch-and-alert.js --verbose
```

Read stdout (JSON). Use the items array to answer. Do not fire system events from here — just answer.

**Step 2 — Answer concisely**

- List pending assignments with due dates
- Surface any unread alerts or announcements
- If nothing pending: "No pending school alerts."

**Tone:** Jarvis voice — precise, no filler. One line per item unless detail is needed.
