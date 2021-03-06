const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false
  },
  articleScraped: {
    type: Date,
    default: Date.now
  },
  note: [
    {
    type: Schema.Types.ObjectId,
    ref: "Note"
    }
  ]
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
