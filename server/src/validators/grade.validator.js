const Joi = require('joi');

const createGradeSchema = Joi.object({
  student_id:   Joi.number().integer().positive().required(),
  subject_id:   Joi.number().integer().positive().required(),
  exam_type_id: Joi.number().integer().positive().required(),
  grade:        Joi.number().min(0).max(200).required(),
  max_grade:    Joi.number().min(1).max(200).optional().default(100),
  date:         Joi.string().min(1).required(),
  notes:        Joi.string().max(500).optional().allow('', null),
  class_id:     Joi.any().optional(),
});

const updateGradeSchema = Joi.object({
  exam_type_id: Joi.number().integer().positive().optional(),
  grade:        Joi.number().min(0).max(200).optional(),
  max_grade:    Joi.number().min(1).max(200).optional(),
  date:         Joi.string().optional(),
  notes:        Joi.string().max(500).optional().allow('', null),
});

module.exports = { createGradeSchema, updateGradeSchema };
