# Datacast.js
[English](README.en.md)

因为对`flux、redux、baobab`都不太满意，所以写了这个框架。

这是一个数据层框架，工作方式类似于jQuery的自定义事件。一边通过注册接收器(`receive`方法)来获取数据
，另一边通过`send`方法来向对应的接收器发送数据。

`send`方法通过一个路径字符串来确定哪些接收器需要被触发。

路径字符串可以有层级关系。例如`grandfather.farther.children`，中间通过`.`来进行分割。

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

###通过`cache`来保存上一次发送的数据

事件监听模型有一个不足就是，监听者无法主动地向发送者请求数据，如果发送者不再发一次
监听者就永远也拿不到。

不过有时候确实需要在注册完监听器后立刻获取一次数据，用于初始化。
这时候缓存就可以排上用场了。

通过`cache`方法来指定缓存哪一条路径上传输的数据。缓存之后就可以调用`requestCache`方法
来把缓存数据发送给另一条路径上的接收器。或者也可以调用`getCache`方法直接获取。

`requestCache`方法接受两个参数。第一个是对应路径字符串在缓存中保存的数据，
第二个是要把给数据重新发送到哪一条路径上。

例如：

```javascript
receive('test',data => {
   console.log('1:', data);
});

receive('test2',data => {
   console.log('2:', data);
});

cache('test');

send('test','123');

requestCache('test','test2');

/*
* output:
*
* 1: 123
* 2: 123
* */
```
####持久化缓存数据

`cache`方法除了可以缓存对应路径上的数据之外还可以通过（`onReceive`, `onRequest`）来持久化数据或从外部读取数据。

`onReceive`会在`cache`收到新的数据时被触发。通过它,可以对数据进行保存，或者替换要保存到
缓存器中的数据。

`onRequest`会在当要获取`cache`中数据时被触发，通过它可以从外部读取数据或者替换
要返回的数据。

例如：

```javascript
receive('test',data=>{
   console.log(data);
});

cache('test',undefined,(newVal,oldVal)=>{
   console.log('1-in',newVal,oldVal);
   return newVal;
},(val)=>{
   console.log('1-out',val);
   return val;
});

send('test','123');

requestCache('test','test');

/*
* output:
*
* 123
* 1-in 123 undefined
* 1-out 123
* 123
* */
```

到这基本上就介绍完了，如果觉得不是很清楚，建议直接看看源代码，反正也没多少行。

###API


```javascript
/**
 * 注册数据接收器
 * @param {string} path 接收哪一条路径上的数据.(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串）
 * @return {function} 返回 receiver
 */
function receive(path = '', receiver)
```

```javascript
/**
 * 注销数据接收器
 * @param {string} path 注销哪一条路径，以及它的子级.(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(path = '')
```

```javascript
/**
 * 向指定路径发送消息
 * @param {string} path 向哪一条路径发送数据.(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(path = '', data)
```

```javascript
/**
 * 缓存指定路径上的数据
 * @param {string} path 缓存哪一条路径上的数据
 * @param  defaultValue 可选参数，默认值
 * @param {function} onReceive 可选参数，当更新缓存数据的时候触发。该回调函数接受两个参数（newValue:新值，oldValue：旧值） 执行完后需要返回一个值,用来替换要缓存的值
 * @param {function} onRequest 可选参数，当获取缓存数据的时候触发。该回调函数接受一个参数（Value:缓存的值） 执行完后需要返回一个值给调用者
 * @return {undefined}
 */
function cache(path, defaultValue, onReceive, onRequest)
```

```javascript
/**
 * 请求cache中的数据
 * @param {string} path 对应路径在缓存中的值
 * @param {string} callback_path 要把数据发到哪一条路径上
 * @return {undefined}
 */
function requestCache(path, callback_path = '')
```

```javascript
/**
 * 直接获取path所对应cache中的数据
 * @param {string} path 数据传输的路径
 * @return 保存在cache中的数据
 */
function getCache(path)
```

```javascript
/**
 * 设置path所对应cache中的数据
 * @param {string} path 路径
 * @param data 要设置的数据
 * @return {undefined}
 */
function setCache(path, data)
```

```javascript
innerData:{     //内部对象
    cacheData,  //保存了对应地址上缓存的数据
    dispatchList//保存了所有接收器函数
}
```