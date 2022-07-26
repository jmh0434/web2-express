var template = require("./template.js");
var db = require("./db"); // mysql을 연결하기 위한 객체
var sanitizeHtml = require("sanitize-html");
const path = require("path");

 // 프로그램이 실행될 때 post 방식으로 보낸 함수의 body-parser 기능 실행 

exports.home = function (request, response) { // 메인 홈페이지를 담당하는 모듈
  // topic 테이블의 데이터를 읽어와서 화면에 출력
  var title = "Welcome";
  var description = "Hello, Node.js";
  var list = template.list(request.list);
  var html = template.HTML(
    title,
    list, // 정적인 이미지 삽입
    `<h2>${title}</h2>${description} 
    <img src = "/images/hello.png"></img> 
    `,
    `<a href="/create">create</a>`
  );
  response.send(html);
}

exports.page = function (request, response) {
  var pageId = path.parse(request.params.pageId).base; // semantic URL으로 전환하기 위해 기존의 쿼리스트링 형식이 아닌 params를 요청하여 pageId를 얻어온다.
  db.query(
    // 선택한 항목의 데이터를 출력한다
    `SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id=?`, // LEFT JOIN을 통한 조인
    [pageId],
    function (err, topic) {
      if (err) {
        next(err);
      } else {
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(request.list);
          var html = template.HTML(
            title,
            list,
            `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}
                <p>by  ${sanitizeHtml(topic[0].name)} </p> 
                <p> ${topic[0].created} </p>`,
            ` <a href="/topic/create">create</a>
                  <a href="/topic/update/${pageId}">update</a>
                  <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${pageId}">
                    <input type="submit" value="delete">
                  </form>`
          );
          response.send(html);
        } 
    });
};

exports.create = function(request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
      // topic DB를 읽어오고
      db.query(`SELECT * FROM author`, function (error2, authors) {
        // author DB도 읽어온다
        var title = "Create";
        var list = template.list(topics);
        var html = template.HTML(
          // 글쓴이를 고를 수 있게 해줌
          sanitizeHtml(title),
          list,
          `
          <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
             <p>
              ${template.authorSelect(authors)} 
            </p>
            <p>
              <input type = "submit">
            </p>
          </form>
          `,
          `<a href="/topic/create">create</a>`
        );
        response.send(html);
      });
    });
}

exports.create_process = function(request, response) {  
  var post = request.body;
  db.query(
    // INSERT 구문을 통해 데이터를 MySQL에 저장
    `
        INSERT INTO topic (title, description, created, author_id) 
          VALUES(?, ?, NOW(), ?)`,
    [post.title, post.description, post.author],
    function (error, result) {
      if (error) {
        throw error;
      }
      response.redirect(`/topic/${result.insertId}`);
  });
}

exports.update = function(request, response) {
    var pageId = path.parse(request.params.pageId).base;
    db.query(
      `SELECT * FROM topic WHERE id=?`,
      [pageId],
      function (error2, topic) {
        if (error2) {
          throw error2;
        }
        db.query(
          // author 테이블을 조회하는 쿼리문 추가
          `SELECT * FROM author`,
          function (error3, authors) {
            if (error3) {
              throw error3;
            }
            var list = template.list(request.list);
            var html = template.HTML(
              sanitizeHtml(topic[0].title),
              list, // 수정하고자 하는 항목의 제목과 내용을 우선 불러온 다음에 편집할 수 있도록 함
              `
            <form action="/topic/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(
                topic[0].title
              )}"></p>
              <p>
                <textarea name="description" placeholder="description">${sanitizeHtml(
                  topic[0].description
                )}</textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              <p>
                <input type="submit">
              </p>
            </form>
            `,
              `<a href="/topic/create">create</a> <a href="/topic/update/${topic[0].id}">update</a>`
            );
            response.send(html);
          });
      });
}

exports.update_process = function(request, response) {
    var post = request.body;
    db.query(
      `UPDATE topic SET title=?, description=?, author_id= ? WHERE id=?`, // UPDATE 구문을 통해 반영하고 MySQL에 저장
      [post.title, post.description, post.author, post.id],
      function (error, result) {
        if (error) {
          throw error;
        }
        response.redirect(`/topic/${post.id}`);
      }
    );
}

exports.delete_process = function(request, response) {
      var post = request.body;
      db.query(
        `DELETE FROM topic WHERE id = ?`,
        [post.id],
        function (error, result) {
          //DELETE 구문을 통해 삭제 후 MySQL에 반영
          if (error) {
            throw error;
          }
          response.redirect('/');
        }
      );
}