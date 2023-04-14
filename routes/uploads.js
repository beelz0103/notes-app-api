var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.json("uploads");
});

router.get("/:filename", (req, res, next) => {
  res.json("uploads");
});

module.exports = router;
