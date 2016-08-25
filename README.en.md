# Datacast.js

[中文](README.md)
######Translated by youdao

Because of ` flux, redux, baobab ` are not satisfied with, so I write this framework.

This is a data layer framework, work similar to the jQuery custom events. Side of the receiver (receive) to obtain data through registration
, on the other side (send) function to corresponding to transmit data.

Sending method (send) through an address string to determine which receivers need to be triggered.

Address string can have a hierarchy.For example ` grandfather. Farther. Children `, intermediate by `. ` for segmentation.

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

###by the cache to hold the last sent data


Event listeners a model is that the listener can't actively request data to the sender, if the sender not send again
The listener will never reach.


But sometimes really need to finish the registration immediately after the listeners to obtain a data is used to initialize,
By this time the cache can play a role.


Through the cache method to specify the cache on the address of a string of data.After the cache can call requestCache method
To cache the data sent to the designated receiver.


RequestCache method takes two parameters.The first is the corresponding address string data cache to save,
The second is to give what to send data to the receiver.


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


The cache method besides can cache the data on the corresponding address string can also through this (onReceive, onRequest)
Two parameters to persist or read data from the outside.


OnReceive will be triggered when new data cache received.Through which data can be saved, or replacement to save to
The data from the cache.


OnRequest will received when the cache to obtain cache data request triggered, through it can be read from an external data or replace
The returned data in the cache.


Such as:

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

To here basically finished, if it is not very clear, suggested that direct look at the source code, there's not much line anyway.

###API
```javascript
/**
* registration data receiver
* @ param {string} address receiving address. (the string through the '. 'to split level)
* @ param {function} receiver receives the data after the execution of the callback function, the callback function accepts two parameters (data: data, address: to receive the address of the string)
* @ return {function} returns the receiver
*/
function receive(address='', receiver)
```

```javascript
/**
* cancellation data receiver
* @ param {string} address receiving address. (the string through the '. 'to split level)
* @ return {undefined}
*/
function cancel(address='')
```

```javascript
/**
* messages to the specified address
* @ param {string} address receiving address (split level through the '. ')
* @ param data to send data
* @ return {undefined}
*/
function send(address,data)
```


```javascript
/**
* the cache the data on the specified path
* @ param {string} the address data transmission path
* @ param {function} onReceive optional parameters, when the cache receives the new cache data to trigger.The callback function accepts two parameters (newValue: new value, oldValue: old value) after the execution needs to return a value to replace the values in the cache
* @ param {function} onRequest optional parameters, when the cache to receive access to cache data request is triggered.The callback function accepts a parameter (Value: the Value of cache) after the execution needs to return a Value is returned to the requester
* @ return {undefined}
*/
function cache(address, onReceive, onRequest)
```

```javascript
/**
* request data from the cache
* @ param {string} the address data transmission path
* @ param {string} callback_address returned data transmission path
*/
function requestCache(address,callback_address)
```

```javascript
innerData:{     //internal objects,
    cacheData,  // save cached data in the corresponding address
    dispatchList// saved all the receiver function
}
```