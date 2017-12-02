import { Listener } from "./ListenerType";
export interface EventSpaceType {
    /**
     * 注册事件监听器（别名 on）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 事件监听器
     */
    receive<T extends Listener>(eventName: string | string[], listener: T): T;
    on: EventSpaceType['receive'];
    /**
     * 注册只使用一次的事件监听器（别名 once）
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 事件监听器
     */
    receiveOnce<T extends Listener>(eventName: string | string[], listener: T): T;
    once: EventSpaceType['receiveOnce'];
    /**
     * 清除所有事件监听器
     */
    cancel(): void;
    /**
     * 清除指定级别的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param includeChildren 是否同时清除子级，默认true
     */
    cancel(eventName: string | string[], includeChildren?: boolean): void;
    /**
     * 清除指定级别的特定事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 要清除的特定事件监听器
     */
    cancel(eventName: string | string[], listener: Listener): void;
    off: EventSpaceType['cancel'];
    /**
     * 清除从根到指定级别在内的所有事件监听器。跟cancel的方向正好相反
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    cancelReverse(eventName: string | string[]): void;
    offReverse: EventSpaceType['cancelReverse'];
    /**
     * 触发指定级别的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要传递的数据
     * @param includeChildren 是否同时要触发其子级，默认true
     * @param asynchronous 是否异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    trigger(eventName: string | string[], data?: any, includeChildren?: boolean, asynchronous?: boolean): void;
    send: EventSpaceType['trigger'];
    /**
     * 触发从根到指定级别在内的所有事件监听器。跟trigger的方向正好相反。注意，监听器执行的顺序是先从根开始。
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要传递的数据
     * @param asynchronous 是否异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerReverse(eventName: string | string[], data?: any, asynchronous?: boolean): void;
    sendReverse: EventSpaceType['triggerReverse'];
    /**
     * 判断指定级别是否注册的有事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param includeChildren 是否包含其子级，默认true
     */
    has(eventName: string | string[], includeChildren?: boolean): boolean;
    /**
     * 判断指定级别是否注册的有特定事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 事件监听器
     */
    has(eventName: string | string[], listener: Listener): boolean;
    /**
     * 判断从根到指定级别在内是否注册的有事件监听器。跟has的方向正好相反。
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    hasReverse(eventName: string | string[]): boolean;
}
