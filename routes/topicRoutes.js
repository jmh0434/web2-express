var express = require("express");
var router = express.Router();
const topic = require("../lib/topic");

router.get("/create", (req, res) => {
  // 게시물 생성 폼 출력 구현
  topic.create(req, res);
});
router.post("/create_process", (req, res) => {
  // 게시물 생성 처리 구현
  topic.create_process(req, res);
});
router.get("/update/:pageId", (req, res) => {
  // 게시물 수정 폼 구현
  topic.update(req, res);
});
router.post("/update_process", (req, res) => {
  // 게시물 수정 처리 구현
  topic.update_process(req, res);
});
router.post("/delete_process", (req, res) => {
  // 게시물 삭제 처리 구현
  topic.delete_process(req, res);
});
router.get("/:pageId", (req, res) => {
  // 상세보기 페이지 구현
  topic.page(req, res);
});

module.exports = router;