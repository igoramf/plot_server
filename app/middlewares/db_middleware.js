const { connectDB } = require('../database/database.js');

const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).send('Erro ao conectar ao banco de dados');
  }
};

module.exports = dbMiddleware;
