const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters.',
    'any.required': 'Password is required.',
  }),
});

const resetPasswordSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  newPassword: Joi.string().min(8).required().messages({
    'string.min': 'New password must be at least 8 characters.',
  }),
});

module.exports = { loginSchema, resetPasswordSchema };
