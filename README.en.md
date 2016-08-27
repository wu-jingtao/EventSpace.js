# Datacast.js

[中文](README.md)


Because `flux, redux, baobab` are not satisfied, so I wrote this framework.

This is a data layer framework, works like jQuery custom events. One side to obtain data by registering a receiver ( `receive` method)
The other side send data to a corresponding receiver by `send` methods.

`Send` method by which to determine a path string receiver needs to be triggered.
 
Path string can have a hierarchy. For example `grandfather.father.children`, `.` through the middle to split.

For the receiver, the child can receive the data from parent. For sending function, the parent can send data to all children.

E.g：
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

###Through `cache` to save the data from the last time send

Event listeners model there is a lack of is that the listener can't actively request data to the sender, 
if the sender not send again, the listener will never reach.


But sometimes we do need After registering listeners obtain a data immediately，to initialize.

Through ` cache ` function to cache the data from  the specify path.
After cached. can invoke ` requestCache ` method To send the cached data to a receiver which on a another path.
Or you can call ` getCache ` method directly to obtain.

` requestCache ` method takes two parameters.The first is the corresponding path string stored data in the cache,
The second is to send data back to which path.

E.g：

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
####Persistent cache data

` cache ` method besides can cache the data on the corresponding path can be controlled by (` onReceive `, ` onRequest `) 
to save the data or to read data from the outside.

`onReceive` will triggered when  `cache` received a new data。Through it, the data can be saved, or replacement The data save to the cache.

`onRequest`will triggered when get data from `cache`，Through it can read data from external  or replace
the return data.

E.g：

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

To here basically finished, if it is not very clear, suggested that direct look at the source code, there's not much line anyway.

###API


```javascript
/**
* register data receiver
* @ param {string} receive data from which path . (the string through the '. 'to split level)
* @ param {function} receiver Receives the data after the execution of the callback function, the callback function accepts two parameters (data: data, path: the path string)
* @ return {function} returns the receiver
*/
function receive(path = '', receiver)
```

```javascript
/**
 * cancellation data receiver
 * @param {string} path cancel which path，And its children.(the string through the '. 'to split level)
 * @return {undefined}
 */
function cancel(path = '')
```

```javascript
/**
 * Send the message to the specified path
 * @param {string} path Send data to which path.
 * @param data Data
 * @return {undefined}
 */
function send(path = '', data)
```

```javascript
/**
 * Cache the data on the specified path
 * @param {string} path cache data from which path
 * @param  defaultValue Optional parameters, the default values
 * @param {function} onReceive Optional parameters,Triggered when update the data in the cache。The callback function accepts two parameters (newValue: new value, oldValue: old value) after the execution needs to return a value, used to replace to cache values
 * @param {function} onRequest Optional parameters，Triggered when get the data from the cache。The callback function accepts a parameter (Value: the Value in the cache) after the execution needs to return a Value to the caller
 * @return {undefined}
 */
function cache(path, defaultValue, onReceive, onRequest)
```

```javascript
/**
 * request data from cache
 * @param {string} path The values of the corresponding path in the cache
 * @param {string} callback_path Want to send the data to which path
 * @return {undefined}
 */
function requestCache(path, callback_path = '')
```

```javascript
/**
 * get the data from cache directly
 * @param {string} path The values of the corresponding path in the cache
 * @return data in the cache
 */
function getCache(path)
```

```javascript
/**
 * set data in the cache directly
 * @param {string} path  The values of the corresponding path in the cache
 * @param data Data
 * @return {undefined}
 */
function setCache(path, data)
```

```javascript
innerData:{     //Internal object
    cacheData,  
    dispatchList
}
```