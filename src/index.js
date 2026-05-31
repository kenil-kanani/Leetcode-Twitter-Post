import { openShareUrl } from './browser.js';
import { getUsageText, parseCliArguments } from './cli.js';
import generateAndTweetImage from './generateImage.js';
import { fetchLeetCodeData, formatLeetCodeData } from './leetcode.js';
import { composeTweetText, generateTwitterShareUrl } from './tweetPost.js';

//fetching the data
let leetcode = async () => {
  try {
    const cliOptions = parseCliArguments(process.argv.slice(2));

    if (cliOptions.showHelp) {
      console.log(getUsageText());
      return;
    }

    const { browser, openBrowser, outputDir, username } = cliOptions;

    const leetCodeData = await fetchLeetCodeData(username);
    const formatedData = formatLeetCodeData(leetCodeData, username);
    const tweetText = composeTweetText(formatedData.recentSubmissions);

    const outputPath = await generateAndTweetImage(formatedData, { outputDir });
    console.log(`Saved image to ${outputPath}`);
    await openShareUrl(generateTwitterShareUrl(tweetText), {
      browser,
      openBrowser,
    });
  } catch (error) {
    console.error(error.message);
    console.error('');
    console.error(getUsageText());
    process.exitCode = 1;
  }
}

leetcode()
