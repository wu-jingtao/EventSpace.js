/**
 * Created by wujingtao on 2017/1/4 0004.
 */

/*测试 receiveOnce 和 send,off*/

const {receiveOnce,send,off} = require('../src/index');

receiveOnce('test',data=>{
    console.log('1:',data);
});

receiveOnce('test.2',(data,p)=>{
    console.log('2:',data,p);
});

receiveOnce('test',data=>{
    console.log('3:',data);
});

off(['test','2']);

send('test', 'a');
send('test', 'b');
send('test.2','c');

/*
 * output:
 1: a
 3: a
 * */