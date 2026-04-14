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

module.exports = { filterNew, changeId, buildMessageItem, buildNotificationItem, buildChangeItem, buildAssignmentItem, buildAnnouncementItem };

if (require.main === module) {
  // Entry point — implemented in later tasks
  console.log(JSON.stringify({ ok: false, error: 'not_implemented' }));
}
