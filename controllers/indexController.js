const Image = require("../models/image");
const Note = require("../models/note");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

//Configuration for Multer
const multerStorage = multer.diskStorage({
  destination: "public/uploads",

  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

exports.index = async (req, res, next) => {
  res.render("index", { title: "Express" });
};

exports.notes_get = async (req, res, next) => {
  try {
    const notes = await Note.find().populate("images").exec();
    res.json(notes);
  } catch (err) {
    return next(err);
  }
};

//add code for error handling later
exports.notes_create = [
  upload.array("file"),
  async (req, res) => {
    const images = [];
    const { title, content } = req.body;

    await Promise.all(
      req.files.map(async (file) => {
        const image = new Image({ url: file.path.slice(7) });
        images.push(image);
        return image.save();
      })
    );

    const newNote = new Note({ title, content, images });
    await newNote.save();

    res.json(`Note uploaded successfully: ${newNote}`);
  },
];
