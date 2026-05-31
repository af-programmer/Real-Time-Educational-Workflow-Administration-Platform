const AppError = require('../utils/AppError');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });

    if (error) {
      const messages = error.details.map((d) => d.message).join(', ');
      return next(new AppError(messages, 422));
    }

    req[property] = value;
    next();
  };
}

module.exports = { validate };
