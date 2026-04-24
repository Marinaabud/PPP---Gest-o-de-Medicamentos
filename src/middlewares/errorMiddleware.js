function notFound(req, _res, next) {
  const error = new Error(`Rota ${req.method} ${req.originalUrl} nao encontrada`);
  error.statusCode = 404;
  next(error);
}

function handler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || 'Erro interno do servidor',
    error: {
      statusCode,
      details: error.details || null
    }
  });
}

module.exports = {
  handler,
  notFound
};
