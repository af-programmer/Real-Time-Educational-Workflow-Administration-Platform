const libraryDAL = require('../dal/library.dal');
const AppError = require('../utils/AppError');
const fs = require('fs');
const path = require('path');
const { UPLOAD_DIR } = require('../config/multer');

async function getLibrary(teacherId) {
  const files = await libraryDAL.findByTeacher(teacherId);
  // Group by subject
  const grouped = {};
  files.forEach((f) => {
    if (!grouped[f.subject_name]) grouped[f.subject_name] = [];
    grouped[f.subject_name].push(f);
  });
  return { files, grouped };
}

async function addFile(teacherId, { subject_id, description }, file) {
  if (!file) throw new AppError('No file uploaded.', 400);
  const id = await libraryDAL.create({
    teacher_id: teacherId,
    subject_id: subject_id || null,
    original_name: file.originalname,
    stored_name: file.filename,
    file_size: file.size,
    mime_type: file.mimetype,
    description,
  });
  return libraryDAL.findById(id);
}

async function updateFile(teacherId, fileId, fields) {
  const file = await libraryDAL.findById(fileId);
  if (!file) throw new AppError('File not found.', 404);
  if (file.teacher_id !== teacherId) throw new AppError('Access denied.', 403);
  await libraryDAL.update(fileId, fields);
  return libraryDAL.findById(fileId);
}

async function deleteFile(teacherId, fileId) {
  const file = await libraryDAL.findById(fileId);
  if (!file) throw new AppError('File not found.', 404);
  if (file.teacher_id !== teacherId) throw new AppError('Access denied.', 403);
  const filePath = path.join(UPLOAD_DIR, file.stored_name);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await libraryDAL.remove(fileId);
}

async function getFileForDownload(teacherId, fileId) {
  const file = await libraryDAL.findById(fileId);
  if (!file) throw new AppError('File not found.', 404);
  if (file.teacher_id !== teacherId) throw new AppError('Access denied.', 403);
  return { filePath: path.join(UPLOAD_DIR, file.stored_name), original_name: file.original_name };
}

module.exports = { getLibrary, addFile, updateFile, deleteFile, getFileForDownload };
