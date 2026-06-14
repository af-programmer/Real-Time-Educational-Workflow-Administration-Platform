const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const subjectsController = require('../controllers/subjects.controller');

router.use(authMiddleware);

router.get('/', subjectsController.getAllActive);
router.get('/all', requireRoles('admin'), subjectsController.getAll);
router.post('/', requireRoles('admin'), subjectsController.create);
router.patch('/:id/suspend', requireRoles('admin'), subjectsController.toggleActive);

module.exports = router;
