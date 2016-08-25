/**
 * Created by wujingtao on 2016/8/25 0025.
 */

const {receive,cancel,send,cache,requestCache,innerData} = require('../src/index');

receive('test',data=>{
   console.log(data); 
});

cache('test');

send('test','123');

requestCache('test','test');

/*
* output:
*
* 123
* 123
* */