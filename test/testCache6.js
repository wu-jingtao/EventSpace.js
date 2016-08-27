/**
 * Created by wujingtao on 2016/8/25 0025.
 */

/*测试getCache和setCache*/
const {receive,getCache,setCache,send,cache} = require('../bin/index');

receive('test',data=>{
   console.log(data); 
});

cache('test',159,(newVal,oldVal)=>{
   console.log(newVal,oldVal);
   return newVal;
},(val)=>{
   console.log(val);
   return val;
});

send('test','123');
send('test.2','321');

var result = getCache('test');
setCache('test','666');
console.log('getcache',result);
var result = getCache('test');
console.log('getcache2',result);

/*
* output:
*
* 123
* 123 159
* 123
* 666 123
* getcache 123
* 666
* getcache2 666
* */