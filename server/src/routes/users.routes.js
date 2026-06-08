const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createUserSchema, updateUserSchema, assignClassesSchema, assignSubjectsSchema } = require('../validators/user.validator');

router.use(authMiddleware, requireRoles('admin'));

router.get('/', usersController.getAll);
router.post('/', validate(createUserSchema), usersController.create);
router.get('/:id', usersController.getById);
router.get('/:id/profile', usersController.getProfile);
router.put('/:id', validate(updateUserSchema), usersController.update);
router.delete('/:id', usersController.remove);
router.patch('/:id/suspend', usersController.suspend);
router.post('/:id/assign-classes', validate(assignClassesSchema), usersController.assignClasses);
router.post('/:id/assign-subjects', validate(assignSubjectsSchema), usersController.assignSubjects);

module.exports = router;
