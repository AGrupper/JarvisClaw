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

describe('changeId', () => {
  it('returns a chg_ prefixed string', () => {
    const { changeId } = require('./fetch-and-alert');
    const raw = { title: 'Gym cancelled', date: '2026-04-14' };
    assert.ok(changeId(raw).startsWith('chg_'));
  });

  it('is stable (same input = same output)', () => {
    const { changeId } = require('./fetch-and-alert');
    const raw = { title: 'Gym cancelled', date: '2026-04-14' };
    assert.equal(changeId(raw), changeId(raw));
  });

  it('is key-order independent', () => {
    const { changeId } = require('./fetch-and-alert');
    const a = { title: 'Gym cancelled', date: '2026-04-14' };
    const b = { date: '2026-04-14', title: 'Gym cancelled' };
    assert.equal(changeId(a), changeId(b));
  });
});
