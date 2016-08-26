'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by wujingtao on 2016/8/24 0024.
 */

/*数据分发中心*/

/**
 * 代表地址命名空间所对应的每一个分发层级
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

var dispatchList = new DispatchLevel('root');

/**
 * 注册数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，address:接收到的地址字符串）
 * @return {function} 返回 receiver
 */
function receive() {
    var address = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
    var receiver = arguments[1];


    if (typeof receiver !== 'function') /*验证数据类型*/
        throw new Error('receiver is not a function');

    address = address.split('.'); //分割地址的命名空间

    var level = dispatchList.children;

    address.forEach(function (item, index) {
        //循环每一级命名空间,找到对应的层级

        if (!level.has(item)) {
            level.set(item, new DispatchLevel(item));
        }

        var currentLevel = level.get(item);

        if (index === address.length - 1) currentLevel.receiver.add(receiver);

        level = currentLevel.children;
    });

    return receiver;
}

/**
 * 注销数据接收器
 * @param {string} address 接收地址.(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel() {
    var address = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];


    var level = dispatchList.children;

    address = address.split('.'); //分割地址的命名空间

    address.some(function (item, index) {
        var currentLevel = level.get(item);

        if (currentLevel == null) return true; //跳出循环

        if (index === address.length - 1) {
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
 * 向指定地址发送消息
 * @param {string} address 接收地址(通过‘.’来分割层级)
 * @param data 要发送的数据
 * @return {undefined}
 */
function _send(address, data) {

    var level = dispatchList.children;

    var addressLevel = address.split('.'); //分割地址的命名空间

    var targetLevel = null;

    addressLevel.some(function (item, index) {
        //循环每一个层级

        var currentLevel = level.get(item); //获取当前层级

        if (currentLevel == null) return true; //跳出循环

        if (index === addressLevel.length - 1) targetLevel = currentLevel; //获取目标层级

        level = currentLevel.children;
    });

    if (targetLevel) {
        var receiver = getAllChildrenReceiver(targetLevel);
        receiver.forEach(function (item) {
            return item(data, address);
        });
    }
}

module.exports = {
    receive: receive, cancel: cancel, dispatchList: dispatchList,

    /**
     * send的包装方法
     * @param address
     * @param data
     * @param needSendToCache   是否需要将这个数据发送给Cache
     */
    send: function send(address, data) {
        var needSendToCache = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

        _send(address, data);
        if (needSendToCache) _send('__cache__receive.' + address, data); //給缓存再发一份
    }
};