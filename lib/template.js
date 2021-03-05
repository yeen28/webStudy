// refactoring.(더 효율적으로 정리정돈). template 객체.
module.exports = {

    html: function (title, list, body, control) {  // HTML 템플릿 
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
    },

    list: function (filelist) {   // List에 대한 템플릿
        var list = '<ul>';
        for (var i = 0; i < filelist.length; i++) {
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += '</ul>';

        return list;
    }
}