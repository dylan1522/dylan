const OpenAI = require('openai');
let Config = require("../../config");
let { fetchJson, msgErr } = require("../../lib/myfunc");
module.exports = {
  category: 'ia',
  desc: 'inteligencia artificial que te puede ayudar con cualquier tema.',
  ignored: true,
  isPrivate: true,
  check: { pts: 1 },
  async handler(m, {myBot, budy, myLang, User}) {
    let checkUser = await User.show(m.sender);
    let isPremium = checkUser.premium ? 0 : -1;
    myBot.sendReact(m.chat, "🕒", m.key);
    try {
      const openai = new OpenAI({
        apiKey: Config.OPEN_AI_KEY || console.log('Err ApikEy'),
      });
      const conversationHistory = await User.getConversationHistory(m.sender);
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: 'Eres DarkBox, analiza cuidadosamente las preguntas que recibes para ofrecer las mejores respuestas posibles, explicando detalladamente cuando sea necesario. Tu estilo de conversación es fluido. Da respuestas analíticas y bien explicadas.',
          },
          {
            role: "user",
            content: budy,
          },
          ...conversationHistory.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: "assistant",
            content: budy,
          },
        ],
      });
  
      const respuestaDelChatbot = response.choices[0].message.content.trim();
      if (respuestaDelChatbot == 'error' || respuestaDelChatbot == '' || !respuestaDelChatbot) return XD;
  
      await User.addToConversationHistory(m.sender, "user", budy);
      await User.addToConversationHistory(m.sender, "assistant", respuestaDelChatbot);
  
      myBot.sendMessage(m.chat, {
        text: respuestaDelChatbot
      }, { quoted: m });
      await User.counter(m.sender, 1, isPremium);
    } catch (e) {
      myBot.sendText(m.chat, msgErr())
      console.log(e)
    }
    /*catch {
      try {
        myBot.sendPresenceUpdate('composing', m.chat);
        const vihangayt1 = await fetch(`https://vihangayt.me/tools/chatgpt?q=${budy}`);
        const vihangaytjson1 = await vihangayt1.json();
        if (vihangaytjson1.data == 'error' || vihangaytjson1.data == '' || !vihangaytjson1.data) return XD;
        myBot.sendMessage(m.chat, {
          text: `${vihangaytjson1.data}`.trim()
        }, { quoted: m });
        await User.counter(m.sender, 1, isPremium);
      } catch {
        try {
          myBot.sendPresenceUpdate('composing', m.chat);
          const vihangayt2 = await fetch(`https://vihangayt.me/tools/chatgpt2?q=${budy}`);
          const vihangaytjson2 = await vihangayt2.json();
          if (vihangaytjson2.data == 'error' || vihangaytjson2.data == '' || !vihangaytjson2.data) return XD;
          myBot.sendMessage(m.chat, {
            text: `${vihangaytjson2.data}`.trim()
          }, { quoted: m });
          await User.counter(m.sender, 1, isPremium);
        } catch {
          try {
            myBot.sendPresenceUpdate('composing', m.chat);
            const vihangayt3 = await fetch(`https://vihangayt.me/tools/chatgpt2?q=${budy}`);
            const vihangaytjson3 = await vihangayt3.json();
            if (vihangaytjson3.data == 'error' || vihangaytjson3.data == '' || !vihangaytjson3.data) return XD;
            myBot.sendMessage(m.chat, {
              text: `${vihangaytjson3.data}`.trim()
            }, { quoted: m });
            await User.counter(m.sender, 1, isPremium);
          } 
        }
      }
    }*/
  }
};