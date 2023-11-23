const moment = require("moment-timezone");
let { LANG, BOT_NAME, VERSION } = require("../../config");
let { totalHit } = require("../../src/data");
let more = String.fromCharCode(8206);
let readMore = more.repeat(4001);
if (LANG == "ES") {
  hi_lang = "Hola";
  sal_a = "Es muy temprano, duerme un poco mas.";
  sal_b = "Buenos Dias";
  sal_c = "Buenas Tardes";
  sal_d = "Buenas Noches";
} else if (LANG == "EN") {
  hi_lang = "Hi";
  sal_a = "you do not sleep?. 😒";
  sal_b = "good morning";
  sal_c = "good afternoon";
  sal_d = "good night";
}
module.exports = {
  ignored: true,
  isPrivate: true,
  cmd: /^(men[uú]|ayuda|help|funciones|alive)|informaci[oó]n/ig,
  check: { pts: 0 },
  async handler(m, { myBot, budy, myLang, prefix }) {
      try {
        myBot.sendReact(m.chat, "🕒", m.key);
        const cmd = [];
        Object.values(attr.commands)
          .filter((cm) => !cm.disabled && !cm.ignored)
          .map((cm) => {
            cmd.push({
              cmd: cm.cmd,
              tag: cm.category ? cm.category : "Uncategorized",
              desc: cm.desc ? cm.desc : '-'
            });
          });
        const map_tag = cmd.map((mek) => mek.tag);
        const sort_tag = await map_tag.sort();
        const tag_data = new Set(sort_tag);
        const tags = [...tag_data];
        let time = moment().tz(global.timeZone).format("HH:mm:ss");
        if (time < "05:00:00") {
          saludo = sal_a;
        } else if (time < "12:00:00") {
          saludo = sal_b;
        } else if (time < "19:00:00") {
          saludo = sal_c;
        } else if (time < "23:59:00") {
          saludo = sal_d;
        }
        let menu = `${hi_lang} *${m.pushName}*, ${saludo}\n\n`;
        menu += myLang("global").welcome.split(".").slice(3).join(".").trim()+'\n';
        myBot.sendImage(m.chat, global.thumb, menu, m);
      } catch (e) {
        console.log(e);
      }
    }
};