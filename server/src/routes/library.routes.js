const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const libraryController = require('../controllers/library.controller');

router.use(authMiddleware, requireRoles('teacher', 'Educator'));

router.get('/', libraryController.getLibrary);
router.post('/', handleUpload('file', 1), libraryController.addFile);
router.patch('/:id', libraryController.updateFile);
router.delete('/:id', libraryController.deleteFile);
router.get('/:id/download', libraryController.downloadFile);

module.exports = router;
