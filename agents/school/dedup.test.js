/**
 * Tests for dedupByContent in fetch-and-alert.js.
 * Extracts the function via a minimal require shim so we don't need webtop-client.
 */

const assert = require('assert');
const { test } = require('node:test');

// Extract dedupByContent without executing main() or requiring webtop
const src = require('fs').readFileSync(require('path').join(__dirname, 'fetch-and-alert.js'), 'utf8');
const fnMatch = src.match(/function dedupByContent[\s\S]*?\n\}/);
if (!fnMatch) throw new Error('dedupByContent not found in fetch-and-alert.js');
const dedupByContent = new Function(`${fnMatch[0]}; return dedupByContent;`)();

// ── Notifications ─────────────────────────────────────────────────────────────

test('notifications: 3 same-text items → 1 kept, 2 collapsed', () => {
  const items = [
    { id: 'n1', text: 'עודכנו עבורך שיעורי-בית' },
    { id: 'n2', text: 'עודכנו עבורך שיעורי-בית' },
    { id: 'n3', text: 'עודכנו עבורך שיעורי-בית' },
  ];
  const { kept, collapsedIds } = dedupByContent(items, item => item.text);
  assert.strictEqual(kept.length, 1);
  assert.strictEqual(kept[0].id, 'n1');
  assert.deepStrictEqual(collapsedIds, ['n2', 'n3']);
});

test('notifications: 3 different-text items → all kept, none collapsed', () => {
  const items = [
    { id: 'n1', text: 'absence notice' },
    { id: 'n2', text: 'homework due' },
    { id: 'n3', text: 'schedule change' },
  ];
  const { kept, collapsedIds } = dedupByContent(items, item => item.text);
  assert.strictEqual(kept.length, 3);
  assert.deepStrictEqual(collapsedIds, []);
});

// ── Messages ──────────────────────────────────────────────────────────────────

test('messages: 2 same subject+sender items → 1 kept, 1 collapsed', () => {
  const items = [
    { id: 'm1', title: 'iPad found', text: 'From: Teacher A. iPad found' },
    { id: 'm2', title: 'iPad found', text: 'From: Teacher A. iPad found' },
  ];
  const { kept, collapsedIds } = dedupByContent(items, item => item.title + '\0' + item.text);
  assert.strictEqual(kept.length, 1);
  assert.deepStrictEqual(collapsedIds, ['m2']);
});

test('messages: different subjects are not collapsed', () => {
  const items = [
    { id: 'm1', title: 'iPad found', text: 'From: Teacher A. iPad found' },
    { id: 'm2', title: 'Tablet found', text: 'From: Teacher B. Tablet found' },
  ];
  const { kept, collapsedIds } = dedupByContent(items, item => item.title + '\0' + item.text);
  assert.strictEqual(kept.length, 2);
  assert.deepStrictEqual(collapsedIds, []);
});

// ── Changes ───────────────────────────────────────────────────────────────────

test('changes: same title+description → 1 kept', () => {
  const items = [
    { id: 'c1', title: 'Math cancelled', text: 'Math cancelled' },
    { id: 'c2', title: 'Math cancelled', text: 'Math cancelled' },
  ];
  const { kept, collapsedIds } = dedupByContent(items, item => item.title + '\0' + item.text);
  assert.strictEqual(kept.length, 1);
  assert.deepStrictEqual(collapsedIds, ['c2']);
});
