/**
 * Created by 吴劲韬 on 2017/3/12.
 */


const {EventSpace} = require('../src/index');

var es1 = new EventSpace();
var es2 = new EventSpace();

es1.receive('test',data=>{
    console.log('es1:',data);
});

es2.receive('test',data=>{
    console.log('es2:',data);
});

es1.send('test','a');
es2.send('test','b');

/*
 es1: a
 es2: b
* */