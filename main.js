var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){  // HTML 템플릿 
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
    <a href="/create">create</a>
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
    if (!queryData.id) {    // 또는 if(queryData.id === undefined){

      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';   // var 를 빼도 실행됨(why?????????????)
        var data = 'Hello, Node.js';  // var 를 빼도 실행됨(why????????????)
        var list = templateList(filelist);
        var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);
        response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
        response.end(template);
      })

    } else {
      fs.readdir('./data', function (error, filelist) {
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data) {
          var title = queryData.id;
          var list = templateList(filelist);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`); 
          response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
          response.end(template);
        })
      })
    }
  } else if(pathname === '/create'){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';  
      var list = templateList(filelist);
      var template = templateHTML(title, list, `
      <form action="http://localhost:3000/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `);
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
      console.log(title);
    });
    response.writeHead(200);
    response.end('success');
  } else {  // 그 외의 경로로 접속한 경우, error 표시
    response.writeHead(404);  // 404 : 파일을 찾을 수 없음.
    response.end('Not found');
  }

});
app.listen(3000);