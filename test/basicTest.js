/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*测试 receive 和 send*/
/*父级可以向所有子级发送数据*/

const {receive,send} = require('../src/index');

receive('test',data=>{
    console.log('1:',data);
});

receive('test.2',data=>{
    console.log('2:',data);
});

receive('test.2.3',data=>{
    console.log('3:',data);
});

send('test','a');
send('test.2','b');
send('test.2.3','c');

/*
* output:
 1: a
 2: a
 3: a
 2: b
 3: b
 3: c
* */