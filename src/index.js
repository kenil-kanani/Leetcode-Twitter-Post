import generateAndTweetImage from './generateImage.js';
import { generateTwitterShareUrl } from './tweetPost.js';
import open from 'open';

//graphql query
let query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;

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
  let today = new Date().toLocaleDateString();
  let filteredData = data.filter((submission) => {
    let date = new Date(submission.timestamp * 1000).toLocaleDateString();
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
    const args = process.argv.slice(2);

    // Check if there are enough arguments
    if (args.length < 1) {
      console.error('Usage: node src/index.js <username>');
      process.exit(1);
    }

    const username = args[0];

    let result = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({ query: query, variables: { username } }),

    })

    result = await result.json();

    if (result.errors) {
      console.log("Error")
    } else {
      let formatedData = formatData(result.data, username);

      let questionList = ""
      formatedData.recentSubmissions.forEach((submission, index) => {
        questionList += ("✅ " + (index + 1) + " : " + submission.title + "\n")
      })
      let tweetText = new Date().toLocaleDateString() + "'s Progress : " + "\n\n" + questionList

      tweetText += "\n"
      tweetText += "💻💡 Each problem conquered feels like a victory, fueling my passion for coding. 💪 \n\n #LeetCode #DSA"
      await generateAndTweetImage(formatedData)
      // console.log(await generateTwitterShareUrl(tweetText))
      open(await generateTwitterShareUrl(tweetText), { app: '/Applications/Safari.app' })
    }
  } catch (error) {
    console.log(error);
  }
}

leetcode()