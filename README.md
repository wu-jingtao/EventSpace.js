# Datacast.js
因为对`flux、redux、baobab`都不太满意所以写了这个框架。

这是一个数据层框架，工作方式类似于jQuery的自定义事件。一边通过注册接收器（receive）来获取数据
，另一边通过（send）方法来向对应的接收器发送数据。

发送方法（send）通过一个地址字符串来确定哪些接收器需要被触发。

地址字符串可以有层级关系。例如`grandfather.farther.children`，中间通过`.`来进行分割。

对于接受器而言，子级接收器可以收发父级发来的消息。而对于发送函数来说，
父级可以向所有子级发送数据。

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

###通过cache来保存上一次发送的数据

事件监听模型有一个不足就是，监听者无法主动地向发送者请求数据，如果发送者不再发一次
监听者就永远也拿不到。

不过有时候确实需要在注册完监听器后立刻获取一次数据用于初始化，
这时候缓存就可以发挥作用了。

通过cache方法来指定缓存那一条地址字符串上传输的数据。缓存之后就可以调用requestCache方法
来让缓存把数据发送给指定的接收器。

requestCache方法接受两个参数。第一个是缓存中保存的对应地址字符串的数据，
第二个是要把给数据重新发送给哪些接收器。

例如：

```javascript
receive('test',data=>{
   console.log(data);
});

receive('test2',data=>{
   console.log(data);
});

cache('test');

send('test','123');

requestCache('test','test2');

/*
* output:
*
* 123
* 123
* */
```
####持久化缓存数据

cache方法除了可以缓存对应地址字符串上的数据之外还可以通过（onReceive, onRequest）这
两个参数来持久化或从外部读取数据。

onReceive会在cache收到新的数据时被触发。通过它可以对数据进行保存，或者替换要保存到
缓存器中的数据。

onRequest会在当缓存器接收到获取缓存器数据请求时触发，通过它可以从外部读取数据或者替换
缓存器中返回的数据。

例如：

```javascript
receive('test',data=>{
   console.log(data);
});

cache('test',(newVal,oldVal) => {
   console.log(newVal,oldVal);

   localStorage['test'] = newVal;

   return newVal;
},(val) => {
    if(val == null)
        val = localStorage['test'];

   console.log(val);

   return val;
});

send('test','123');

requestCache('test','test');
```

到这基本上就介绍完了，如果觉得不是很清楚，建议直接看看源代码，反正也没多少行。

###API
```javascript
/**
 * 注册数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，address:接收到的地址字符串）
 * @return {function} 返回 receiver
 */
function receive(address='', receiver)
```

```javascript
/**
 * 注销数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(address='')
```

```javascript
/**
 * 向指定地址发送消息
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(address,data)
```

```javascript
/**
 * 向指定地址发送消息
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(address,data)
```

```javascript
/**
 * 缓存指定路径上的数据
 * @param {string} address 数据传输的路径
 * @param {function} onReceive 当缓存器接收到新的缓存数据的时候触发。该回调函数接受两个参数（newValue:新值，oldValue：旧值） 执行完后需要返回一个值来替换缓存器中的值
 * @param {function} onRequest 当缓存器接收到获取缓存器数据请求时触发。该回调函数接受一个参数（Value:缓存的值） 执行完后需要返回一个值来返回给请求者
 * @return {undefined}
 */
function cache(address, onReceive, onRequest)
```

```javascript
/**
 * 请求cache中的数据
 * @param {string} address 数据传输的路径
 * @param {string} callback_address 回传数据的传输路径
 */
function requestCache(address,callback_address)
```

```javascript
innerData:{     //内部对象，
    cacheData,  //保存了对应地址上缓存的数据
    dispatchList//保存了所有接收器函数
}
```