 var express = require("express");
 var router = express.Router();
 const topic = require("../lib/topic");
 // routing
router.get('/', (req, res) => { // 메인 홈페이지 구현
    topic.home(req, res); 
});
module.exports = router;