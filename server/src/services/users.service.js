const bcrypt = require('bcryptjs');
const usersDAL = require('../dal/users.dal');
const AppError = require('../utils/AppError');
const { paginate, paginateResponse } = require('../utils/paginate');

async function getAllUsers({ role, search, page = 1, limit = 20 }) {
  const { offset, limit: lim, page: p } = paginate(null, page, limit);
  const { rows, total } = await usersDAL.findAll({ roleFilter: role, search, page: p, limit: lim, offset });
  return paginateResponse(rows, total, p, lim);
}

async function getUserById(id) {
  const user = await usersDAL.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  return user;
}

async function createUser({ name, email, password, role, phone, phone2 }) {
  const existing = await usersDAL.findByEmail(email);
  if (existing) throw new AppError('A user with this email already exists.', 409);

  const roleId = await usersDAL.getRoleId(role);
  if (!roleId) throw new AppError('Invalid role.', 400);

  const password_hash = await bcrypt.hash(password, 12);
  const id = await usersDAL.create({ name, email, role_id: roleId, phone, phone2 });
  await usersDAL.createCredential(id, password_hash);
  return usersDAL.findById(id);
}

async function updateUser(id, fields) {
  const user = await usersDAL.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  await usersDAL.update(id, fields);
  return usersDAL.findById(id);
}

async function deleteUser(id) {
  const user = await usersDAL.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  const deleted = await usersDAL.remove(id);
  if (!deleted) throw new AppError('Failed to delete user.', 500);
}

async function toggleSuspend(id, suspend) {
  const user = await usersDAL.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  await usersDAL.setSuspended(id, suspend);
  return { id, is_suspended: suspend };
}

async function assignClasses(teacherId, classIds) {
  const user = await usersDAL.findById(teacherId);
  if (!user) throw new AppError('User not found.', 404);
  if (user.role !== 'teacher') throw new AppError('Only teachers can be assigned to classes.', 400);
  await usersDAL.assignClasses(teacherId, classIds);
}

async function assignSubjects(teacherId, subjectIds) {
  const user = await usersDAL.findById(teacherId);
  if (!user) throw new AppError('User not found.', 404);
  if (user.role !== 'teacher') throw new AppError('Only teachers can be assigned to subjects.', 400);
  await usersDAL.assignSubjects(teacherId, subjectIds);
}

async function getTeacherProfile(teacherId) {
  const user = await usersDAL.findById(teacherId);
  if (!user) throw new AppError('Teacher not found.', 404);
  const classes  = await usersDAL.getTeacherClasses(teacherId);
  const subjects = await usersDAL.getTeacherSubjects(teacherId);
  return { ...user, classes, subjects };
}

module.exports = {
  getAllUsers, getUserById, createUser, updateUser, deleteUser,
  toggleSuspend, assignClasses, assignSubjects, getTeacherProfile,
};
