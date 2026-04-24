const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');
const { JWT_SECRET } = require('../services/authService');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const error = new Error('Token nao informado');
    error.statusCode = 401;
    return next(error);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    const error = new Error('Formato do token invalido');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userModel.findById(decoded.sub);

    if (!user) {
      const error = new Error('Usuario do token nao encontrado');
      error.statusCode = 401;
      return next(error);
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return next();
  } catch (_error) {
    const error = new Error('Token invalido ou expirado');
    error.statusCode = 401;
    return next(error);
  }
}

module.exports = {
  authenticate
};
