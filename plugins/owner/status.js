const os = require("os");
const speed = require("performance-now");
let Config = require("../../config");
let { runtime } = require("../../lib/myfunc");
let { UserModel } = require("../../src/data");
module.exports = {
  cmd: /^(status)/i,
  category: "owner",
  desc: "obten informacion del bot.",
  owner: true,
  ignored: true,
  check: { pts: null },
  async handler(m, { command }) {
    m.reply(`*𝚃𝙸𝙴𝙼𝙿𝙾 𝙳𝙴 𝙴𝙹𝙴𝙲𝚄𝙲𝙸Ó𝙽*
${BOX.iniM.replace("{}", Config.BOT_NAME)}
${BOX.medM} ⏱️ ${global.time} 
${BOX.medM} ⏰ ${runtime(process.uptime())}
${BOX.medM} 🔰 ${Config.VERSION}
${BOX.medM} 👥 ${await UserModel.countDocuments()}
${BOX.medM} ♨️ Bot modo${global.wtMyBot}
${BOX.end}`);
  }
};