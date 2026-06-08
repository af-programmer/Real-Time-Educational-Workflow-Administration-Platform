const printRequestsDAL = require('../dal/printRequests.dal');
const classesDAL = require('../dal/classes.dal');
const notificationsDAL = require('../dal/notifications.dal');
const libraryDAL = require('../dal/library.dal');
const { calculateTotalCopies } = require('../utils/calculateCopies');
const { paginate, paginateResponse } = require('../utils/paginate');
const AppError = require('../utils/AppError');
const path = require('path');

async function createPrintRequest(teacherId, { subject_id, priority, lesson_date, lesson_time, class_ids, notes, library_file_id }, files) {
  if (!files?.length && !library_file_id) throw new AppError('No files attached.', 400);

  const classes = await classesDAL.findByIds(class_ids);
  if (classes.length !== class_ids.length) throw new AppError('One or more classes not found.', 400);

  const total_copies = calculateTotalCopies(classes);
  const requestId = await printRequestsDAL.create({
    teacher_id: teacherId, subject_id, priority, lesson_date,
    lesson_time, total_copies, notes,
  });

  const classData = classes.map((c) => ({ class_id: c.id, copies_count: c.student_count }));
  await printRequestsDAL.addClasses(requestId, classData);

  // Attach uploaded files
  if (files && files.length) {
    for (const file of files) {
      await printRequestsDAL.addFile({
        print_request_id: requestId,
        original_name: file.originalname,
        stored_name: file.filename,
        file_path: file.path,
        file_size: file.size,
        mime_type: file.mimetype,
      });
    }
  }

  // Attach library file if provided
  if (library_file_id) {
    const libFile = await libraryDAL.findById(parseInt(library_file_id));
    if (!libFile) throw new AppError('Library file not found.', 404);
    if (libFile.teacher_id !== teacherId) throw new AppError('Access denied to library file.', 403);
    await printRequestsDAL.addFile({
      print_request_id: requestId,
      original_name: libFile.original_name,
      stored_name: libFile.stored_name,
      file_path: libFile.stored_name,
      file_size: libFile.file_size,
      mime_type: libFile.mime_type,
    });
  }

  // Notify secretary for urgent requests
  if (priority === 'urgent') {
    await notificationsDAL.create({
      role_target: 'secretary',
      type: 'urgent_request',
      title: 'Urgent Print Request',
      content: `New urgent print request submitted.`,
      entity_id: requestId,
      entity_type: 'print_request',
    });
  } else {
    await notificationsDAL.create({
      role_target: 'secretary',
      type: 'print_request',
      title: 'New Print Request',
      content: `New ${priority} print request submitted.`,
      entity_id: requestId,
      entity_type: 'print_request',
    });
  }

  return printRequestsDAL.findById(requestId);
}

async function getMyRequests(teacherId, { page = 1, limit = 20 } = {}) {
  const { offset, limit: lim, page: p } = paginate(null, page, limit);
  const { rows, total } = await printRequestsDAL.findByTeacher(teacherId, { page: p, limit: lim, offset });
  return paginateResponse(rows, total, p, lim);
}

async function getAllRequests({ teacherId, priority, status, dateFrom, dateTo, page = 1, limit = 20 }) {
  const { offset, limit: lim, page: p } = paginate(null, page, limit);
  const { rows, total } = await printRequestsDAL.findAll({
    teacherId, priority, status, dateFrom, dateTo,
    page: p, limit: lim, offset,
  });
  return paginateResponse(rows, total, p, lim);
}

async function updateStatus(requestId, status) {
  const request = await printRequestsDAL.findById(requestId);
  if (!request) throw new AppError('Print request not found.', 404);
  await printRequestsDAL.updateStatus(requestId, status);
  return printRequestsDAL.findById(requestId);
}

async function getRequestById(requestId) {
  const request = await printRequestsDAL.findById(requestId);
  if (!request) throw new AppError('Print request not found.', 404);
  return request;
}

async function mergeRequests(requestIds, notes) {
  const requests = await Promise.all(requestIds.map((id) => printRequestsDAL.findById(id)));
  const notFound = requests.findIndex((r) => !r);
  if (notFound !== -1) throw new AppError(`Print request ${requestIds[notFound]} not found.`, 404);

  // Use the first request's teacher and metadata as the base
  const base = requests[0];
  const total_copies = requests.reduce((sum, r) => sum + r.total_copies, 0);

  const mergedId = await printRequestsDAL.createMerged({
    teacher_id: base.teacher_id,
    subject_id: base.subject_id,
    priority: 'urgent',
    lesson_date: base.lesson_date,
    lesson_time: base.lesson_time,
    total_copies,
    notes: notes || `Merged from requests: ${requestIds.join(', ')}`,
    merged_from: requestIds,
  });

  // Aggregate all classes from merged requests
  const allClasses = requests.flatMap((r) => r.classes || []);
  const classMap = new Map();
  allClasses.forEach((cls) => {
    const existing = classMap.get(cls.class_id) || 0;
    classMap.set(cls.class_id, existing + cls.copies_count);
  });
  const mergedClasses = Array.from(classMap.entries()).map(([class_id, copies_count]) => ({
    class_id, copies_count,
  }));
  await printRequestsDAL.addClasses(mergedId, mergedClasses);

  return printRequestsDAL.findById(mergedId);
}

async function deleteRequest(requestId, userId, userRole) {
  const request = await printRequestsDAL.findById(requestId);
  if (!request) throw new AppError('Print request not found.', 404);
  if (userRole === 'teacher' && request.teacher_id !== userId)
    throw new AppError('Access denied.', 403);
  await printRequestsDAL.remove(requestId);
}

async function getHistory({ priority, dateFrom, dateTo, search, page = 1, limit = 20 }) {
  const { offset, limit: lim, page: p } = paginate(null, page, limit);
  const { rows, total } = await printRequestsDAL.findHistory({ priority, dateFrom, dateTo, search, page: p, limit: lim, offset });
  return paginateResponse(rows, total, p, lim);
}

module.exports = {
  createPrintRequest, getMyRequests, getAllRequests, updateStatus, getRequestById, mergeRequests, deleteRequest, getHistory,
};
