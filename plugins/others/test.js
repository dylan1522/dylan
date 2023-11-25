const axios = require("axios");
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let Config = require("../../config");
let { log, pint } = require("../../lib/colores");
let { checkPremiumPlan } = require("../../lib/subscription");
let { jsonformat, fetchJson } = require("../../lib/myfunc");
let { User, UserModel } = require("../../src/data");
module.exports = {
  cmd: /^(test)/i,
  category: 'ia',
  desc: 'test de comandos',
  ignored: true,
  isPrivate: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, { myBot, args, budy, myLang }) {
    //return;
  }
};