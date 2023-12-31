module.exports = {
  cmd: /^(add)/i,
  ignored: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, { myBot, args, User }) {
    let newPrem = args[0] + "@s.whatsapp.net";
    let plan = args[1] ? args[1] : "bronce";
    if (await User.check(newPrem)) {
      await User.activatePremiumPlan(newPrem, plan);
      let checkUser = await User.show(newPrem);
      /*let emojis = {"bronce": "🥉", "plata": "🥈", "oro": "🥇", "semana": "7️⃣"};
      let premiumEmoji = emojis[checkUser.plan];*/
      myBot.sendText(newPrem, `Ya eres Premium\nPlan: ${plan}`);
    } else {
      m.reply("Usuario no encontrado!");
    }
  }
};