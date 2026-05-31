import Jimp from 'jimp';
import fs from 'node:fs/promises';
import path from 'path';
import os from 'os';
import { formatDisplayDate, formatFileDate } from './date.js';

const DEFAULT_OUTPUT_DIRECTORY = path.join(os.homedir(), 'Desktop');

async function resolveOutputPath(outputDir) {
    const directory = outputDir
        ? path.resolve(outputDir)
        : DEFAULT_OUTPUT_DIRECTORY;

    await fs.mkdir(directory, { recursive: true });
    return path.join(directory, `leetcode-${formatFileDate()}.png`);
}

async function generateAndTweetImage(data, options = {}) {
    try {
        // Image Generation
        const backgroundImage = await Jimp.read(`./src/my-background.jpg`);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        backgroundImage.print(font, backgroundImage.getWidth() - (Jimp.measureText(font, data.username)) - 250, 130, "@" + data.username);

        if (data.recentSubmissions.length > 0) {
            data.recentSubmissions.forEach((submission, index) => {
                backgroundImage.print(font, 200, 350 + (index * 50), index + 1 + " : " + submission.title);
            });
        } else {
            backgroundImage.print(font, 200, 350, "No recent accepted submissions");
        }

        const displayDate = formatDisplayDate();
        backgroundImage.print(
            font,
            backgroundImage.getWidth() - Jimp.measureText(font, displayDate) - 260,
            270,
            displayDate
        );

        backgroundImage.print(font, 300, 125, ": " + data.ranking)

        backgroundImage.print(font, 445, backgroundImage.getHeight() - 150, data.easySolved + " / " + data.totalEasy);
        backgroundImage.print(font, 745, backgroundImage.getHeight() - 150, data.mediumSolved + " / " + data.totalMedium);
        backgroundImage.print(font, 1060, backgroundImage.getHeight() - 150, data.hardSolved + " / " + data.totalHard);
        const outputPath = await resolveOutputPath(options.outputDir);

        await backgroundImage.writeAsync(outputPath);
        return outputPath;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default generateAndTweetImage;
