/**
 * Created by wujingtao on 2016/8/25 0025.
 */

const {receive,send,cache,requestCache} = require('../src/index');

receive('test',data=>{
   console.log(data); 
});

cache('test',(newVal,oldVal)=>{
   console.log(newVal,oldVal);
   return 321;
},(val)=>{
   console.log(val);
   return '666';
});

send('test','123');

requestCache('test','test');

/*
* output:
* 
* 123
* 123 undefined
* 321
* 666
* */