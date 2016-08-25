/**
 * Created by wujingtao on 2016/8/25 0025.
 */

const {on,off,send,cache,requestCache,innerData} = require('../src/index');

on('test',data=>{
   console.log(data); 
});

cache('test');

send('test','123');

requestCache('test','test');
