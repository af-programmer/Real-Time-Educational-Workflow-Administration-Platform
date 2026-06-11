const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const teachersController = require('../controllers/teachers.controller');

router.use(authMiddleware);

router.get('/',                    requireRoles('secretary', 'admin'), teachersController.getAll);
router.get('/secretaries',         requireRoles('teacher'),            teachersController.getSecretaries);
router.get('/my-homeroom-teachers',requireRoles('teacher'),            teachersController.getMyHomeroomTeachers);
router.get('/admins',              requireRoles('secretary'),          teachersController.getAdmins);
router.get('/me',                  requireRoles('teacher'),            teachersController.getMe);
router.get('/me/classes',          requireRoles('teacher'),            teachersController.getMyClasses);
router.get('/me/subjects',         requireRoles('teacher'),            teachersController.getMySubjects);
router.get('/:id/profile',         requireRoles('secretary', 'admin'), teachersController.getProfile);

module.exports = router;
