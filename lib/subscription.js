const { writeFileSync, readFileSync } = require('fs');
let Config = require("../config");
let { UserModel } = require("../src/data");

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: Config.OPEN_AI_KEY || console.log('Err ApikEy'),
});

async function crearFrases() {
  try {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'Eres un experto dando consejos.' },
        { role: 'user', content: 'Dame una frase de motivación para cada día de la semana, muestramelos por dias' },
    ],
  });

    const motivacionSemana = response.choices[0].message.content.trim();
    const regex = /(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo): "(.*?)"/g;
    let match;
    const motivacionDiaria = {};

    while ((match = regex.exec(motivacionSemana)) !== null) {
      const dia = match[1];
      const frase = match[2];
      motivacionDiaria[dia] = frase;
    }

    writeFileSync('./src/motivacion-semanal.json', JSON.stringify(motivacionDiaria, null, 2));
    console.log('archivo creado')
  } catch (e) {
    console.error('Error:', e.message);
  }
}

async function enviarFrases() {
  try {
    const motivacionSemana = JSON.parse(readFileSync('motivacion-semanal.json', 'utf-8'));

    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaActual = diasSemana[new Date().getDay()];

    const fraseDiaria = motivacionSemana[diaActual];
    
    let users = await UserModel.find();
    
    for (let user of users) {
      await client.sendImage(
        user.phone,
        global.thumb,
        fraseDiaria
      );
      await sleep(1500);
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

module.exports = {
  crearFrases,
  enviarFrases
}