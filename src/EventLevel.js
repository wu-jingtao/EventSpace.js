/**
 * Created by wujingtao on 2016/12/17 0017.
 */

/**
 * 事件等级类
 * @constructor
 */
function EventLevel() {
    this.receivers = [];  //当前层级的接收器
    this.children = new Map();   //子层级
}

/**
 * 添加接收器
 * @param {Array} levelName 等级名字数组
 * @param {function} receiver 监听器
 */
EventLevel.prototype.addReceiver = function (levelName, receiver) {  //添加新的监听器

    if (levelName.length === 0)  //是不是最后一级了
        this.receivers.push(receiver);
    else {
        var currentName = levelName.shift();
        if (!this.children.has(currentName))
            this.children.set(currentName, new this.constructor());

        this.children.get(currentName).addReceiver(levelName, receiver);
    }
};

/**
 * 移除指定等级的事件监听器
 * @param {Array} levelName 等级名字数组
 */
EventLevel.prototype.removeReceiver = function (levelName) {

    if (levelName.length === 0) { //是不是最后一级了
        this.receivers = [];
        this.children.clear();
    } else {
        var currentName = levelName.shift();

        if (this.children.has(currentName))
            this.children.get(currentName).removeReceiver(levelName);
    }
};

/**
 * 触发所有指定级别以及子级的监听器
 * @param {Array} levelName 等级名字数组
 * @param {Array} data 要给触发的方法传递的数据
 * @param {Object} _this 指定监听器绑定的this对象
 * @optionalParam {Array} __originalLevelName 内部使用的，保留一个原始的levelName
 */
EventLevel.prototype.trigger = function (levelName, data, _this, __originalLevelName) {

    if (__originalLevelName === undefined)  //保留一个原始的levelName
        __originalLevelName = Array.from(levelName);

    if (levelName.length === 0) {  //是不是最后一级了,遍历当前级别和子级
        this.receivers.forEach(function (item) {
            item.call(_this, data, __originalLevelName);
        });

        this.children.forEach(function (child) {
            child.trigger(levelName, data, _this, __originalLevelName);
        });
    } else {
        var currentName = levelName.shift();

        if (this.children.has(currentName))
            this.children.get(currentName).trigger(levelName, data, _this, __originalLevelName);
    }
};

module.exports = EventLevel;