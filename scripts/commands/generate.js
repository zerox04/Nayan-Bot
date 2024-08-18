const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "generate",
    version: "1.0.0",
    credits: "Riyad",
    description: "Generate an image based on a prompt",
    category: "AI",
    usages: ["[prompt]"],
    cooldowns: 5,
    prefix: true
  },
  run: async function ({ api, event, args }) {
    function sendMessage(msg) {
      api.sendMessage(msg, event.threadID, event.messageID);
    }

    const usageGuide = "Usage: !generate [prompt]";

    if (!args[0]) return sendMessage(`Missing prompt\n\n${usageGuide}`);

    // React with 🕑 when the command is initiated
    api.setMessageReaction("🕑", event.messageID, (err) => {
      if (err) console.error("Error while reacting with 🕑:", err);
    }, true);

    try {
      const prompt = encodeURIComponent(args.join(" "));
      const apiUrl = `https://aiimage.hellonepdevs.workers.dev/?prompt=${prompt}`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

      if (!response.headers['content-type'].includes('image')) {
        return sendMessage("Error: Unexpected response format. Please try again later.");
      }

      const imageData = Buffer.from(response.data, 'binary');
      const imagePath = path.join(__dirname, 'tmp', 'generated_image.jpg');
      fs.writeFileSync(imagePath, imageData);

      // Send the image
      await api.sendMessage({
        body: "Here's an image based on your prompt:",
        attachment: fs.createReadStream(imagePath)
      }, event.threadID);

      // React with ⚡ after sending the image
      api.setMessageReaction("⚡", event.messageID, (err) => {
        if (err) console.error("Error while reacting with ⚡:", err);
      }, true);

    } catch (error) {
      console.error(error);
      return sendMessage("An error occurred while processing your request. Please try again later.");
    }
  }
};
