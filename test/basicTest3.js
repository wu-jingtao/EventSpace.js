/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*测试 cancel*/
/*多次注册*/

const {receive,send} = require('../src/EventSpace');

receive('test',data=>{
    console.log('1:',data);
});

receive('test',data=>{
    console.log('2:',data);
});

receive('test.2',data=>{
    console.log('3:',data);
});


send('test','a');
send('test.2','b');
send('test.2.3','c');

/*
* output:
* 
* 1: a
* 2: a
* 3: a
* 3: b
* */