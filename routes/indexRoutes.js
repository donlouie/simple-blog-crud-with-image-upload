const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Article = require('../models/articleModel');

//* render index route, display index.js ejs template
//TODO: CREATE ARTICLE VIEW TEMPLATE
//? Why do we live just to suffer?
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    await Article.find({}, (err, doc) => {
      if (doc.length === 0) {
        //TODO: ENABLE DISPLAY WITH EMPTY CONTENT
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('index', { articleList: doc });
      // console.log(doc);
    });
  })
);

//* generate path for each article
router.get(
  '/t/:articleId',
  catchAsync(async (req, res, next) => {
    const requestedArticleId = req.params.articleId;

    await Article.findOne({ _id: requestedArticleId }, (err, doc) => {
      if (!doc) {
        return next(new AppError('No document with that ID', 404));
      }

      res.status(200).render('article', {
        article: doc,
      });
      // json({ status: 'success', data: { doc } })
    });
  })
);

module.exports = router;
