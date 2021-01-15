const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Article = require('../models/articleModel');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');

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

//* render article management route
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    await Article.find({}, (err, doc) => {
      if (!doc) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('manage', { articleList: doc });
      // console.log(doc);
    });
  })
);

//* add article
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

    res.status(201).redirect('/api/articles');
    // json({
    //   status: 'success',
    //   data: {
    //     data: doc,
    //   },
    // });
  })
);

//* delete article
router.post(
  '/delete',
  catchAsync(async (req, res, next) => {
    const doc = await Article.findByIdAndRemove(req.body.delbutton);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).redirect('/api/articles');
    // json({
    //   status: 'success',
    //   data: null,
    // });
  })
);

module.exports = router;
