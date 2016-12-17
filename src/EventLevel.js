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
 * @param {Array} nameLevel 命名等级
 * @param {function} receiver 监听器
 */
EventLevel.prototype.addReceiver = function (nameLevel, receiver) {  //添加新的监听器
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new TypeError('receiver is not a function');

    var isLast = nameLevel.length === 0; //是不是最后一级了
    var levelName = nameLevel.shift();

    if (isLast)
        this.receivers.push(receiver);
    else {
        if (!(levelName in this.children))
            this.children[levelName] = new EventLevel();

        this.children[levelName].addReceiver(nameLevel, receiver);
    }
};

/**
 * 移除指定等级的事件监听器
 * @param {Array} nameLevel 命名等级
 */
EventLevel.prototype.removeReceiver = function (nameLevel) {

    var isLast = nameLevel.length === 0; //是不是最后一级了
    var levelName = nameLevel.shift();

    if (isLast) {
        this.receivers = [];
        this.children = {};
    } else {
        if (levelName in this.children)
            this.children[levelName].removeReceiver(nameLevel);
    }
};

/**
 * 触发所有指定级别以及子级的监听器
 * @param {Array} nameLevel 命名等级
 * @param {Object} _this 指定监听器绑定的this对象
 */
EventLevel.prototype.trigger = function (nameLevel, data, _this) {

    var isLast = nameLevel.length === 0; //是不是最后一级了
    var levelName = nameLevel.shift();

    if (isLast) {
        this.receivers.forEach(item => item.call(_this, data));
        Object.keys(this.children).forEach(tag => this.children[tag].trigger(nameLevel, data, _this));
    } else {
        if (levelName in this.children)
            this.children[levelName].trigger(nameLevel, data, _this);
    }
};


module.exports = EventLevel;