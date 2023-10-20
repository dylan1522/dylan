module.exports = {
  cmd: /^(pass)/i,
  ignored: true,
  owner: true,
  isPrivate: true,
  check: { pts: 0 },
  async handler(m, {myBot, args, User}) {
    await User.change(m.sender, args[0])
    m.reply("*Contraseña actualizada*\nEscribe 'estado' para ver tus datos")
  }
};