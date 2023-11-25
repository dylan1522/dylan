const moment = require('moment-timezone');
const mongoose = require('mongoose');
const fs = require("fs");

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pass: String,
  premium: Boolean,
  plan: String,
  planStartDate: Date,
  planEndDate: Date,
  block: Boolean,
  usage: Number,
  cash: Number,
  conversationHistory: [{
    role: String,
    content: String,
    timestamp: Date,
  }],
});

const UserModel = mongoose.model('User', userSchema);

class User {
  constructor(phone, name, pass = '') {
    this.phone = phone;
    this.name = name;
    this.pass = pass;
  }

  async save() {
    const newUser = new UserModel({
      phone: this.phone,
      name: this.name,
      pass: this.pass,
      premium: false,
      plan: "free",
      planStartDate: null,
      planEndDate: null,
      block: false,
      usage: 0,
      cash: 10,
      conversationHistory: [],
    });
    await newUser.save();
  }
  
  static async delUser(phone) {
    try {
      await UserModel.findOneAndDelete({ phone });
    } catch (error) {
      console.error(`Error al eliminar el usuario "${phone}": ${error}`);
    }
  }

  static async show(phone) {
    return await UserModel.findOne({ phone });
  }

  static async check(phone) {
    const user = await UserModel.findOne({ phone });
    return user !== null;
  }

  static async counter(phone, usageChange = 0, cashChange = 0) {
    const user = await UserModel.findOne({ phone });
    if (user) {
      user.usage += usageChange;
      user.cash += cashChange;
      try {
        await user.save();
      } catch (error) {
        console.error(`Error al guardar los cambios del usuario "${phone}": ${error}`);
      }
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }
  
  static async change(phone, pass) {
    const user = await UserModel.findOne({ phone });
    if (user) {
      user.pass = pass;
      try {
        await user.save();
      } catch (error) {
        console.error(`Error al guardar los cambios del usuario "${phone}": ${error}`);
      }
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }

  static async addToConversationHistory(phone, role, content) {
    const user = await UserModel.findOne({ phone });
    if (user) {
      const newMessage = { role, content, timestamp: Date.now() };
      user.conversationHistory.push(newMessage);
      await user.save();
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }

  static async getConversationHistory(phone) {
    const user = await UserModel.findOne({ phone });
    if (user && user.conversationHistory) {
      const conversationHistory = user.conversationHistory;
      const startIndex = Math.max(0, conversationHistory.length - 2);
      return conversationHistory.slice(startIndex);
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos o no tiene historial de conversaciones.`);
      return [];
    }
  }
  
  static async activatePremiumPlan(phone, plan) {
    const now = moment().tz(global.timeZone);
    let endDate = moment().tz(global.timeZone);
    const user = await UserModel.findOne({ phone });
    now.startOf('day');
    endDate.startOf('day');
    if (plan === "bronce") {
      endDate.add(1, 'months');
    } else if (plan === "plata") {
      endDate.add(6, 'months');
    } else if (plan === "oro") {
      endDate.add(1, 'year');
    } else if (plan === 'semana') {
      endDate.add(1, 'week');
    } else if (!isNaN(plan) && Number(plan) > 0) {
      endDate.add(Number(plan), 'days');
    } else {
      return;
    }
    if (user) {
      user.premium = true;
      user.plan = plan;
      user.planStartDate = now.toDate();
      user.planEndDate = endDate.toDate();
      user.cash = 10;
      await user.save();
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }
  
  static async checkPremiumPlanStatus(phone) {
    const user = await UserModel.findOne({ phone });
    if (user && user.premium && user.planEndDate) {
      const now = moment().tz(global.timeZone);
      const planEndDate = moment(user.planEndDate).tz(global.timeZone);
      if (planEndDate.isBefore(now)) {
        user.premium = false;
        user.plan = "free";
        user.planStartDate = null;
        user.planEndDate = null;
        user.cash = 10;
        await user.save();
      }
    }
  }
  
  static async resetUser(phone) {
    const user = await UserModel.findOne({ phone });
    if (user) {
      user.premium = false;
      user.plan = "free";
      user.planStartDate = null;
      user.planEndDate = null;
      user.cash = 10;
      await user.save();
    }
  }
  
  static getDaysRemaining(endDate) {
    const now = moment().tz(global.timeZone);
    const end = moment(endDate).tz(global.timeZone);
    const diffInMs = end - now;
    return runtime(diffInMs);
  }
}

module.exports = { User, UserModel };


function runtime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " 𝙳𝙸𝙰 " : " 𝙳𝙸𝙰𝚂 ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " 𝙷𝙾𝚁𝙰 " : " 𝙷𝙾𝚁𝙰𝚂 ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " 𝙼𝙸𝙽𝚄𝚃𝙾 " : " 𝙼𝙸𝙽𝚄𝚃𝙾𝚂 ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾 " : " 𝚂𝙴𝙶𝚄𝙽𝙳𝙾𝚂") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}