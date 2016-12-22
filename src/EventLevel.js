/**
 * Created by wujingtao on 2016/12/17 0017.
 */

//
/**
 * 事件等级类
 * @constructor
 */
function EventLevel() {
    this.receivers = [];  //当前层级的接收器
    this.children = {};   //子层级
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

        if (!(currentName in this.children))
            this.children[currentName] = new this.constructor();

        this.children[currentName].addReceiver(levelName, receiver);
    }
};

/**
 * 移除指定等级的事件监听器
 * @param {Array} levelName 等级名字数组
 */
EventLevel.prototype.removeReceiver = function (levelName) {

    if (levelName.length === 0) { //是不是最后一级了
        this.receivers = [];
        this.children = {};
    } else {
        var currentName = levelName.shift();

        if (currentName in this.children)
            this.children[currentName].removeReceiver(levelName);
    }
};

/**
 * 触发所有指定级别以及子级的监听器
 * @param {Array} levelName 等级名字数组
 * @param {Object} _this 指定监听器绑定的this对象
 */
EventLevel.prototype.trigger = function (levelName, data, _this) {

    if (levelName.length === 0) {  //是不是最后一级了
        this.receivers.forEach(item => item.call(_this, data));
        Object.keys(this.children).forEach(tag => this.children[tag].trigger(levelName, data, _this));
    } else {
        var currentName = levelName.shift();

        if (currentName in this.children)
            this.children[currentName].trigger(levelName, data, _this);
    }
};


module.exports = EventLevel;