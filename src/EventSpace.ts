import EventLevel from "./EventLevel";

/**
 * 根据规则将事件名转换成数组的形式
 * @param {any | any[]} eventName 事件名称
 */
function convertEventNameType(eventName: any | any[] = []): any[] {
    if (!Array.isArray(eventName)) {  //是数组就不用转换了
        if ('string' === typeof eventName) {    //是字符串还需要将字符串分割一下
            eventName = eventName.split('.');
        } else {
            eventName = [eventName];
        }
    }

    return eventName;
}

export default class EventSpace {

    //导出一个全局事件空间和一个事件空间类
    private readonly eventLevel = new EventLevel();

    /**
     * 注册事件监听器
     * 别名 on
     * @param {any | any[]} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param {function} receiver 接收到事件后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
     * @return {function} 返回 receiver
     */
    receive(eventName: any | any[], receiver: Function) {
        if ('function' !== typeof receiver)  /*验证数据类型*/
            throw new Error('receiver must be function');

        eventName = convertEventNameType(eventName);

        this.eventLevel.addReceiver(eventName, receiver);
        return receiver;
    }

    /**
     * 注册只接收一次的事件监听器
     * 别名 once
     * @param {any | any[]} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
     * @return {function} 返回 receiver
     */
    receiveOnce(eventName: any | any[], receiver: Function) {
        if ('function' !== typeof receiver)  /*验证数据类型*/
            throw new Error('receiver must be function');

        eventName = convertEventNameType(eventName);
        eventName.push(Math.random().toString());  //确保只删除自身

        this.receive(eventName, function (d: any, p: any[]) {
            receiver(d, p);
            this.cancel(eventName);
        }.bind(this));
        return receiver;
    }

    /**
     * 注销数据接收器
     * 别名 off
     * @param {any | any[]} eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @return {undefined}
     */
    cancel(eventName: any | any[]) {
        eventName = convertEventNameType(eventName);
        this.eventLevel.removeReceiver(eventName);
    }

    /**
     * 触发指定的事件接收器
     * 别名 trigger
     * @param {any | any[]} eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param {any} data 要发送的数据
     * @param {Object} _this 要为监听器绑定的this对象
     * @return {undefined}
     */
    send(eventName: any | any[], data: any, _this: Object) {
        eventName = convertEventNameType(eventName);
        this.eventLevel.trigger(eventName, data, _this);
    }
}