/**
 * 事件监听器
 */
export interface Listener<T> {

    /**
     * 这个主要是给receiveOnce这种情况使用的，保留一个原始的listener
     */
    _es_original?: (data: any, layer: EventSpace<T>) => any;

    /**
     * @param data 传递的数据
     * @param layer 监听器所在层的引用
     */
    (data: any, layer: EventSpace<T>): any;
}

/**
 * 添加或删除事件监听器回调
 */
export interface AddOrRemoveListenerCallback<T> {
    /**
     * @param listener 发生变化的监听器
     * @param layer 发生变化的层
     */
    (listener: Listener<T>, layer: EventSpace<T>): any;
}

/**
 * 事件名称
 */
export type EventName = string | string[];

/**
 * 将事件名转换成数组的形式    
 * 注意：空字符串将会被转换成空数组
 * @param eventName 事件名称
 */
export function convertEventNameType(eventName: EventName) {
    if (Array.isArray(eventName))
        return eventName;
    else if (eventName === '')
        return [];
    else
        return eventName.split('.');
}

export default class EventSpace<T> {

    //#region 属性与构造

    /**
     * 当前层注册的事件监听器     
     */
    private readonly _listeners: Set<Listener<T>> = new Set();

    /**
     * 当当前层有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当当前层有事件监听器被删除时触发的回调函数
     */
    private readonly _onRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 相对于当前层，当父层有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAncestorsAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 相对于当前层，当父层有事件监听器被删除时触发的回调函数
     */
    private readonly _onAncestorsRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 相对于当前层，当子层有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onDescendantsAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 相对于当前层，当子层有事件监听器被删除时触发的回调函数
     */
    private readonly _onDescendantsRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 父层。根的父层为undefined   
     */
    readonly parent?: EventSpace<T>;

    /**
    * 子层, key:子层名称
    */
    readonly children: Map<string, EventSpace<T>> = new Map();

    /**
     * 当前层的名称。根的名称为空字符串    
     * 注意：以数组表示时，空数组才代表根
     */
    readonly name: string;

    /**
     * 供用户保存一些自定义数据。    
     * 注意：当所在层不再有监听器注册时，data中的数据将被清除
     */
    data?: T;

    /**
     * 获取当前层的完整事件名称。（返回从根到当前层，由每一层的name组成的数组）
     */
    get fullName(): string[] {
        if (this.parent) {
            const result = this.parent.fullName
            result.push(this.name);
            return result;
        } else
            return [];
    }

    /**
     * 当前层注册了多少监听器
     */
    get listenerCount(): number {
        return this._listeners.size;
    }

    /**
     * 相对于当前层，获取所有父层上注册了多少监听器。(不包括当前层)
     */
    get ancestorsListenerCount(): number {
        if (this.parent)
            return this.parent.ancestorsListenerCount + this.parent._listeners.size;
        else
            return 0;
    }

    /**
     * 相对于当前层，获取所有子层上注册了多少监听器。(不包括当前层)
     */
    get descendantsListenerCount(): number {
        let result = 0;

        for (const item of this.children.values()) {
            result += item.descendantsListenerCount + item._listeners.size;
        }

        return result;
    }

    constructor(parent?: EventSpace<T>, name: string = '') {
        this.parent = parent;
        this.name = name;
    }

    //#endregion

    //#region 工具方法

    /**
     * 相对于当前层，根据事件名称获取特定的子层，如果不存在就返回空。
     * @param eventName 事件名称
     */
    getChild(eventName: EventName, autoCreateLayer?: false): EventSpace<T> | undefined
    /**
     * 相对于当前层，根据事件名称获取特定的子层，如果不存在就自动创建。
     * @param eventName 事件名称
     */
    getChild(eventName: EventName, autoCreateLayer: true): EventSpace<T>
    getChild(eventName: EventName, autoCreateLayer?: boolean) {
        let layer: EventSpace<T> = this;

        for (const currentName of convertEventNameType(eventName)) {
            let currentLayer = layer.children.get(currentName);

            if (currentLayer === undefined) {
                if (autoCreateLayer) {
                    currentLayer = new EventSpace<T>(layer, currentName);
                    layer.children.set(currentName, currentLayer);
                } else {
                    return undefined;
                }
            }

            layer = currentLayer;
        }

        return layer;
    }

    /**
     * 相对于当前层，循环遍历每一个子层。返回boolean，用于判断遍历是否发生中断。     
     * 提示：如果把callback作为判断条件，可以将forEachDescendants模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachDescendants(callback: (layer: EventSpace<T>) => void | boolean, includeCurrentLayer: boolean = false): boolean {
        if (includeCurrentLayer)
            if (callback(this)) return true;

        for (const item of this.children.values()) {
            if (item.forEachDescendants(callback, true)) return true;
        }

        return false;
    }

    /**
     * 相对于当前层，循环遍历每一个父层。返回boolean，用于判断遍历是否发生中断。     
     * 提示：如果把callback作为判断条件，可以将forEachAncestors模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachAncestors(callback: (layer: EventSpace<T>) => void | boolean, includeCurrentLayer: boolean = false): boolean {
        if (includeCurrentLayer)
            if (callback(this)) return true;

        if (this.parent)
            return this.parent.forEachAncestors(callback, true);
        else
            return false;
    }

    /**
     * 相对于当前层，将所有子层保存到一个数组中。    
     * 注意：子层的数目随时可能会变化，因为可能会有监听器在新的子层上注册
     * 
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapDescendants(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[]
    /**
     * 相对于当前层，遍历每一个子层，将每一次遍历的结果保存到一个数组中。    
     * 注意：子层的数目随时可能会变化，因为可能会有监听器在新的子层上注册
     * 
     * @param callback 回调
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapDescendants<P>(callback: (layer: EventSpace<T>) => P, includeCurrentLayer?: boolean): P[]
    mapDescendants(callback?: Function, includeCurrentLayer?: boolean): any[] {
        const result: any[] = [];

        this.forEachDescendants(layer => {
            if (callback)
                result.push(callback(layer));
            else
                result.push(layer);
        }, includeCurrentLayer);

        return result;
    }

    /**
     * 相对于当前层，将所有父层保存到一个数组中
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapAncestors(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[]
    /**
     * 相对于当前层，遍历每一个父层，将每一次遍历的结果保存到一个数组中。    
     * @param callback 回调
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapAncestors<P>(callback: (layer: EventSpace<T>) => P, includeCurrentLayer?: boolean): P[]
    mapAncestors(callback?: Function, includeCurrentLayer?: boolean): any[] {
        const result: any[] = [];

        this.forEachAncestors(layer => {
            if (callback)
                result.push(callback(layer));
            else
                result.push(layer);
        }, includeCurrentLayer);

        return result;
    }

    /**
     * 相对于当前层，累加每一个子层。类似于数组的reduce
     * @param callback 回调
     * @param initial 初始值
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    reduceDescendants<P>(callback: (previous: P, layer: EventSpace<T>) => P, initial: P, includeCurrentLayer?: boolean): P {
        let result = initial;

        this.forEachDescendants(layer => { result = callback(result, layer) }, includeCurrentLayer);

        return result;
    }

    /**
     * 相对于当前层，累加每一个父层。类似于数组的reduce
     * @param callback 回调
     * @param initial 初始值
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    reduceAncestors<P>(callback: (previous: P, layer: EventSpace<T>) => P, initial: P, includeCurrentLayer?: boolean): P {
        let result = initial;

        this.forEachAncestors(layer => { result = callback(result, layer) }, includeCurrentLayer);

        return result;
    }

    /**
     * 相对于当前层，根据给定的条件找出一个特定的子层
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findChild(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined {
        let result: EventSpace<T> | undefined;

        this.forEachDescendants(layer => {
            if (callback(layer)) {
                result = layer;
                return true;
            }
        }, includeCurrentLayer);

        return result;
    }

    /**
     * 相对于当前层，根据给定的条件找出一个特定的父层
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findParent(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined {
        let result: EventSpace<T> | undefined;

        this.forEachAncestors(layer => {
            if (callback(layer)) {
                result = layer;
                return true;
            }
        }, includeCurrentLayer);

        return result;
    }

    //#endregion

    //#region 事件操作方法

    /**
     * 注册事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 事件监听器
     */
    receive<P extends Listener<T>>(eventName: EventName, listener: P): P {
        const layer = this.getChild(eventName, true);

        if (layer._listeners.size < layer._listeners.add(listener).size) { //确保有新的监听器被添加
            if (listener._es_original) listener = listener._es_original as any;

            layer._onAddListenerCallback.forEach(cb => cb(listener, layer));
            layer.forEachDescendants(layer => layer._onAncestorsAddListenerCallback.forEach(cb => cb(listener, layer)));
            layer.forEachAncestors(layer => layer._onDescendantsAddListenerCallback.forEach(cb => cb(listener, layer)));
        }

        return listener;
    }

    /**
     * 注册只使用一次的事件监听器
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     * @param listener 事件监听器
     */
    receiveOnce<P extends Listener<T>>(eventName: EventName, listener: P): P {
        const once: Listener<T> = (data, layer) => {
            listener(data, layer);
            layer.cancel([], once);
        };

        once._es_original = listener;

        this.receive(eventName, once);

        return listener;
    }

    /**
     * 清除指定级别的所有事件监听器。可以传递一个listener来只清除一个特定的事件监听器
     * @param eventName 事件名称,可以为字符串或数组(字符串通过‘.’来分割层级)。默认 []
     * @param listener 要清除的特定事件监听器
     */
    cancel(eventName: EventName = [], listener?: Listener<T>): void {
        const layer = this.getChild(eventName);

        if (layer) {
            if (listener) {
                if (layer._listeners.delete(listener)) {
                    if (listener._es_original) listener = listener._es_original;

                    layer._onRemoveListenerCallback.forEach(cb => cb(listener as any, layer));
                    layer.forEachDescendants(layer => layer._onAncestorsRemoveListenerCallback.forEach(cb => cb(listener as any, layer)));
                    layer.forEachAncestors(layer => layer._onDescendantsRemoveListenerCallback.forEach(cb => cb(listener as any, layer)));
                }
            } else {
                layer._listeners.forEach(listener => {
                    layer._listeners.delete(listener);

                    if (listener._es_original) listener = listener._es_original;

                    layer._onRemoveListenerCallback.forEach(cb => cb(listener, layer));
                    layer.forEachDescendants(layer => layer._onAncestorsRemoveListenerCallback.forEach(cb => cb(listener, layer)));
                    layer.forEachAncestors(layer => layer._onDescendantsRemoveListenerCallback.forEach(cb => cb(listener, layer)));
                });
            }
        }
    }

    //#endregion
}