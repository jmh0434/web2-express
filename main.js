const express = require("express");
const app = express();
const port = 3000;
const topic = require("./lib/topic");
const author = require("./lib/author");

var db = require("./lib/db");
var bodyParser = require("body-parser"); //body-parser 미들웨어 호출
var compression = require("compression");
const { authorSelect } = require("./lib/template");

app.use(express.static('public')); // 'public' 내의 정적인 파일을 사용하겠다
app.use(bodyParser.urlencoded({ extended: false })); // main.js이 실행될 때 POST 방식으로 요쳥된 미들웨어의 body구문을 parsing 수행함
app.use(compression()); // 컨텐츠를 압축해서 전송해주는 미들웨어

app.get('*', function(request, response, next) { // get request에서 공통적으로 SELECT * FROM topic 명령을 쓰는데 이걸 미들웨어로 묶어서 코드 간결하게 함
    db.query(`SELECT * FROM topic`, function (error, topics){
        request.list = topics;
        next();
    });
});

// routing
app.get('/', (req, res) => { // 메인 홈페이지 구현
    topic.home(req, res); 
});

app.post('/author/create_process', (req, res) => {
    author.create_process(req, res);
});

app.get('/author/update', (req, res) => {
    author.update(req, res);
});

app.post('/author/update_process', (req, res) => {
    author.update_process(req, res);
});

app.post('/author/delete_process', (req, res) => {
    author.delete_process(req, res);
});

app.get("/author", (req, res) => {
  author.home(req, res);
});

app.get('/topic/create', (req, res) => { // 게시물 생성 폼 출력 구현
    topic.create(req, res);
});

app.post('/topic/create_process', (req, res) => { // 게시물 생성 처리 구현
    topic.create_process(req, res);
});

app.get('/topic/update/:pageId', (req, res) => { // 게시물 수정 폼 구현
    topic.update(req, res);
});

app.post('/topic/update_process', (req, res) => { // 게시물 수정 처리 구현
    topic.update_process(req, res);
});

app.post('/topic/delete_process', (req, res) => { // 게시물 삭제 처리 구현
    topic.delete_process(req, res);
});

app.get("/topic/:pageId", (req, res) => { // 상세보기 페이지 구현
  topic.page(req, res);
});

app.use(function (req, res, next) { // 404 에러
  res.status(404).send("잘못된 경로 접근입니다!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
