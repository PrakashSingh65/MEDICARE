import upload from "./upload.middleware.js";

export const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload failed",
        success: false,
      });
    }
    if (!req.file && Array.isArray(req.files) && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
};
