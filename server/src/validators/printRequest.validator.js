const Joi = require('joi');

const createPrintRequestSchema = Joi.object({
  subject_id: Joi.number().integer().positive().required(),
  priority: Joi.string().valid('normal', 'important', 'urgent').default('normal'),
  lesson_date: Joi.string().isoDate().required(),
  lesson_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional().allow('', null),
  class_ids: Joi.array().items(Joi.number().integer().positive()).min(1).required(),
  notes: Joi.string().max(1000).optional().allow('', null),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in_progress', 'printed', 'completed').required(),
});

const mergeRequestsSchema = Joi.object({
  requestIds: Joi.array().items(Joi.number().integer().positive()).min(2).required(),
  notes: Joi.string().max(1000).optional().allow('', null),
});

module.exports = { createPrintRequestSchema, updateStatusSchema, mergeRequestsSchema };
