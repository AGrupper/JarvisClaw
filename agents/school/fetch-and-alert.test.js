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
