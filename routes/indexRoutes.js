const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController');
//* Page Authenticaiton
const { ensureAuthenticated } = require('../config/auth');

//* Article Model
const Article = require('../models/articleModel');

//* @route   GET /
//* @desc    Render article list, Get all articles
//* @access  Public
//? Why do we live just to suffer?
router.get('/', indexController.getArticles);

//* @route   GET /t/:articleId
//* @desc    Render article page, Get specific article by Id
//* @access  Public
router.get('/t/:articleId', indexController.getArticle);

//* @route   GET /manage-articles
//* @desc    Render article panel, Get all articles
//* @access  Private
router.get(
  '/manage-articles',
  ensureAuthenticated,
  indexController.getManagement
);

module.exports = router;
