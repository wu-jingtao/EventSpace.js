/**
 * Created by wujingtao on 2016/12/17 0017.
 */

var eventLevel = new (require('./EventLevel'));


/**
 * 转换事件名称的类型
 * @param {string|Array} eventName
 */
function convertEventNameType(eventName) {
    if (typeof eventName === 'string')    //验证eventName的数据类型
        eventName = eventName.split('.');
    else if (!Array.isArray(eventName))
        throw new Error('eventName must be a string or array');

    return eventName;
}

/**
 * 注册事件监听器
 * 别名 on
 * @param {string|Array} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到事件后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
 * @return {function} 返回 receiver
 */
function receive(eventName, receiver) {
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    eventName = convertEventNameType(eventName);

    eventLevel.addReceiver(eventName, receiver);
    return receiver;
}

/**
 * 注册只接收一次的事件监听器
 * 别名 once
 * @param {string|Array} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(eventName, receiver) {
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    eventName = convertEventNameType(eventName);
    eventName.push(Math.random().toString());  //确保只删除自身

    receive(eventName, function (d, p) {
        receiver(d, p);
        cancel(eventName);
    });
    return receiver;
}

/**
 * 注销数据接收器
 * 别名 off
 * @param {string|Array} eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(eventName) {
    eventName = convertEventNameType(eventName);
    eventLevel.removeReceiver(eventName);
}

/**
 * 触发指定的事件接收器
 * 别名 trigger
 * @param {string|Array} eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @param _this 要为监听器绑定的this对象
 * @return {undefined}
 */
function send(eventName, data, _this) {
    eventName = convertEventNameType(eventName);
    eventLevel.trigger(eventName, data, _this);
}

module.exports = {
    receive,
    on: receive,

    receiveOnce,
    once: receiveOnce,

    send,
    trigger: send,

    cancel,
    off: cancel
};