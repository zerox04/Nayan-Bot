const fs = require("fs");
module.exports = {
  config:{
	name: "prefix",
        version: "1.0.1",
        prefix: false,
	permssion: 0,
	credits: "nayan", 
	description: "Fun",
	category: "no prefix",
	usages: "😒",
        cooldowns: 5, 
},

handleEvent: async function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
  const content = event.body ? event.body : '';
  const body = content.toLowerCase();
  const axios = require('axios')
const media = (
    await axios.get(
      'https://i.imgur.com/F6ERF0K.gif',
      { responseType: 'stream' }
    )
  ).data;

	if (body.indexOf("Love")==0 || body.indexOf("❤️‍🔥")==0 || body.indexOf("🖤")==0) {
		var msg = {
				body: "my prefix 💟🪐",
				attachment: media
			}
			api.sendMessage( msg, threadID, messageID);
    api.setMessageReaction("🖤", event.messageID, (err) => {}, true)
		}
	},
	start: function({ nayan }) {
  }
}
