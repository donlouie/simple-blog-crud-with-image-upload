const express = require('express');
const router = express.Router();

const Article = require('../models/articleModel');

const fs = require('fs');
const path = require('path');
const multer = require('multer');

//* multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

//* add event handle
// TODO: FIX MULTER IMAGE UPLOAD
router.post(
  '/create',
  upload.fields([{ name: 'imageCover', maxCount: 1 }]),
  (req, res) => {
    const obj = {
      articleAuthor: req.body.articleAuthor,
      articleTitle: req.body.articleTitle,
      articleContent: req.body.articleContent,
      imageCover: {
        data: fs.readFileSync(
          path.join(
            __dirname +
              '/../public/uploads/' +
              req.files['imageCover'][0].filename
          )
        ),
        contentType: 'image',
      },
    };
    Article.create(obj, (err, article) => {
      if (err) {
        res.send(err);
      } else {
        res.send(article);
      }
    });
  }
);

module.exports = router;
