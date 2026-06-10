const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const usersService = require('../services/users.service');
const usersDAL = require('../dal/users.dal');
const asyncWrapper = require('../utils/asyncWrapper');

router.use(authMiddleware);

// Secretary and admin see all teachers
router.get('/', requireRoles('secretary', 'admin'), asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'teacher', ...req.query });
  res.json({ success: true, ...result });
}));

// Teacher can get list of secretaries (for messaging)
router.get('/secretaries', requireRoles('teacher'), asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'secretary', limit: 100 });
  res.json({ success: true, ...result });
}));

// Homeroom teacher: get all teachers assigned to their homeroom classes
router.get('/my-homeroom-teachers', requireRoles('teacher'), asyncWrapper(async (req, res) => {
  if (!req.user.is_homeroom)
    return res.status(403).json({ success: false, message: 'Not a homeroom teacher.' });
  const homeroomClasses = await usersDAL.getHomeroomClasses(req.user.id);
  if (!homeroomClasses.length)
    return res.json({ success: true, data: [] });
  const teacherSets = await Promise.all(
    homeroomClasses.map((c) => usersDAL.getTeachersByClass(c.id))
  );
  const seen = new Set([req.user.id]);
  const teachers = teacherSets.flat().filter((t) => !seen.has(t.id) && seen.add(t.id));
  res.json({ success: true, data: teachers });
}));

// Secretary can get list of admins (for messaging)
router.get('/admins', requireRoles('secretary'), asyncWrapper(async (req, res) => {
  const result = await usersService.getAllUsers({ role: 'admin', limit: 100 });
  res.json({ success: true, ...result });
}));

// Get teacher's own profile with classes + subjects
router.get('/me', requireRoles('teacher'), asyncWrapper(async (req, res) => {
  const profile = await usersService.getTeacherProfile(req.user.id);
  res.json({ success: true, data: profile });
}));

// Teacher's own assigned classes
router.get('/me/classes', requireRoles('teacher'), asyncWrapper(async (req, res) => {
  const classes = await usersDAL.getTeacherClasses(req.user.id);
  res.json({ success: true, data: classes });
}));

// Teacher's own assigned subjects
router.get('/me/subjects', requireRoles('teacher'), asyncWrapper(async (req, res) => {
  const subjects = await usersDAL.getTeacherSubjects(req.user.id);
  res.json({ success: true, data: subjects });
}));

router.get('/:id/profile', requireRoles('secretary', 'admin'), asyncWrapper(async (req, res) => {
  const profile = await usersService.getTeacherProfile(req.params.id);
  res.json({ success: true, data: profile });
}));

module.exports = router;
