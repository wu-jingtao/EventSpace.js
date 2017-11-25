/**
 * 接收器回调函数
 */
export type receiver = (data?: any, eventName?: string[]) => void;

/**
 * 事件层级类
 */
export class EventLevel {

    private readonly _receivers: receiver[] = []; //当前层级的接收器
    private readonly _children = new Map<string, EventLevel>();   //子层级, key:子层级名称

    /**
     * 添加接收器
     * @param levelNameArray 事件层级名字数组
     * @param receiver 监听器
     */
    addReceiver(levelNameArray: string[], receiver: receiver) {  //添加新的监听器
        let level: EventLevel = this;   //查询到的对应层级

        for (const currentName of levelNameArray) {
            const nextLevel = level._children.get(currentName);
            if (nextLevel === undefined) {
                level = new EventLevel();
                level._children.set(currentName, level);
            } else {
                level = nextLevel;
            }
        }

        level._receivers.push(receiver);
    }

    /**
     * 移除指定层级的事件监听器
     * @param levelNameArray 层级名字数组
     */
    removeReceiver(levelNameArray: string[]) {
        let level: EventLevel = this;   //查询到的对应层级

        for (const item of levelNameArray) {
            level = level._children.get(item);
            if (level === undefined) break;
        }

        if (level !== undefined) {
            this._receivers.length = 0;
            this._children.clear();
        }
    }

    /**
     * 判定在指定的事件层级下是否绑定的有监听器
     * @param levelNameArray 层级名字数组
     */
    hasReceiver(levelNameArray: string[]): boolean {
        let level: EventLevel = this;   //查询到的对应层级

        for (const item of levelNameArray) {
            level = level._children.get(item);
            if (level === undefined) break;
        }

        if (level !== undefined) {
            return this._receivers.length > 0 || this._children.size > 0;
        } else {
            return false;
        }
    }

    /**
     * 触发所有指定级别以及子级的监听器
     * @param levelNameArray 事件层级名字数组
     * @param data 要给触发的方法传递的数据
     */
    trigger(levelNameArray: string[], data: any) {
        if (levelNameArray.length === 0) {  //是不是最后一级了,遍历当前级别和子级
            this._receivers.forEach(function (item) {
                item(data);
            });

            this._children.forEach(function (child) {
                child.trigger(levelNameArray, data);
            });
        } else {
            const currentName = levelNameArray.shift();
            const level = this._children.get(currentName);
            if (level !== undefined) level.trigger(levelNameArray, data);
        }
    };
}