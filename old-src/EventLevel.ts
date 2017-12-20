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
    readonly receivers: Set<(data: any, currentLevel: EventLevel<T>) => any> = new Set();

    /**
     * 供用户保存一些自定义数据
     */
    data?: T;

    /**
     * 获取当前层的完整事件名称
     */
    get fullName(): string[] {
        if (this.parent) {
            const result = this.parent.fullName
            result.push(this.name);
            return result;
        } else
            return [];
    }

    constructor(
        /**
         * 当前层级的名称。根的名称为空字符串
         */
        readonly name: string,

        /**
         * 父层。根的父层为undefined   
         */
        readonly parent?: EventLevel<T>
    ) { }
}