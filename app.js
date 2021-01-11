const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const articleRouter = require('./routes/articleRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/api/articles', articleRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
