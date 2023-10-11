const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

const { User, addUserKey, totalHit } = require("./data");
const myLang = require("../language").getString;
const Config = require("../config");
//JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')).name;
const botName = Config.BOT_NAME;

app.use(session({
    secret: "xix2j4av",
    resave: false,
    saveUninitialized: true,
  })
);

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.sesionIniciada = req.session.sesionIniciada || false;
  next();
});

/* imagenes generales */
app.get('/lib/logo', (req, res) => {
  res.sendFile(path.join(__dirname, '../lib/bot.jpg'));
});
app.get('/lib/rnd', (req, res) => {
  res.sendFile(path.join(__dirname, '../lib/imgProfile.jpg'));
});

/* rutas iniciales */
app.get("/", (req, res) => {
  res.render("index", { botName });
});
app.get("/planes", (req, res) => {
  res.render("pricing", { botName });
});

/* rutas formulario */
app.get("/login", (req, res) => {
  if (req.session && req.session.sesionIniciada) {
    res.redirect("/usuario");
  } else {
    res.render("login", { botName });
  }
});
app.get("/registro", (req, res) => {
  if (req.session && req.session.sesionIniciada) {
    res.redirect("/usuario");
  } else {
    res.render("register", { botName });
  }
});

app.post("/login", (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  let noPlus = phone.replace(/\+/g, '');
  let checkUser = User.show(noPlus+'@s.whatsapp.net');
  if (!checkUser) {
    return res.json({
      icon: 'danger',
      tit: 'Alerta',
      msg: 'Usuario no encontrado!',
      time: 2500,
      ruta: ''
    })
  } else if (checkUser.pass !== password) {
    return res.json({
      icon: 'danger',
      tit: 'Alerta',
      msg: 'Contraseña Incorrecta!',
      time: 2500,
      ruta: ''
    })
  } else {
    req.session.username = noPlus
    req.session.sesionIniciada = true;
    
    const destino = req.session.destino || "/usuario";
    delete req.session.destino;
    return res.json({
      icon: 'success',
      tit: 'Exito',
      msg: 'Sesion Iniciada!',
      time: 2500,
      ruta: destino
    })
  }
});
app.post("/registro", async (req, res) => {
  const username = req.body.username;
  const phone = req.body.phone;
  const password = req.body.password;
  let noPlus = phone.replace(/\+/g, '');
  let regUser = User.check(noPlus+'@s.whatsapp.net');
  let exist = await client.onWhatsApp(phone+'@s.whatsapp.net');
  if (!exist[0]) {
    return res.json({
      icon: 'warning',
      tit: 'Error',
      msg: 'El número ingresado no existe en WhatsApp o no colocaste el codigo del pais!',
      time: 2500,
      ruta: ''
    });
  } else if (regUser === true) {
    return res.json({
      icon: 'warning',
      tit: 'Error',
      msg: 'Usuario Existente!',
      time: 2500,
      ruta: ''
    });
  } else {
    res.json({
      icon: 'success',
      tit: 'Exito',
      msg: 'Usuario Guardaro!',
      time: 2500,
      ruta: '/login'
    });
    new User(exist[0].jid, username, password)
    await client.sendMessage(exist[0].jid, {
      text: `Bienvenido ${username}, tus credenciales son las siguientes:\n\n`+
      `*Usuario:*\n${username}\n`+
      `*Contraseña:*\n${password}`
    })
    await client.sendText(exist[0].jid, myLang("global").welcome)
  }
});

/* ingreso usuario */
function requireLogin(req, res, next) {
  if (req.session && req.session.sesionIniciada) {
    return next();
  } else {
    req.session.destino = req.originalUrl;
    res.redirect("/login");
  }
}
app.get("/usuario", requireLogin, async (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const user = req.session.username;
  let checkUser = User.show(user+'@s.whatsapp.net');
  let emojis = {"bronce": "🥉 Bronce", "plata": "🥈 Plata", "oro": "🥇 Oro",};
  let premiumEmoji = emojis[checkUser.plan] || "🆓";
  
  let profile = {
    numero: checkUser.number.split('@')[0],
    nombre: checkUser.name,
    pass: checkUser.pass || 'Contraseña no definida',
    usoBot: checkUser.usage,
    planPremium: premiumEmoji,
    diasRestantes: '',
    usosRestantes: '',
  }
  if (checkUser.premium) {
    profile.diasRestantes = User.getDaysRemaining(checkUser.planEndDate);
    profile.usosRestantes = '♾️';
  } else {
    profile.diasRestantes = 'Hasta agotar creditos';
    profile.usosRestantes = checkUser.cash + ' creditos';
  }
  
  let ppuser = ''
  try {
    ppuser = await client.profilePictureUrl(user+'@s.whatsapp.net', 'image')
  } catch {
    ppuser = "/lib/rnd"
  }
  //let hidePassword = (password) => '*'.repeat(password.length);
  res.render("user", { profile, ppuser, botName });
});
app.get("/orden", requireLogin, async (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const plan = req.query.plan;
  let planInfo = {};

  let user = req.session.username;
  let checkUser = User.show(user+'@s.whatsapp.net');

  if (plan === 'bronce') {
    planInfo = {
      name: 'Bronce',
      price: '$ 1',
      use: 'Ilimitado',
      days: '30 Dias'
    };
  } else if (plan === 'plata') {
    planInfo = {
      name: 'Plata',
      price: '$ 5.5',
      use: 'Ilimitado',
      days: '180 Dias'
    };
  } else if (plan === 'oro') {
    planInfo = {
      name: 'Oro',
      price: '$ 10',
      use: 'Ilimitado',
      days: '365 Dias'
    };
  } else {
    planInfo = {
      noPlan: 'PLAN NO ENCONTRADO'
    };
  }
  
  // Verificar Plan Actual
  let verifyPlan = esPlanSuperior(plan, checkUser.plan)
  function esPlanSuperior(aComprar, actual) {
    const planes = { 'free': 0, 'bronce': 1, 'plata': 2, 'oro': 3};
    return planes[aComprar] > planes[actual];
  }

  res.render('order', {
    botName,
    plan: planInfo,
    usuario: checkUser.number.split('@')[0],
    verifyPlan
  });
});
app.get("/xix2j4av", async (req, res) => {
  let bot = await client.decodeJid(client.user.id.split(':')[0]);
  let totalUsers = Object.keys(database).length

  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = Object.values(database).slice(startIndex, endIndex);

  const totalPages = Math.ceil(Object.keys(database).length / itemsPerPage);
  
  //res.render("bot", { users: database })
  res.render("bot", {
    botName,
    bot,
    totalUsers,
    usos: totalHit(),
    users: usersToDisplay,
    totalPages,
    currentPage: page
  });
})
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 404 */
app.use((req, res, next) => {
  res.status(404).render("404", { botName });
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});