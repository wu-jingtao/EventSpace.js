/**
 * 事件监听器回调函数
 */
export declare type receiver = (data?: any) => any;
/**
 * 事件层级类
 */
export declare class EventLevel {
    private readonly _receivers;
    private readonly _children;
    /**
     * 获取指定层级，如果不存在就返回空
     * @param levelNameArray 事件层级名称数组
     */
    private getLevel(levelNameArray, autoCreateLevel?);
    /**
     * 获取指定层级，如果不存在就自动创建
     * @param levelNameArray 事件层级名称数组
     */
    private getLevel(levelNameArray, autoCreateLevel?);
    /**
     * 添加事件监听器
     * @param levelNameArray 事件层级名称数组
     * @param receiver 事件监听器
     */
    addReceiver(levelNameArray: string[], receiver: receiver): void;
    /**
     * 移除指定层级上的所有监听器
     * @param levelNameArray 层级名称数组
     */
    removeReceiver(levelNameArray: string[]): void;
    /**
     * 移除指定层级上的特定监听器
     * @param levelNameArray 层级名称数组
     * @param receiver 要移除的监听器
     */
    removeReceiver(levelNameArray: string[], receiver: receiver): void;
    /**
     * 检查特定级别上是否包含的有监听器
     * @param levelNameArray 层级名称数组
     * @param receiver 检查是否有指定的监听器
     */
    hasReceiver(levelNameArray: string[], receiver?: receiver): boolean;
    /**
     * 检查特定级别上是否包含的有监听器
     * @param levelNameArray 层级名称数组
     * @param includeChildren 是否包含子级，默认false
     */
    hasReceiver(levelNameArray: string[], includeChildren?: boolean): boolean;
    /**
     * 触发指定级别以及其子级的事件监听器
     * @param levelNameArray 事件层级名称数组
     * @param data 要给触发的事件监听器传递的数据
     */
    trigger(levelNameArray: string[], data: any): void;
}
