const fs = require("fs");
const axios = require("axios"); // Add axios for making HTTP requests

module.exports.config = {
    name: "prefix",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Riyadh",
    description: "hihihihi",
    category: "no prefix", // Changed from commandCategory to category
    usages: "prefix",
    prefix: true, // Changed from usePrefix to prefix
    cooldowns: 1,
};

module.exports.handleEvent = async function ({ api, event, client, __GLOBAL }) {
    const { threadID, messageID, senderID, body } = event;
    let senderName = "";

    try {
        const userInfo = await api.getUserInfo(senderID);
        senderName = userInfo[senderID]?.name || "there";
    } catch (err) {
        console.error(err);
        senderName = "there";
    }

    if (
        body.startsWith("prefix") ||
        body.startsWith("Prefix") ||
        body.startsWith("Robo") ||
        body.startsWith("pref")
    ) {
        // URL of the image from Imgur or Imgbb
        const imageUrl = "https://i.imgur.com/vvJPrBU.gif"; // Replace with your actual image URL

        // Send text message with prefix information
        api.sendMessage(
            {
                body: ` ✿ ${senderName}🌟, 𝖬𝗒 𝗉𝗋𝖾𝖿𝗂𝗑 𝗂𝗌 𝗂𝗇 𝗍𝗁𝖾 𝖦𝗂𝖿 ✿ `,
                attachment: imageUrl,
            },
            threadID,
            messageID
        );

        // Send voice message with additional information (if required, otherwise you can remove this)
        const voiceFile = fs.readFileSync(__dirname + "/zone/pr.gif");
        api.sendMessage(
            {
                attachment: voiceFile,
                type: "audio",
                body: "Hey, listen to my prefix information!",
            },
            threadID,
            () => {}
        );

        api.setMessageReaction("🤖", messageID, (err) => {}, true);
    }
};

module.exports.run = function ({ api, event, client, __GLOBAL }) {};
