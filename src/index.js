import { getUsageText, parseCliArguments } from './cli.js';
import generateAndTweetImage from './generateImage.js';
import { fromUnixSeconds, toCalendarDateKey } from './date.js';
import leetcodeQuery from './leetcodeQuery.js';
import { composeTweetText, generateTwitterShareUrl } from './tweetPost.js';
import open from 'open';

// format data 
let formatData = (data, username) => {
  let sendData = {
    easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
    totalEasy: data.allQuestionsCount[1].count,
    mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
    totalMedium: data.allQuestionsCount[2].count,
    hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
    totalHard: data.allQuestionsCount[3].count,
    ranking: data.matchedUser.profile.ranking,
    username,
    recentSubmissions: filterData(data.recentSubmissionList),
  }
  return sendData;
}

const filterData = (data) => {
  // send only todays accepted submissions
  const today = toCalendarDateKey();
  let filteredData = data.filter((submission) => {
    const date = toCalendarDateKey(fromUnixSeconds(submission.timestamp));
    return date === today && submission.statusDisplay === 'Accepted';
  })

  // send one submission per question
  let titles = {};
  filteredData = filteredData.filter((submission) => {
    if (titles[submission.titleSlug]) {
      return false;
    }
    titles[submission.titleSlug] = true;
    return true;
  })
  return filteredData;
}

//fetching the data
let leetcode = async () => {
  try {
    const cliOptions = parseCliArguments(process.argv.slice(2));

    if (cliOptions.showHelp) {
      console.log(getUsageText());
      return;
    }

    const { username } = cliOptions;

    let result = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({ query: leetcodeQuery, variables: { username } }),
    })

    result = await result.json();

    if (result.errors) {
      console.log("Error")
    } else {
      let formatedData = formatData(result.data, username);
      const tweetText = composeTweetText(formatedData.recentSubmissions);
      await generateAndTweetImage(formatedData)
      open(generateTwitterShareUrl(tweetText), { app: '/Applications/Safari.app' })
    }
  } catch (error) {
    console.error(error.message);
    console.error('');
    console.error(getUsageText());
    process.exitCode = 1;
  }
}

leetcode()
