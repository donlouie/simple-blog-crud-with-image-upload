const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Article = require('../models/articleModel');

//* render index route, display index.js ejs template
//TODO: CREATE ARTICLE VIEW TEMPLATE
//? Why do we live just to suffer?
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    await Article.find({}, (err, doc) => {
      if (doc.length === 0) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('index'), { articleList: doc };
    });
  })
);

module.exports = router;
