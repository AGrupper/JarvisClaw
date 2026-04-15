#!/usr/bin/env node
/**
 * fetch-and-alert.js
 * Fetches school data from Webtop and Google Classroom.
 * Outputs clean JSON to stdout. No side effects — agent handles state + alerts.
 *
 * Usage:
 *   node fetch-and-alert.js [--verbose]
 *
 * Output:
 *   { ok: true, meta: { fetchedAt }, items: [...] }
 *   { ok: false, error: "webtop_auth_expired"|"fetch_failed", detail?: "..." }
 */

const path = require('path');
const { execSync } = require('child_process');

const verbose = process.argv.includes('--verbose');
const log = (...args) => { if (verbose) process.stderr.write(args.join(' ') + '\n'); };

// ── Load state (seen IDs only) ───────────────────────────────────────────────

const STATE_PATH = path.join(__dirname, 'state.json');

function loadState() {
  try {
    return JSON.parse(require('fs').readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { seenMessageIds: [], seenNotificationIds: [], seenChangeIds: [], seenClassroomIds: [] };
  }
}

// ── Webtop ───────────────────────────────────────────────────────────────────

const webtop = require('./webtop-client');

async function fetchWebtop(state) {
  const items = [];

  // Messages
  let messages = [];
  try {
    messages = await webtop.getUnreadMessages(50);
    const newMsgs = messages.filter(m => m.senderId && !state.seenMessageIds.includes(String(m.senderId + '_' + m.sendingDate)));
    log(`[webtop] fetched ${messages.length} messages, ${newMsgs.length} new`);
    for (const m of newMsgs) {
      items.push({
        id: m.senderId + '_' + m.sendingDate,
        source: 'webtop',
        type: 'message',
        title: m.subject || '(no subject)',
        text: `From: ${m.student_F_name || ''} ${m.student_L_name || ''}. ${m.subject || ''}`,
        daysUntilDue: null,
        submitted: false,
        fetchedAt: new Date().toISOString()
      });
    }
  } catch (e) {
    throw new Error('webtop_messages: ' + e.message);
  }

  // Notifications
  let notifs = [];
  try {
    const result = await webtop.getUnreadNotifications();
    const personal = result?.personalNotifications || [];
    const newNotifs = personal.filter(n => !state.seenNotificationIds.includes(String(n.id || n.itemId)));
    log(`[webtop] fetched ${personal.length} notifications, ${newNotifs.length} new`);
    for (const n of newNotifs) {
      items.push({
        id: String(n.id || n.itemId),
        source: 'webtop',
        type: 'notification',
        title: n.message?.slice(0, 80) || 'Notification',
        text: n.message || '',
        daysUntilDue: null,
        submitted: false,
        fetchedAt: new Date().toISOString()
      });
    }
  } catch (e) {
    throw new Error('webtop_notifications: ' + e.message);
  }

  // Today changes
  try {
    const changes = await webtop.getChangesAndMessagesToday();
    const allChanges = [
      ...(changes?.changes || []),
      ...(changes?.events || []),
    ];
    const newChanges = allChanges.filter(c => !state.seenChangeIds.includes(String(c.id)));
    log(`[webtop] fetched ${allChanges.length} changes, ${newChanges.length} new`);
    for (const c of newChanges) {
      items.push({
        id: String(c.id),
        source: 'webtop',
        type: 'change',
        title: c.title || c.description || 'Schedule change',
        text: c.description || c.title || '',
        daysUntilDue: null,
        submitted: false,
        fetchedAt: new Date().toISOString()
      });
    }
  } catch (e) {
    log('[webtop] changes fetch failed (non-fatal):', e.message);
  }

  return items;
}

// ── Google Classroom ─────────────────────────────────────────────────────────

function gws(args) {
  try {
    const out = execSync(`gws ${args}`, { encoding: 'utf8', timeout: 15000, stdio: ['pipe', 'pipe', 'pipe'] });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

async function fetchClassroom(state) {
  const items = [];
  const now = new Date();

  const coursesResult = gws('classroom courses list --params \'{"studentId": "me", "courseStates": ["ACTIVE"]}\'');
  const courses = coursesResult?.courses || [];
  log(`[classroom] found ${courses.length} active courses`);

  for (const course of courses) {
    // Coursework
    const cwResult = gws(`classroom courses.courseWork list --params '{"courseId": "${course.id}", "courseWorkStates": ["PUBLISHED"], "orderBy": "dueDate asc"}'`);
    const courseWork = cwResult?.courseWork || [];

    for (const cw of courseWork) {
      if (!cw.dueDate) continue;
      if (state.seenClassroomIds.includes(cw.id)) continue;

      const due = new Date(`${cw.dueDate.year}-${String(cw.dueDate.month).padStart(2,'0')}-${String(cw.dueDate.day).padStart(2,'0')}`);
      const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
      if (daysUntilDue < 0 || daysUntilDue > 14) continue; // skip past or far future

      // Check submission status
      const subsResult = gws(`classroom courses.courseWork.studentSubmissions list --params '{"courseId": "${course.id}", "courseWorkId": "${cw.id}", "userId": "me"}'`);
      const sub = subsResult?.studentSubmissions?.[0];
      const submitted = sub?.state === 'TURNED_IN' || sub?.state === 'RETURNED';

      if (submitted) {
        log(`[classroom] ${cw.title} — already submitted, skipping`);
        continue;
      }

      items.push({
        id: cw.id,
        source: 'classroom',
        type: 'assignment',
        title: cw.title,
        text: `${course.name}: ${cw.title}. Due in ${daysUntilDue} day(s).`,
        daysUntilDue,
        submitted: false,
        fetchedAt: new Date().toISOString()
      });
    }

    // Announcements (last 48h)
    const annResult = gws(`classroom courses.announcements list --params '{"courseId": "${course.id}"}'`);
    const announcements = annResult?.announcements || [];
    const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    for (const ann of announcements) {
      if (state.seenClassroomIds.includes(ann.id)) continue;
      const created = new Date(ann.creationTime);
      if (created < cutoff) continue;

      items.push({
        id: ann.id,
        source: 'classroom',
        type: 'announcement',
        title: `${course.name}: ${(ann.text || '').slice(0, 60)}`,
        text: ann.text || '',
        daysUntilDue: null,
        submitted: false,
        fetchedAt: new Date().toISOString()
      });
    }
  }

  log(`[classroom] ${items.length} new items`);
  return items;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const fetchedAt = new Date().toISOString();

  // Quiet hours: don't run between 23:00 and 07:00 (Asia/Jerusalem)
  const hour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem', hour: 'numeric', hour12: false });
  const h = parseInt(hour);
  if (h >= 23 || h < 7) {
    log('[main] quiet hours — skipping fetch');
    process.stdout.write(JSON.stringify({ ok: true, meta: { fetchedAt }, items: [], skipped: 'quiet_hours' }) + '\n');
    process.exit(0);
  }

  const state = loadState();

  // Check auth by trying a counters call
  try {
    const counters = await webtop.getMenuCounters();
    if (counters === null) {
      process.stdout.write(JSON.stringify({ ok: false, error: 'webtop_auth_expired' }) + '\n');
      process.exit(0);
    }
  } catch (e) {
    process.stdout.write(JSON.stringify({ ok: false, error: 'fetch_failed', detail: e.message }) + '\n');
    process.exit(0);
  }

  let items = [];

  try {
    const webtopItems = await fetchWebtop(state);
    items = items.concat(webtopItems);
  } catch (e) {
    process.stdout.write(JSON.stringify({ ok: false, error: 'fetch_failed', detail: e.message }) + '\n');
    process.exit(0);
  }

  try {
    const classroomItems = await fetchClassroom(state);
    items = items.concat(classroomItems);
  } catch (e) {
    log('[classroom] fetch failed (non-fatal):', e.message);
    // Classroom failure is non-fatal — continue with webtop items
  }

  log(`[done] ${items.length} total new items`);

  process.stdout.write(JSON.stringify({ ok: true, meta: { fetchedAt }, items }) + '\n');
}

main().catch(e => {
  process.stdout.write(JSON.stringify({ ok: false, error: 'fetch_failed', detail: e.message }) + '\n');
  process.exit(0);
});
