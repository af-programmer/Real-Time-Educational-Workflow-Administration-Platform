const libraryService = require('../services/library.service');
const asyncWrapper = require('../utils/asyncWrapper');

const getLibrary = asyncWrapper(async (req, res) => {
  const result = await libraryService.getLibrary(req.user.id);
  res.json({ success: true, ...result });
});

const addFile = asyncWrapper(async (req, res) => {
  const file = await libraryService.addFile(req.user.id, req.body, req.file);
  res.status(201).json({ success: true, data: file });
});

const updateFile = asyncWrapper(async (req, res) => {
  const file = await libraryService.updateFile(req.user.id, req.params.id, req.body);
  res.json({ success: true, data: file });
});

const deleteFile = asyncWrapper(async (req, res) => {
  await libraryService.deleteFile(req.user.id, req.params.id);
  res.json({ success: true, message: 'File deleted.' });
});

const downloadFile = asyncWrapper(async (req, res) => {
  const { filePath, original_name } = await libraryService.getFileForDownload(req.user.id, req.params.id);
  const encoded = encodeURIComponent(original_name);
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encoded}`);
  res.sendFile(filePath);
});

module.exports = { getLibrary, addFile, updateFile, deleteFile, downloadFile };
