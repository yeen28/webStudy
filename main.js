var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;  // url 분석하는 코드
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {  // 만약 pathname이 루트인 경우
    if (!queryData.id) {    // 또는 if(queryData.id === undefined){

      fs.readdir('./data', function(error, filelist){
        var title = 'Welcome';   // var 를 빼도 실행됨(why?????????????)
        var data = 'Hello, Node.js';  // var 를 빼도 실행됨(why????????????)

        var list = '<ul>';
        for(var i = 0; i < filelist.length; i++){
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';

        var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${data}</p>
        </body>
        </html>
        `;
        response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
        response.end(template);
      })

    } else {

      fs.readdir('./data', function (error, filelist) {
        var list = '<ul>';
        for (var i = 0; i < filelist.length; i++) {
          list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';

        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, data) {
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${data}</p>
          </body>
          </html>
          `;
          response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
          response.end(template);
        })
      })
    }
  } else {  // 그 외의 경로로 접속한 경우, error 표시
    response.writeHead(404);  // 404 : 파일을 찾을 수 없음.
    response.end('Not found');
  }

});
app.listen(3000);