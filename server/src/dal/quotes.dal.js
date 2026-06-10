const { pool } = require('../config/db');

async function getDailyQuote(role) {
  const [rows] = await pool.query(
    'SELECT id, text FROM quotes WHERE role = ? AND is_active = TRUE ORDER BY id ASC',
    [role]
  );
  if (!rows.length) return null;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return rows[dayOfYear % rows.length];
}

async function getRandomQuote(role, excludeId) {
  const [rows] = await pool.query(
    'SELECT id, text FROM quotes WHERE role = ? AND is_active = TRUE AND id != ? ORDER BY RAND() LIMIT 1',
    [role, excludeId ?? 0]
  );
  return rows[0] || null;
}

module.exports = { getDailyQuote, getRandomQuote };
