import { getUsageText, parseCliArguments } from './cli.js';
import generateAndTweetImage from './generateImage.js';
import { fetchLeetCodeData, formatLeetCodeData } from './leetcode.js';
import { composeTweetText, generateTwitterShareUrl } from './tweetPost.js';
import open from 'open';

//fetching the data
let leetcode = async () => {
  try {
    const cliOptions = parseCliArguments(process.argv.slice(2));

    if (cliOptions.showHelp) {
      console.log(getUsageText());
      return;
    }

    const { username } = cliOptions;

    let result = await fetchLeetCodeData(username);

    if (result.errors) {
      console.log("Error")
    } else {
      let formatedData = formatLeetCodeData(result.data, username);
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
