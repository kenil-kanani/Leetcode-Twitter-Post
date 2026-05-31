import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatDisplayDate,
  formatFileDate,
  fromUnixSeconds,
  toCalendarDateKey,
} from '../src/date.js';

test('formatDisplayDate returns a readable label', () => {
  const date = new Date('2024-02-26T10:00:00Z');

  assert.equal(formatDisplayDate(date), 'Feb 26, 2024');
});

test('file date helpers stay stable for comparisons and filenames', () => {
  const date = new Date('2024-02-26T10:00:00Z');

  assert.equal(formatFileDate(date), '2024-02-26');
  assert.equal(toCalendarDateKey(date), '2024-02-26');
});

test('fromUnixSeconds converts timestamps into Date objects', () => {
  const date = fromUnixSeconds(1708941600);

  assert.equal(date.toISOString(), '2024-02-26T10:00:00.000Z');
});
