# School Alerts System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a background fetch-and-alert pipeline that monitors Webtop SmartSchool and Google Classroom every 20 minutes and routes new items to Jarvis as URGENT system events or NON_URGENT pendingAlerts.

**Architecture:** A pure Node.js fetcher script (`fetch-and-alert.js`) reads state.json for seen IDs, fetches both sources in parallel, deduplicates, and emits structured JSON to stdout. An isolated Claude agent (triggered by OpenClaw cron) runs the script, classifies urgency with LLM judgment, fires urgent system events, and writes all state updates. Jarvis handles alerts via a school-subagent skill and surfaces NON_URGENT items at each heartbeat.

**Tech Stack:** Node.js 25 (built-in `node:test` runner, `node:crypto` for change ID hashing), existing `webtop-client.js` and `gws-classroom.js` helpers, OpenClaw CLI (`openclaw system event`, `openclaw cron add`).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `agents/school/fetch-and-alert.js` | Create | Fetch, deduplicate, emit JSON to stdout |
| `agents/school/fetch-and-alert.test.js` | Create | Tests for pure logic (filterNew, item builders) |
| `agents/school/state.json` | Already updated | Tracks seen IDs and pendingAlerts |
| `skills/school-subagent/SKILL.md` | Create | How Jarvis interprets alerts and answers questions |
| `HEARTBEAT.md` | Modify | Add school alerts surfacing instruction |

---

## Task 1: Scaffold fetch-and-alert.js with filterNew + tests

**Files:**
- Create: `agents/school/fetch-and-alert.js`
- Create: `agents/school/fetch-and-alert.test.js`

- [ ] **Step 1: Write the failing test for filterNew**

Create `agents/school/fetch-and-alert.test.js`:

```js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// We'll require the pure helpers once they exist
// For now, define them inline to write the test first
function filterNew(items, seenIds) {
  throw new Error('not implemented');
}

describe('filterNew', () => {
  it('returns all items when seenIds is empty', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    assert.deepEqual(filterNew(items, []), items);
  });

  it('excludes items whose id is in seenIds', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    assert.deepEqual(filterNew(items, ['a', 'c']), [{ id: 'b' }]);
  });

  it('returns empty array when all items are seen', () => {
    const items = [{ id: 'x' }];
    assert.deepEqual(filterNew(items, ['x']), []);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node --test fetch-and-alert.test.js
```

Expected: fails with `Error: not implemented`

- [ ] **Step 3: Create fetch-and-alert.js with filterNew exported**

Create `agents/school/fetch-and-alert.js`:

```js
/**
 * School fetch-and-alert script
 *
 * Reads state.json for seen IDs, fetches Webtop + Classroom in parallel,
 * deduplicates, and emits structured JSON to stdout.
 * All state writes and event dispatch are handled by the calling agent.
 *
 * Usage:
 *   node fetch-and-alert.js [--verbose]
 *
 * Stdout: JSON { ok, error?, items[], meta }
 * Stderr (--verbose only): fetch counts and skipped item summaries
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STATE_PATH = path.join(__dirname, 'state.json');
const verbose = process.argv.includes('--verbose');

function log(...args) {
  if (verbose) console.error(...args);
}

/** Returns items whose id is not in seenIds */
function filterNew(items, seenIds) {
  return items.filter(item => !seenIds.includes(item.id));
}

/** Synthesize a stable ID for a Webtop today-change (API has no native ID) */
function changeId(raw) {
  return 'chg_' + crypto.createHash('md5').update(JSON.stringify(raw)).digest('hex').slice(0, 12);
}

module.exports = { filterNew, changeId };

if (require.main === module) {
  // Entry point — implemented in later tasks
  console.log(JSON.stringify({ ok: false, error: 'not_implemented' }));
}
```

- [ ] **Step 4: Update test to import from the module**

Replace the inline `filterNew` definition in the test:

```js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { filterNew } = require('./fetch-and-alert');

describe('filterNew', () => {
  it('returns all items when seenIds is empty', () => {
    const items = [{ id: 'a' }, { id: 'b' }];
    assert.deepEqual(filterNew(items, []), items);
  });

  it('excludes items whose id is in seenIds', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    assert.deepEqual(filterNew(items, ['a', 'c']), [{ id: 'b' }]);
  });

  it('returns empty array when all items are seen', () => {
    const items = [{ id: 'x' }];
    assert.deepEqual(filterNew(items, ['x']), []);
  });
});
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node --test fetch-and-alert.test.js
```

Expected:
```
▶ filterNew
  ✔ returns all items when seenIds is empty
  ✔ excludes items whose id is in seenIds
  ✔ returns empty array when all items are seen
▶ filterNew (3ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

- [ ] **Step 6: Commit**

```bash
cd /Users/amitgrupper/.openclaw/workspace
git add agents/school/fetch-and-alert.js agents/school/fetch-and-alert.test.js
git commit -m "feat(school): scaffold fetch-and-alert with filterNew + tests"
```

---

## Task 2: Add item builder helpers + tests

**Files:**
- Modify: `agents/school/fetch-and-alert.js`
- Modify: `agents/school/fetch-and-alert.test.js`

These pure builder functions map raw API responses to the structured item schema. Testing them ensures the JSON emitted to the agent is always well-formed.

- [ ] **Step 1: Write failing tests for item builders**

In `agents/school/fetch-and-alert.test.js`, replace the existing `require` line at the top with the expanded version (adds the builder names), then append the new `describe` blocks below the existing ones:

```js
// Replace line 1 of the file (the require) with:
const { filterNew, changeId, buildMessageItem, buildNotificationItem, buildChangeItem, buildAssignmentItem, buildAnnouncementItem } = require('./fetch-and-alert');

// Then append these describe blocks after the existing filterNew describe block:
const NOW = '2026-04-14T08:00:00.000Z';

describe('buildMessageItem', () => {
  it('maps Webtop message to structured item', () => {
    const raw = {
      messageId: 'msg1',
      subject: 'Test subject',
      student_F_name: 'Amit',
      student_L_name: 'G',
      sendingDate: '2026-04-14'
    };
    const item = buildMessageItem(raw, NOW);
    assert.equal(item.id, 'msg1');
    assert.equal(item.source, 'webtop');
    assert.equal(item.type, 'message');
    assert.equal(item.title, 'Test subject');
    assert.equal(item.daysUntilDue, null);
    assert.equal(item.submitted, false);
    assert.equal(item.fetchedAt, NOW);
  });
});

describe('buildAssignmentItem', () => {
  it('marks urgent when due tomorrow', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const raw = {
      id: 'cw1',
      courseName: 'Math',
      title: 'Homework 1',
      dueDate: tomorrow.toISOString(),
      submitted: false
    };
    const item = buildAssignmentItem(raw, NOW);
    assert.equal(item.id, 'cw1');
    assert.equal(item.source, 'classroom');
    assert.equal(item.type, 'assignment');
    assert.equal(item.submitted, false);
    assert.ok(item.daysUntilDue <= 1);
  });

  it('excludes submitted assignments', () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const raw = {
      id: 'cw2',
      courseName: 'Math',
      title: 'Done',
      dueDate: tomorrow.toISOString(),
      submitted: true
    };
    const item = buildAssignmentItem(raw, NOW);
    assert.equal(item, null);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node --test fetch-and-alert.test.js
```

Expected: fails with `buildMessageItem is not a function`

- [ ] **Step 3: Add builder functions to fetch-and-alert.js**

Add these functions before the `module.exports` line:

```js
/** Build a structured item from a Webtop unread message */
function buildMessageItem(raw, fetchedAt) {
  return {
    id: String(raw.messageId || raw.id),
    source: 'webtop',
    type: 'message',
    title: raw.subject || '',
    text: raw.body || raw.subject || '',
    daysUntilDue: null,
    submitted: false,
    fetchedAt
  };
}

/** Build a structured item from a Webtop notification */
function buildNotificationItem(raw, fetchedAt) {
  return {
    id: String(raw.id || raw.notificationId),
    source: 'webtop',
    type: 'notification',
    title: raw.title || raw.message?.slice(0, 80) || '',
    text: raw.message || '',
    daysUntilDue: null,
    submitted: false,
    fetchedAt
  };
}

/** Build a structured item from a Webtop today-change (synthesized ID) */
function buildChangeItem(raw, fetchedAt) {
  return {
    id: changeId(raw),
    source: 'webtop',
    type: 'change',
    title: raw.title || raw.description?.slice(0, 80) || 'Schedule change',
    text: JSON.stringify(raw),
    daysUntilDue: null,
    submitted: false,
    fetchedAt
  };
}

/**
 * Build a structured item from a Classroom assignment.
 * Returns null if the assignment is submitted (caller should filter nulls).
 */
function buildAssignmentItem(raw, fetchedAt) {
  if (raw.submitted) return null;
  const due = raw.dueDate ? new Date(raw.dueDate) : null;
  const daysUntilDue = due
    ? Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  return {
    id: String(raw.id),
    source: 'classroom',
    type: 'assignment',
    title: `${raw.courseName}: ${raw.title}`,
    text: raw.title || '',
    daysUntilDue,
    submitted: false,
    fetchedAt
  };
}

/** Build a structured item from a Classroom announcement */
function buildAnnouncementItem(raw, fetchedAt) {
  return {
    id: String(raw.id),
    source: 'classroom',
    type: 'announcement',
    title: `${raw.courseName}: announcement`,
    text: raw.text || '',
    daysUntilDue: null,
    submitted: false,
    fetchedAt
  };
}
```

Update `module.exports`:

```js
module.exports = { filterNew, changeId, buildMessageItem, buildNotificationItem, buildChangeItem, buildAssignmentItem, buildAnnouncementItem };
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node --test fetch-and-alert.test.js
```

Expected: all tests pass (5 passing)

- [ ] **Step 5: Commit**

```bash
cd /Users/amitgrupper/.openclaw/workspace
git add agents/school/fetch-and-alert.js agents/school/fetch-and-alert.test.js
git commit -m "feat(school): add item builder helpers with tests"
```

---

## Task 3: Implement main() — fetch, deduplicate, emit JSON

**Files:**
- Modify: `agents/school/fetch-and-alert.js`

This task wires up the actual fetching. Manual verification only (network calls can't be unit-tested without mocks).

- [ ] **Step 1: Replace the stub entry point in fetch-and-alert.js**

Replace the `if (require.main === module)` block with:

```js
if (require.main === module) {
  main().catch(err => {
    console.log(JSON.stringify({ ok: false, error: 'fetch_failed', detail: err.message }));
    process.exit(0);
  });
}

async function main() {
  const webtop = require('./webtop-client');
  const { fetchAllClassroomData } = require('./gws-classroom');

  // Load state for deduplication
  const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  const { seenMessageIds, seenNotificationIds, seenChangeIds, seenClassroomIds } = state;

  const fetchedAt = new Date().toISOString();

  // Fetch all sources in parallel
  let messages, notifs, changes, classroom;
  try {
    [messages, notifs, changes, classroom] = await Promise.all([
      webtop.getUnreadMessages(50),
      webtop.getUnreadNotifications(),
      webtop.getChangesAndMessagesToday(),
      fetchAllClassroomData()
    ]);
  } catch (err) {
    console.log(JSON.stringify({ ok: false, error: 'fetch_failed', detail: err.message }));
    return;
  }

  // Auth check: getMenuCounters returns null when session is expired.
  // getUnreadMessages returns [] (not null) on failure, so counters is the reliable signal.
  const counters = await webtop.getMenuCounters().catch(() => null);
  if (counters === null) {
    console.log(JSON.stringify({ ok: false, error: 'webtop_auth_expired' }));
    return;
  }

  // Build and deduplicate items
  const rawMessages = Array.isArray(messages) ? messages : [];
  const rawNotifs = (notifs?.personalNotifications || []);
  const rawChanges = Array.isArray(changes) ? changes : (changes ? [changes] : []);
  const rawAssignments = classroom?.upcoming || [];
  const rawAnnouncements = classroom?.announcements || [];

  const messageItems = filterNew(
    rawMessages.map(m => buildMessageItem(m, fetchedAt)),
    seenMessageIds
  );
  const notifItems = filterNew(
    rawNotifs.map(n => buildNotificationItem(n, fetchedAt)),
    seenNotificationIds
  );
  const changeItems = filterNew(
    rawChanges.map(c => buildChangeItem(c, fetchedAt)),
    seenChangeIds
  );
  const assignmentItems = filterNew(
    rawAssignments.map(a => buildAssignmentItem(a, fetchedAt)).filter(Boolean),
    seenClassroomIds
  );
  const announcementItems = filterNew(
    rawAnnouncements.map(a => buildAnnouncementItem(a, fetchedAt)),
    seenClassroomIds
  );

  log('[webtop] messages: fetched %d, new %d', rawMessages.length, messageItems.length);
  log('[webtop] notifications: fetched %d, new %d', rawNotifs.length, notifItems.length);
  log('[webtop] changes: fetched %d, new %d', rawChanges.length, changeItems.length);
  log('[classroom] assignments: fetched %d, new %d (submitted filtered)', rawAssignments.length, assignmentItems.length);
  log('[classroom] announcements: fetched %d, new %d', rawAnnouncements.length, announcementItems.length);
  if (state.lastFetch) {
    const minsAgo = Math.round((Date.now() - new Date(state.lastFetch)) / 60000);
    log('[state] lastFetch was %d minutes ago', minsAgo);
  }

  const items = [...messageItems, ...notifItems, ...changeItems, ...assignmentItems, ...announcementItems];

  console.log(JSON.stringify({ ok: true, meta: { fetchedAt }, items }));
}
```

- [ ] **Step 2: Run the script with --verbose to verify output**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node fetch-and-alert.js --verbose | jq .
```

Expected stdout: `{ "ok": true, "meta": { "fetchedAt": "..." }, "items": [...] }`
Expected stderr: lines like `[webtop] messages: fetched N, new N`

If Webtop cookies are expired you'll see: `{ "ok": false, "error": "webtop_auth_expired" }`
If classroom CLI is unavailable you'll see items array with only Webtop data (no error — classroom failures throw and are caught).

- [ ] **Step 3: Run existing tests to confirm nothing broke**

```bash
cd /Users/amitgrupper/.openclaw/workspace/agents/school
node --test fetch-and-alert.test.js
```

Expected: all pass

- [ ] **Step 4: Commit**

```bash
cd /Users/amitgrupper/.openclaw/workspace
git add agents/school/fetch-and-alert.js
git commit -m "feat(school): implement main fetch/dedup/emit pipeline"
```

---

## Task 4: Create `skills/school-subagent/SKILL.md`

**Files:**
- Create: `skills/school-subagent/SKILL.md`

- [ ] **Step 1: Create the skill directory and file**

```bash
mkdir -p /Users/amitgrupper/.openclaw/workspace/skills/school-subagent
```

Create `skills/school-subagent/SKILL.md`:

```markdown
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
```

- [ ] **Step 2: Verify the file exists and is readable**

```bash
cat /Users/amitgrupper/.openclaw/workspace/skills/school-subagent/SKILL.md
```

Expected: full skill content prints cleanly

- [ ] **Step 3: Commit**

```bash
cd /Users/amitgrupper/.openclaw/workspace
git add skills/school-subagent/SKILL.md
git commit -m "feat(school): add school-subagent skill"
```

---

## Task 5: Update HEARTBEAT.md

**Files:**
- Modify: `HEARTBEAT.md`

- [ ] **Step 1: Read current HEARTBEAT.md**

```bash
cat /Users/amitgrupper/.openclaw/workspace/HEARTBEAT.md
```

- [ ] **Step 2: Append school alerts section**

Add to the end of `HEARTBEAT.md`:

```markdown
## School Alerts

Read `agents/school/state.json`. If `pendingAlerts` contains any entries where `delivered` is `false`:

- Surface each alert to Amit (one line per entry, using the `summary` field)
- After surfacing, set `delivered: true` on each surfaced entry and write `state.json` back

Example output line:
> **School:** New announcement in Math — office hours moved to Thursday
```

- [ ] **Step 3: Commit**

```bash
cd /Users/amitgrupper/.openclaw/workspace
git add HEARTBEAT.md
git commit -m "feat(school): add pending alerts check to HEARTBEAT.md"
```

---

## Task 6: Register OpenClaw cron job

**Files:**
- No files created — cron is registered via CLI

The cron message is the full agent prompt. It must be self-contained — the isolated agent has no other context.

- [ ] **Step 1: Write the cron message to a temp file, then register**

Shell quoting a multi-line prompt inline is error-prone. Write the message to a file first:

```bash
cat > /tmp/school-cron-msg.txt << 'ENDOFMSG'
You are a school data fetch agent. Your only job is to run the school fetch script and dispatch alerts.

Run this command and capture its stdout:
  node /Users/amitgrupper/.openclaw/workspace/agents/school/fetch-and-alert.js

Parse the JSON output from stdout.

If ok is false:
- If error is "webtop_auth_expired": run exactly this command:
    openclaw system event --text "SCHOOL_ALERT: Webtop session expired — re-export cookies at webtop.smartschool.co.il" --mode now
- Otherwise: stop here silently (will retry next cycle).

If ok is true, process each item in items[]:

Classify as URGENT if ANY of:
- source is "webtop" and the title/text mentions absence, cancellation, or schedule change
- type is "assignment" and daysUntilDue <= 2 and submitted is false
- type is "announcement" and the text mentions: cancelled, cancellation, moved, postponed, date change, due date, exam, test, בוטל, נדחה, הגשה, מבחן, בוחן, שינוי

Classify as NON_URGENT otherwise.

For each URGENT item:
  Run: openclaw system event --text "SCHOOL_ALERT: <one-line summary in the content language>" --mode now

For each NON_URGENT item:
  Read /Users/amitgrupper/.openclaw/workspace/agents/school/state.json
  Append to pendingAlerts array:
    { "id": "<item.id>", "source": "<item.source>", "type": "<item.type>", "summary": "<one-line summary>", "addedAt": "<item.fetchedAt>", "delivered": false }
  Write state.json back.

After all items are processed, update /Users/amitgrupper/.openclaw/workspace/agents/school/state.json:
  - Add IDs of type "message" items to seenMessageIds (no duplicates)
  - Add IDs of type "notification" items to seenNotificationIds (no duplicates)
  - Add IDs of type "change" items to seenChangeIds (no duplicates)
  - Add IDs of type "assignment" or "announcement" items to seenClassroomIds (no duplicates)
  - Set lastFetch to meta.fetchedAt
  Write state.json back.
ENDOFMSG

openclaw cron add \
  --name "school-fetch" \
  --every 20m \
  --session isolated \
  --light-context \
  --message "$(cat /tmp/school-cron-msg.txt)"
```

- [ ] **Step 2: Verify the cron was registered**

```bash
openclaw cron list
```

Expected: `school-fetch` appears in the list with `every: 20m`, `session: isolated`

- [ ] **Step 3: Do a dry-run to verify the script works end-to-end**

```bash
openclaw cron run school-fetch
```

Watch the output. If items are found, verify:
- URGENT items trigger a system event (Jarvis should receive a SCHOOL_ALERT)
- NON_URGENT items appear in `agents/school/state.json` → `pendingAlerts`
- `state.json` → `lastFetch` is updated to now
- `state.json` → `seenMessageIds` / `seenClassroomIds` etc. grow

```bash
cat /Users/amitgrupper/.openclaw/workspace/agents/school/state.json | jq .
```

- [ ] **Step 4: Commit the cron message as documentation**

Document the cron payload in case it needs to be re-registered after a reset:

```bash
cd /Users/amitgrupper/.openclaw/workspace
```

Add to `skills/webtop/SKILL.md` under a new `## Cron Job` section:

```markdown
## Cron Job

The school fetch cron runs every 20 minutes as an isolated agent session named `school-fetch`.

To re-register if lost:
```bash
openclaw cron list   # check if school-fetch exists
openclaw cron add --name school-fetch --every 20m --session isolated --light-context --message "<see docs/superpowers/specs/2026-04-14-school-alerts-design.md Section 2 for full prompt>"
```

To run manually:
```bash
openclaw cron run school-fetch
```
```

```bash
git add skills/webtop/SKILL.md
git commit -m "docs(school): document cron job registration in webtop skill"
```

---

## Self-Review Checklist

After implementation, verify:

- [ ] `node fetch-and-alert.js --verbose | jq .` produces valid JSON with `ok`, `meta`, `items[]`
- [ ] Each item has `id`, `source`, `type`, `title`, `text`, `daysUntilDue`, `submitted`, `fetchedAt`
- [ ] Submitted assignments are absent from output
- [ ] Running twice without new data produces `items: []` (dedup working)
- [ ] `openclaw cron run school-fetch` updates `state.json` correctly
- [ ] `state.json` → `pendingAlerts` entries have `delivered: false`
- [ ] Heartbeat surfaces `pendingAlerts` and flips `delivered: true`
- [ ] All unit tests pass: `node --test fetch-and-alert.test.js`
