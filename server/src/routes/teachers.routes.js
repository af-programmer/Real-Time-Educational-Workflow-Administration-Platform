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
