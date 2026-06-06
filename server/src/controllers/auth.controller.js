const authService = require('../services/auth.service');
const asyncWrapper = require('../utils/asyncWrapper');

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json({ success: true, ...result });
});

const logout = asyncWrapper(async (req, res) => {
  // JWT is stateless; client should discard the token
  res.json({ success: true, message: 'Logged out successfully.' });
});

const resetPassword = asyncWrapper(async (req, res) => {
  const { userId, newPassword } = req.body;
  await authService.resetPassword(userId, newPassword);
  res.json({ success: true, message: 'Password reset successfully.' });
});

const me = asyncWrapper(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { login, logout, resetPassword, me };
