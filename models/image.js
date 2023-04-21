const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema(
  {
    url: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", Image);
