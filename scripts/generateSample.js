import path from 'node:path';

import generateAndTweetImage from '../src/generateImage.js';

const sampleData = {
  easySolved: 215,
  hardSolved: 18,
  mediumSolved: 132,
  ranking: 12456,
  recentSubmissions: [
    {
      title:
        'Two Sum with a surprisingly long title that shows how wrapped text looks on the card',
    },
    {
      title: 'Binary Tree Level Order Traversal',
    },
    {
      title: 'Best Time to Buy and Sell Stock',
    },
    {
      title: 'Longest Substring Without Repeating Characters',
    },
    {
      title: 'Container With Most Water',
    },
    {
      title: 'Trapping Rain Water',
    },
  ],
  totalEasy: 850,
  totalHard: 750,
  totalMedium: 1800,
  username: 'sampleuser',
};

const outputPath = path.resolve('assets/sample-output.png');

await generateAndTweetImage(sampleData, {
  outputFilePath: outputPath,
});

console.log(`Generated sample image at ${outputPath}`);
