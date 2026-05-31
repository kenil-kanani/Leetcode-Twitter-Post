import assert from 'node:assert/strict';
import test from 'node:test';

import { parseCliArguments } from '../src/cli.js';

test('parseCliArguments reads username and options', () => {
  const result = parseCliArguments([
    'kenilkanani',
    '--browser',
    'chrome',
    '--output-dir',
    './assets/generated',
    '--no-open',
  ]);

  assert.deepEqual(result, {
    browser: 'chrome',
    openBrowser: false,
    outputDir: './assets/generated',
    showHelp: false,
    username: 'kenilkanani',
  });
});

test('parseCliArguments supports help mode', () => {
  const result = parseCliArguments(['--help']);

  assert.deepEqual(result, {
    browser: '',
    openBrowser: true,
    outputDir: '',
    showHelp: true,
    username: '',
  });
});

test('parseCliArguments rejects missing usernames', () => {
  assert.throws(
    () => parseCliArguments([]),
    /A LeetCode username is required\./
  );
});
