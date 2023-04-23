const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Note = new Schema(
  {
    title: String,
    content: String,
    labels: [{ type: Schema.Types.ObjectId, ref: "Label" }],
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    deleted: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", Note);
