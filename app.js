const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const articleRouter = require('./routes/articleRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// routes
app.use('/api/articles', articleRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
