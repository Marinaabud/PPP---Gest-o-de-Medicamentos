const authService = require('../services/authService');

async function register(req, res, next) {
  try {
    const result = authService.register(req.body);
    return res.status(201).json({
      message: 'Usuario registrado com sucesso',
      data: result
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = authService.login(req.body);
    return res.status(200).json({
      message: 'Login realizado com sucesso',
      data: result
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
