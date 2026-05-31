import assert from 'node:assert/strict';
import test from 'node:test';

import { composeTweetText, generateTwitterShareUrl } from '../src/tweetPost.js';

test('composeTweetText builds a shareable progress message', () => {
  const text = composeTweetText(
    [{ title: 'Two Sum' }, { title: 'Valid Parentheses' }],
    new Date('2024-02-26T10:00:00Z')
  );

  assert.match(text, /^Feb 26, 2024's Progress/m);
  assert.match(text, /✅ 1\. Two Sum/);
  assert.match(text, /✅ 2\. Valid Parentheses/);
  assert.match(text, /#LeetCode #DSA/);
});

test('composeTweetText handles empty submission lists', () => {
  const text = composeTweetText([], new Date('2024-02-26T10:00:00Z'));

  assert.match(text, /No accepted submissions today, but the streak continues\./);
});

test('generateTwitterShareUrl encodes tweet text', () => {
  const url = generateTwitterShareUrl('A & B');

  assert.equal(url, 'https://twitter.com/intent/tweet?text=A%20%26%20B');
});
