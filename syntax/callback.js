/*
function a(){
  console.log('A');
}
*/
var a = function(){  // 익명함수. javascript는 함수가 값임.
    console.log('A');
}
   
   
function slowfunc(callback) {
    callback();
}

slowfunc(a);

// 결과 : A