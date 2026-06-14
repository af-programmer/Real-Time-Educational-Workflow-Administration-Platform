const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { createUserSchema, updateUserSchema, assignClassesSchema, assignSubjectsSchema } = require('../validators/user.validator');

router.use(authMiddleware);

router.get('/', requireRoles('admin'), usersController.getAll);
router.post('/', requireRoles('admin'), validate(createUserSchema), usersController.create);
router.post('/me/avatar', handleUpload('avatar', 1), usersController.uploadAvatar);
router.put('/me', validate(updateUserSchema), usersController.updateSelf);

router.get('/:id', usersController.requireSelfOrAdmin, usersController.getById);
router.get('/:id/profile', usersController.requireSelfOrAdmin, usersController.getProfile);
router.put('/:id', validate(updateUserSchema), usersController.requireSelfOrAdmin, usersController.update);
router.delete('/:id', requireRoles('admin'), usersController.remove);
router.patch('/:id/suspend', requireRoles('admin'), usersController.suspend);
router.post('/:id/assign-classes', requireRoles('admin'), validate(assignClassesSchema), usersController.assignClasses);
router.post('/:id/assign-subjects', requireRoles('admin'), validate(assignSubjectsSchema), usersController.assignSubjects);
router.post('/:id/assign-homeroom-classes', requireRoles('admin'), usersController.assignHomeroomClasses);

module.exports = router;
