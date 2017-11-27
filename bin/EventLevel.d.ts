/**
 * 接收器回调函数
 */
export declare type receiver = (data?: any) => any;
/**
 * 事件层级类
 */
export declare class EventLevel {
    private readonly _receivers;
    private readonly _children;
    getLevel(levelNameArray: string[], autoCreateLevel?: false): EventLevel | undefined;
    getLevel(levelNameArray: string[], autoCreateLevel?: true): EventLevel;
    /**
     * 添加接收器
     * @param levelNameArray 事件层级名字数组
     * @param receiver 监听器
     */
    addReceiver(levelNameArray: string[], receiver: receiver): void;
    /**
     * 移除指定层级的事件监听器。还可以传递一个监听器来确保只删除它自身。
     * @param levelNameArray 层级名字数组
     * @param receiver 要删除的监听器
     */
    removeReceiver(levelNameArray: string[], receiver?: receiver): void;
    /**
     * 触发所有指定级别以及子级的监听器
     * @param levelNameArray 事件层级名字数组
     * @param data 要给触发的方法传递的数据
     */
    trigger(levelNameArray: string[], data: any): void;
}
