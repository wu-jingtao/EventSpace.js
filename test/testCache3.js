/**
 * Created by HASEE on 2016/8/25.
 */

/*requestCache只会返回精确地址字符串所对应的数据，子级不会返回*/

const {receive,send,cache,requestCache} = require('../bin/index');

receive('test',data => {console.log(data)});
receive('test2',data => {console.log(data)});

cache('test');
cache('test.2');

send('test',123);
send('test.2',321);


requestCache('test','test2');

/*
* output：
*
* 123
* 123
* */