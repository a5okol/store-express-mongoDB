const multer = require("multer");

const storege = multer.diskStorage({
  description(req, file, callback) {
    callback(null, "images");
  },
  filename(req, file, callback) {
    callback(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const allowedTypes = ["image/png", "image/jpg", "image/gif", "image/jpeg"]

const fileFilter = (req, file, callback) => {
    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(null, false)
    }
};

module.exports = multer({
  storege: storege,
  fileFilter: fileFilter,
});
