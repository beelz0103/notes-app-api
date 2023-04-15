var express = require("express");
var router = express.Router();

const index_controller = require("../controllers/indexController");

router.get("/", index_controller.index);

router.get("/notes", index_controller.notes_get);

router.post("/note/create", index_controller.notes_create);

router.post("/note/:id/update", index_controller.note_update);

router.post("/note/:id/labelupdate", index_controller.note_update_labels);

router.post("/label/create", index_controller.label_create);

router.get("/labels", index_controller.labels_get);

module.exports = router;
