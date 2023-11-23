const axios = require("axios");
let Config = require("../../config");
let { log, pint } = require("../../lib/colores");
let { sleep } = require("../../lib/myfunc");
let { UserModel } = require("../../src/data");
module.exports = {
  cmd: /^(bci|bcv)/i,
  ignored: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, { myBot, command, text }) {
    if (!text) return m.reply(`Que quieres enviar?`);
    let = imgbc = (await m.quoted.download()).catch(() => global.thumb);
    let users = await UserModel.find();
    let totalUsers = await UserModel.countDocuments();
    
    if (command == "bci") {
      try {
        m.reply(`Enviar difusión a ${totalUsers} usuarios.\nTiempo de envio ${totalUsers * 3} segundos.`);
        for (let user of users) {
          await myBot.sendImage(
            user.phone,
            imgbc,
            `Boletin Informativo *${Config.BOT_NAME}*\n\n` + text
          );
          await sleep(1500);
        }
        m.reply("Difusion Enviada");
      } catch (e) {
        log(e);
      }
    } else if (command == "bcv") {
      try {
        m.reply(`Enviar difusión a ${totalUsers} usuarios.\nTiempo de envio ${totalUsers * 5} segundos.`);
        for (let user of users) {
          await myBot.sendVideo(
            user.phone,
            imgbc,
            `Boletin Informativo *${Config.BOT_NAME}*\n\n` + text
          );
          await sleep(1500);
        }
        m.reply("Difusion Enviada");
      } catch (e) {
        log(e);
      }
    }
  }
};