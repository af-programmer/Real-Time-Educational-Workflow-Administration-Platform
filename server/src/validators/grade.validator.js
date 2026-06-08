const Joi = require('joi');

const createGradeSchema = Joi.object({
  student_id:   Joi.number().integer().positive().required(),
  subject_id:   Joi.number().integer().positive().required(),
  exam_type_id: Joi.number().integer().positive().required(),
  grade:        Joi.number().min(0).max(200).required(),
  date:         Joi.string().min(1).required(),
  notes:        Joi.string().max(500).optional().allow('', null),
  class_id:     Joi.any().optional(), // UI-only, ignored server-side
});

const updateGradeSchema = Joi.object({
  exam_type_id: Joi.number().integer().positive().optional(),
  grade:        Joi.number().min(0).max(200).optional(),
  date:         Joi.string().isoDate().optional(),
  notes:        Joi.string().max(500).optional().allow('', null),
});

module.exports = { createGradeSchema, updateGradeSchema };
