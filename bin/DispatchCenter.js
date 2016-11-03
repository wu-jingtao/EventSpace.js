'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*数据分发中心*/

/**
 *代表所对应路径的每一个分发层级
 */
var DispatchLevel =
/**
 * @param {string} levelName 当前层级的名字
 */
function DispatchLevel() {
    var levelName = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, DispatchLevel);

    this.levelName = levelName; //当前层级的名字
    this.receiver = new Set(); //当前层级的接收器
    this.children = new Map(); //子层级
};

/**
 * 转换路径字符串的类型
 * @param {string|Array} path
 */


function convertPathType(path) {
    if (typeof path === 'string') //验证path的数据类型
        path = path.split('.');else if (!Array.isArray(path)) throw new Error('path must be a string or array');

    return path;
}

var dispatchList = new DispatchLevel('root');

/**
 * 注册数据接收器
 * @param {string|Array} path 接收哪一条路径上的数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receive(path, receiver) {

    path = convertPathType(path);

    if (typeof receiver !== 'function') /*验证数据类型*/
        throw new Error('receiver is not a function');

    var level = dispatchList.children;

    path.forEach(function (item, index) {
        //循环每一级,找到对应的层级

        if (!level.has(item)) {
            level.set(item, new DispatchLevel(item));
        }

        var currentLevel = level.get(item);

        if (index === path.length - 1) currentLevel.receiver.add(receiver);

        level = currentLevel.children;
    });

    return receiver;
}

/**
 * 注册只接收一次的数据接收器
 * @param {string|Array} path 接收哪一条路径上的数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，path:路径字符串数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(path, receiver) {

    if (typeof receiver !== 'function') /*验证数据类型*/
        throw new Error('receiver is not a function');

    path = convertPathType(path);
    path.push(('' + Math.random()).split('0')[1]); //确保只删除自身

    receive(path, function (d, p) {
        receiver(d, p);
        cancel(path);
    });
    return receiver;
}

/**
 * 注销数据接收器
 * @param {string|Array} path 注销哪一条路径，以及它的子级.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(path) {

    path = convertPathType(path);

    var level = dispatchList.children;

    path.some(function (item, index) {
        var currentLevel = level.get(item);

        if (currentLevel == null) return true; //跳出循环

        if (index === path.length - 1) {
            currentLevel.receiver.clear();
            currentLevel.children.clear();
        }

        level = currentLevel.children;
    });
}

//辅助方法，用于获取子级所有的接收器方法
function getAllChildrenReceiver(targetLevel) {
    var receiver = [].concat(_toConsumableArray(targetLevel.receiver));

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = targetLevel.children.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            receiver.push.apply(receiver, _toConsumableArray(getAllChildrenReceiver(item)));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return receiver;
}

/**
 * 向指定路径发送消息
 * @param {string|Array} path 向哪一条路径发送数据.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function send(path, data) {

    path = convertPathType(path);

    var level = dispatchList.children;

    var pathLevel = path;

    var targetLevel = null;

    pathLevel.some(function (item, index) {
        //循环每一个层级

        var currentLevel = level.get(item); //获取当前层级

        if (currentLevel == null) return true; //跳出循环

        if (index === pathLevel.length - 1) targetLevel = currentLevel; //获取目标层级

        level = currentLevel.children;
    });

    if (targetLevel) {
        var receiver = getAllChildrenReceiver(targetLevel);
        receiver.forEach(function (item) {
            return item(data, path);
        });
    }
}

module.exports = {
    receive: receive, receiveOnce: receiveOnce, cancel: cancel, send: send
};