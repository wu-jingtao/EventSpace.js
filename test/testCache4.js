/**
 * Created by wujingtao on 2016/8/25 0025.
 */
/*重复注册_只会注册一次*/

const {receive,send,cache,requestCache} = require('../bin/index');

receive('test',data=>{
   console.log(data); 
});

cache('test',(newVal,oldVal)=>{
   console.log('1-in',newVal,oldVal);
   return newVal;
},(val)=>{
   console.log('1-out',val);
   return val;
});

cache('test',(newVal,oldVal)=>{
   console.log('2-in',newVal,oldVal);
   return newVal;
},(val)=>{
   console.log('2-out',val);
   return val;
});

send('test','123');

requestCache('test','test');

/*
* output:
* 
* 123
* 1-in 123 undefined
* 1-out 123
* 123
* */