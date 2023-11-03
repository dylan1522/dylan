/*
  Copyright (C) 2023
  DarkBox - Ian VanH
  Licensed MIT
  you may not use this file except in compliance with the License.
*/

require("./config");
const {
  proto,
  generateWAMessage,
  areJidsSameUser
} = require("@adiwajshing/baileys");
const fs = require("fs");
const { exec, spawn, execSync } = require("child_process");
const axios = require("axios");
const { log, pint, bgPint } = require("./lib/colores");
const { chat_gpt, msgErr, getBuffer } = require("./lib/myfunc");
const Config = require("./config");

// Language
const myLang = require("./language").getString;

module.exports = myBot = async (myBot, m, chatUpdate, store) => {
  try {
    const body = m.mtype === "conversation" ? m.message.conversation : m.mtype == "imageMessage" ? m.message.imageMessage.caption : m.mtype == "videoMessage" ? m.message.videoMessage.caption : m.mtype == "extendedTextMessage" ? m.message.extendedTextMessage.text : m.mtype == "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId : m.mtype == "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId : m.mtype == "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId : m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text : "";
    //var budy = typeof m.text == "string" ? m.text : "";
    const budy = m.mtype == "extendedTextMessage" ? m.text : m.mtype;
    const prefix = Config.HANDLER.match(/\[(\W*)\]/)[1][0];
    const isCmd = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await myBot.decodeJid(myBot.user.id);
    const isCreator = [botNumber, ...global.owner].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender);
    const itsMe = m.sender == botNumber ? true : false;
    const text = (q = args.join(" "));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || "";
    const isMedia = /image|video|sticker|audio/.test(mime);

    // New Functions BD
    const { User, UserModel } = require("./src/data");
    const regUser = await User.check(m.sender);
    const checkUser = await User.show(m.sender);

    // Group
    const groupMetadata = m.isGroup ? await myBot.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
    const groupAdmins = m.isGroup ? await participants.filter((v) => v.admin !== null).map((v) => v.id) : "";
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

    // Public & Self
    if (!myBot.public) {
      if (!m.key.fromMe) return;
    }
    
    let cron = require("node-cron");
    cron.schedule('0 6,18 * * *', async () => {
      try {
        let { data } = await axios.get(url);
        let { active, name, news1, news2 } = data;
    
        if (active === true) {
          if (cron.getExpression() === '0 6 * * *') {
            if (news1.mode === 'image') {
              await sendNotify(news1.url, name.replace('{}', Config.BOT_NAME) + news1.description, 'image');
            } else if (news1.mode === 'video') {
              await sendNotify(news1.url, name.replace('{}', Config.BOT_NAME) + news1.description, 'video');
            }
          } else if (cron.getExpression() === '0 18 * * *') {
            if (news2.mode === 'image') {
              await sendNotify(news2.url, name.replace('{}', Config.BOT_NAME) + news2.description, 'image');
            } else if (news2.mode === 'video') {
              await sendNotify(news2.url, name.replace('{}', Config.BOT_NAME) + news2.description, 'video');
            }
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    }, {
      timezone: global.timeZone
    });
    
    async function sendNotify(url, description, tipo) {
      try {
        const users = await UserModel.find();
    
        for (let user of users) {
          if (tipo === 'image') {
            await myBot.sendImage(user.phone, url, description);
          } else if (tipo === 'video') {
            await myBot.sendVideo(user.phone, url, description);
          }
          await sleep(1500);
        }
    
        console.log(`Todos los ${tipo}s han sido enviados.`);
      } catch (error) {
        console.error(`Error al enviar ${tipo}s: ${error}`);
      }
    }

    //  Push Message To Console && Auto Read
    if (m.message) {
      if (Config.READ === "true") {
        myBot.sendReadReceipt(m.chat, m.sender, [m.key.id]);
      }
      if (Config.MSG_CONSOLE === "true") {
        log(
          pint(bgPint(new Date(), "white"), "black.") + "\n" +
          pint(bgPint("[ NUEVO MENSAJE ]", "white"), "black.") + "\n" +
          pint(bgPint(budy, "blue"), "white.") + "\n" +
          pint("=> Sender: ", "magenta") + pint(pushname) + " " + pint(m.sender, "yellow") + "\n" +
          pint("=> To: ", "blue") + " " + pint(m.isGroup ? pushname : "Chat Privado") + " " + pint(m.chat) + "\n\n"
        );
      }
    };
//log(m)
    const cmd = Object.values(attr.commands).find((cmn) => cmn.cmd && command.match(cmn.cmd) && !cmn.disabled)
    if (budy) {
      if (m.isGroup) {
        return;
      }
      else if (regUser === false) {
        return myBot.sendText(m.chat, `👋🏻 Hola, soy *DrkBot*, veo qué no estás registrado.\nPara usar todas mis funciones ingresa al siguiente link y registrate\n${Config.DOMINIO}/registro`)
      }
      else if (budy === "protocolMessage") {
        return;
      }
      else if (budy === "stickerMessage") {
        m.reply('No puedo leer stickers, si quieres expresarme algo escríbeme o mándame una nota de voz y te responderé 😊');
      }
      else if (budy === "videoMessage") {
        m.reply('Quisiera ver ese divertido video pero ando muy ocupado 😞\nEscríbeme o mándame una nota de voz y te responderé 😊');
      }
      else if (budy === "documentMessage") {
        m.reply('Ando ocupado para procesar tu documento.\nEscríbeme o mándame una nota de voz y te responderé 😊');
      }
      else if (budy === "reactionMessage") {
        m.reply('Divertidas tus reacciones, si necesitás que te ayude en algun tema escríbeme o mándame una nota de voz y te responderé 😊');
      }
      else if (budy === "contactMessage") {
        m.reply('🤔')
        await myBot.sendText(m.chat, `*${m.msg.displayName}*\nEs un amigo tuyo?, cuéntale de mi también podríamos ser amigos. 😁`);
      }
      else if (budy === "locationMessage") {
        m.reply('🚨 No compartas tu ubicación, podrías ponerte en riesgo!');
      }
      else if (budy === "pollCreationMessage") {
        m.reply('Esas preguntás no me dejan dormir en las noches 😪');
      }
      else if (budy === "imageMessage") {
        let { newSticker } = require("./lib/exif");
        try {
          myBot.sendReact(m.chat, "🕒", m.key);
          if (m.message.imageMessage.caption) { name = m.message.imageMessage.caption }
          else { name = "Sticker by:" }
          let encmedia = await newSticker(await m.download(), false, name, Config.BOT_NAME)
          await myBot.sendMessage(m.chat, {
            sticker: encmedia
           }, { quoted: m });
          await User.counter(m.sender, 1);
        } catch (e) {
          myBot.sendText(m.chat, msgErr())
          throw e
        }
      }
      else if (budy === "audioMessage") {
        if (checkUser.cash < 1) return myBot.sendText(m.chat, myLang("global").no_points.replace("{}", Config.DOMINIO));
        if (m.message.audioMessage.seconds > 10) return myBot.sendText(m.chat, 'Envia un audio menor a 10 segundos!');
        
        let isPremium = checkUser.premium ? 0 : -1;
        let FormData = require("form-data");
        myBot.sendReact(m.chat, "🎧", m.key);
        try {
          let path = await m.download()
          let buffer = Buffer.from(path)
          
          let formData = new FormData();
          formData.append("file", buffer, {
            filename: "grab.ogg",
            contentType: "audio/ogg",
          });
          formData.append("model", "whisper-1");
          formData.append("temperature", 0.4);
          
          const transcription = await axios({
            method: "post",
            url: "https://api.openai.com/v1/audio/transcriptions",
            headers: {
              Authorization: `Bearer ${Config.OPEN_AI_KEY}`,
              ...formData.getHeaders(),
            },
            maxBodyLength: Infinity,
            data: formData
          });
          
          let response = await chat_gpt(m.sender, transcription.data.text)
          
          myBot.sendMessage(m.chat, {
            text: response
          }, { quoted: m });
          await User.counter(m.sender, 1, isPremium);
        } catch (e) {
          myBot.sendText(m.chat, msgErr())
          log(e)
        }
      }
      else if (cmd) {
        if (cmd.owner && !isCreator) return;
        else if (checkUser.block == true) return myBot.sendText(m.chat, myLang("global").block);
        else if (checkUser.cash < cmd.check.pts) {
          return myBot.sendText(m.chat, myLang("global").no_points.replace("{}", Config.DOMINIO)) }
        await cmd.handler(m, {
          myBot,
          myLang,
          pushname,
          command,
          prefix,
          text,
          mime,
          User,
          participants,
          regUser,
          quoted,
          args,
        });
      } else {
        const is_event = Object.values(attr.commands).filter((func) => !func.cmd && !func.disabled);
        for (const event of is_event) {
          if (checkUser.block == true) return myBot.sendText(m.chat, myLang("global").block);
          else if (checkUser.cash < event.check.pts) {
            return await myBot.sendText(m.chat, myLang("global").no_points.replace("{}", Config.DOMINIO)) }
          await event.handler(m, {
            myBot, myLang, budy, pushname, User,
          })
        }
      }
    };

  } catch (err) {
    if (Config.LOG == "false") return;
    myBot.sendText(m.chat, msgErr())
    myBot.sendMessage(myBot.user.id, { text: `*-- ${myLang("err").msgReport} [ ${Config.BOT_NAME} ] --*\n` + "*Error:* ```" + err + "```"});
  };
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  log(pint(`Update ${__filename}`, "orange."));
  delete require.cache[file];
  require(file);
});