const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'medication-secret-key';
const TOKEN_OPTIONS = { expiresIn: '1h' };

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateCredentials(payload, isRegister = false) {
  const { name, email, password } = payload;

  if (isRegister && !name) {
    throw createError(400, 'O nome do usuario e obrigatorio');
  }

  if (!email) {
    throw createError(400, 'O e-mail e obrigatorio');
  }

  if (!password) {
    throw createError(400, 'A senha e obrigatoria');
  }

  if (password.length < 6) {
    throw createError(400, 'A senha deve ter pelo menos 6 caracteres');
  }
}

function buildAuthResponse(user) {
  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    TOKEN_OPTIONS
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };
}

function register(payload) {
  validateCredentials(payload, true);

  if (userModel.findByEmail(payload.email)) {
    throw createError(409, 'Ja existe um usuario cadastrado com este e-mail');
  }

  const user = userModel.create(payload);
  return buildAuthResponse(user);
}

function login(payload) {
  validateCredentials(payload);

  const user = userModel.findByEmail(payload.email);

  if (!user || user.password !== payload.password) {
    throw createError(401, 'Credenciais invalidas');
  }

  return buildAuthResponse(user);
}

module.exports = {
  JWT_SECRET,
  login,
  register
};
