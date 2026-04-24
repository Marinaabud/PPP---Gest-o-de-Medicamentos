const swaggerDocument = require('../../resources/swagger.json');

function getSwaggerDocument() {
  return swaggerDocument;
}

function renderJson(_req, res) {
  return res.status(200).json(swaggerDocument);
}

module.exports = {
  getSwaggerDocument,
  renderJson
};
