const { pool } = require('../config/db');

async function findAllActive() {
  const [rows] = await pool.query('SELECT * FROM subjects WHERE is_active = TRUE ORDER BY name ASC');
  return rows;
}

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
  return rows;
}

async function create({ name, description }) {
  const [result] = await pool.query(
    'INSERT INTO subjects (name, description) VALUES (?, ?)',
    [name, description || null]
  );
  return result.insertId;
}

async function setActive(id, is_active) {
  await pool.query('UPDATE subjects SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
}

module.exports = { findAllActive, findAll, create, setActive };
