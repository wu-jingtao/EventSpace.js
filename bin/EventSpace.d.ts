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
export declare type EventName = string | string[];
export default class EventSpace<T> {
    /**
     * 每隔多长时间清理一次不再被使用的空层
     */
    private static readonly _gc_interval;
    /**
     * 当当前层有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAddListenerCallback;
    /**
     * 当当前层有事件监听器被删除时触发的回调函数
     */
    private readonly _onRemoveListenerCallback;
    /**
     * 当祖先有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onAncestorsAddListenerCallback;
    /**
     * 当祖先有事件监听器被删除时触发的回调函数
     */
    private readonly _onAncestorsRemoveListenerCallback;
    /**
     * 当后代有新的事件监听器被添加时触发的回调函数
     */
    private readonly _onDescendantsAddListenerCallback;
    /**
     * 当后代有事件监听器被删除时触发的回调函数
     */
    private readonly _onDescendantsRemoveListenerCallback;
    /**
     * 当前层注册的事件监听器
     */
    private readonly _listeners;
    /**
    * 子层, key:子层名称
    */
    readonly children: Map<string, EventSpace<T>>;
    /**
     * 父层。根的父层为undefined
     */
    readonly parent?: EventSpace<T>;
    /**
     * 根
     */
    readonly root: EventSpace<T>;
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
    readonly fullName: string[];
    /**
     * 当前层注册了多少监听器
     */
    readonly listenerCount: number;
    /**
     * 相对于当前层，获取所有祖先上注册了多少监听器。(不包括当前层)
     */
    readonly ancestorsListenerCount: number;
    /**
     * 相对于当前层，获取所有后代上注册了多少监听器。(不包括当前层)
     */
    readonly descendantsListenerCount: number;
    constructor(parent?: EventSpace<T>, name?: string);
    /**
     * 清理不再被使用的层
     */
    private _clearNoLongerUsedLayer();
    /**
     * 将事件名转换成数组的形式
     * 注意：空字符串将会被转换成空数组
     * @param eventName 事件名称
     */
    static convertEventNameType(eventName: EventName): string[];
    /**
     * 根据事件名称获取特定的后代。(不存在会自动创建)
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    get(eventName: EventName): EventSpace<T>;
    /**
     * 循环遍历每一个后代。返回boolean，用于判断遍历是否发生中断
     * 提示：如果把callback作为判断条件，可以将forEachDescendants模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachDescendants(callback: (layer: EventSpace<T>) => void | boolean, includeCurrentLayer?: boolean): boolean;
    /**
     * 循环遍历每一个祖先。返回boolean，用于判断遍历是否发生中断
     * 提示：如果把callback作为判断条件，可以将forEachAncestors模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachAncestors(callback: (layer: EventSpace<T>) => void | boolean, includeCurrentLayer?: boolean): boolean;
    /**
     * 将所有后代保存到一个数组中
     * 注意：后代的数目随时可能会变化，因为可能会有监听器在新的后代上注册
     *
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapDescendants(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[];
    /**
     * 遍历每一个后代，将每一次遍历的结果保存到一个数组中
     * 注意：后代的数目随时可能会变化，因为可能会有监听器在新的后代上注册
     *
     * @param callback 回调
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapDescendants<P>(callback: (layer: EventSpace<T>) => P, includeCurrentLayer?: boolean): P[];
    /**
     * 将所有祖先保存到一个数组中
     * @param callback undefined
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapAncestors(callback?: undefined, includeCurrentLayer?: boolean): EventSpace<T>[];
    /**
     * 遍历每一个祖先，将每一次遍历的结果保存到一个数组中
     * @param callback 回调
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    mapAncestors<P>(callback: (layer: EventSpace<T>) => P, includeCurrentLayer?: boolean): P[];
    /**
     * 累加每一个后代。类似于数组的reduce
     * @param callback 回调
     * @param initial 初始值
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    reduceDescendants<P>(callback: (previous: P, layer: EventSpace<T>) => P, initial: P, includeCurrentLayer?: boolean): P;
    /**
     * 累加每一个祖先。类似于数组的reduce
     * @param callback 回调
     * @param initial 初始值
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    reduceAncestors<P>(callback: (previous: P, layer: EventSpace<T>) => P, initial: P, includeCurrentLayer?: boolean): P;
    /**
     * 根据给定的条件找出一个满足条件的后代
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findDescendant(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined;
    /**
     * 根据给定的条件找出一个满足条件的祖先
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findAncestor(callback: (layer: EventSpace<T>) => boolean, includeCurrentLayer?: boolean): EventSpace<T> | undefined;
    /**
     * 注册事件监听器
     */
    on<P extends Listener<T>>(listener: P): P;
    /**
     * 注册只使用一次的事件监听器。
     * 注意：由于receiveOnce会对传入的listener进行一次包装，所以返回的listener与传入的listener并不相同
     * @param listener 事件监听器
     */
    once(listener: Listener<T>): Listener<T>;
    /**
     * 清除所有事件监听器
     * @param clearDataWhenEmpty 是否同时清理该层的data属性，默认true
     */
    off(listener?: undefined, clearDataWhenEmpty?: boolean): void;
    /**
     * 清除特定的事件监听器
     * @param listener 可以传递一个listener来只清除一个特定的事件监听器
     * @param clearDataWhenEmpty 如果删光了该层的所有监听器，是否清理该层的data属性，默认true
     */
    off(listener: Listener<T>, clearDataWhenEmpty?: boolean): void;
    /**
     * 清理所有后代上的事件监听器
     * @param listener 可以传递一个listener来清除每一个后代上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offDescendants(listener?: Listener<T>, clearDataWhenEmpty?: boolean, includeSelf?: boolean): void;
    /**
     * 清理所有祖先上的事件监听器
     * @param listener 可以传递一个listener来清除每一个祖先上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offAncestors(listener?: Listener<T>, clearDataWhenEmpty?: boolean, includeSelf?: boolean): void;
    /**
     * 触发事件监听器
     * @param data 要传递的数据
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    trigger(data?: any, asynchronous?: boolean): void;
    /**
     * 触发所有后代上的事件监听器
     * @param data 要传递的数据
     * @param includeSelf  可以传递一个boolean来指示是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerDescendants(data?: any, includeSelf?: boolean, asynchronous?: boolean): void;
    /**
     * 触发所有祖先上的事件监听器
     * @param data 要传递的数据
     * @param includeSelf  可以传递一个boolean来指示是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerAncestors(data?: any, includeSelf?: boolean, asynchronous?: boolean): void;
    /**
     * 判断是否注册的有事件监听器
     */
    has(): boolean;
    /**
     * 判断是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     */
    has(listener: Listener<T>): boolean;
    /**
     * 判断后代是否注册的有事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasDescendants(listener?: undefined, includeSelf?: boolean): boolean;
    /**
     * 判断后代是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasDescendants(listener: Listener<T>, includeSelf?: boolean): boolean;
    /**
     * 判断祖先是否注册的有事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasAncestors(listener?: undefined, includeSelf?: boolean): boolean;
    /**
     * 判断祖先是否注册的有特定的事件监听器
     * @param listener 要进行判断的事件监听器
     * @param includeSelf 是否要同时判断自身，默认true
     */
    hasAncestors(listener: Listener<T>, includeSelf?: boolean): boolean;
    /**
     * 当当前层有新的事件监听器被添加时触发
     */
    watch(event: 'addListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 当当前层有事件监听器被删除时触发
     */
    watch(event: 'removeListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 当祖先有新的事件监听器被添加时触发
     */
    watch(event: 'ancestorsAddListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 当祖先有事件监听器被删除时触发
     */
    watch(event: 'ancestorsRemoveListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 当后代有新的事件监听器被添加时触发
     */
    watch(event: 'descendantsAddListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 当后代有事件监听器被删除时触发
     */
    watch(event: 'descendantsRemoveListener', listener: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个addListener监听器
     */
    watchOff(event: 'addListener', listener?: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个removeListener监听器
     */
    watchOff(event: 'removeListener', listener?: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个ancestorsAddListener监听器
     */
    watchOff(event: 'ancestorsAddListener', listener?: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个ancestorsRemoveListener监听器
     */
    watchOff(event: 'ancestorsRemoveListener', listener?: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个descendantsAddListener监听器
     */
    watchOff(event: 'descendantsAddListener', listener?: AddOrRemoveListenerCallback<T>): void;
    /**
     * 清除所有或单个descendantsRemoveListener监听器
     */
    watchOff(event: 'descendantsRemoveListener', listener?: AddOrRemoveListenerCallback<T>): void;
}
