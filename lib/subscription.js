const { writeFileSync, readFileSync } = require('fs');
let Config = require("../config");
let { User, UserModel } = require("../src/data");
let { sleep } = require('./myfunc');

const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: Config.OPEN_AI_KEY || console.log('Err ApikEy'),
});
/*async function crearFrases() {
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
  } catch (e) {
    console.error('Error:', e);
  }
}

async function enviarFrases() {
  try {
    const motivacionSemana = JSON.parse(readFileSync('./src/motivacion-semanal.json', 'utf-8'));

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
}*/
async function checkPremiumPlan() {
  const users = await UserModel.find();
  
  for (let user of users) {
    await User.checkPremiumPlanStatus(user.phone);
  }
}

/*async function checkDaysRemaining() {
  const users = await UserModel.find();

  for (let user of users) {
    try {
      let res = await User.getDaysRemaining(user.planEndDate);

      const matchDias = res.match(/(\d+)\s*𝙳𝙸𝙰/);
      const diasRestantes = matchDias ? parseInt(matchDias[1]) : 0;

      if ([5, 4, 3, 2, 1].includes(diasRestantes)) {
        await client.sendText(
          user.phone,
          `🤖 Hola ${user.name},\nTe quedan ${diasRestantes} días premium, renueva tu plan.\n*No dejes perder tus beneficios*`
        );
      }
    } catch (error) {
      console.error(`Error al enviar mensaje a ${user.phone}: ${error.message}`);
      continue;
    }
  }
}*/


module.exports = {
  checkPremiumPlan
}