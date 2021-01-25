const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//* Article Model
const Article = require('../models/articleModel');

exports.getArticles = catchAsync(async (req, res, next) => {
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
});

exports.getArticle = catchAsync(async (req, res, next) => {
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
});

exports.getManagement = catchAsync(async (req, res, next) => {
  try {
    await Article.find({}, (err, doc) => {
      if (!doc) {
        return next(new AppError('No documents found in the database', 404));
      }

      res.status(200).render('manage', {
        articleList: doc,
        user: req.user,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
