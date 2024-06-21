// db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.DB_URI;

const connectDB = async () => {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000
      });
      console.log("Conectado ao MongoDB com Mongoose!");
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB', error);
      throw error;
    }
  };

module.exports = { connectDB };
