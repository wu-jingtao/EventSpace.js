/**
 * 事件监听器回调函数
 */
export type Listener = (data?: any) => any;

/**
 * 事件层
 */
export class EventLevel<T> {

    /**
     * 子层, key:子层名称
     */
    readonly children: Map<string, EventLevel<T>> = new Map();

    /**
     * 当前层注册的事件监听器
     */
    readonly receivers: Set<Listener> = new Set();

    /**
     * 供用户保存一些自定义数据
     */
    data: T;

    constructor(
        /**
         * 父层。根的父层为undefined   
         */
        readonly parent?: EventLevel<T>
    ) { }
}