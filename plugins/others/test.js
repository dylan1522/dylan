const fs = require("fs");
const axios = require("axios");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let { log, pint } = require("../../lib/colores");
let Config = require("../../config");
let { jsonformat } = require("../../lib/myfunc");
module.exports = {
  cmd: /^(test)/i,
  ignored: true,
  owner: true,
  check: { pts: 0 },
  async handler(m, {myBot, text, User}) {
    let check = await User.show(m.sender)
    console.log(check)
  }
};