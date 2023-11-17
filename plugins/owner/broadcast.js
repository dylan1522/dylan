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
    let dataBase = await fetchJson(process.env.DB_OLD);
    let numbers = await Object.keys(dataBase);
    m.reply(`Enviar difusión a ${numbers.length} chat.\n*Tiempo de envio:* Aproximadamente ${numbers.length * 3.5} segundos.`);

    for (let number of numbers) {
      await myBot.sendText(number, text);
      await sleep(1500);
    }
    m.reply("Difusion Enviada")
  }
};