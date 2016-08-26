/**
 * Created by wujingtao on 2016/8/25 0025.
 */

const {receive,cancel,send,cache,requestCache,innerData} = require('../bin/index');

receive('test',data=>{
   console.log(data); 
});

cache('test');

send('test','123');
send('test.2','321');

requestCache('test','test');

/*
* output:
*
* 123
* 123
* */