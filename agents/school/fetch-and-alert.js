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
  const seen = new Set(seenIds.map(String));
  return items.filter(item => !seen.has(String(item.id)));
}

/** Synthesize a stable ID for a Webtop today-change (API has no native ID) */
function changeId(raw) {
  const stable = JSON.stringify(raw, Object.keys(raw).sort());
  return 'chg_' + crypto.createHash('md5').update(stable).digest('hex').slice(0, 12);
}

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
    id: raw.itemId ? String(raw.itemId) : (raw.id ? String(raw.id) : changeId(raw)),
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

module.exports = { filterNew, changeId, buildMessageItem, buildNotificationItem, buildChangeItem, buildAssignmentItem, buildAnnouncementItem };

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
  const seenMessageIds = Array.isArray(state.seenMessageIds) ? state.seenMessageIds : [];
  const seenNotificationIds = Array.isArray(state.seenNotificationIds) ? state.seenNotificationIds : [];
  const seenChangeIds = Array.isArray(state.seenChangeIds) ? state.seenChangeIds : [];
  const seenClassroomIds = Array.isArray(state.seenClassroomIds) ? state.seenClassroomIds : [];

  const fetchedAt = new Date().toISOString();

  // Auth check first: getMenuCounters returns null when session is expired
  // (getUnreadMessages returns [] not null on failure, so counters is the reliable signal)
  const counters = await webtop.getMenuCounters().catch(() => null);
  if (counters === null) {
    console.log(JSON.stringify({ ok: false, error: 'webtop_auth_expired' }));
    return;
  }

  // Fetch all sources in parallel
  let messages, notifs, changes, classroom;
  try {
    [messages, notifs, changes, classroom] = await Promise.all([
      webtop.getUnreadMessages(50),
      webtop.getUnreadNotifications(),
      webtop.getChangesAndMessagesToday(),
      fetchAllClassroomData().catch(() => null)
    ]);
  } catch (err) {
    console.log(JSON.stringify({ ok: false, error: 'fetch_failed', detail: err.message }));
    return;
  }

  // Normalize raw responses
  const rawMessages = Array.isArray(messages) ? messages : [];
  const rawNotifs = Array.isArray(notifs?.personalNotifications) ? notifs.personalNotifications : [];
  const rawChanges = Array.isArray(changes) ? changes : (changes ? [changes] : []);
  const rawAssignments = classroom?.upcoming || [];
  const rawAnnouncements = classroom?.announcements || [];

  // Build structured items
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
