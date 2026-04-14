const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { filterNew, changeId, buildMessageItem, buildNotificationItem, buildChangeItem, buildAssignmentItem, buildAnnouncementItem } = require('./fetch-and-alert');

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

  it('uses body as text when present', () => {
    const raw = {
      messageId: 'msg2',
      subject: 'Subject line',
      body: 'Full message body text here'
    };
    const item = buildMessageItem(raw, NOW);
    assert.equal(item.text, 'Full message body text here');
  });
});

describe('buildAssignmentItem', () => {
  it('maps Classroom assignment to structured item', () => {
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
    assert.ok(item.daysUntilDue >= 0 && item.daysUntilDue <= 2);
  });

  it('returns null for submitted assignments', () => {
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
