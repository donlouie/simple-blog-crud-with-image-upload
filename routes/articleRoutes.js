const express = require('express');
const router = express.Router();

const multer = require('multer');

const articleController = require('../controllers/articleController');

//* Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

//* @route   POST api/articles/create
//* @desc    Create post
//* @access  Private
router.post(
  '/create',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  articleController.createArticle
);

//* @route   POST api/articles/delete
//* @desc    Delete post
//* @access  Private
router.post('/delete', articleController.deleteArticle);

module.exports = router;
