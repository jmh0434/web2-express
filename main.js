const express = require("express");
const app = express();
const port = 3000;
const db = require("./lib/db");
const bodyParser = require("body-parser"); // body-parser 미들웨어 호출
const compression = require("compression"); // compression 미들웨어 호출

const topicRouter = require("./routes/topicRoutes");
const authorRouter = require("./routes/authorRoutes");
const indexRouter = require("./routes/indexRoutes");

app.use(express.static('public')); // 'public' 내의 정적인 파일을 사용하겠다
app.use(bodyParser.urlencoded({ extended: false })); // main.js이 실행될 때 POST 방식으로 요쳥된 미들웨어의 body구문을 parsing 수행함
app.use(compression()); // 컨텐츠를 압축해서 전송해주는 미들웨어

app.get('*', function(request, response, next) { // get request에서 공통적으로 SELECT * FROM topic 명령을 쓰는데 이걸 미들웨어로 묶어서 코드 간결하게 함
    db.query(`SELECT * FROM topic`, function (error, topics){
        request.list = topics;
        next();
    });
});

app.use("/topic", topicRouter); // topic 관련 미들웨어는 따로 라우팅을 해주어 분리함
app.use("/author", authorRouter); // author 관련 미들웨어는 따로 라우팅을 해주어 분리함
app.use("/", indexRouter);

app.use(function (req, res, next) { // 404 에러
  res.status(404).send("잘못된 경로 접근입니다!");
});

app.use(function (err, req, res, next) { // 500 에러
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
