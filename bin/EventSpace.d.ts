import { receiver } from "./EventLevel";
export default class EventSpace {
    private readonly _eventLevel;
    /**
     * 注册事件监听器（别名 on）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receive: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    on: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    /**
     * 注册只使用一次的事件监听器（别名 once）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receiveOnce: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    once: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    /**
     * 移除指定的事件层级（别名 off）。可以传递第二个参数来只移除指定的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 要移除的回调函数
     */
    cancel: <T extends receiver>(eventName?: string | string[], receiver?: T | undefined) => void;
    off: <T extends receiver>(eventName?: string | string[], receiver?: T | undefined) => void;
    /**
     * 触发事件监听器（别名 trigger）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要发送的数据
     */
    send: (eventName: string | string[], data?: any) => void;
    trigger: (eventName: string | string[], data?: any) => void;
    /**
     * 检查某个事件名称下是否包含的有监听器。
     * 可以传递一个boolean，判断子级是否包含的有，或者传递一个receiver，判定是否有指定的监听器。
     */
    has: (eventName: string | string[], receiverOrChildren?: boolean | receiver | undefined) => boolean;
}
