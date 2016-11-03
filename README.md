# Datacast.js

```
npm install datacast --save
```

[English](README.en.md)


这是一个数据层框架，工作方式类似于jQuery的自定义事件。一边通过注册接收器(`receive`方法)来获取数据
，另一边通过`send`方法来向对应的接收器发送数据。

`send`方法通过一个路径字符串来确定哪些接收器需要被触发。

路径字符串可以有层级关系。例如`grandfather.farther.children`，中间通过`.`来进行分割。
（也可以用数组的方式来表示，例如`['grandfather','farther','children']`）

对于接收器而言，子级接收器可以收到父级发来的消息。而对于发送函数来说，父级可以向所有子级发送数据。

例如：
```javascript
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


###API


```javascript
/**
 * 注册数据接收器
 * @param {string|Array} path 接收哪一条路径上的数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receive(path, receiver)
```

```javascript
/**
 * 注册只接收一次的数据接收器
 * @param {string|Array} path 接收哪一条路径上的数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(path, receiver)
```

```javascript
/**
 * 注销数据接收器
 * @param {string|Array} path 注销哪一条路径，以及它的子级.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(path)
```

```javascript
/**
 * 向指定路径发送消息
 * @param {string|Array} path 向哪一条路径发送数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(path, data)
```
