const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { pool } = require('../config/db');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

router.get('/', asyncWrapper(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM subjects WHERE is_active = TRUE ORDER BY name ASC');
  res.json({ success: true, data: rows });
}));

module.exports = router;
