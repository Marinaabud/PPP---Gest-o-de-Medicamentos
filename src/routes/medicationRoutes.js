const express = require('express');

const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.get('/', medicationController.list);
router.get('/:id', medicationController.getById);
router.post('/', medicationController.create);
router.put('/:id', medicationController.update);
router.patch('/:id/status', medicationController.updateStatus);
router.delete('/:id', medicationController.remove);

module.exports = router;
