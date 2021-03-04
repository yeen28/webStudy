/* function.js */
f123();
console.log('A');
console.log('Z');
console.log('B');
f123();
console.log('F');
console.log('C');
console.log('P');
console.log('J');
f123();
 
function f123(){
  console.log(1);
  console.log(2);
  console.log(3);
  console.log(4);
}




/* function2.js */
// Math.round : 반올림
console.log(Math.round(1.6)); //2
console.log(Math.round(1.4)); //1
 
function sum(first, second){ // parameter
  console.log(first+second);
}
 
sum(2,4); // argument


function returnSum(first, second){
    return first+second;
}

console.log(returnSum(2,4));