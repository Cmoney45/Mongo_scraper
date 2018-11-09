const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
  body: String,
  dateCreated: {
    type: Date,
    default: Date.now
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
    }
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
