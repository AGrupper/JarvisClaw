# School Alerts — Morning Briefing Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface undelivered school alerts in the morning briefing and verify urgent cron dispatch works.

**Architecture:** The morning briefing skill reads `agents/school/state.json` in parallel with its existing fetches, injects an `🏫 School Alerts` section when undelivered alerts exist, then marks them delivered after composing. No new files — two skill files updated.

**Tech Stack:** Markdown skill files (agent instructions), Node.js state file (`state.json`)

---

### Task 1: Update briefing layout reference

**Files:**
- Modify: `skills/morning-briefing/references/briefing-format.md`

- [ ] **Step 1: Add `🏫 School Alerts` to the layout block**

In `skills/morning-briefing/references/briefing-format.md`, find the layout code block:

```
✅ **Today's Tasks**

[Task list or "No tasks flagged for today."]
```

Add the school alerts section immediately after it:

```
✅ **Today's Tasks**

[Task list or "No tasks flagged for today."]

---

🏫 **School Alerts**

- [alert text]
- [alert text]
```

- [ ] **Step 2: Add omit rule under Layout rules**

In the `### Layout rules` list, add:

```
- Omit **🏫 School Alerts** section if no undelivered alerts (no heading, no divider)
- Surface urgent alerts first (where `urgent: true`), then non-urgent
```

- [ ] **Step 3: Commit**

```bash
git add skills/morning-briefing/references/briefing-format.md
git commit -m "feat(briefing): add school alerts section to layout spec"
```

---

### Task 2: Update morning briefing SKILL.md

**Files:**
- Modify: `skills/morning-briefing/SKILL.md`

- [ ] **Step 1: Add school alerts fetch to Step 1 (parallel fetches)**

In `skills/morning-briefing/SKILL.md`, find the end of the `### 1. Fetch in parallel` section (after the Garmin block). Add school alerts as a fifth parallel fetch:

```
**School alerts** (pending undelivered):
Read `~/.openclaw/workspace/agents/school/state.json`.
Extract all items in `pendingAlerts` where `delivered: false`.
If the file is missing, unreadable, or `pendingAlerts` is empty: skip silently — treat as no alerts.
```

- [ ] **Step 2: Add school alerts to Step 3 (compose)**

In `### 3. Compose the briefing`, add after the existing instruction to see `references/briefing-format.md`:

```
If there are undelivered school alerts, include the `🏫 School Alerts` section as the last section. Surface urgent alerts first (`urgent: true`), then non-urgent. Use the alert's `text` field as the bullet content.
```

- [ ] **Step 3: Add Step 3.5 — mark alerts delivered**

After `### 3. Compose the briefing` and before `### 4. Return`, insert:

```
### 3.5. Mark school alerts delivered

If school alerts were surfaced in Step 3:
- Re-read `~/.openclaw/workspace/agents/school/state.json`
- For each alert you surfaced, find the matching entry by `id` and set `delivered: true`
- Write the updated file back

If the write fails, note the failure in the briefing output but still return the briefing.
```

- [ ] **Step 4: Commit**

```bash
git add skills/morning-briefing/SKILL.md
git commit -m "feat(briefing): surface school alerts and mark delivered"
```

---

### Task 3: Verify urgent dispatch from cron session

This is a manual test — no code changes unless the test fails.

- [ ] **Step 1: Run the cron manually**

```bash
openclaw cron run school-fetch
```

Watch the main session for a `SCHOOL_ALERT` system event. Since all current items are non-urgent, no event will fire — that's expected. Confirm the run completes and `state.json` updates `lastFetch`.

- [ ] **Step 2: Force an urgent classification to test the dispatch path**

Temporarily add a fake urgent item to `agents/school/state.json` → wait, that won't work (the cron fetches live). Instead, run `fetch-and-alert.js` directly and check the output:

```bash
node ~/.openclaw/workspace/agents/school/fetch-and-alert.js --verbose
```

Then manually fire a system event to confirm `--mode now` works from a shell (which is what the cron agent does):

```bash
openclaw system event --text "SCHOOL_ALERT: test — verifying dispatch" --mode now
```

If a `SCHOOL_ALERT` system event appears in the main session: urgent dispatch works, done.

- [ ] **Step 3: If `--mode now` fails — update cron prompt**

If Step 2 shows `--mode now` doesn't fire in non-main-session contexts, re-register the cron with the explicit form. Get the current cron definition:

```bash
openclaw cron list
```

Re-register with `--url` and `--token` replacing `--mode now` in the prompt. See `docs/superpowers/specs/2026-04-14-school-alerts-design.md` Section 2 for the full cron registration command — replace:

```
openclaw system event --text "SCHOOL_ALERT: ..." --mode now
```

with:

```
openclaw system event --text "SCHOOL_ALERT: ..." --url ws://127.0.0.1:18789 --token "$OPENCLAW_GATEWAY_TOKEN"
```

- [ ] **Step 4: Commit if cron was changed**

```bash
git add skills/webtop/SKILL.md  # update cron re-registration command if stored there
git commit -m "fix(school): use explicit gateway URL for system events in cron session"
```
