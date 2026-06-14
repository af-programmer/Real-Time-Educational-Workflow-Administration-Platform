const quotesDAL = require('../dal/quotes.dal');

async function getDailyQuote(role) {
  return quotesDAL.getDailyQuote(role);
}

async function getRandomQuote(role, excludeId) {
  return quotesDAL.getRandomQuote(role, excludeId);
}

module.exports = { getDailyQuote, getRandomQuote };
