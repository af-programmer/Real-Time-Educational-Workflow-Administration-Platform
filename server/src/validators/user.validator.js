const Joi = require('joi');

const createUserSchema = Joi.object({
  name:                Joi.string().min(2).max(100).required(),
  email:               Joi.string().email().required(),
  password:            Joi.string().min(8).required().messages({ 'string.min': 'Password must be at least 8 characters.' }),
  role:                Joi.string().valid('admin', 'secretary', 'teacher').required(),
  phone:               Joi.string().max(20).optional().allow('', null),
  phone2:              Joi.string().max(20).optional().allow('', null),
  is_homeroom:         Joi.boolean().optional(),
  homeroom_class_ids:  Joi.array().items(Joi.number().integer().positive()).optional(),
});

const updateUserSchema = Joi.object({
  name:     Joi.string().min(2).max(100).optional(),
  email:    Joi.string().email().optional(),
  phone:    Joi.string().max(20).optional().allow('', null),
  phone2:   Joi.string().max(20).optional().allow('', null),
  is_active: Joi.boolean().optional(),
});

const assignClassesSchema = Joi.object({
  classIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
});

const assignSubjectsSchema = Joi.object({
  subjectIds: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
});

module.exports = { createUserSchema, updateUserSchema, assignClassesSchema, assignSubjectsSchema };
