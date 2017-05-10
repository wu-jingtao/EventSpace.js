import EventLevel, { eventname } from "./EventLevel";

/**
 * 转换事件名称的类型
 * @param {eventname | eventname[]} eventName
 */
function convertEventNameType(eventName: eventname | eventname[] = []): eventname[] {
    if ('number' === typeof eventName)          //如果是数字类型就转换成字符串
        eventName = [eventName.toString()];
    else if ('string' === typeof eventName)     //验证eventName的数据类型
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
function receive(this: EventSpace, eventName: eventname | eventname[], receiver: Function) {
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    eventName = convertEventNameType(eventName);

    this.eventLevel.addReceiver(eventName, receiver);
    return receiver;
}

/**
 * 注册只接收一次的事件监听器
 * 别名 once
 * @param {string|Array} eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param {function} receiver 接收到数据后执行的回调函数 ,回调函数接受两个参数（data:数据，eventName:事件的名称数组）
 * @return {function} 返回 receiver
 */
function receiveOnce(this: EventSpace, eventName: eventname | eventname[], receiver: Function) {
    if (typeof receiver !== 'function')  /*验证数据类型*/
        throw new Error('receiver is not a function');

    eventName = convertEventNameType(eventName);
    eventName.push(Math.random().toString());  //确保只删除自身

    this.receive(eventName, function (d: any, p: eventname[]) {
        receiver(d, p);
        this.cancel(eventName);
    }.bind(this));
    return receiver;
}

/**
 * 注销数据接收器
 * 别名 off
 * @param {string|Array} eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @return {undefined}
 */
function cancel(this: EventSpace, eventName: eventname | eventname[]) {
    eventName = convertEventNameType(eventName);
    this.eventLevel.removeReceiver(eventName);
}

/**
 * 触发指定的事件接收器
 * 别名 trigger
 * @param {string|Array} eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
 * @param data 要发送的数据
 * @param _this 要为监听器绑定的this对象
 * @return {undefined}
 */
function send(this: EventSpace, eventName: eventname | eventname[], data: any, _this: Object) {
    eventName = convertEventNameType(eventName);
    this.eventLevel.trigger(eventName, data, _this);
}


/**
 * 对EventLevel的简易封装
 * @constructor
 */
export default class EventSpace {
    //导出一个全局事件空间和一个事件空间类
    readonly eventLevel = new EventLevel();
    readonly EventSpace = EventSpace;

    on: (eventName: eventname | eventname[], receiver: Function) => Function;
    receive: (eventName: eventname | eventname[], receiver: Function) => Function;
    once: (eventName: eventname | eventname[], receiver: Function) => Function;
    receiveOnce: (eventName: eventname | eventname[], receiver: Function) => Function;
    off: (eventName: eventname | eventname[]) => undefined;
    cancel: (eventName: eventname | eventname[]) => undefined;
    trigger: (eventName: eventname | eventname[], data: any, _this: Object) => undefined;
    send: (eventName: eventname | eventname[], data: any, _this: Object) => undefined;

    constructor() {
        this.on = this.receive = receive.bind(this);
        this.once = this.receiveOnce = receiveOnce.bind(this);
        this.off = this.cancel = cancel.bind(this);
        this.trigger = this.send = send.bind(this);
    }
}