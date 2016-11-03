/**
 * Created by wujingtao on 2016/11/3 0003.
 */


const {receive,send,cache,requestCache,cancel} = require('../bin/index');

receive(['test'],data => {console.log(data)});
receive(['test2'],data => {console.log(2,data)});

cache(['test']);
cache(['test','2']);

send(['test'],123);
send(['test','2'],321);


requestCache(['test'],['test2']);

cancel('test');

requestCache(['test'],['test2']);

send(['test'],123);

requestCache(['test'],['test2']);

/*
 * output：
 *
 * 123
 * 123
 * */