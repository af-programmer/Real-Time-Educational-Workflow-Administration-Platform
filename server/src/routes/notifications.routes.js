const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notifications.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

router.use(authMiddleware);

router.get('/', notificationsController.getAll);
router.patch('/read-all', notificationsController.markAllRead);
router.patch('/:id/read', notificationsController.markOneRead);
router.post('/announcement', requireRoles('admin'), notificationsController.createAnnouncement);

module.exports = router;
