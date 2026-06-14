const usersService = require('../services/users.service');
const teachersService = require('../services/teachers.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getAll = asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'all_teachers', ...req.query });
  res.json({ success: true, ...result });
});

const getSecretaries = asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'secretary', limit: 100 });
  res.json({ success: true, ...result });
});

const getMyHomeroomTeachers = asyncWrapper(async (req, res) => {
  if (req.user.role !== 'Educator')
    return res.status(403).json({ success: false, message: 'Not a Educator.' });
  const teachers = await teachersService.getHomeroomTeachersForEducator(req.user.id);
  res.json({ success: true, data: teachers });
});

const getAdmins = asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'admin', limit: 100 });
  res.json({ success: true, ...result });
});

const getMe = asyncWrapper(async (req, res) => {
  const profile = await usersService.getTeacherProfile(req.user.id);
  res.json({ success: true, data: profile });
});

const getMyClasses = asyncWrapper(async (req, res) => {
  const classes = await teachersService.getTeacherClasses(req.user.id);
  res.json({ success: true, data: classes });
});

const getMySubjects = asyncWrapper(async (req, res) => {
  const subjects = await teachersService.getTeacherSubjects(req.user.id);
  res.json({ success: true, data: subjects });
});

const getProfile = asyncWrapper(async (req, res) => {
  const profile = await usersService.getTeacherProfile(req.params.id);
  res.json({ success: true, data: profile });
});

module.exports = { getAll, getSecretaries, getMyHomeroomTeachers, getAdmins, getMe, getMyClasses, getMySubjects, getProfile };
