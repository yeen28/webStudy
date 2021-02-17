var http = require('http');
var fs = require('fs');
var url = require('url');
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;  // url 분석하는 코드
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id;
    console.log(queryData.id);

    if(pathname === '/'){  // 만약 pathname이 루트인 경우
      fs.readFile(`data/${title}`, 'utf8', function(err, data){
        var template = `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${data}</p>
      </body>
      </html>
      `;
      response.writeHead(200);  // 서버가 브라우저에게 200 전달 : 파일을 성공적으로 전송!
      response.end(template);
      });
    } else {  // 그 외의 경로로 접속한 경우, error 표시
      response.writeHead(404);  // 404 : 파일을 찾을 수 없음.
      response.end('Not found');
    }
    
});
app.listen(3000);