/**
 * 接收器回调函数
 */
export type receiver = (data?: any, eventName?: string[]) => void;

/**
 * 事件层级类
 */
export class EventLevel {

    private readonly _receivers: Set<receiver> = new Set();           //当前层级的接收器
    private readonly _children: Map<string, EventLevel> = new Map();    //子层级, key:子层级名称


    getLevel(levelNameArray: string[], autoCreateLevel?: false): EventLevel | undefined
    getLevel(levelNameArray: string[], autoCreateLevel?: true): EventLevel
    /**
     * 获取指定层级
     * @param levelNameArray 事件层级名字数组
     * @param autoCreateLevel 是否自动创建不存在的层级，默认false
     */
    getLevel(levelNameArray: string[], autoCreateLevel: boolean = false) {
        let level: EventLevel = this;   //查询到的对应层级

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
     * 添加接收器
     * @param levelNameArray 事件层级名字数组
     * @param receiver 监听器
     */
    addReceiver(levelNameArray: string[], receiver: receiver) {  //添加新的监听器
        this.getLevel(levelNameArray, true)._receivers.add(receiver);
    }

    /**
     * 移除指定层级的事件监听器
     * @param levelNameArray 层级名字数组
     */
    removeReceiver(levelNameArray: string[]) {
        const level = this.getLevel(levelNameArray);

        if (level !== undefined) {
            this._receivers.clear();
            this._children.clear();
        }
    }

    /**
     * 判定在指定的事件层级下是否绑定的有监听器
     * @param levelNameArray 层级名字数组
     */
    hasReceiver(levelNameArray: string[]): boolean {
        const level = this.getLevel(levelNameArray);

        if (level !== undefined) {
            return this._receivers.size > 0 || this._children.size > 0;
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
        const level = this.getLevel(levelNameArray);

        if (level !== undefined) {
            level._receivers.forEach(function (item) {
                item(data);
            });

            level._children.forEach(function (child) {
                child.trigger([], data);
            });
        }
    };
}