const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const quotesDAL = require('../dal/quotes.dal');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

router.get('/daily', asyncWrapper(async (req, res) => {
  const role = req.query.role || req.user.role;
  const quote = await quotesDAL.getDailyQuote(role);
  res.json({ success: true, data: quote });
}));

router.get('/random', asyncWrapper(async (req, res) => {
  const role = req.query.role || req.user.role;
  const { excludeId } = req.query;
  const quote = await quotesDAL.getRandomQuote(role, excludeId ? parseInt(excludeId) : null);
  res.json({ success: true, data: quote });
}));

module.exports = router;
