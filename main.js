const express = require("express");
const app = express();
const port = 3000;

const topic = require("./lib/topic");

// routing
app.get("/", (req, res) => {
    topic.home(req, res); // 메인 홈페이지 불러오기
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*
var http = require("http");
var url = require("url");
var topic = require("./lib/topic");
var author = require("./lib/author");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === "/") { // 차상위 루트라면
    if (queryData.id === undefined) { // queryData가 존재하지 않는다면, 즉 메인 홈페이지라면
      topic.home(request, response);
    } else { // 그렇지 않다면, 즉 어떠한 게시물을 클릭했을 때
        topic.page(request, response);
    }
  } else if (pathname === "/create") { // 만들기 버튼을 눌렀을 때
      topic.create(request, response);
  } else if (pathname === "/create_process") { // 생성 후 처리
      topic.create_process(request, response);
  } else if (pathname === "/update") { // 수정 버튼을 눌렀을 때
      topic.update(request, response);
  } else if (pathname === "/update_process") { // 수정 작업 처리
      topic.update_process(request, response);
  } else if (pathname === "/delete_process") { // 삭제 처리
      topic.delete_process(request, response);
  } else if (pathname === "/author") { // 저자 목록 보이기
      author.home(request, response);
  } else if (pathname === "/author/create_process") { // 저자 생성 처리
      author.create_process(request, response);
  } else if (pathname === "/author/update") { // 저자 업데이트 UI
      author.update(request, response);
  } else if (pathname === "/author/update_process") { // 저자 업데이트 처리
      author.update_process(request, response);
  } else if (pathname === "/author/delete_process") {
      author.delete_process(request, response);
  } else {
      response.writeHead(404);
      response.end("Not found");
  }
});
app.listen(3000);
*/
