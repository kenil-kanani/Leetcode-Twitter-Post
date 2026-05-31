import assert from 'node:assert/strict';
import test from 'node:test';

import {
  filterTodaysAcceptedSubmissions,
  formatLeetCodeData,
} from '../src/leetcode.js';

const today = new Date('2024-02-26T12:00:00Z');
const todayTimestamp = Math.floor(new Date('2024-02-26T09:00:00Z').getTime() / 1000);
const yesterdayTimestamp = Math.floor(
  new Date('2024-02-25T09:00:00Z').getTime() / 1000
);

test('filterTodaysAcceptedSubmissions keeps only unique accepted problems from today', () => {
  const submissions = [
    {
      statusDisplay: 'Accepted',
      timestamp: todayTimestamp,
      title: 'Two Sum',
      titleSlug: 'two-sum',
    },
    {
      statusDisplay: 'Accepted',
      timestamp: todayTimestamp,
      title: 'Two Sum',
      titleSlug: 'two-sum',
    },
    {
      statusDisplay: 'Wrong Answer',
      timestamp: todayTimestamp,
      title: 'Add Two Numbers',
      titleSlug: 'add-two-numbers',
    },
    {
      statusDisplay: 'Accepted',
      timestamp: yesterdayTimestamp,
      title: 'Valid Parentheses',
      titleSlug: 'valid-parentheses',
    },
  ];

  const result = filterTodaysAcceptedSubmissions(submissions, today);

  assert.deepEqual(result, [
    {
      statusDisplay: 'Accepted',
      timestamp: todayTimestamp,
      title: 'Two Sum',
      titleSlug: 'two-sum',
    },
  ]);
});

test('formatLeetCodeData maps difficulty counts by label', () => {
  const result = formatLeetCodeData(
    {
      allQuestionsCount: [
        { count: 0, difficulty: 'All' },
        { count: 850, difficulty: 'Easy' },
        { count: 1800, difficulty: 'Medium' },
        { count: 750, difficulty: 'Hard' },
      ],
      matchedUser: {
        profile: {
          ranking: 12345,
        },
        submitStats: {
          acSubmissionNum: [
            { count: 0, difficulty: 'All' },
            { count: 150, difficulty: 'Easy' },
            { count: 90, difficulty: 'Medium' },
            { count: 15, difficulty: 'Hard' },
          ],
        },
      },
      recentSubmissionList: [
        {
          statusDisplay: 'Accepted',
          timestamp: todayTimestamp,
          title: 'Two Sum',
          titleSlug: 'two-sum',
        },
      ],
    },
    'kenilkanani',
    today
  );

  assert.deepEqual(result, {
    easySolved: 150,
    hardSolved: 15,
    mediumSolved: 90,
    ranking: 12345,
    recentSubmissions: [
      {
        statusDisplay: 'Accepted',
        timestamp: todayTimestamp,
        title: 'Two Sum',
        titleSlug: 'two-sum',
      },
    ],
    totalEasy: 850,
    totalHard: 750,
    totalMedium: 1800,
    username: 'kenilkanani',
  });
});
