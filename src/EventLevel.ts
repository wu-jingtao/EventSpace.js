/**
 * 事件等级类
 * @constructor
 */
export default class EventLevel {

    receivers: Function[] = []; //当前层级的接收器
    children = new Map<any, EventLevel>();   //子层级

    /**
     * 添加接收器
     * 
     * @param {any[]} levelNameArray 事件等级名字数组
     * @param {Function} receiver 监听器
     * 
     * @memberof EventLevel
     */
    addReceiver(levelNameArray: any[], receiver: Function) {  //添加新的监听器
        if (levelNameArray.length === 0)  //是不是最后一级了
            this.receivers.push(receiver);
        else {
            var currentName = levelNameArray.shift();
            if (!this.children.has(currentName))
                this.children.set(currentName, new EventLevel());

            this.children.get(currentName).addReceiver(levelNameArray, receiver);
        }
    }

    /**
     * 移除指定等级的事件监听器
     * 
     * @param {any[]} levelNameArray 等级名字数组
     * 
     * @memberof EventLevel
     */
    removeReceiver(levelNameArray: any[]) {

        if (levelNameArray.length === 0) { //是不是最后一级了
            this.receivers = [];
            this.children.clear();
        } else {
            var currentName = levelNameArray.shift();

            if (this.children.has(currentName))
                this.children.get(currentName).removeReceiver(levelNameArray);
        }
    }

    /**
     * 触发所有指定级别以及子级的监听器
     * 
     * @param {any[]} levelNameArray 等级名字数组
     * @param {*} data 要给触发的方法传递的数据
     * @param {Object} _this 指定监听器绑定的this对象
     * @param {eventname[]} __originalLevelName 内部使用的，保留一个原始的levelName
     * 
     * @memberof EventLevel
     */
    trigger(levelNameArray: any[], data: any, _this: Object, __originalLevelName?: any[]) {

        if (__originalLevelName === undefined)  //保留一个原始的levelName
            __originalLevelName = Array.from(levelNameArray);

        if (levelNameArray.length === 0) {  //是不是最后一级了,遍历当前级别和子级
            this.receivers.forEach(function (item) {
                item.call(_this, data, __originalLevelName);
            });

            this.children.forEach(function (child) {
                child.trigger(levelNameArray, data, _this, __originalLevelName);
            });
        } else {
            var currentName = levelNameArray.shift();

            if (this.children.has(currentName))
                this.children.get(currentName).trigger(levelNameArray, data, _this, __originalLevelName);
        }
    };
}