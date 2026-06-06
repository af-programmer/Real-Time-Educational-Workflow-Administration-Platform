const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');

router.use(authMiddleware);

router.get('/', messagesController.getInbox);
router.post('/', requireRoles('secretary', 'admin'), messagesController.send);
router.post('/broadcast', requireRoles('admin'), messagesController.broadcast);
router.patch('/:id/read', messagesController.markRead);

module.exports = router;
