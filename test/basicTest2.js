/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*测试 cancel*/
/*父级可以删除自己和所有子级*/

const {receive,send,cancel} = require('../src/EventSpace');

receive('test',(data,p)=>{
    console.log('1:',data,p);
});

receive('test.2',(data,p)=>{
    console.log('2:',data,p);
});

receive('test.2.3',(data,p)=>{
    console.log('3:',data,p);
});


cancel('test.2');

send('test','a');
send('test.2','b');
send('test.2.3','c');

/*
* output:
* 
* 1: a [ 'test' ]
* */