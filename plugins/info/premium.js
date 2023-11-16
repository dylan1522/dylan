let Config = require("../../config");
module.exports = {
  cmd: /premium/i,
  category: 'información',
  desc: 'solicitud',
  ignored: true,
  isPrivate: true,
  check: { pts: 0 },
  async handler(m, {myBot, myLang}) {
    myBot.sendReact(m.chat, "🕒", m.key);
    myBot.sendText(m.chat, myLang("global").no_points.split(".").slice(1).join(".").replace("{}", Config.DOMINIO));
  }
};