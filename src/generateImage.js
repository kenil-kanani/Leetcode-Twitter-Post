import Jimp from 'jimp';
import fs from 'node:fs/promises';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'node:url';
import { formatDisplayDate, formatFileDate } from './date.js';

const BACKGROUND_IMAGE_PATH = fileURLToPath(new URL('./my-background.jpg', import.meta.url));
const DEFAULT_OUTPUT_DIRECTORY = path.join(os.homedir(), 'Desktop');
const MAX_SUBMISSIONS_ON_CARD = 5;
const SUBMISSION_SECTION = {
    lineGap: 12,
    maxHeight: 360,
    width: 1180,
    x: 200,
    y: 350,
};

async function resolveOutputPath(outputDir) {
    const directory = outputDir
        ? path.resolve(outputDir)
        : DEFAULT_OUTPUT_DIRECTORY;

    await fs.mkdir(directory, { recursive: true });
    return path.join(directory, `leetcode-${formatFileDate()}.png`);
}

async function resolveRequestedOutputPath(options) {
    if (options.outputFilePath) {
        const outputFilePath = path.resolve(options.outputFilePath);

        await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
        return outputFilePath;
    }

    return resolveOutputPath(options.outputDir);
}

function getCardSubmissionLines(submissions) {
    if (submissions.length === 0) {
        return ['No accepted submissions today.'];
    }

    const visibleSubmissions = submissions.slice(0, MAX_SUBMISSIONS_ON_CARD);
    const submissionLines = visibleSubmissions.map(
        (submission, index) => `${index + 1}. ${submission.title}`
    );

    if (submissions.length > visibleSubmissions.length) {
        submissionLines.push(
            `+ ${submissions.length - visibleSubmissions.length} more accepted submissions`
        );
    }

    return submissionLines;
}

function printSubmissionList(backgroundImage, font, submissions) {
    const lines = getCardSubmissionLines(submissions);
    const bottomEdge = SUBMISSION_SECTION.y + SUBMISSION_SECTION.maxHeight;
    let cursorY = SUBMISSION_SECTION.y;

    for (const line of lines) {
        const lineHeight = Jimp.measureTextHeight(font, line, SUBMISSION_SECTION.width);

        if (cursorY + lineHeight > bottomEdge) {
            break;
        }

        backgroundImage.print(
            font,
            SUBMISSION_SECTION.x,
            cursorY,
            {
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                text: line,
            },
            SUBMISSION_SECTION.width,
            lineHeight
        );

        cursorY += lineHeight + SUBMISSION_SECTION.lineGap;
    }
}

async function generateAndTweetImage(data, options = {}) {
    try {
        // Image Generation
        const backgroundImage = await Jimp.read(BACKGROUND_IMAGE_PATH);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        backgroundImage.print(
            font,
            backgroundImage.getWidth() - Jimp.measureText(font, data.username) - 250,
            130,
            `@${data.username}`
        );

        printSubmissionList(backgroundImage, font, data.recentSubmissions);

        const displayDate = formatDisplayDate();
        backgroundImage.print(
            font,
            backgroundImage.getWidth() - Jimp.measureText(font, displayDate) - 260,
            270,
            displayDate
        );

        backgroundImage.print(font, 300, 125, `: ${data.ranking}`);

        backgroundImage.print(font, 445, backgroundImage.getHeight() - 150, `${data.easySolved} / ${data.totalEasy}`);
        backgroundImage.print(font, 745, backgroundImage.getHeight() - 150, `${data.mediumSolved} / ${data.totalMedium}`);
        backgroundImage.print(font, 1060, backgroundImage.getHeight() - 150, `${data.hardSolved} / ${data.totalHard}`);
        const outputPath = await resolveRequestedOutputPath(options);

        await backgroundImage.writeAsync(outputPath);
        return outputPath;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default generateAndTweetImage;
