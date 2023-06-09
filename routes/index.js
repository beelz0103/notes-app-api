var express = require("express");
var router = express.Router();

const index_controller = require("../controllers/indexController");

router.get("/", index_controller.index);

router.get("/notes", index_controller.notes_get);

router.post("/note/create", index_controller.notes_create);

router.post("/note/:id/update", index_controller.note_update);

router.post("/note/:id/delete", index_controller.note_delete);

router.post(
  "/note/:id/delete_permanently",
  index_controller.note_delete_permanently
);

router.post("/note/:id/archive", index_controller.note_archive);

router.post("/note/:id/labelupdate", index_controller.note_update_labels);

router.post("/label/create", index_controller.label_create);

router.get("/labels", index_controller.labels_get);

router.post("/note/:id/pin", index_controller.note_update_pin);

module.exports = router;
