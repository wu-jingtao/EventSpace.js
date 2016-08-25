/**
 * Created by HASEE on 2016/8/25.
 */


const {receive,send,cache,requestCache} = require('../src/index');

receive('test',data=>{console.log(data)});
receive('test2',data=>{console.log(data)});

cache('test');
cache('test.2');

send('test',123);
send('test.2',321);


requestCache('test','test2');