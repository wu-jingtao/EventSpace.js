import { receiver } from "./EventLevel";
export default class EventSpace {
    private readonly _eventLevel;
    /**
     * 注册事件监听器（别名 on）
     * @param eventName 接收事件的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receive: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    on: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    /**
     * 注册只接收一次的事件监听器（别名 once）
     * @param eventName 接收事件的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receiveOnce: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    once: <T extends receiver>(eventName: string | string[], receiver: T) => T;
    /**
     * 移除指定层级上的数据接收器（别名 off）。可以传递第二个参数来确保只移除指定的接收器
     * @param eventName 移除事件接收器的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 要移除的回调函数
     */
    cancel: <T extends receiver>(eventName: string | string[], receiver?: T | undefined) => T | undefined;
    off: <T extends receiver>(eventName: string | string[], receiver?: T | undefined) => T | undefined;
    /**
     * 触发指定的事件接收器（别名 trigger）
     * @param eventName 要触发的事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要发送的数据
     */
    send: (eventName: string | string[], data?: any) => void;
    trigger: (eventName: string | string[], data?: any) => void;
}
