import { fromUnixSeconds, toCalendarDateKey } from './date.js';
import leetcodeQuery from './leetcodeQuery.js';

function getDifficultyCount(entries, difficulty) {
  return entries.find((entry) => entry.difficulty === difficulty)?.count ?? 0;
}

export function filterTodaysAcceptedSubmissions(submissions) {
  const today = toCalendarDateKey();
  const seenTitles = new Set();

  return submissions.filter((submission) => {
    const date = toCalendarDateKey(fromUnixSeconds(submission.timestamp));
    const isAcceptedToday =
      date === today && submission.statusDisplay === 'Accepted';

    if (!isAcceptedToday || seenTitles.has(submission.titleSlug)) {
      return false;
    }

    seenTitles.add(submission.titleSlug);
    return true;
  });
}

export function formatLeetCodeData(data, username) {
  const acceptedCounts = data.matchedUser.submitStats.acSubmissionNum;
  const allQuestions = data.allQuestionsCount;

  return {
    easySolved: getDifficultyCount(acceptedCounts, 'Easy'),
    totalEasy: getDifficultyCount(allQuestions, 'Easy'),
    mediumSolved: getDifficultyCount(acceptedCounts, 'Medium'),
    totalMedium: getDifficultyCount(allQuestions, 'Medium'),
    hardSolved: getDifficultyCount(acceptedCounts, 'Hard'),
    totalHard: getDifficultyCount(allQuestions, 'Hard'),
    ranking: data.matchedUser.profile.ranking,
    username,
    recentSubmissions: filterTodaysAcceptedSubmissions(data.recentSubmissionList),
  };
}

export async function fetchLeetCodeData(username) {
  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://leetcode.com',
    },
    body: JSON.stringify({
      query: leetcodeQuery,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `LeetCode request failed with status ${response.status} ${response.statusText}.`
    );
  }

  const payload = await response.json();
  const errorMessage = payload.errors?.map((error) => error.message).join('; ');

  if (errorMessage) {
    throw new Error(`LeetCode API error: ${errorMessage}`);
  }

  if (!payload.data?.matchedUser) {
    throw new Error(`No LeetCode profile found for "${username}".`);
  }

  if (!payload.data.allQuestionsCount || !payload.data.recentSubmissionList) {
    throw new Error('LeetCode returned an incomplete profile response.');
  }

  return payload.data;
}
