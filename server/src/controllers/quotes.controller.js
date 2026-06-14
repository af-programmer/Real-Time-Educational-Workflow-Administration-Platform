const quotesService = require('../services/quotes.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getDaily = asyncWrapper(async (req, res) => {
  const role = req.query.role || req.user.role;
  const quote = await quotesService.getDailyQuote(role);
  res.json({ success: true, data: quote });
});

const getRandom = asyncWrapper(async (req, res) => {
  const role = req.query.role || req.user.role;
  const excludeId = req.query.excludeId ? parseInt(req.query.excludeId) : null;
  const quote = await quotesService.getRandomQuote(role, excludeId);
  res.json({ success: true, data: quote });
});

module.exports = { getDaily, getRandom };
