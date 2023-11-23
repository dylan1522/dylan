const OpenAI = require('openai');
let Config = require("../../config");
let { chat_gpt, msgErr } = require("../../lib/myfunc");
module.exports = {
  category: 'ia',
  desc: 'inteligencia artificial que te puede ayudar con cualquier tema.',
  ignored: true,
  isPrivate: true,
  check: { pts: 1 },
  async handler(m, { myBot, budy, myLang, User }) {
    let checkUser = await User.show(m.sender);
    let isPremium = checkUser.premium ? 0 : -1;
    try {
      let words = ['xd', 'lol', 'gracias'];
      let message = budy.toLowerCase();
      
      if (words.some(word => message.includes(word))) {
        return myBot.sendReact(m.chat, "🙃", m.key);
      } else {
        myBot.sendReact(m.chat, "🕒", m.key);
        let response = await chat_gpt(m.sender, budy);
        myBot.sendMessage(m.chat, {
          text: response
        }, { quoted: m });
        await User.counter(m.sender, 1, isPremium);
      }
    } catch (e) {
      myBot.sendText(m.chat, msgErr());
      throw e;
    }
  }
};