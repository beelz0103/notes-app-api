var express = require("express");
var router = express.Router();
const cors = require("cors");
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
    cb(null, `file-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

router.use(cors());

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/submit-form", async (req, res, next) => {
  const note = new Note(req.body);
  await note.save();
  res.json(note);
});

router.post("/upload/:id", upload.array("file"), async (req, res) => {
  console.log(req.files, "request files");
  const imageArr = [];

  await Promise.all(
    req.files.map(async (file) => {
      const img = new Image({ url: file.path.slice(7) });
      imageArr.push(img);
      return img.save();
    })
  );

  const note = await Note.findByIdAndUpdate(req.params.id, {
    images: imageArr,
  });

  console.log("File uploaded successfully!");

  res.json("File uploaded successfully!");
});

router.get("/notes", async (req, res) => {
  const notes = await Note.find().populate("images").exec();
  res.json(notes);
});

module.exports = router;
