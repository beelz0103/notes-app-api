const Image = require("../models/image");
const Note = require("../models/note");
const Label = require("../models/label");
const multer = require("multer");
const fsPromises = require("fs").promises;

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
  res.render("index", { title: "Notes App Api" });
};

exports.notes_get = async (req, res, next) => {
  try {
    const notes = await Note.find()
      .populate("images")
      .populate("labels")
      .exec();
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
    const labels = JSON.parse(req.body.labels);

    await Promise.all(
      req.files.map(async (file) => {
        const image = new Image({ url: file.path.slice(7) });
        images.push(image);
        return image.save();
      })
    );

    const newNote = new Note({ title, content, images, labels });
    await newNote.save();

    res.json(`Note uploaded successfully: ${newNote}`);
  },
];

const removeDuplicateFiles = async () => {
  const uploads = await fsPromises.readdir("./public/uploads");
  const allImages = await Image.find({}, "url");
  const allUrls = allImages.map((url) => url.url.slice(8));
  const removeFiles = uploads
    .filter((elem) => !allUrls.includes(elem))
    .concat(allUrls.filter((elem) => !uploads.includes(elem)));
  Promise.all(
    removeFiles.map(async (path) => {
      fsPromises.unlink("./public/uploads/" + path);
    })
  );
};

exports.note_update = [
  upload.array("file"),
  async (req, res) => {
    const id = req.params.id;
    const images = [];
    const { title, content } = req.body;
    const labels = JSON.parse(req.body.labels);

    const note = await Note.findById(id);
    const noteImages = note.images;
    const removeDuplicateImagesQuery = noteImages.map(async (image) => {
      await Image.findByIdAndRemove(image._id);
    });

    const addImageQuery = req.files.map((file) => {
      const image = new Image({ url: file.path.slice(7) });
      images.push(image);
      return image.save();
    });

    await Promise.all([...removeDuplicateImagesQuery, ...addImageQuery]);

    await removeDuplicateFiles();

    const upateQuery = Note.findByIdAndUpdate(id, {
      title,
      content,
      images,
      labels,
    });
    await upateQuery;

    res.json(
      `Note uploaded successfully: ${{ title, content, images, _id: id }}`
    );
  },
];

exports.note_update_labels = [
  upload.none(),
  async (req, res, next) => {
    const id = req.params.id;
    const { labelId, checked } = req.body;
    console.log(labelId);
    const label = await Label.findById(labelId);
    if (checked === "false") {
      await Note.updateOne({ _id: id }, { $pull: { labels: label._id } });
    } else if (checked === "true") {
      await Note.updateOne({ _id: id }, { $push: { labels: label._id } });
    }
    const updatednote = await Note.findById(id).populate("labels");
    res.json(updatednote);
  },
];

exports.note_delete = [
  upload.none(),
  async (req, res, next) => {
    const note_id = req.params.id;

    const noteDeleted = req.body.deleted === "true" ? true : false;

    console.log(typeof noteDeleted);

    const deleteQuery = await Note.findByIdAndUpdate(note_id, {
      deleted: !noteDeleted,
    });

    res.json(`Deleted note with id: ${note_id}`);
  },
];

exports.note_delete_permanently = [
  upload.none(),
  async (req, res, next) => {
    const note_id = req.params.id;
    const note = await Note.findById(note_id);
    console.log(note);
    const noteImages = note.images;
    const removeImagesQuery = noteImages.map(async (image) => {
      await Image.findByIdAndRemove(image._id);
    });
    const deleteQuery = note.deleteOne();
    await Promise.all([...removeImagesQuery, deleteQuery]);
    await removeDuplicateFiles();
    res.json(`Deleted note with id: ${note_id}`);
  },
];

exports.note_archive = [
  upload.none(),
  async (req, res, next) => {
    const note_id = req.params.id;
    const noteArchived = req.body.archived === "true" ? true : false;
    const archiveQuery = await Note.findByIdAndUpdate(note_id, {
      archived: !noteArchived,
    });
    res.json(`Archived note with id: ${note_id}`);
  },
];

exports.note_update_pin = [
  upload.none(),
  async (req, res, next) => {
    const note_id = req.params.id;
    const notePinned = req.body.pinned === "true" ? true : false;
    const pinQuery = await Note.findByIdAndUpdate(note_id, {
      pinned: !notePinned,
    });
    res.json(`Pinned note with id: ${note_id}`);
  },
];

exports.labels_get = async (req, res, next) => {
  try {
    const labels = await Label.find();
    res.json(labels);
  } catch (err) {
    return next(err);
  }
};

exports.label_create = [
  upload.none(),
  async (req, res, next) => {
    const name = req.body.name;
    const newLabel = new Label({ name });
    await newLabel.save();
    res.json(newLabel);
  },
];
