const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Label = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", Label);
