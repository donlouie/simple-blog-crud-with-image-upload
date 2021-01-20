const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//* Page Authenticaiton
const { ensureAuthenticated } = require('../config/auth');

//* Article Model
const Article = require('../models/articleModel');

//* @route   GET /
//* @desc    Render article list, Get all articles
//* @access  Public
//? Why do we live just to suffer?
router.get(
  '/',
  catchAsync(async (req, res, next) => {
    try {
      await Article.find({}, (err, doc) => {
        if (!doc) {
          return next(new AppError('No documents found in the database', 404));
        }

        res.status(200).render('index', { articleList: doc });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })
);

//* @route   GET /t/:articleId
//* @desc    Render article page, Get specific article by Id
//* @access  Public
router.get(
  '/t/:articleId',
  catchAsync(async (req, res, next) => {
    const requestedArticleId = req.params.articleId;

    try {
      await Article.findOne({ _id: requestedArticleId }, (err, doc) => {
        if (!doc) {
          return next(new AppError('No document with that ID', 404));
        }

        res.status(200).render('article', {
          article: doc,
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })
);

//* @route   GET /manage-articles
//* @desc    Render article panel, Get all articles
//* @access  Private
router.get(
  '/manage-articles',
  ensureAuthenticated,
  catchAsync(async (req, res, next) => {
    try {
      await Article.find({}, (err, doc) => {
        if (!doc) {
          return next(new AppError('No documents found in the database', 404));
        }

        res.status(200).render('manage', { articleList: doc });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  })
);

module.exports = router;
