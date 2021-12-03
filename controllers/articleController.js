const catchAsync = require('../utils/catchAsync');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');

//* Article model
const Article = require('../models/articleModel');

//* Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads');
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now());
//   },
// });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});

// const upload = multer({ storage: storage });
var upload = multer({ storage: storage }).single('image');

exports.createArticle = catchAsync(async (req, res, next) => {
  try {
    const article = {
      articleAuthor: req.body.author,
      articleTitle: req.body.title,
      articleContent: req.body.content,
      imageCover: req.file.filename,
      // imageCover: {
      //   data: fs.readFileSync(
      //     path.join(
      //       __dirname + '/../public/uploads/' + req.files['image'][0].filename
      //     )
      //   ),
      //   //? why is contentType not showing on mongoDB json object
      //   contentType: 'image',
      // },
    };

    const doc = await Article.create(article);
    req.flash('success_msg', 'Article Added Successfully!');
    res.status(201).redirect('/manage-articles');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  try {
    const doc = await Article.findByIdAndRemove(req.body.delbutton);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    req.flash('success_msg', 'Article Deleted Successfully!');
    res.status(204).redirect('/manage-articles');
  } catch (err) {}
  console.error(err.message);
  res.status(500).send('Server Error');
});
