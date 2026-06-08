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
      // Fix Hebrew/Unicode filenames: multer reads multipart headers as Latin-1
      const fixName = (f) => {
        try { f.originalname = Buffer.from(f.originalname, 'latin1').toString('utf8'); } catch {}
      };
      if (req.file) fixName(req.file);
      if (req.files) (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()).forEach(fixName);
      next();
    });
  };
}

module.exports = { handleUpload };
