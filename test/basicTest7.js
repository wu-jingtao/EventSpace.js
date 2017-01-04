/**
 * Created by wujingtao on 2016/10/12 0012.
 */

/*测试 receiveOnce 和 send*/
/*父级可以向所有子级发送数据*/

const {receiveOnce,send} = require('../src/EventSpace');

receiveOnce('test',data=>{
    console.log('1:',data);
});

receiveOnce('test.2',(data,p)=>{
    console.log('2:',data,p);
});

receiveOnce('test',data=>{
    console.log('3:',data);
});


send('test', 'a');
send('test', 'b');
send('test.2','c');

/*
 * output:
 1: a
 2: a
 3: a
 * */