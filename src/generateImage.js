import Jimp from 'jimp';
import path from 'path';
import os from 'os';

async function generateAndTweetImage(data) {
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

        backgroundImage.print(font, backgroundImage.getWidth() - (Jimp.measureText(font, new Date().toLocaleDateString())) - 260, 270, new Date().toLocaleDateString());

        backgroundImage.print(font, 300, 125, ": " + data.ranking)

        backgroundImage.print(font, 445, backgroundImage.getHeight() - 150, data.easySolved + " / " + data.totalEasy);
        backgroundImage.print(font, 745, backgroundImage.getHeight() - 150, data.mediumSolved + " / " + data.totalMedium);
        backgroundImage.print(font, 1060, backgroundImage.getHeight() - 150, data.hardSolved + " / " + data.totalHard);
        const imageName = "leetcode-" + new Date().toLocaleDateString().replace(/\//g, '-') + '.png'
        const desktopPath = path.join(os.homedir(), 'Desktop', imageName);
        await backgroundImage.writeAsync(desktopPath);
    } catch (error) {
        console.error(error);
    }
}

export default generateAndTweetImage;