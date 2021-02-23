var fs = require('fs');
 
/*
//readFileSync 동기적
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
*/
/*
결과:
A
B
C
*/
 
// 비동기적 (성능이 중요하다면 다음과 같이 비동기적으로 처리해야 함)
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
    console.log(result);
});
console.log('C');
/*
결과:
A
C
B
*/