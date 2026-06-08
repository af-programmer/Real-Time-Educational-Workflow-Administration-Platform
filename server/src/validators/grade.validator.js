const Joi = require('joi');

const createGradeSchema = Joi.object({
  student_id: Joi.number().integer().positive().required(),
  subject_id: Joi.number().integer().positive().required(),
  grade: Joi.number().min(0).max(200).required(),
  max_grade: Joi.number().min(1).max(200).default(100),
  date: Joi.string().min(1).required(),
  exam_type: Joi.string().max(50).default('test'),
  notes: Joi.string().max(500).optional().allow('', null),
  class_id: Joi.any().optional(), // UI-only field, ignored server-side
});

const updateGradeSchema = Joi.object({
  grade: Joi.number().min(0).max(100).optional(),
  max_grade: Joi.number().min(1).max(200).optional(),
  date: Joi.string().isoDate().optional(),
  exam_type: Joi.string().max(50).optional(),
  notes: Joi.string().max(500).optional().allow('', null),
});

module.exports = { createGradeSchema, updateGradeSchema };
