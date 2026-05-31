import { formatDisplayDate } from './date.js';

const DEFAULT_HASH_TAGS = '#LeetCode #DSA';

function buildQuestionList(submissions) {
  if (submissions.length === 0) {
    return 'No accepted submissions today, but the streak continues.';
  }

  return submissions
    .map((submission, index) => `✅ ${index + 1}. ${submission.title}`)
    .join('\n');
}

export function composeTweetText(submissions, date = new Date()) {
  return [
    `${formatDisplayDate(date)}'s Progress`,
    '',
    buildQuestionList(submissions),
    '',
    'Each solved problem sharpens problem-solving instincts and keeps the momentum going.',
    '',
    DEFAULT_HASH_TAGS,
  ].join('\n');
}

export function generateTwitterShareUrl(text) {
  const encodedText = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${encodedText}`;
}
