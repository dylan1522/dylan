module.exports = {
  cmd: /^(delete)/i,
  ignored: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, {myBot, args, User}) {
    let user = args[0]+'@s.whatsapp.net';
    try {
      await User.delUser(user);
      myBot.sendText(m.chat, `Usuario eliminado con exito.`);
    } catch {
      m.reply('Usuario no encontrado!');
    }
  }
};