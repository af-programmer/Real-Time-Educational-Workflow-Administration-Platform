const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';

  if (err.code === 'ER_DUP_ENTRY')         { statusCode = 409; message = 'A record with this value already exists.'; }
  if (err.code === 'ER_NO_REFERENCED_ROW_2'){ statusCode = 400; message = 'Referenced resource does not exist.'; }
  if (err.name === 'MulterError')           { statusCode = 400; message = err.message; }
  if (err.name === 'JsonWebTokenError')     { statusCode = 401; message = 'Invalid token.'; }
  if (err.name === 'TokenExpiredError')     { statusCode = 401; message = 'Token expired.'; }

  if (statusCode >= 500) {
    logger.error('Unhandled server error', {
      message: err.message,
      stack:   err.stack,
      method:  req.method,
      path:    req.path,
      userId:  req.user?.id,
    });
  } else {
    logger.warn('Client error', { statusCode, message, method: req.method, path: req.path });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
