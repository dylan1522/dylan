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
    const now = new Date();
    let endDate = new Date();
    const user = await UserModel.findOne({ phone });
    now.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (plan === "bronce") {
      endDate.setMonth(now.getMonth() + 1);
    } else if (plan === "plata") {
      endDate.setMonth(now.getMonth() + 6);
    } else if (plan === "oro") {
      endDate.setFullYear(now.getFullYear() + 1);
    } else if (plan === 'semana') {
      endDate.setDate(now.getDate() + 7);
    } else if (!isNaN(plan) && Number(plan) > 0) {
      endDate.setDate(now.getDate() + Number(plan));
    } else {
      return;
    }
    if (user) {
      user.premium = true;
      user.plan = plan;
      user.planStartDate = now;
      user.planEndDate = endDate;
      user.cash = 10;
      await user.save();
    } else {
      console.log(`El usuario "${phone}" no existe en la base de datos`);
    }
  }
  
  static async checkPremiumPlanStatus(phone) {
    const user = await UserModel.findOne({ phone });
    if (user && user.premium && user.planEndDate) {
      const now = new Date();
      if (user.planEndDate < now) {
        user.premium = false;
        user.plan = "free";
        user.planStartDate = null;
        user.planEndDate = null;
        user.cash = 10;
        await user.save();
        await client.sendText(
          user.phone,
          'Se ha terminado tu plan premium, actualiza y sigue disfrutando de los servicios de forma ilimitada.'
        );
      }
    }
  }
  
  static async getDaysRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffInMs = end - now;
    const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return daysRemaining;
  }
}

module.exports = { User, UserModel };