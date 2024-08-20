const axios = require('axios');

module.exports = {
  config: {
    name: "Ana",
    version: "1.0.0",
    permission: 0,
    credits: "RiyadxNayan",
    description: "...",
    prefix: 'awto',
    category: "talk",
    usages: "hi",
    cooldowns: 5,
  },

  handleReply: async function ({ api, event, handleReply }) {
    try {
      const response = await axios.get(`https://rubish-apihub.onrender.com/rubish/simma-chat?message=${encodeURIComponent(event.body)}&apikey=rubish69`);
      console.log(response.data);
      const result = response.data.message; // Adjust this based on the new API response structure

      api.sendMessage(result, event.threadID, (error, info) => {
        if (error) {
          console.error('Error replying to user:', error);
          return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }
        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          head: event.body
        });
      }, event.messageID);

    } catch (error) {
      console.error('Error in handleReply:', error);
      api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
    }
  },

  start: async function ({ nayan, events, args, Users }) {
    try {
      const msg = args.join(" ");
      if (!msg) {
        const replies = [
          "Hum baby bolo 🐱",
          "Ale babu tmi naki 🥺",
          "Jantus tmre miss kortesilam"
        ];
        const name = await Users.getNameUser(events.senderID);
        const randReply = replies[Math.floor(Math.random() * replies.length)];
        return nayan.sendMessage({
          body: `${name}, ${randReply}`,
          mentions: [{ tag: name, id: events.senderID }]
        }, events.threadID, (error, info) => {
          if (error) {
            return nayan.sendMessage('An error occurred while processing your request. Please try again later.', events.threadID, events.messageID);
          }

          global.client.handleReply.push({
            type: 'reply',
            name: this.config.name,
            messageID: info.messageID,
            author: events.senderID,
            head: msg,
          });
        }, events.messageID);
      }

      const response = await axios.get(`https://rubish-apihub.onrender.com/rubish/simma-chat?message=${encodeURIComponent(msg)}&apikey=rubish69`);
      console.log(response.data);
      const replyMessage = response.data.message; // Adjust this based on the new API response structure

      nayan.sendMessage({ body: replyMessage }, events.threadID, (error, info) => {
        if (error) {
          return nayan.sendMessage('An error occurred while processing your request. Please try again later.', events.threadID, events.messageID);
        }

        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: events.senderID,
          head: msg,
        });
      }, events.messageID);

    } catch (error) {
      console.log(error);
      nayan.sendMessage('An error has occurred, please try again later.', events.threadID, events.messageID);
    }
  }
};
