const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

const { User, UserModel } = require("./data");
const myLang = require("../language").getString;
const { BOT_NAME, DOMINIO } = require("../config");
const generalDescription = 'Experimente el poder de la Inteligencia Artificial: hable con Chat GPT en WhatsApp. Participe en conversaciones, obtenga respuestas a preguntas y explore posibilidades interesantes.'

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
  res.locals.isAdmin = req.session.isAdmin || false;
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
  res.render("index", { BOT_NAME, DOMINIO, pageTitle: 'Inicio', description: generalDescription });
});
app.get("/planes", (req, res) => {
  res.render("pricing", { BOT_NAME, DOMINIO, pageTitle: 'Planes', description: generalDescription });
});
app.get("/generador-link-whatsapp", (req, res) => {
  res.render("gen", {
    BOT_NAME,
    DOMINIO,
    pageTitle: 'Generador de enlaces para WhatsApp',
    description: 'Obten de manera rapida y en muy pocos click tu enlace de Whatsapp personslizado con tú ensaje predeterminado.'
  });
});
app.get("/politicas_de_privacidad", (req, res) => {
  res.render("privacy", {
    BOT_NAME,
    DOMINIO,
    pageTitle: 'Politicas de Privacidad',
    description: generalDescription
  });
});

/* rutas formulario */
app.get("/login", (req, res) => {
  if (req.session && req.session.sesionIniciada) {
    res.redirect("/usuario");
  } else {
    res.render("login", { BOT_NAME, DOMINIO, pageTitle: 'Login', description: generalDescription });
  }
});
app.get("/registro", (req, res) => {
  if (req.session && req.session.sesionIniciada) {
    res.redirect("/usuario");
  } else {
    res.render("register", { BOT_NAME, DOMINIO, pageTitle: 'Registro', description: generalDescription });
  }
});

app.post("/login", async (req, res) => {
  const phone = req.body.phone;
  const password = req.body.password;
  let noPlus = phone.replace(/\+/g, '');
  let checkUser = await User.show(noPlus+'@s.whatsapp.net');
  let bot = await client.decodeJid(client.user.id.split(':')[0]);

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
    req.session.username = noPlus;
    if (noPlus === bot) {
      req.session.isAdmin = true;
    }
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
  let regUser = await User.check(noPlus+'@s.whatsapp.net');
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
    let newUser = new User(exist[0].jid, username, password)
    await newUser.save();
    await client.sendMessage(exist[0].jid, {
      text: `Bienvenido ${username}, tus credenciales son las siguientes:\n\n`+
      `*Usuario:*\n${username}\n`+
      `*Contraseña:*\n${password}`
    })
    await client.sendText(exist[0].jid, myLang("global").welcome)
  }
});

/* verificación usuario */
function requireLogin(req, res, next) {
  if (req.session && req.session.sesionIniciada) {
    return next();
  } else {
    req.session.destino = req.originalUrl;
    res.redirect("/login");
  }
};
async function requireAdmin(req, res, next) {
  let user = req.session.username;
  let bot = await client.decodeJid(client.user.id.split(':')[0]);
  if (user === bot) {
    next();
  } else {
    res.status(403).render("errores", { BOT_NAME, DOMINIO, pageTitle: 'Acceso Denegado', description: generalDescription, errorMessage: "403 Acceso Denegado" });
  }
}

app.get("/usuario", requireLogin, async (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const user = req.session.username;
  let checkUser = await User.show(user+'@s.whatsapp.net');
  let emojis = {"bronce": "🥉 Bronce", "plata": "🥈 Plata", "oro": "🥇 Oro",};
  let premiumEmoji = emojis[checkUser.plan] || "🆓";
  
  let profile = {
    numero: checkUser.phone.split('@')[0],
    nombre: checkUser.name,
    pass: checkUser.pass || 'Contraseña no definida',
    usoBot: checkUser.usage,
    planPremium: premiumEmoji,
    diasRestantes: '',
    usosRestantes: '',
  }
  if (checkUser.premium) {
    profile.diasRestantes = await User.getDaysRemaining(checkUser.planEndDate);
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
  res.render("user", { BOT_NAME, DOMINIO, pageTitle: 'Perfil', description: generalDescription, profile, ppuser });
});
app.get("/orden", requireLogin, async (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  const plan = req.query.plan;
  let planInfo = {};

  let user = req.session.username;
  let checkUser = await User.show(user+'@s.whatsapp.net');

  if (plan === 'bronce') {
    planInfo = {
      name: 'Bronce',
      price: '$ 1.5',
      use: 'Ilimitado',
      days: '30 Dias'
    };
  } else if (plan === 'plata') {
    planInfo = {
      name: 'Plata',
      price: '$ 6',
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
    BOT_NAME,
    DOMINIO,
    pageTitle: 'Orden',
    description: generalDescription,
    plan: planInfo,
    usuario: checkUser.phone.split('@')[0],
    verifyPlan
  });
});
app.get("/configure", requireLogin, requireAdmin, async (req, res) => {
  try {
    let bot = await client.decodeJid(client.user.id.split(':')[0]);
    let isAdmin = req.session.isAdmin;
    
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const totalUsers = await UserModel.countDocuments();
    const users = await UserModel.find().skip(startIndex).limit(itemsPerPage);
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
  
    res.render("bot", {
      BOT_NAME,
      DOMINIO,
      pageTitle: 'Administracion',
      description: generalDescription,
      bot,
      isAdmin,
      usos: 1,
      totalUsers,
      users,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error al recuperar usuarios:', error);
    res.status(500).render("errores", { BOT_NAME, pageTitle: '....?', description: generalDescription, errorMessage: "500 Error Interno Del Servidor" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

/* mantener actividad plan free */
app.get('/ping', (req, res) => {
  res.send('Pong');
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* 404 */
app.use((req, res, next) => {
  res.status(404).render("errores", { BOT_NAME, pageTitle: '....?', description: generalDescription, errorMessage: "404 Pagina no encontrada" });
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});