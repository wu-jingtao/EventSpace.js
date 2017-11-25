# EventSpace.js

```
npm install eventspace --save
```

[English](README.en.md)

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

### [API](./bin/EventSpace.d.ts)
