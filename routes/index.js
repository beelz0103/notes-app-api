var express = require("express");
var router = express.Router();

const index_controller = require("../controllers/indexController");

router.get("/", index_controller.index);

router.get("/notes", index_controller.notes_get);

router.post("/note/create");

router.post("/note/create", index_controller.notes_create);

module.exports = router;
