const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');

//* Article model
const Article = require('../models/articleModel');

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

//* Create Handle
router.post(
  '/create',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  catchAsync(async (req, res, next) => {
    const article = {
      articleAuthor: req.body.author,
      articleTitle: req.body.title,
      articleContent: req.body.content,
      imageCover: {
        data: fs.readFileSync(
          path.join(
            __dirname + '/../public/uploads/' + req.files['image'][0].filename
          )
        ),
        //? why is contentType not showing on mongoDB json object
        contentType: 'image',
      },
    };
    const doc = await Article.create(article);

    req.flash('success_msg', 'Article Added Successfully!');
    res.status(201).redirect('/manage-articles');
    // json({
    //   status: 'success',
    //   data: {
    //     data: doc,
    //   },
    // });
  })
);

//* Delete Handle
router.post(
  '/delete',
  catchAsync(async (req, res, next) => {
    const doc = await Article.findByIdAndRemove(req.body.delbutton);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    req.flash('success_msg', 'Article Deleted Successfully!');
    res.status(204).redirect('/manage-articles');
    // json({
    //   status: 'success',
    //   data: null,
    // });
  })
);

module.exports = router;
