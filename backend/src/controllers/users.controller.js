const usersService = require('../services/users.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getAll = asyncWrapper(async (req, res) => {
  const { role, search, page, limit } = req.query;
  const result = await usersService.getAllUsers({ role, search, page, limit });
  res.json({ success: true, ...result });
});

const getById = asyncWrapper(async (req, res) => {
  const user = await usersService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

const getProfile = asyncWrapper(async (req, res) => {
  const profile = await usersService.getTeacherProfile(req.params.id);
  res.json({ success: true, data: profile });
});

const create = asyncWrapper(async (req, res) => {
  const user = await usersService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

const update = asyncWrapper(async (req, res) => {
  const user = await usersService.updateUser(req.params.id, req.body);
  res.json({ success: true, data: user });
});

const remove = asyncWrapper(async (req, res) => {
  await usersService.deleteUser(req.params.id);
  res.json({ success: true, message: 'User deleted successfully.' });
});

const block = asyncWrapper(async (req, res) => {
  const { block: shouldBlock } = req.body;
  const result = await usersService.toggleBlock(req.params.id, shouldBlock !== false);
  res.json({ success: true, data: result });
});

const assignClasses = asyncWrapper(async (req, res) => {
  await usersService.assignClasses(req.params.id, req.body.classIds);
  res.json({ success: true, message: 'Classes assigned successfully.' });
});

const assignSubjects = asyncWrapper(async (req, res) => {
  await usersService.assignSubjects(req.params.id, req.body.subjectIds);
  res.json({ success: true, message: 'Subjects assigned successfully.' });
});

module.exports = { getAll, getById, getProfile, create, update, remove, block, assignClasses, assignSubjects };
