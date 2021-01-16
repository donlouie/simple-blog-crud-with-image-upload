const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//* Page Authenticaiton
const { ensureAuthenticated } = require('../config/auth');

//* Article Model
const Article = require('../models/articleModel');

//* Home Page / Login
//? Why do we live just to suffer?
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    await Article.find({}, (err, doc) => {
      if (!doc) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('index', { articleList: doc });
      // console.log(doc);
    });
  })
);

//* Article Page
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

//* Article Management Page
router.get(
  '/manage-articles',
  ensureAuthenticated,
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

module.exports = router;
