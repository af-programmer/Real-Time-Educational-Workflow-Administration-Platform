const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireRoles } = require('../middleware/roles.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const libraryService = require('../services/library.service');
const asyncWrapper = require('../utils/asyncWrapper');
const path = require('path');
const { UPLOAD_DIR } = require('../config/multer');

router.use(authMiddleware, requireRoles('teacher'));

router.get('/', asyncWrapper(async (req, res) => {
  const result = await libraryService.getLibrary(req.user.id);
  res.json({ success: true, ...result });
}));

router.post('/', handleUpload('file', 1), asyncWrapper(async (req, res) => {
  const file = await libraryService.addFile(req.user.id, req.body, req.file);
  res.status(201).json({ success: true, data: file });
}));

router.patch('/:id', asyncWrapper(async (req, res) => {
  const file = await libraryService.updateFile(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: file });
}));

router.delete('/:id', asyncWrapper(async (req, res) => {
  await libraryService.deleteFile(req.user.id, req.params.id);
  res.json({ success: true, message: 'File deleted.' });
}));

router.get('/:id/download', asyncWrapper(async (req, res) => {
  const libraryDAL = require('../dal/library.dal');
  const AppError = require('../utils/AppError');
  const file = await libraryDAL.findById(req.params.id);
  if (!file) throw new AppError('File not found.', 404);
  if (file.teacher_id !== req.user.id) throw new AppError('Access denied.', 403);
  const filePath = path.join(UPLOAD_DIR, file.stored_name);
  const encoded = encodeURIComponent(file.original_name);
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encoded}`);
  res.sendFile(filePath);
}));

module.exports = router;
