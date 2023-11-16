const axios = require("axios");
//const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let { log, pint } = require("../../lib/colores");
let Config = require("../../config");
let { jsonformat, fetchJson } = require("../../lib/myfunc");
module.exports = {
  cmd: /^(test)/i,
  category: 'ia',
  desc: 'test de comandos',
  ignored: true,
  isPrivate: true,
  owner: true,
  check: { pts: 1 },
  async handler(m, {myBot, budy, myLang, User}) {
    return;
  }
};