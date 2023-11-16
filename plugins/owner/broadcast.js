let { fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: /^(dbold)/i,
  category: 'ia',
  desc: 'test de comandos',
  ignored: true,
  isPrivate: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, {myBot, text}) {
    if (!text) return m.reply('Que quieres enviar?');
    let res = await fetchJson(process.env.DB_OLD);
    let db = await Object.keys(res);
    m.reply(`Enviar difusión a ${db.length} chat.\n*Tiempo de envio:* Aproximadamente ${db.length * 3.5} segundos.`);

    for (let i of db) {
      await myBot.sendImage(
        i,
        await m.quoted.download() || global.thumb,
        text
      );
      await sleep(1500);
    }
    m.reply("Difusion Enviada")
  }
};