/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*测试 off*/

const {receive,send,cancel} = require('../src/index');

receive('test',data=>{
    console.log('1:',data);
});

receive('test.2',data=>{
    console.log('2:',data);
});

receive('test.2.3',data=>{
    console.log('3:',data);
});


cancel('test.2');

send('test','a');
send('test.2','b');
send('test.2.3','c');

/*
* output:
* 
* 1: a
* */