module.exports = {
  cmd: /^(pass)/i,
  ignored: true,
  register: true,
  owner: true,
  isPrivate: true,
  check: { pts: 0 },
  async handler(m, {myBot, args, checkUser, User}) {
    User.change(m.sender, {pass: args[0]})
    m.reply("*Contraseña actualizada*\nEscribe 'estado' para ver tus datos")
  }
};