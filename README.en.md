# EventSpace.js


```
npm install eventspace --save
```

[中文](README.md)

Browser version [download](bin/browser/index.js)

This is a event transfer framework, works like jQuery custom events. One side to obtain data by registering a receiver ( `receive` method)
The other side send data to a corresponding receiver by `send` methods.

`Send` method by a path string or a array to determine which receiver needs to be triggered.
 
Path string can has a hierarchy. For example `grandfather.father.children`,  through `.` to split.
（it also can be a array，For example`['grandfather','farther','children']`）

For the receiver, the child can receive the data from parent. For sending method, the parent can send data to all children.

E.g：
```javascript
const {receive, send} = require('eventspace');

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
```

### API


```javascript
/**
 * register a event listener
 * alias on
 * @param {string|Array} eventName   listening event name. can be a string or array (the string through the '. 'to split level)
 * @param {function} receiver   the event listener, the callback function accepts two parameters (data: data, eventName: the path string)
 * @return {function} returns the receiver
 */
function receive(eventName, receiver)
```

```javascript
/**
 * register a event listener, which will be triggered  only once
 * alias once
 * @param {string|Array} eventName   listening event name. can be a string or array (the string through the '. 'to split level)
 * @param {function} receiver   the event listener, the callback function accepts two parameters (data: data, eventName: the path string)
 * @return {function}  returns the receiver
 */
function receiveOnce(eventName, receiver)
```

```javascript
/**
 * canceling event listener
 * alias off
 * @param {string|Array} eventName   be canceled event name. can be a string or array(the string through the '. 'to split level)
 * @return {undefined}
 */
function cancel(eventName)
```

```javascript
/**
 * trigger specific event listener
 * alias trigger
 * @param {string|Array} eventName   be triggered event name.can be a string or array (the string through the '. 'to split level)
 * @param data   sending data
 * @param _this   binding‘this’to listener
 * @return {undefined}
 */
function send(eventName, data, _this)
```
```javascript
/**
 * EventSpace`s constructor. Can use 'new EventSpace()' to create a new eventspace object .
 * @constructor
 */
function EventSpace() 