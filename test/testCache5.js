/**
 * Created by wujingtao on 2016/8/25 0025.
 */

const {receive,getCache,send,cache} = require('../src/index');

receive('test',data=>{
   console.log(data); 
});

cache('test',(newVal,oldVal)=>{
   console.log(newVal,oldVal);
   return newVal;
},(val)=>{
   console.log(val);
   return '666';
});

send('test','123');
send('test.2','321');

var result = getCache('test');

console.log('getcache',result);

/*
* output:
*
* 123
* 123 undefined
* 123
* getcache 666
* */