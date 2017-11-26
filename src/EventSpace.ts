import { EventLevel, receiver } from "./EventLevel";

/**
 * 根据规则将事件名转换成数组的形式
 * @param eventName 事件名称
 */
function convertEventNameType(eventName: string | string[]): string[] {
    if ('string' === typeof eventName)
        return eventName.length === 0 ? [] : eventName.split('.');  //避免空字符串返回[""]
    else
        return eventName;
}

export default class EventSpace {

    private readonly _eventLevel = new EventLevel();

    /**
     * 注册事件监听器（别名 on）
     * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receive = (eventName: string | string[], receiver: receiver) => {
        if ('function' !== typeof receiver)  /*验证数据类型*/
            throw new Error('receiver must be function');

        this._eventLevel.addReceiver(convertEventNameType(eventName), receiver);

        return receiver;
    }
    on = this.receive;

    /**
     * 注册只接收一次的事件监听器（别名 once）
     * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receiveOnce = (eventName: string | string[], receiver: receiver) => {
        if ('function' !== typeof receiver)  /*验证数据类型*/
            throw new Error('receiver must be function');

        const en = convertEventNameType(eventName);
        en.push(Math.random().toString());  //确保只删除自身

        this._eventLevel.addReceiver(en, (data) => {
            receiver(data);
            this._eventLevel.removeReceiver(en);
        });

        return receiver;
    }
    once = this.receiveOnce;

    /**
     * 注销数据接收器（别名 off）
     * @param eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    cancel = (eventName: string | string[]) => {
        this._eventLevel.removeReceiver(convertEventNameType(eventName));
    }
    off = this.cancel;

    /**
     * 触发指定的事件接收器（别名 trigger）
     * @param eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要发送的数据
     */
    send = (eventName: string | string[], data: any) => {
        this._eventLevel.trigger(convertEventNameType(eventName), data);
    }
    trigger = this.send;
}