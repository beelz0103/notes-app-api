const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Note = new Schema({
  title: String,
  content: String,
  images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
});

module.exports = mongoose.model("Note", Note);
