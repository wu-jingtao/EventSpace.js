/**
 * 事件监听器
 */
export interface Listener<T> {
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

export default class EventSpace<T> {

    //#region 属性与构造

    /**
     * 每隔多长时间清理一次不再被使用的空层
     */
    private static readonly _gc_interval = 60 * 1000;

    /**
     * 当当前层有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当当前层有事件监听器被删除时触发的回调函数
     */
    private readonly _onRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当祖先有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAncestorsAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当祖先有事件监听器被删除时触发的回调函数
     */
    private readonly _onAncestorsRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当后代有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onDescendantsAddListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当后代有事件监听器被删除时触发的回调函数
     */
    private readonly _onDescendantsRemoveListenerCallback: Set<AddOrRemoveListenerCallback<T>> = new Set();

    /**
     * 当前层注册的事件监听器     
     */
    private readonly _listeners: Set<Listener<T>> = new Set();
    
    /**
    * 子层, key:子层名称
    */
    readonly children: Map<string, EventSpace<T>> = new Map();

    /**
     * 父层。根的父层为undefined   
     */
    readonly parent?: EventSpace<T>;

    /**
     * 当前层的名称。根的名称为空字符串    
     * 注意：以数组表示时，空数组才代表根
     */
    readonly name: string;

    /**
     * 供用户保存一些自定义数据。    
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
     * 相对于当前层，获取所有祖先上注册了多少监听器。(不包括当前层)
     */
    get ancestorsListenerCount(): number {
        if (this.parent)
            return this.parent.ancestorsListenerCount + this.parent._listeners.size;
        else
            return 0;
    }

    /**
     * 相对于当前层，获取所有后代上注册了多少监听器。(不包括当前层)
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

        //-------- 清理不再被使用的层 ---------
        if (this.parent === undefined && this.name === '') {    //确保是根
            let nextClearTime = (new Date).getTime() + EventSpace._gc_interval;   //下一次清理的最早时间
            this.watch('descendantsRemoveListener', () => {
                if ((new Date).getTime() > nextClearTime) {
                    this._clearNoLongerUsedLayer();
                    nextClearTime = (new Date).getTime() + EventSpace._gc_interval;
                }
            });
        }
    }

    //#endregion

    //#region 工具方法

    /**
     * 清理不再被使用的层
     */
    private _clearNoLongerUsedLayer() {
        this.children.forEach(item => item._clearNoLongerUsedLayer());

        if (this.parent) {
            const needClear =
                this.children.size === 0 &&
                this._listeners.size === 0 &&
                this._onAddListenerCallback.size === 0 &&
                this._onRemoveListenerCallback.size === 0 &&
                this._onAncestorsAddListenerCallback.size === 0 &&
                this._onAncestorsRemoveListenerCallback.size === 0 &&
                this._onDescendantsAddListenerCallback.size === 0 &&
                this._onDescendantsRemoveListenerCallback.size === 0 &&
                this.data === undefined;

            if (needClear)
                this.parent.children.delete(this.name);
        }
    }

    /**
     * 将事件名转换成数组的形式    
     * 注意：空字符串将会被转换成空数组
     * @param eventName 事件名称
     */
    static convertEventNameType(eventName: EventName) {
        if (Array.isArray(eventName))
            return eventName;
        else if (eventName === '')
            return [];
        else
            return eventName.split('.');
    }

    /**
     * 根据事件名称获取特定的后代。(不存在会自动创建)
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    get(eventName: EventName): EventSpace<T> {
        let layer: EventSpace<T> = this;

        for (const currentName of EventSpace.convertEventNameType(eventName)) {
            let currentLayer = layer.children.get(currentName);

            if (currentLayer === undefined) {
                currentLayer = new EventSpace<T>(layer, currentName);
                layer.children.set(currentName, currentLayer);
            }

            layer = currentLayer;
        }

        return layer;
    }

    /**
     * 循环遍历每一个后代。返回boolean，用于判断遍历是否发生中断     
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
     * 循环遍历每一个祖先。返回boolean，用于判断遍历是否发生中断     
     * 提示：如果把callback作为判断条件，可以将forEachAncestors模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachAncestors(callback: (layer: EventSpace<T>) => void | boolean, includeCurrentLayer: boolean = false): boolean {
        if (includeCurrentLayer)
            if (callback(this)) return true;

        if (this.parent)
            return this.parent.forEachAncestors(callback, true);

        return false;
    }

    /**
     * 将所有后代保存到一个数组中    
     * 注意：后代的数目随时可能会变化，因为可能会有监听器在新的后代上注册
     * 
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapDescendants(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[]
    /**
     * 遍历每一个后代，将每一次遍历的结果保存到一个数组中    
     * 注意：后代的数目随时可能会变化，因为可能会有监听器在新的后代上注册
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
     * 将所有祖先保存到一个数组中
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapAncestors(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[]
    /**
     * 遍历每一个祖先，将每一次遍历的结果保存到一个数组中    
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
     * 累加每一个后代。类似于数组的reduce
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
     * 累加每一个祖先。类似于数组的reduce
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
     * 根据给定的条件找出一个满足条件的后代
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findDescendant(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined {
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
     * 根据给定的条件找出一个满足条件的祖先
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findAncestor(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined {
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
     */
    on<P extends Listener<T>>(listener: P): P {
        if (this._listeners.size < this._listeners.add(listener).size) { //确保有新的监听器被添加
            this._onAddListenerCallback.forEach(cb => cb(listener, this));
            this.forEachDescendants(layer => layer._onAncestorsAddListenerCallback.forEach(cb => cb(listener, this)));
            this.forEachAncestors(layer => layer._onDescendantsAddListenerCallback.forEach(cb => cb(listener, this)));
        }

        return listener;
    }

    /**
     * 注册只使用一次的事件监听器。    
     * 注意：由于receiveOnce会对传入的listener进行一次包装，所以返回的listener与传入的listener并不相同
     * @param listener 事件监听器
     */
    once(listener: Listener<T>): Listener<T> {
        return this.on(function once(data, layer) {
            listener(data, layer);
            layer.off(once);
        });
    }

    /**
     * 清除所有事件监听器
     * @param clearDataWhenEmpty 是否同时清理该层的data属性，默认true
     */
    off(listener?: undefined, clearDataWhenEmpty?: boolean): void
    /**
     * 清除特定的事件监听器
     * @param listener 可以传递一个listener来只清除一个特定的事件监听器
     * @param clearDataWhenEmpty 如果删光了该层的所有监听器，是否清理该层的data属性，默认true
     */
    off(listener: Listener<T>, clearDataWhenEmpty?: boolean): void
    off(listener?: Listener<T>, clearDataWhenEmpty: boolean = true): void {
        if (listener) {
            if (this._listeners.delete(listener)) {
                this._onRemoveListenerCallback.forEach(cb => cb(listener, this));
                this.forEachDescendants(layer => layer._onAncestorsRemoveListenerCallback.forEach(cb => cb(listener, this)));
                this.forEachAncestors(layer => layer._onDescendantsRemoveListenerCallback.forEach(cb => cb(listener, this)));
            }
        } else {
            this._listeners.forEach(listener => {
                this._listeners.delete(listener);
                this._onRemoveListenerCallback.forEach(cb => cb(listener, this));
                this.forEachDescendants(layer => layer._onAncestorsRemoveListenerCallback.forEach(cb => cb(listener, this)));
                this.forEachAncestors(layer => layer._onDescendantsRemoveListenerCallback.forEach(cb => cb(listener, this)));
            });
        }

        if (clearDataWhenEmpty && this._listeners.size === 0)
            this.data = undefined;
    }

    /**
     * 清理所有后代上的事件监听器
     * @param listener 可以传递一个listener来清除每一个后代上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offDescendants(listener?: Listener<T>, clearDataWhenEmpty?: boolean, includeSelf: boolean = true): void {
        this.forEachDescendants(layer => layer.off(listener as any, clearDataWhenEmpty), includeSelf);
    }

    /**
     * 清理所有祖先上的事件监听器
     * @param listener 可以传递一个listener来清除每一个祖先上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offAncestors(listener?: Listener<T>, clearDataWhenEmpty?: boolean, includeSelf: boolean = true): void {
        this.forEachAncestors(layer => layer.off(listener as any, clearDataWhenEmpty), includeSelf);
    }

    /**
     * 触发事件监听器
     * @param data 要传递的数据
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    trigger(data?: any, asynchronous?: boolean): void {
        this._listeners.forEach(item => {
            if (asynchronous)
                setTimeout(item, 0, data, this);
            else
                item(data, this);
        });
    }

    /**
     * 触发所有后代上的事件监听器
     * @param data 要传递的数据
     * @param includeSelf  可以传递一个boolean来指示是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerDescendants(data?: any, includeSelf: boolean = true, asynchronous?: boolean): void {
        this.forEachDescendants(layer => layer.trigger(data, asynchronous), includeSelf);
    }

    /**
     * 触发所有祖先上的事件监听器
     * @param data 要传递的数据
     * @param includeSelf  可以传递一个boolean来指示是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerAncestors(data?: any, includeSelf: boolean = true, asynchronous?: boolean): void {
        this.forEachAncestors(layer => layer.trigger(data, asynchronous), includeSelf);
    }

    /**
     * 判断是否注册的有事件监听器
     */
    has(): boolean
    /**
     * 判断是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     */
    has(listener: Listener<T>): boolean
    has(listener?: Listener<T>): boolean {
        if (listener)
            return this._listeners.has(listener);
        else
            return this._listeners.size > 0;
    }

    /**
     * 判断后代是否注册的有事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasDescendants(listener?: undefined, includeSelf?: boolean): boolean
    /**
     * 判断后代是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasDescendants(listener: Listener<T>, includeSelf?: boolean): boolean
    hasDescendants(listener?: any, includeSelf: boolean = true): boolean {
        return this.forEachDescendants(layer => layer.has(listener), includeSelf);
    }

    /**
     * 判断祖先是否注册的有事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasAncestors(listener?: undefined, includeSelf?: boolean): boolean
    /**
     * 判断祖先是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasAncestors(listener: Listener<T>, includeSelf?: boolean): boolean
    hasAncestors(listener?: any, includeSelf: boolean = true): boolean {
        return this.forEachAncestors(layer => layer.has(listener), includeSelf);
    }

    //#endregion

    //#region 注册监听监听器变化的回调函数

    /**
     * 当当前层有新的事件监听器被添加时触发
     */
    watch(event: 'addListener', listener: AddOrRemoveListenerCallback<T>): void
    /**
     * 当当前层有事件监听器被删除时触发
     */
    watch(event: 'removeListener', listener: AddOrRemoveListenerCallback<T>): void
    /**
     * 当祖先有新的事件监听器被添加时触发
     */
    watch(event: 'ancestorsAddListener', listener: AddOrRemoveListenerCallback<T>): void
    /**
     * 当祖先有事件监听器被删除时触发
     */
    watch(event: 'ancestorsRemoveListener', listener: AddOrRemoveListenerCallback<T>): void
    /**
     * 当后代有新的事件监听器被添加时触发
     */
    watch(event: 'descendantsAddListener', listener: AddOrRemoveListenerCallback<T>): void
    /**
     * 当后代有事件监听器被删除时触发
     */
    watch(event: 'descendantsRemoveListener', listener: AddOrRemoveListenerCallback<T>): void
    watch(event: string, listener: AddOrRemoveListenerCallback<T>): void {
        switch (event) {
            case 'addListener':
                this._onAddListenerCallback.add(listener);
                break;
            case 'removeListener':
                this._onRemoveListenerCallback.add(listener);
                break;
            case 'ancestorsAddListener':
                this._onAncestorsAddListenerCallback.add(listener);
                break;
            case 'ancestorsRemoveListener':
                this._onAncestorsRemoveListenerCallback.add(listener);
                break;
            case 'descendantsAddListener':
                this._onDescendantsAddListenerCallback.add(listener);
                break;
            case 'descendantsRemoveListener':
                this._onDescendantsRemoveListenerCallback.add(listener);
                break;
        }
    }

    /**
     * 清除所有或单个addListener监听器
     */
    watchOff(event: 'addListener', listener?: AddOrRemoveListenerCallback<T>): void
    /**
     * 清除所有或单个removeListener监听器
     */
    watchOff(event: 'removeListener', listener?: AddOrRemoveListenerCallback<T>): void
    /**
     * 清除所有或单个ancestorsAddListener监听器
     */
    watchOff(event: 'ancestorsAddListener', listener?: AddOrRemoveListenerCallback<T>): void
    /**
     * 清除所有或单个ancestorsRemoveListener监听器
     */
    watchOff(event: 'ancestorsRemoveListener', listener?: AddOrRemoveListenerCallback<T>): void
    /**
     * 清除所有或单个descendantsAddListener监听器
     */
    watchOff(event: 'descendantsAddListener', listener?: AddOrRemoveListenerCallback<T>): void
    /**
     * 清除所有或单个descendantsRemoveListener监听器
     */
    watchOff(event: 'descendantsRemoveListener', listener?: AddOrRemoveListenerCallback<T>): void
    watchOff(event: string, listener?: AddOrRemoveListenerCallback<T>): void {
        switch (event) {
            case 'addListener':
                if (listener)
                    this._onAddListenerCallback.delete(listener);
                else
                    this._onAddListenerCallback.clear();
                break;
            case 'removeListener':
                if (listener)
                    this._onRemoveListenerCallback.delete(listener);
                else
                    this._onRemoveListenerCallback.clear();
                break;
            case 'ancestorsAddListener':
                if (listener)
                    this._onAncestorsAddListenerCallback.delete(listener);
                else
                    this._onAncestorsAddListenerCallback.clear();
                break;
            case 'ancestorsRemoveListener':
                if (listener)
                    this._onAncestorsRemoveListenerCallback.delete(listener);
                else
                    this._onAncestorsRemoveListenerCallback.clear();
                break;
            case 'descendantsAddListener':
                if (listener)
                    this._onDescendantsAddListenerCallback.delete(listener);
                else
                    this._onDescendantsAddListenerCallback.clear();
                break;
            case 'descendantsRemoveListener':
                if (listener)
                    this._onDescendantsRemoveListenerCallback.delete(listener);
                else if (this.parent)
                    this._onDescendantsRemoveListenerCallback.clear();
                else {
                    //这样做是为了避免删除root的_clearNoLongerUsedLayer
                    const root = this._onDescendantsRemoveListenerCallback.values().next().value;
                    this._onDescendantsRemoveListenerCallback.clear();
                    this._onDescendantsRemoveListenerCallback.add(root);
                }
                break;
        }
    }

    //#endregion
}