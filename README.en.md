# Datacast.js

[中文](README.md)


Because of ` flux, redux, baobab ` are not satisfied with, so I write this framework.

This is a data layer framework, work similar to the jQuery custom events.Side by registering the receiver ` receive ` to obtain data
, on the other side through ` send ` method corresponding to transmit data.

Sending method ` send ` via a path string to determine which receivers need to be triggered.

Path string can have a hierarchy.For example ` grandfather. Farther. Children `, intermediate by `. ` for segmentation.

For the receiver, the child receiver can get data from the parent.And for sending function,
The parent can send data to all children.

Such as:
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

###Through ` cache ` to save the data for the last time send

Event listeners a model is that the listener can't actively request data to the sender, if the sender is no longer send at a time
The listener will never reach.

But sometimes really need to finish the registration immediately after the listeners to obtain a data is used to initialize the,
By this time the cache can play a role.

Through ` cache ` method which transmitted on a path to specify the cache data.After the cache can invoke ` requestCache ` method
To cache the data sent to the receiver on another path.Or you can call ` getCache ` method directly obtained.

` requestCache ` method takes two parameters.The first is the corresponding path string stored data in the cache,
The second is to send data back to the path.

Such as:

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
####The persistent cache data

` cache ` method besides can cache the data on the corresponding path can be controlled by (` onReceive `, ` onRequest `) it
Two parameters to persist the data or to read data from the outside.


In ` onReceive ` ` cache ` received when new data is triggered.Through which data can be saved, or replacement to save to
The data from the cache.


` onRequest ` can be in when to get ` cache data in ` is triggered, through it can be read from an external data or replace
To return to the data.


Such as:

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

cache('test',undefined,(newVal,oldVal)=>{
   console.log('2-in',newVal,oldVal);
   return newVal;
},(val)=>{
   console.log('2-out',val);
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
* registration data receiver
* @ param {string} path which receive the data on the path. (the string through the '. 'to split level)
* @ param {function} receiver receives the data after the execution of the callback function, the callback function accepts two parameters (data: data, path: the path string)
* @ return {function} returns the receiver
*/
function receive(path = '', receiver)
```

```javascript
/**
* cancellation data receiver
* @ param {string} path which cancellation path, as well as their children's. (the string through the '. 'to split level)
* @ return {undefined}
*/
function cancel(path = '')
```

```javascript
/**
* send a message to the specified path
* @ param {string} path which path to send data to. (split level through the '. ')
* @ param data to send data
* @ return {undefined}
*/
function send(path = '', data)
```

```javascript
/**
* the cache the data on the specified path
* @ param {string} which path cache the data on the path
* @ param defaultValue optional parameters, the default value
* @ param {function} onReceive optional parameters, trigger when update the cached data.The callback function accepts two parameters (newValue: new value, oldValue: old value) after the execution needs to return a value to replace to cache
* @ param {function} onRequest optional parameters, trigger when access to cache data.The callback function accepts a parameter (Value: the Value of cache) after the execution needs to return a Value to the caller
* @ return {undefined}
*/
function cache(path, defaultValue, onReceive, onRequest)
```

```javascript
/**
* request data from the cache
* @ param {string} The values in the request which path in the cache
* @ param {string} callback_path to which to send the data to a path
*/
function requestCache(path, callback_path = '')
```

```javascript
/**
* direct access path for data from the cache
* @ param {string} path data transmission path
* @ return to save the data in the cache
*/
function getCache(path)
```

```javascript
/**
* set the path for the data in the cache
* @ param {string} path path
* @ param data to set up the data
* @ return {undefined}
*/
function setCache(path, data)
```

```javascript
innerData:{     //internal objectsi
    cacheData,  //save cached data in the corresponding address
    dispatchList//to save all the receiver function
}
```