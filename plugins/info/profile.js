let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: /^(estado)/i,
  category: 'información',
  desc: 'obten tu informacion en el bot.',
  isPrivate: true,
  check: { pts: 0 },
  async handler(m, { User }) {
    const checkUser = await User.show(m.sender);
    let emojis = {"bronce": "🥉", "plata": "🥈", "oro": "🥇", "semana": "7️⃣"};
    let premiumEmoji = emojis[checkUser.plan] || "🆓";

    let profile = `*Número:* ${checkUser.phone.split("@")[0]}\n`;
    profile += `*Nombre:* ${checkUser.name}\n`;
    profile += `*Contraseña:* ${checkUser.pass || 'Contraseña no definida'}\n`;
    profile += `*Uso del Bot:* ${checkUser.usage}\n`;
    if (checkUser.premium) {
      profile += `*Plan Premium:* ${premiumEmoji}\n`;
      profile += `*Tiempo restantes:* ${await User.getDaysRemaining(checkUser.planEndDate)}\n`;
      profile += `*Usos restantes:* ♾️`;
    } else {
      profile += `*Plan Premium:* ${premiumEmoji}\n`;
      profile += `*Usos restantes:* ${checkUser.cash}`;
    }
    m.reply(profile);
  }
};