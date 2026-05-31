const { upload } = require('../config/multer');
const AppError = require('../utils/AppError');

function handleUpload(fieldName, maxCount = 5) {
  return (req, res, next) => {
    const uploadFn = maxCount === 1
      ? upload.single(fieldName)
      : upload.array(fieldName, maxCount);

    uploadFn(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File size exceeds the allowed limit (10MB).', 400));
        }
        return next(new AppError(err.message || 'File upload failed.', 400));
      }
      next();
    });
  };
}

module.exports = { handleUpload };
