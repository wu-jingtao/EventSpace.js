import { Listener } from "../interfaces/ListenerType";

/**
 * 事件层
 */
export class EventLevel {
    /**
     * 父层。根的父层为undefined   
     */
    readonly parent?: EventLevel;

    /**
     * 子层, key:子层名称
     */
    readonly children: Map<string, EventLevel> = new Map();

    /**
     * 当前层的事件监听器
     */
    readonly receivers: Set<Listener> = new Set();

    constructor(parent?: EventLevel) {
        this.parent = parent;
    }

    /**
     * 相对当前层，根据层名称数组获取子层，如果不存在就返回空
     * @param levelNameArray 层名称数组
     */
    getChild(levelNameArray: string[], autoCreateLevel: false): EventLevel | undefined
    /**
     * 相对当前层，根据层名称数组获取子层，如果不存在就自动创建
     * @param levelNameArray 层名称数组
     */
    getChild(levelNameArray: string[], autoCreateLevel: true): EventLevel
    getChild(levelNameArray: string[], autoCreateLevel: boolean) {
        let level: EventLevel = this;

        for (const currentName of levelNameArray) {
            let currentLevel = level.children.get(currentName);

            if (currentLevel === undefined) {
                if (autoCreateLevel) {
                    currentLevel = new EventLevel(level);
                    level.children.set(currentName, currentLevel);
                } else {
                    return undefined;
                }
            }

            level = currentLevel;
        }

        return level;
    }
}