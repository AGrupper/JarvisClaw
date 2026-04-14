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
