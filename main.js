const express = require("express");
const app = express();
const port = 3000;
const topic = require("./lib/topic");

// routing
app.get("/", (req, res) => { // 메인 홈페이지 구현
    topic.home(req, res); 
});

app.get('/page/:pageId', (req, res) => { // 상세보기 페이지 구현
    topic.page(req, res);
});

app.get('/create', (req, res) => { // 페이지 생성 폼 출력 구현
    topic.create(req, res);
});

app.post('/create_process', (req, res) => { // 페이지 생성 처리 구현
    topic.create_process(req, res);
});

app.get('/update/:pageId', (req, res) => { // 페이지 수정 폼 구현
    topic.update(req, res);
});

app.post('/update_process', (req, res) => { // 페이지 수정 처리 구현
    topic.update_process(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
