/**
 * Created by 吴劲韬 on 2017/3/12.
 */


const {EventSpace} = require('../src/index');

var es = new EventSpace();

es.receive('test',data=>{
    console.log('1:',data);
});

es.receive('test.2',data=>{
    console.log('2:',data);
});

es.receive('test.2.3',data=>{
    console.log('3:',data);
});

es.send('test','a');
es.send('test.2','b');
es.send('test.2.3','c');

/*
 * output:
 1: a
 2: a
 3: a
 2: b
 3: b
 3: c
 * */