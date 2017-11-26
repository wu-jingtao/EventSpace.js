import { receiver } from "./EventLevel";
export default class EventSpace {
    private readonly _eventLevel;
    /**
     * 注册事件监听器（别名 on）
     * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receive: (eventName: string | string[], receiver: receiver) => receiver;
    on: (eventName: string | string[], receiver: receiver) => receiver;
    /**
     * 注册只接收一次的事件监听器（别名 once）
     * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param receiver 回调函数
     */
    receiveOnce: (eventName: string | string[], receiver: receiver) => receiver;
    once: (eventName: string | string[], receiver: receiver) => receiver;
    /**
     * 注销数据接收器（别名 off）
     * @param eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    cancel: (eventName: string | string[]) => void;
    off: (eventName: string | string[]) => void;
    /**
     * 触发指定的事件接收器（别名 trigger）
     * @param eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要发送的数据
     */
    send: (eventName: string | string[], data: any) => void;
    trigger: (eventName: string | string[], data: any) => void;
}
