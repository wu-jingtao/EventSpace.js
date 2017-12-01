import { EventLevel, receiver } from "./EventLevel";

/**
 * 根据规则将事件名转换成数组的形式
 * @param eventName 事件名称
 */
function convertEventNameType(eventName: string | string[]) {
    return 'string' === typeof eventName ? eventName.split('.') : eventName;
}

export default class EventSpace {

    private readonly _eventLevel = new EventLevel();

    /**
     * 注册事件监听器（别名 on）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receive = <T extends receiver>(eventName: string | string[], receiver: T) => {
        if ('function' !== typeof receiver)
            throw new Error('receiver must be a function');

        this._eventLevel.addReceiver(convertEventNameType(eventName), receiver);

        return receiver;
    }
    on = this.receive;

    /**
     * 注册只使用一次的事件监听器（别名 once）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receiveOnce = <T extends receiver>(eventName: string | string[], receiver: T) => {
        if ('function' !== typeof receiver)
            throw new Error('receiver must be a function');

        const level = convertEventNameType(eventName);

        const once: receiver = (data) => {
            receiver(data);
            this._eventLevel.removeReceiver(level, once);
        }

        this._eventLevel.addReceiver(level, once);

        return receiver;
    }
    once = this.receiveOnce;

    /**
     * 移除指定的事件层级（别名 off）。可以传递第二个参数来只移除指定的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 要移除的回调函数
     */
    cancel = <T extends receiver>(eventName: string | string[] = [], receiver?: T) => {
        this._eventLevel.removeReceiver(convertEventNameType(eventName), receiver as any);
    }
    off = this.cancel;

    /**
     * 触发事件监听器（别名 trigger）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要发送的数据
     */
    send = (eventName: string | string[], data?: any) => {
        this._eventLevel.trigger(convertEventNameType(eventName), data);
    }
    trigger = this.send;

    /**
     * 检查某个事件名称下是否包含的有监听器。
     * 可以传递一个boolean，判断子级是否包含的有，或者传递一个receiver，判定是否有指定的监听器。
     */
    has = (eventName: string | string[], receiverOrChildren?: receiver | boolean) => {
        return this._eventLevel.hasReceiver(convertEventNameType(eventName), receiverOrChildren as any);
    }
}