/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*测试 off*/

const {on,send,off} = require('../src/index');

on('test',data=>{
    console.log('1:',data);
});

on('test.2',data=>{
    console.log('2:',data);
});

on('test.2.3',data=>{
    console.log('3:',data);
});


off('test.2');

send('test','a');
send('test.2','b');
send('test.2.3','c');