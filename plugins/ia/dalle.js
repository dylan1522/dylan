const axios = require("axios");
let Config = require("../../config");
let { getBuffer, msgErr, sleep } = require("../../lib/myfunc");
module.exports = {
  cmd: /^(crea)/i,
  category: 'ia',
  desc: 'inteligencia artificial para creación de imagenes.',
  isPrivate: true,
  check: { pts: 1 },
  async handler(m, {myBot, myLang, command, text, User}) {
    let checkUser = await User.show(m.sender);
    let isPremium = checkUser.premium ? 0 : -1;
    if(!text) return m.reply("Que imagen deseas crear?\nEscribe crea seguido de lo que quieres.");
    myBot.sendReact(m.chat, "🎨", m.key);
    try {
      let prePrompt = 'Mejora la imagen de acuerdo a mis especificaciones';
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        //"model": "image-alpha-001",
        "prompt": `${prePrompt} ${text}`,
        "num_images": 1,
        "size": "512x512",
        "response_format": "url"
      }, {
          headers: {
            'Authorization': `Bearer ${Config.OPEN_AI_KEY}`
          }
      });
      myBot.editMessage(m.chat, 'Dame un momento estoy dibujando!', 3, 'Dibujo Terminado, Enviando....')
      await sleep(3000)
      await myBot.sendImage(m.chat, response.data.data[0].url, Config.BOT_NAME);
      await User.counter(m.sender, 1, isPremium);
    } catch (e) {
      myBot.sendText(m.chat, msgErr())
      throw e
    }
  }
};