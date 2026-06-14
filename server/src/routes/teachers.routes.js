const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const teachersController = require('../controllers/teachers.controller');

router.use(authMiddleware);

router.get('/',                     requireRoles('secretary', 'admin'),                    teachersController.getAll);
router.get('/secretaries',          requireRoles('teacher', 'Educator'),           teachersController.getSecretaries);
router.get('/my-homeroom-teachers', requireRoles('teacher', 'Educator'),           teachersController.getMyHomeroomTeachers);
router.get('/admins',               requireRoles('secretary'),                             teachersController.getAdmins);
router.get('/me',                   requireRoles('teacher', 'Educator'),           teachersController.getMe);
router.get('/me/classes',           requireRoles('teacher', 'Educator'),           teachersController.getMyClasses);
router.get('/me/subjects',          requireRoles('teacher', 'Educator'),           teachersController.getMySubjects);
router.get('/:id/profile',          requireRoles('secretary', 'admin'),                   teachersController.getProfile);

module.exports = router;
