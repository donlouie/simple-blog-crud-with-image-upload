const express = require('express');
const router = express.Router();

const multer = require('multer');

const articleController = require('../controllers/articleController');

//* Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});

var upload = multer({ storage: storage }).single('image');

//* @route   POST api/articles/create
//* @desc    Create post
//* @access  Private
// router.post(
//   '/create',
//   upload.fields([{ name: 'image', maxCount: 1 }]),
//   articleController.createArticle
// );
router.post('/create', upload, articleController.createArticle);

//* @route   POST api/articles/delete
//* @desc    Delete post
//* @access  Private
router.post('/delete', articleController.deleteArticle);

module.exports = router;
