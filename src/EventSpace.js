/**
 * Created by wujingtao on 2016/12/17 0017.
 */

const eventLevel = new (require('./EventLevel'));


/**
 * 转换路径字符串的类型
 * @param {string|Array} path
 */
function convertPathType(path) {
    if (typeof path === 'string')    //验证path的数据类型
        path = path.split('.');
    else if (!Array.isArray(path))
        throw new Error('path must be a string or array');

    return path;
}

/**
 * 注册事件监听器
 * 别名 on
 * @param {string|Array} path 接收哪一条路径上的事件.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到事件后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receive(path, receiver) {
    path = convertPathType(path);

    eventLevel.addReceiver(path, receiver);
    return receiver;
}

/**
 * 注册只接收一次的事件监听器
 * 别名 once
 * @param {string|Array} path 接收哪一条路径上的事件.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(path, receiver) {
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    path = convertPathType(path);
    path.push(`${Math.random()}`.split('0')[1]);  //确保只删除自身

    receive(path, function (d, p) {
        receiver(d, p);
        cancel(path);
    });
    return receiver;
}

/**
 * 注销数据接收器
 * 别名 off
 * @param {string|Array} path 注销哪一条路径，以及它的子级.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(path) {

    path = convertPathType(path);
    eventLevel.removeReceiver(path);
}

/**
 * 向指定路径发送消息
 * @param {string|Array} path 向哪一条路径发送数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @param _this 要为监听器绑定的this对象
 * @return {undefined}
 */
function send(path, data, _this) {
    eventLevel.trigger(path, data, _this);
}

module.exports = {
    receive,
    on: receive,

    receiveOnce,
    once: receiveOnce,
    send,

    cancel,
    off: cancel
};