const bcrypt = require('bcryptjs');
const usersDAL = require('../dal/users.dal');
const { signToken } = require('../config/jwt');
const AppError = require('../utils/AppError');

async function login(email, password) {
  const user = await usersDAL.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password.', 401);
  if (user.is_suspended) throw new AppError('Your account has been suspended. Contact an administrator.', 403);
  if (!user.is_active)   throw new AppError('Your account is inactive. Contact an administrator.', 403);

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) throw new AppError('Invalid email or password.', 401);

  const token = signToken({
    id: user.id, email: user.email, role: user.role, name: user.name,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || null,
    },
  };
}

async function resetPassword(userId, newPassword) {
  const user = await usersDAL.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  const hash = await bcrypt.hash(newPassword, 12);
  await usersDAL.updatePassword(userId, hash);
}

async function changePassword(userId, currentPassword, newPassword) {
  const hash = await usersDAL.findPasswordHash(userId);
  if (!hash) throw new AppError('User not found.', 404);

  const match = await bcrypt.compare(currentPassword, hash);
  if (!match) throw new AppError('Current password is incorrect.', 401);

  const newHash = await bcrypt.hash(newPassword, 12);
  await usersDAL.updatePassword(userId, newHash);
}

async function verifyPassword(userId, password) {
  const hash = await usersDAL.findPasswordHash(userId);
  if (!hash) throw new AppError('User not found.', 404);

  const match = await bcrypt.compare(password, hash);
  if (!match) throw new AppError('Current password is incorrect.', 401);
}

module.exports = { login, resetPassword, changePassword, verifyPassword };
