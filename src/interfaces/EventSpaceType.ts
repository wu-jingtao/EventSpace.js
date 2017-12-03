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
     * 清除指定级别的所有事件监听器。可以传递一个listener来只清除一个特定的事件监听器
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。默认 []
     * @param listener 要清除的特定事件监听器
     */
    cancel(eventName?: string | string[], listener?: Listener): void;
    off: EventSpaceType['cancel'];

    /**
     * 清理指定级别的所有下级的事件监听器。可以传递一个includeSelf来指示是否要同时清除自身的事件监听器，默认true。
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。默认 []
     * @param includeSelf 是否要同时清除自身的事件监听器，默认true
     */
    cancelDescendants(eventName?: string | string[], includeSelf?: boolean): void;
    offDescendants: EventSpaceType['cancelDescendants'];

    /**
     * 清除指定级别的所有上级的事件监听器。可以传递一个includeSelf来指示是否要同时清除自身的事件监听器，默认true。
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。默认 []
     * @param includeSelf 是否要同时清除自身的事件监听器，默认true
     */
    cancelAncestors(eventName?: string | string[], includeSelf?: boolean): void;
    offAncestors: EventSpaceType['cancelAncestors'];

    /**
     * 触发指定级别的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要传递的数据
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    trigger(eventName: string | string[], data?: any, asynchronous?: boolean): void;
    send: EventSpaceType['trigger'];

    /**
     * 触发指定级别的所有下级的事件监听器。可以传递一个includeSelf来指示是否要同时触发自身的事件监听器，默认true。
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要传递的数据
     * @param includeSelf 是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerDescendants(eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean): void;
    sendDescendants: EventSpaceType['triggerDescendants'];

    /**
     * 触发从根到指定级别的所有事件监听器。注意，监听器执行的顺序是先从根开始。可以传递一个includeSelf来指示是否要同时触发自身的事件监听器，默认true。
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param data 要传递的数据
     * @param includeSelf 是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerAncestors(eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean): void;
    sendAncestors: EventSpaceType['triggerAncestors'];

    /**
     * 判断指定级别是否注册的有事件监听器。可以传递一个listener来判断是否注册的有特定事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 要进行判断的特定事件监听器
     */
    has(eventName: string | string[], listener?: Listener): boolean;

    /**
     * 判断指定级别的下级是否注册的有事件监听器。可以传递一个includeSelf来指示是否要同时判断自身，默认true。
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。
     * @param includeSelf 指示是否要同时判断自身，默认true。
     */
    hasDescendants(eventName: string | string[], includeSelf?: boolean): boolean;

    /**
     * 判断指定级别的上级是否注册的有事件监听器。可以传递一个includeSelf来指示是否要同时判断自身，默认true。
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。
     * @param includeSelf 指示是否要同时判断自身，默认true。
     */
    hasAncestors(eventName: string | string[], includeSelf?: boolean): boolean;
}