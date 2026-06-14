const subjectsService = require('../services/subjects.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getAllActive = asyncWrapper(async (req, res) => {
  const rows = await subjectsService.getAllActive();
  res.json({ success: true, data: rows });
});

const getAll = asyncWrapper(async (req, res) => {
  const rows = await subjectsService.getAll();
  res.json({ success: true, data: rows });
});

const create = asyncWrapper(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) return res.status(400).json({ success: false, message: 'Name is required.' });
  const id = await subjectsService.create(name.trim(), description?.trim() || null);
  res.status(201).json({ success: true, data: { id } });
});

const toggleActive = asyncWrapper(async (req, res) => {
  const { is_active } = req.body;
  if (is_active === undefined) return res.status(400).json({ success: false, message: 'is_active is required.' });
  await subjectsService.setActive(req.params.id, is_active);
  res.json({ success: true });
});

module.exports = { getAllActive, getAll, create, toggleActive };
