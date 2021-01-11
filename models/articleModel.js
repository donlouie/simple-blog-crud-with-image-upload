const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleAuthor: {
    type: String,
    required: [true, 'Article must have an Author'],
  },
  articleTitle: {
    type: String,
    unique: true,
    required: [true, 'Article must have a title'],
  },
  articleContent: {
    type: String,
    required: [true, 'Article must have a content'],
  },
  imageCover: {
    data: Buffer,
    contetType: String,
  },
  publishedAt: { type: Date, default: Date.now },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
