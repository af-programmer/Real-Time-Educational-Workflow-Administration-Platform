const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const quotesController = require('../controllers/quotes.controller');

router.use(authMiddleware);

router.get('/daily', quotesController.getDaily);
router.get('/random', quotesController.getRandom);

module.exports = router;
