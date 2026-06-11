const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messages.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { handleUpload } = require('../middleware/upload.middleware');

router.use(authMiddleware);

router.get('/', messagesController.getInbox);
router.post('/', requireRoles('teacher', 'secretary', 'admin'), handleUpload('attachment', 1), messagesController.send);
router.patch('/:id/read', messagesController.markRead);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;
