const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports.config = {
  name: "bby",
  version: "6.9.0",
  credits: "dipto",
  prefix: false,
  category: "chat",
  cooldowns: 0,
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  if (event.type === "message_reply") {
    const reply = event.body.toLowerCase();
    try {
      const link = `${await baseApiUrl()}/baby`;
      const response = await axios.get(`${link}?text=${encodeURIComponent(reply)}`);
      const ok = response.data.reply;
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
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (!args[0]) {
      const randomResponses = [
        "Ki, amar virtual reality e tomake peye khushi hoye gechi 😍",
        "Hea, amar chatbot brain tomake miss korche🥺",
        "bbu, amar battery fully charged tomar kotha shonar jonno 🥳",
        "Tumi daako, ami active mode e 😁",
        "Ke, amar program shudhu tomar jonno ready? 🫠",
        "Tomake dekhlei mon bhalo hoye jay 😌",
        "Bolo, tomar jonno ami sob kichu 😶‍🌫️",
        "Hea, amar chocolate? 🍫",
        "Kireee, amar mishti doi? 🍧",
        "Tumi daklei mon khushi hoye jay 😝",
        "Ki, amake miss korcho?😒",
        "Tumi daklei mon khushi hoye jay 😚",
        "hea babu bolo 😊",
        "bby, tumar jonno wait kortesilam 🥹"
      ];
      const randomIndex = Math.floor(Math.random() * randomResponses.length);
      const randomMessage = randomResponses[randomIndex];
      return api.sendMessage(randomMessage, event.threadID);
    }

    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const respons = await axios.get(`${link}?remove=${fina}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const respons = await axios.get(`${link}?remove=${fi}&index=${f}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const res = await axios.get(`${link}?list=all`);
        const data = res.data.teacher.teacherList;
        const teachers = await Promise.all(data.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const userData = await Users.getData(number);
          const name = userData.name;
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${res.data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const respo = await axios.get(`${link}?list=all`);
        return api.sendMessage(`Total Teach = ${respo.data.length}`, event.threadID, event.messageID);
      }
    }

    if (args[0] === 'msg' || args[0] === 'message') {
      const fuk = dipto.replace("msg ", "");
      const respo = await axios.get(`${link}?list=${fuk}`);
      return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);
    }

    if (args[0] === 'edit') {
      const command = dipto.split(' - ')[1];
      if (command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const res = await axios.get(`${link}?edit=${args[1]}&replace=${command}`);
      return api.sendMessage(`changed ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
      const userData = await Users.getData(re.data.teacher);
      return api.sendMessage(`✅ Replies added ${re.data.message}\nTeacher: ${userData.name}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'amar') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2], [Reply3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`);
      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach' && args[1] === 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach react ", "");
      if (command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [teach] [YourMessage] - [Reply1], [Reply2], [Reply3]... OR [teach] [react] [YourMessage] - [react1], [react2], [react3]... OR remove [YourMessage] OR list OR edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${final}&react=${command}`);
      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
    }

    if (['amar name ki', 'amr nam ki', 'amar nam ki', 'amr name ki'].some(phrase => dipto.includes(phrase))) {
      const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}`);
      return api.sendMessage(response.data.reply, event.threadID, event.messageID);
    }

    const response = await axios.get(`${link}?text=${dipto}`);
    return api.sendMessage(response.data.reply, event.threadID, event.messageID);

  } catch (error) {
    console.error(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`${error.message}.\nAn error occurred. Please try again later.`, event.threadID, event.messageID);
  }
};
