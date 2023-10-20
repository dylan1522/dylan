module.exports = {
  cmd: /^(add)/i,
  ignored: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, {myBot, args, User}) {
    let newPrem = args[0]+'@s.whatsapp.net';
    let plan = args[1] ? args[1] : 'bronce';
    try {
      await User.activatePremiumPlan(newPrem, plan);
      let checkUser = await User.show(newPrem);
      let emojis = {"bronce": "🥉", "plata": "🥈", "oro": "🥇",};
      let premiumEmoji = emojis[checkUser.plan];
      myBot.sendText(newPrem, `Ya eres Premium\nPlan: ${premiumEmoji}`);
    } catch {
      m.reply('Usuario no encontrado!');
    }
  }
};