# EventSpace.js

```
npm install eventspace --save
```

[English](README.en.md)

>浏览器版本[*下载*](bin/browser/index.js)。入口暴露在`window.es`。

>Typescript 定义文件 [*下载*](bin/browser/index.d.ts)

这是一个事件消息传输框架，工作方式类似于jQuery的自定义事件。一边通过注册接收器(`receive`方法)来获取数据
，另一边通过`send`方法来向对应的接收器发送数据。

`send`方法通过一个路径字符串来确定哪些接收器需要被触发。

路径可以有层级关系。例如`grandfather.farther.children`，中间通过` . `来进行分割。
（也可以用数组的方式来表示，例如`['grandfather','farther','children']`）

对于接收器而言，子级接收器可以收到父级发来的消息。而对于发送函数来说，父级可以向所有子级发送数据。

例如：
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
 * 注册事件监听器
 * 别名 on
 * @param {string|Array} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到事件后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
 * @return {function} 返回 receiver
 */
function receive(eventName, receiver)
```

```javascript
/**
 * 注册只接收一次的事件监听器
 * 别名 once
 * @param {string|Array} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(eventName, receiver)
```

```javascript
/**
 * 注销数据接收器
 * 别名 off
 * @param {string|Array} eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(eventName)
```

```javascript
/**
 * 触发指定的事件接收器
 * 别名 trigger
 * @param {string|Array} eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @param _this 要为监听器绑定的this对象
 * @return {undefined}
 */
function send(eventName, data, _this)
```

```javascript
/**
 * 事件空间的构造方法。可以通过new EventSpace() 来创建一个新的事件空间对象。
 * @constructor
 */
function EventSpace() 
```