const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const usersService = require('../services/users.service');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const asyncWrapper = require('../utils/asyncWrapper');
const { createUserSchema, updateUserSchema, assignClassesSchema, assignSubjectsSchema } = require('../validators/user.validator');

// All routes require authentication
router.use(authMiddleware);

// Admin-only: list and create users
router.get('/', requireRoles('admin'), usersController.getAll);
router.post('/', requireRoles('admin'), validate(createUserSchema), usersController.create);

// Self: update own profile (name, phone, phone2) — avoids URL-param id mismatch
router.put('/me', validate(updateUserSchema), asyncWrapper(async (req, res) => {
  const { name, phone, phone2 } = req.body;
  const user = await usersService.updateUser(req.user.id, { name, phone, phone2 });
  res.json({ success: true, data: user });
}));

// Self or admin: read profile data
router.get('/:id', (req, res, next) => {
  if (req.user.role === 'admin' || Number(req.user.id) === parseInt(req.params.id, 10)) return next();
  return res.status(403).json({ success: false, message: 'Forbidden.' });
}, usersController.getById);

router.get('/:id/profile', (req, res, next) => {
  if (req.user.role === 'admin' || Number(req.user.id) === parseInt(req.params.id, 10)) return next();
  return res.status(403).json({ success: false, message: 'Forbidden.' });
}, usersController.getProfile);

// Self or admin: update — non-admins may only update their own safe fields
router.put('/:id', validate(updateUserSchema), (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (Number(req.user.id) === parseInt(req.params.id, 10)) {
    const { name, phone, phone2 } = req.body;
    req.body = { name, phone, phone2 };
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden.' });
}, usersController.update);

// Admin-only: destructive and assignment operations
router.delete('/:id', requireRoles('admin'), usersController.remove);
router.patch('/:id/suspend', requireRoles('admin'), usersController.suspend);
router.post('/:id/assign-classes', requireRoles('admin'), validate(assignClassesSchema), usersController.assignClasses);
router.post('/:id/assign-subjects', requireRoles('admin'), validate(assignSubjectsSchema), usersController.assignSubjects);
router.post('/:id/assign-homeroom-classes', requireRoles('admin'), usersController.assignHomeroomClasses);

module.exports = router;
