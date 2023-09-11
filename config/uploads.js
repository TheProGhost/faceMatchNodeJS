const path = require('path');
const multer = require('multer')

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'single/');
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + fileExt);
    },
  });
  const upload = multer({ storage });

  module.exports = upload