const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./utils/appError');
const indexRouter = require('./routes/indexRoutes');
const articleRouter = require('./routes/articleRoutes');
const userRouter = require('./routes/userRoutes');

//* Authentication modules
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
//* Passport config
require('./config/passport')(passport);

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.static('uploads'));

//* Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

//* Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//* Connect flash
app.use(flash());

//* Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//* Routes
app.use('/', indexRouter);
app.use('/api/articles', articleRouter);
app.use('/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

module.exports = app;
