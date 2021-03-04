var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control){  // HTML 템플릿 
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist){   // List에 대한 템플릿
  var list = '<ul>';
  for (var i = 0; i < filelist.length; i++) {
    list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
  }
  list += '</ul>';

  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;  // url 분석하는 코드
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {  // 만약 pathname이 루트인 경우 (home으로 간 경우)
    if (!queryData.id) {    // 또는 if(queryData.id === undefined){  ==> HOME인 경우

      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';   // var 를 빼도 실행됨(why?????????????)
        var data = 'Hello, Node.js';  // var 를 빼도 실행됨(why????????????)
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, `<a href="/create">create</a>`);
        response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
        response.end(template);
      })

    } else {    // HOME이 아닌 경우
      fs.readdir('./data', function (error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`, `<a href="/create">create</a> 
           <a href="/update?id=${title}">update</a>
           <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${title}">
            <input type="submit" value="delete">
           </form>`    // delete는 form으로 작성! (링크로 작성(get방식)하면 위험할 수 있음)
           ); 
          response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
          response.end(template);
        })
      })
    }
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';  
      var list = templateList(filelist);
      var template = templateHTML(title, list, 
        // form을 만들어줌 (title과 description을 쓸 수 있는 칸)
        /* submit하면 보내는 곳 : http://localhost:3000/create_process 
         * 실제 도메인에서는 http://localhost:3000 삭제하기 */
        `<form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, '');
      response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
      response.end(template);
    });
  } else if(pathname === '/create_process'){
    // post 방식으로 전송된 데이터를 nodejs에서 가져오기
    var body = '';

    // Event
    request.on('data', function(data){  
      /* web 브라우저가 post 방식으로 데이터를 전송할 때 데이터가 엄청 많으면 그 데이터를 한 번에 처리하다가는 프로그램이 꺼지거나 컴퓨터에 무리가 가거나 하는 여러 가지 문제가 생김.
      그래서 nodejs에서는 post방식으로 전송되는 데이터가 많을 경우를 대비해서 이와 같은 사용방법을 적용.
      조각조각의 양들을 서버 쪽에서 수신할 때마다 서버는 function(data) 이 콜백함수를 호출하도록 약속되어 있음. 호출할 때 data라는 인자를 통해서 수신한 정보를 주기로 약속하고 있음. */
      body += data;  // 콜백이 실행될 때마다 body에 data를 추가해줌.

      // Too much POST data, kill the connection!
      // 1e6 === 1*Math.pow(10, 6) === 1*1000000 ~~~ 1MB
      /* if (body.length > 1e6)
        request.connection.destroy(); */
    });
    request.on('end', function(){  // 더이상 들어올 정보가 없는 경우 여기의 function() (콜백함수)를 호출하도록 되어 있음. 이 함수가 실행되면 정보 수신이 끝남.
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      // fs.writeFile('파일이름', '파일내용', 'utf8', function(){});
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){    // err : 에러가 있을 때 에어를 처리하는 방법.
        response.writeHead(302, {Location: `/?id=${title}`});      // 302 : 페이지를 {Location: _______} 로 redirection 시킴.
        response.end('success');
      });
    });
  } else if (pathname === `/update`){
    fs.readdir('./data', function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `<form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p>
            <input type="text" name="title" placeholder="title" value="${title}">
          </p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `, 
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`); 
        response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
        response.end(template);
      })
    })
  } else if (pathname === "/update_process"){
    var body = '';

    // Event
    request.on('data', function(data){
      body += data; 
    });

    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      
      // 파일 이름 수정
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        // 파일 내용 수정
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){ 
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (pathname === "/delete_process"){
    var body = '';

    // Event
    request.on('data', function(data){
      body += data; 
    });

    request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      
      // 파일 삭제
      fs.unlink(`data/${id}`, function(error){
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  } else {  // 그 외의 경로로 접속한 경우, error 표시
    response.writeHead(404);  // 404 : 파일을 찾을 수 없음.
    response.end('Not found');
  }

});
app.listen(3000);