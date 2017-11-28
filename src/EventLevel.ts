/**
 * 事件监听器回调函数
 */
export type receiver = (data?: any) => any;

/**
 * 事件层级类
 */
export class EventLevel {

    private readonly _receivers: Set<receiver> = new Set();             //当前层级的事件监听器
    private readonly _children: Map<string, EventLevel> = new Map();    //子层级, key:子层级名称

    /**
     * 获取指定层级，如果不存在就返回空
     * @param levelNameArray 事件层级名称数组
     */
    getLevel(levelNameArray: string[], autoCreateLevel?: false): EventLevel | undefined
    /**
     * 获取指定层级，如果不存在就自动创建
     * @param levelNameArray 事件层级名称数组
     */
    getLevel(levelNameArray: string[], autoCreateLevel?: true): EventLevel
    getLevel(levelNameArray: string[], autoCreateLevel: boolean = false) {
        let level: EventLevel = this;   

        for (const currentName of levelNameArray) {
            let currentLevel = level._children.get(currentName);

            if (currentLevel === undefined) {
                if (autoCreateLevel) {
                    currentLevel = new EventLevel();
                    level._children.set(currentName, currentLevel);
                } else {
                    return undefined;
                }
            }

            level = currentLevel;
        }

        return level;
    }

    /**
     * 添加事件监听器
     * @param levelNameArray 事件层级名称数组
     * @param receiver 事件监听器
     */
    addReceiver(levelNameArray: string[], receiver: receiver) {
        this.getLevel(levelNameArray, true)._receivers.add(receiver);
    }

    /**
     * 移除指定层级上的所有监听器
     * @param levelNameArray 层级名称数组
     */
    removeReceiver(levelNameArray: string[]): void
    /**
     * 移除指定层级上的特定监听器
     * @param levelNameArray 层级名称数组
     * @param receiver 要移除的监听器
     */
    removeReceiver(levelNameArray: string[], receiver: receiver): void
    removeReceiver(levelNameArray: string[], receiver?: receiver) {
        const level = this.getLevel(levelNameArray);

        if (level !== undefined) {
            if (receiver !== undefined)
                level._receivers.delete(receiver);
            else {
                level._receivers.clear();
                level._children.clear();
            }
        }
    }

    /**
     * 触发指定级别以及其子级的事件监听器
     * @param levelNameArray 事件层级名称数组
     * @param data 要给触发的事件监听器传递的数据
     */
    trigger(levelNameArray: string[], data: any) {
        const level = this.getLevel(levelNameArray);

        if (level !== undefined) {
            const triggerChildren = (level: EventLevel) => {
                level._receivers.forEach(item => item(data));
                level._children.forEach(triggerChildren);
            }

            triggerChildren(level);
        }
    }
}