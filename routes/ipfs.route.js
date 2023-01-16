const express = require('express');
const router = express.Router();
const multer = require('multer');
const SchemaValidator = require('../middlewares/SchemaValidator');
const validateRequest = SchemaValidator(true);

const ipfsController = require('../controllers/ipfs.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const mimetyp = file.mimetype;
    if (
      mimetyp == 'image/png' ||
      mimetyp == 'image/jpg' ||
      mimetyp == 'image/jpeg' ||
      mimetyp == 'image/gif' ||
      mimetyp == 'video/webm' ||
      mimetyp == 'audio/webm'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Unsupported file format.'));
    }
  },
});

router.post(
  '/upload_file',
  upload.single('file'),
  validateRequest,
  ipfsController.uploadContent
);

router.post('/store_file', ipfsController.storeFile);

module.exports = router;
