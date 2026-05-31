const bcrypt = require('bcryptjs');
const usersDAL = require('../dal/users.dal');
const { signToken } = require('../config/jwt');
const AppError = require('../utils/AppError');

async function login(email, password) {
  const user = await usersDAL.findByEmail(email);
  if (!user) throw new AppError('Invalid email or password.', 401);
  if (user.is_blocked) throw new AppError('Your account has been blocked. Contact an administrator.', 403);
  if (!user.is_active) throw new AppError('Your account is inactive. Contact an administrator.', 403);

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) throw new AppError('Invalid email or password.', 401);

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
    },
  };
}

async function resetPassword(userId, newPassword) {
  const user = await usersDAL.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  const hash = await bcrypt.hash(newPassword, 12);
  await usersDAL.updatePassword(userId, hash);
}

module.exports = { login, resetPassword };
