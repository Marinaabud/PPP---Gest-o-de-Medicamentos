const express = require('express');

const authRoutes = require('./authRoutes');
const docsRoutes = require('./docsRoutes');
const medicationRoutes = require('./medicationRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    message: 'API online',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

router.use('/auth', authRoutes);
router.use('/docs', docsRoutes);
router.use('/medications', medicationRoutes);

module.exports = router;
