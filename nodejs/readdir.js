var testFolder = './data';   // ./ : 현재 디렉토리
var fs = require('fs');
 
fs.readdir(testFolder, function(error, filelist){
  console.log(filelist);    // 결과가 배열 형태로 나옴  :  [ 'CSS', 'HTML', 'JavaScript' ]  
})