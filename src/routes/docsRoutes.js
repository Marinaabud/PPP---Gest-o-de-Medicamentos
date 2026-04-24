const express = require('express');

const docsController = require('../controllers/docsController');

const router = express.Router();

router.get('/json', docsController.renderJson);

module.exports = router;
