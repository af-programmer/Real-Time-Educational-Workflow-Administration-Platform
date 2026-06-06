const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

router.use(authMiddleware);

router.get('/', classesController.getAll);
router.get('/:id', classesController.getById);

// Student management - secretary + admin only
router.get('/:id/students', requireRoles('secretary', 'admin'), classesController.getStudents);
router.post('/students', requireRoles('secretary', 'admin'), classesController.createStudent);
router.get('/students/:studentId', requireRoles('secretary', 'admin'), classesController.getStudent);
router.put('/students/:studentId', requireRoles('secretary', 'admin'), classesController.updateStudent);

module.exports = router;
