const axios = require("axios");

module.exports.config = {
  name: "Ana",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "riyadxRubish",
  description: "better than all Sim simi",
  prefix: false,
  category: "ChatBots",
  cooldowns: 5,
};

// Array of random responses
const randomResponses = [
  "hea babu bolo 😚",
  "Ki hoise bby 🥹",
  "dako kn? 🙄",
  "kase aso janu 🤭",
  " 😅",
  "🥺",
  " 😒😒",
  "😌🫶",
  " 😏😏"
];

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.type === "message_reply") {
    const reply = event.body.toLowerCase();
    if (isNaN(reply)) {
      try {
        const response = await axios.get(`https://rubish-apihub.onrender.com/rubish/simma-chat?message=${encodeURIComponent(reply)}&apikey=rubish69`);
        const ok = response.data.response;
        await api.sendMessage(ok, event.threadID, (error, info) => {
          if (error) console.error("Error sending reply message:", error);
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: ok,
          });
        }, event.messageID);
      } catch (error) {
        console.error("Error fetching response from API:", error);
        api.sendMessage(
          "An error occurred while fetching response from API. Please try again later.",
          event.threadID
        );
      }
    }
  }
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const dipto = args.join(" ").toLowerCase();
    if (!args[0]) {
      // Randomly select a response from the array
      const randomIndex = Math.floor(Math.random() * randomResponses.length);
      const randomMessage = randomResponses[randomIndex];
      await api.sendMessage(randomMessage, event.threadID);
      return;
    }

    const response = await axios.get(`https://rubish-apihub.onrender.com/rubish/simma-chat?message=${encodeURIComponent(dipto)}&apikey=rubish69`);
    const mg = response.data.response;
    await api.sendMessage({ body: mg }, event.threadID, (error, info) => {
      if (error) console.error("Error sending reply message:", error);
      global.client.handleReply.push({
        name: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        link: mg,
      });
    }, event.messageID);
  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`${error.message}.\nAn error occurred. Please try again later.`, event.threadID, event.messageID);
  }
};
