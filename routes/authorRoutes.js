var express = require("express");
var router = express.Router();
const author = require("../lib/author");

router.post("/create_process", (req, res) => {
  author.create_process(req, res);
});

router.get("/update", (req, res) => {
  author.update(req, res);
});

router.post("/update_process", (req, res) => {
  author.update_process(req, res);
});

router.post("/delete_process", (req, res) => {
  author.delete_process(req, res);
});

router.get("", (req, res) => {
  author.home(req, res);
});

module.exports = router;