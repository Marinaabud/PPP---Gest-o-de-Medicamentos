const express = require('express');
const swaggerUi = require('swagger-ui-express');

const docsController = require('./controllers/docsController');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());

app.use(routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(docsController.getSwaggerDocument(), {
  customSiteTitle: 'Gestao de Medicacao API Docs'
}));

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.handler);

module.exports = app;
