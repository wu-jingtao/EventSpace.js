"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventSpace {
    constructor(parent, name = '') {
        /**
         * 每当当前层有新的事件监听器被添加时触发的回调函数
         */
        this._onAddListenerCallback = new Set();
        /**
         * 每当当前层有事件监听器被删除时触发的回调函数
         */
        this._onRemoveListenerCallback = new Set();
        /**
         * 每当祖先有新的事件监听器被添加时触发的回调函数
         */
        this._onAncestorsAddListenerCallback = new Set();
        /**
         * 每当祖先有事件监听器被删除时触发的回调函数
         */
        this._onAncestorsRemoveListenerCallback = new Set();
        /**
         * 每当后代有新的事件监听器被添加时触发的回调函数
         */
        this._onDescendantsAddListenerCallback = new Set();
        /**
         * 每当后代有事件监听器被删除时触发的回调函数
         */
        this._onDescendantsRemoveListenerCallback = new Set();
        /**
         * 当前层注册的事件监听器
         */
        this._listeners = new Set();
        /**
        * 子层, key:子层名称
        */
        this.children = new Map();
        this.parent = parent;
        this.name = name;
        this.root = parent ? parent.root : this;
        //-------- 清理不再被使用的层 ---------
        if (this.parent === undefined && this.name === '') {
            let nextClearTime = Date.now() + EventSpace._gc_interval; //下一次清理的最早时间
            this.watch('descendantsRemoveListener', () => {
                if (Date.now() > nextClearTime) {
                    this._clearNoLongerUsedLayer();
                    nextClearTime = Date.now() + EventSpace._gc_interval;
                }
            });
        }
    }
    /**
     * 获取当前层的完整事件名称。（返回从根到当前层，由每一层的name组成的数组）
     */
    get fullName() {
        if (this.parent) {
            const result = this.parent.fullName;
            result.push(this.name);
            return result;
        }
        else
            return [];
    }
    /**
     * 当前层注册了多少监听器
     */
    get listenerCount() {
        return this._listeners.size;
    }
    /**
     * 相对于当前层，获取所有祖先上注册了多少监听器。(不包括当前层)
     */
    get ancestorsListenerCount() {
        if (this.parent)
            return this.parent.ancestorsListenerCount + this.parent._listeners.size;
        else
            return 0;
    }
    /**
     * 相对于当前层，获取所有后代上注册了多少监听器。(不包括当前层)
     */
    get descendantsListenerCount() {
        let result = 0;
        for (const item of this.children.values()) {
            result += item.descendantsListenerCount + item._listeners.size;
        }
        return result;
    }
    //#endregion
    //#region 工具方法
    /**
     * 清理不再被使用的层
     */
    _clearNoLongerUsedLayer() {
        this.children.forEach(item => item._clearNoLongerUsedLayer());
        if (this.parent) {
            const needClear = this.children.size === 0 &&
                this._listeners.size === 0 &&
                this.data === undefined &&
                this._onAddListenerCallback.size === 0 &&
                this._onRemoveListenerCallback.size === 0 &&
                this._onAncestorsAddListenerCallback.size === 0 &&
                this._onAncestorsRemoveListenerCallback.size === 0 &&
                this._onDescendantsAddListenerCallback.size === 0 &&
                this._onDescendantsRemoveListenerCallback.size === 0;
            if (needClear)
                this.parent.children.delete(this.name);
        }
    }
    /**
     * 将事件名转换成数组的形式
     * 注意：空字符串将会被转换成空数组
     * @param eventName 事件名称
     */
    static convertEventNameType(eventName) {
        if (Array.isArray(eventName))
            return eventName;
        else if (eventName === '')
            return [];
        else
            return eventName.split('.');
    }
    /**
     * 根据事件名称获取特定的后代。(不存在的层会自动创建)
     * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
     */
    get(eventName) {
        let layer = this;
        for (const currentName of EventSpace.convertEventNameType(eventName)) {
            let currentLayer = layer.children.get(currentName);
            if (currentLayer === undefined) {
                currentLayer = new EventSpace(layer, currentName);
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
    forEachDescendants(callback, includeCurrentLayer = false) {
        if (includeCurrentLayer)
            if (callback(this))
                return true;
        for (const item of this.children.values()) {
            if (item.forEachDescendants(callback, true))
                return true;
        }
        return false;
    }
    /**
     * 循环遍历每一个祖先。返回boolean，用于判断遍历是否发生中断
     * 提示：如果把callback作为判断条件，可以将forEachAncestors模拟成includes来使用
     * @param callback 回调。返回true则终止遍历
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    forEachAncestors(callback, includeCurrentLayer = false) {
        if (includeCurrentLayer)
            if (callback(this))
                return true;
        if (this.parent)
            return this.parent.forEachAncestors(callback, true);
        return false;
    }
    mapDescendants(callback, includeCurrentLayer) {
        const result = [];
        this.forEachDescendants(layer => {
            if (callback)
                result.push(callback(layer));
            else
                result.push(layer);
        }, includeCurrentLayer);
        return result;
    }
    mapAncestors(callback, includeCurrentLayer) {
        const result = [];
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
    reduceDescendants(callback, initial, includeCurrentLayer) {
        let result = initial;
        this.forEachDescendants(layer => { result = callback(result, layer); }, includeCurrentLayer);
        return result;
    }
    /**
     * 累加每一个祖先。类似于数组的reduce
     * @param callback 回调
     * @param initial 初始值
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    reduceAncestors(callback, initial, includeCurrentLayer) {
        let result = initial;
        this.forEachAncestors(layer => { result = callback(result, layer); }, includeCurrentLayer);
        return result;
    }
    /**
     * 根据给定的条件找出一个满足条件的后代
     * @param callback 判断条件，如果满足则返回true
     * @param includeCurrentLayer 是否包含当前层，默认false
     */
    findDescendant(callback, includeCurrentLayer) {
        let result;
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
    findAncestor(callback, includeCurrentLayer) {
        let result;
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
    on(listener) {
        if (this._listeners.size < this._listeners.add(listener).size) {
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
    once(listener) {
        return this.on(function once(data, layer) {
            listener(data, layer);
            layer.off(once);
        });
    }
    off(listener, clearDataWhenEmpty = true) {
        if (listener) {
            if (this._listeners.delete(listener)) {
                this._onRemoveListenerCallback.forEach(cb => cb(listener, this));
                this.forEachDescendants(layer => layer._onAncestorsRemoveListenerCallback.forEach(cb => cb(listener, this)));
                this.forEachAncestors(layer => layer._onDescendantsRemoveListenerCallback.forEach(cb => cb(listener, this)));
            }
        }
        else {
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
    offDescendants(listener, clearDataWhenEmpty = true, includeSelf = true) {
        this.forEachDescendants(layer => layer.off(listener, clearDataWhenEmpty), includeSelf);
    }
    /**
     * 清理所有祖先上的事件监听器
     * @param listener 可以传递一个listener来清除每一个祖先上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offAncestors(listener, clearDataWhenEmpty = true, includeSelf = true) {
        this.forEachAncestors(layer => layer.off(listener, clearDataWhenEmpty), includeSelf);
    }
    /**
     * 触发事件监听器
     * @param data 要传递的数据
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    trigger(data, asynchronous) {
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
    triggerDescendants(data, includeSelf = true, asynchronous) {
        this.forEachDescendants(layer => layer.trigger(data, asynchronous), includeSelf);
    }
    /**
     * 触发所有祖先上的事件监听器
     * @param data 要传递的数据
     * @param includeSelf  可以传递一个boolean来指示是否要同时触发自身的事件监听器，默认true
     * @param asynchronous 是否采用异步调用，默认false。(其实就是是否使用"setTimeout(listener, 0)"来调用监听器)
     */
    triggerAncestors(data, includeSelf = true, asynchronous) {
        this.forEachAncestors(layer => layer.trigger(data, asynchronous), includeSelf);
    }
    has(listener) {
        if (listener)
            return this._listeners.has(listener);
        else
            return this._listeners.size > 0;
    }
    hasDescendants(listener, includeSelf = true) {
        return this.forEachDescendants(layer => layer.has(listener), includeSelf);
    }
    hasAncestors(listener, includeSelf = true) {
        return this.forEachAncestors(layer => layer.has(listener), includeSelf);
    }
    watch(event, listener) {
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
    watchOff(event, listener) {
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
}
//#region 属性与构造
/**
 * 每隔多长时间清理一次不再被使用的空层
 */
EventSpace._gc_interval = 60 * 1000;
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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SSxHQUFHLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQzdFLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDbEQsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDeEQsQ0FBQztnQkFDRCxLQUFLLENBQUM7UUFDZCxDQUFDO0lBQ0wsQ0FBQzs7QUE1bUJELGVBQWU7QUFFZjs7R0FFRztBQUNxQix1QkFBWSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFQckQsNkJBaW5CQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOS6i+S7tuebkeWQrOWZqFxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lcjxUPiB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBkYXRhIOS8oOmAkueahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIGxheWVyIOebkeWQrOWZqOaJgOWcqOWxgueahOW8leeUqFxyXG4gICAgICovXHJcbiAgICAoZGF0YTogYW55LCBsYXllcjogRXZlbnRTcGFjZTxUPik6IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmt7vliqDmiJbliKDpmaTkuovku7bnm5HlkKzlmajlm57osINcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOWPkeeUn+WPmOWMlueahOebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxheWVyIOWPkeeUn+WPmOWMlueahOWxglxyXG4gICAgICovXHJcbiAgICAobGlzdGVuZXI6IExpc3RlbmVyPFQ+LCBsYXllcjogRXZlbnRTcGFjZTxUPik6IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blkI3np7BcclxuICovXHJcbmV4cG9ydCB0eXBlIEV2ZW50TmFtZSA9IHN0cmluZyB8IHN0cmluZ1tdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZTxUPiB7XHJcblxyXG4gICAgLy8jcmVnaW9uIOWxnuaAp+S4juaehOmAoFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P6ZqU5aSa6ZW/5pe26Ze05riF55CG5LiA5qyh5LiN5YaN6KKr5L2/55So55qE56m65bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9nY19pbnRlcnZhbCA9IDYwICogMTAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOavj+W9k+W9k+WJjeWxguacieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFkZExpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P5b2T5b2T5YmN5bGC5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/lvZPnpZblhYjmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5HnmoTlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOavj+W9k+elluWFiOacieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P5b2T5ZCO5Luj5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOavj+W9k+WQjuS7o+acieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3lsYLms6jlhoznmoTkuovku7bnm5HlkKzlmaggICAgIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9saXN0ZW5lcnM6IFNldDxMaXN0ZW5lcjxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIOWtkOWxgiwga2V5OuWtkOWxguWQjeensFxyXG4gICAgKi9cclxuICAgIHJlYWRvbmx5IGNoaWxkcmVuOiBNYXA8c3RyaW5nLCBFdmVudFNwYWNlPFQ+PiA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOeItuWxguOAguagueeahOeItuWxguS4unVuZGVmaW5lZCAgIFxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBwYXJlbnQ/OiBFdmVudFNwYWNlPFQ+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC5XHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IHJvb3Q6IEV2ZW50U3BhY2U8VD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3lsYLnmoTlkI3np7DjgILmoLnnmoTlkI3np7DkuLrnqbrlrZfnrKbkuLIgICAgXHJcbiAgICAgKiDms6jmhI/vvJrku6XmlbDnu4TooajnpLrml7bvvIznqbrmlbDnu4TmiY3ku6PooajmoLlcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5L6b55So5oi35L+d5a2Y5LiA5Lqb6Ieq5a6a5LmJ5pWw5o2u44CCICAgIFxyXG4gICAgICovXHJcbiAgICBkYXRhPzogVDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluW9k+WJjeWxgueahOWujOaVtOS6i+S7tuWQjeensOOAgu+8iOi/lOWbnuS7juagueWIsOW9k+WJjeWxgu+8jOeUseavj+S4gOWxgueahG5hbWXnu4TmiJDnmoTmlbDnu4TvvIlcclxuICAgICAqL1xyXG4gICAgZ2V0IGZ1bGxOYW1lKCk6IHN0cmluZ1tdIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5wYXJlbnQuZnVsbE5hbWVcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5YmN5bGC5rOo5YaM5LqG5aSa5bCR55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIGdldCBsaXN0ZW5lckNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55u45a+55LqO5b2T5YmN5bGC77yM6I635Y+W5omA5pyJ56WW5YWI5LiK5rOo5YaM5LqG5aSa5bCR55uR5ZCs5Zmo44CCKOS4jeWMheaLrOW9k+WJjeWxgilcclxuICAgICAqL1xyXG4gICAgZ2V0IGFuY2VzdG9yc0xpc3RlbmVyQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5hbmNlc3RvcnNMaXN0ZW5lckNvdW50ICsgdGhpcy5wYXJlbnQuX2xpc3RlbmVycy5zaXplO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnm7jlr7nkuo7lvZPliY3lsYLvvIzojrflj5bmiYDmnInlkI7ku6PkuIrms6jlhozkuoblpJrlsJHnm5HlkKzlmajjgIIo5LiN5YyF5ous5b2T5YmN5bGCKVxyXG4gICAgICovXHJcbiAgICBnZXQgZGVzY2VuZGFudHNMaXN0ZW5lckNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmNoaWxkcmVuLnZhbHVlcygpKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBpdGVtLmRlc2NlbmRhbnRzTGlzdGVuZXJDb3VudCArIGl0ZW0uX2xpc3RlbmVycy5zaXplO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ/OiBFdmVudFNwYWNlPFQ+LCBuYW1lOiBzdHJpbmcgPSAnJykge1xyXG4gICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5yb290ID0gcGFyZW50ID8gcGFyZW50LnJvb3QgOiB0aGlzO1xyXG5cclxuICAgICAgICAvLy0tLS0tLS0tIOa4heeQhuS4jeWGjeiiq+S9v+eUqOeahOWxgiAtLS0tLS0tLS1cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLm5hbWUgPT09ICcnKSB7ICAgIC8v56Gu5L+d5piv5qC5XHJcbiAgICAgICAgICAgIGxldCBuZXh0Q2xlYXJUaW1lID0gRGF0ZS5ub3coKSArIEV2ZW50U3BhY2UuX2djX2ludGVydmFsOyAgIC8v5LiL5LiA5qyh5riF55CG55qE5pyA5pep5pe26Ze0XHJcbiAgICAgICAgICAgIHRoaXMud2F0Y2goJ2Rlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXInLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0ZS5ub3coKSA+IG5leHRDbGVhclRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dENsZWFyVGltZSA9IERhdGUubm93KCkgKyBFdmVudFNwYWNlLl9nY19pbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlt6Xlhbfmlrnms5VcclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4heeQhuS4jeWGjeiiq+S9v+eUqOeahOWxglxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IGl0ZW0uX2NsZWFyTm9Mb25nZXJVc2VkTGF5ZXIoKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZWVkQ2xlYXIgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID09PSB1bmRlZmluZWQgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQWRkTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW92ZUxpc3RlbmVyQ2FsbGJhY2suc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5lZWRDbGVhcilcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLmRlbGV0ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuS6i+S7tuWQjei9rOaNouaIkOaVsOe7hOeahOW9ouW8jyAgICBcclxuICAgICAqIOazqOaEj++8muepuuWtl+espuS4suWwhuS8muiiq+i9rOaNouaIkOepuuaVsOe7hFxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZTogRXZlbnROYW1lKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnROYW1lKSlcclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcclxuICAgICAgICBlbHNlIGlmIChldmVudE5hbWUgPT09ICcnKVxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lLnNwbGl0KCcuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7kuovku7blkI3np7Dojrflj5bnibnlrprnmoTlkI7ku6PjgIIo5LiN5a2Y5Zyo55qE5bGC5Lya6Ieq5Yqo5Yib5bu6KVxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7DjgILlj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqL1xyXG4gICAgZ2V0KGV2ZW50TmFtZTogRXZlbnROYW1lKTogRXZlbnRTcGFjZTxUPiB7XHJcbiAgICAgICAgbGV0IGxheWVyOiBFdmVudFNwYWNlPFQ+ID0gdGhpcztcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjdXJyZW50TmFtZSBvZiBFdmVudFNwYWNlLmNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMYXllciA9IGxheWVyLmNoaWxkcmVuLmdldChjdXJyZW50TmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudExheWVyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRMYXllciA9IG5ldyBFdmVudFNwYWNlPFQ+KGxheWVyLCBjdXJyZW50TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBsYXllci5jaGlsZHJlbi5zZXQoY3VycmVudE5hbWUsIGN1cnJlbnRMYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxheWVyID0gY3VycmVudExheWVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b6q546v6YGN5Y6G5q+P5LiA5Liq5ZCO5Luj44CC6L+U5ZueYm9vbGVhbu+8jOeUqOS6juWIpOaWremBjeWOhuaYr+WQpuWPkeeUn+S4reaWrSAgICAgXHJcbiAgICAgKiDmj5DnpLrvvJrlpoLmnpzmiopjYWxsYmFja+S9nOS4uuWIpOaWreadoeS7tu+8jOWPr+S7peWwhmZvckVhY2hEZXNjZW5kYW50c+aooeaLn+aIkGluY2x1ZGVz5p2l5L2/55SoXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCD44CC6L+U5ZuedHJ1ZeWImee7iOatoumBjeWOhlxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZm9yRWFjaERlc2NlbmRhbnRzKGNhbGxiYWNrOiAobGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IHZvaWQgfCBib29sZWFuLCBpbmNsdWRlQ3VycmVudExheWVyOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoaW5jbHVkZUN1cnJlbnRMYXllcilcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHRoaXMpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuY2hpbGRyZW4udmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZm9yRWFjaERlc2NlbmRhbnRzKGNhbGxiYWNrLCB0cnVlKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvqrnjq/pgY3ljobmr4/kuIDkuKrnpZblhYjjgILov5Tlm55ib29sZWFu77yM55So5LqO5Yik5pat6YGN5Y6G5piv5ZCm5Y+R55Sf5Lit5patICAgICBcclxuICAgICAqIOaPkOekuu+8muWmguaenOaKimNhbGxiYWNr5L2c5Li65Yik5pat5p2h5Lu277yM5Y+v5Lul5bCGZm9yRWFjaEFuY2VzdG9yc+aooeaLn+aIkGluY2x1ZGVz5p2l5L2/55SoXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCD44CC6L+U5ZuedHJ1ZeWImee7iOatoumBjeWOhlxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZm9yRWFjaEFuY2VzdG9ycyhjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiB2b2lkIHwgYm9vbGVhbiwgaW5jbHVkZUN1cnJlbnRMYXllcjogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGluY2x1ZGVDdXJyZW50TGF5ZXIpXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayh0aGlzKSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmZvckVhY2hBbmNlc3RvcnMoY2FsbGJhY2ssIHRydWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbmiYDmnInlkI7ku6Pkv53lrZjliLDkuIDkuKrmlbDnu4TkuK0gICAgXHJcbiAgICAgKiDms6jmhI/vvJrlkI7ku6PnmoTmlbDnm67pmo/ml7blj6/og73kvJrlj5jljJbvvIzlm6DkuLrlj6/og73kvJrmnInnm5HlkKzlmajlnKjmlrDnmoTlkI7ku6PkuIrms6jlhoxcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHVuZGVmaW5lZFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwRGVzY2VuZGFudHMoY2FsbGJhY2s/OiB1bmRlZmluZWQsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogRXZlbnRTcGFjZTxUPltdXHJcbiAgICAvKipcclxuICAgICAqIOmBjeWOhuavj+S4gOS4quWQjuS7o++8jOWwhuavj+S4gOasoemBjeWOhueahOe7k+aenOS/neWtmOWIsOS4gOS4quaVsOe7hOS4rSAgICBcclxuICAgICAqIOazqOaEj++8muWQjuS7o+eahOaVsOebrumaj+aXtuWPr+iDveS8muWPmOWMlu+8jOWboOS4uuWPr+iDveS8muacieebkeWQrOWZqOWcqOaWsOeahOWQjuS7o+S4iuazqOWGjFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBtYXBEZXNjZW5kYW50czxQPihjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiBQLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IFBbXVxyXG4gICAgbWFwRGVzY2VuZGFudHMoY2FsbGJhY2s/OiBGdW5jdGlvbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBhbnlbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKGxheWVyKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxheWVyKTtcclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuaJgOacieelluWFiOS/neWtmOWIsOS4gOS4quaVsOe7hOS4rVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHVuZGVmaW5lZFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwQW5jZXN0b3JzKGNhbGxiYWNrPzogdW5kZWZpbmVkLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IEV2ZW50U3BhY2U8VD5bXVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgY3ljobmr4/kuIDkuKrnpZblhYjvvIzlsIbmr4/kuIDmrKHpgY3ljobnmoTnu5Pmnpzkv53lrZjliLDkuIDkuKrmlbDnu4TkuK0gICAgXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBtYXBBbmNlc3RvcnM8UD4oY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gUCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBQW11cclxuICAgIG1hcEFuY2VzdG9ycyhjYWxsYmFjaz86IEZ1bmN0aW9uLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IGFueVtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKGxheWVyKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxheWVyKTtcclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe0r+WKoOavj+S4gOS4quWQjuS7o+OAguexu+S8vOS6juaVsOe7hOeahHJlZHVjZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluaXRpYWwg5Yid5aeL5YC8XHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICByZWR1Y2VEZXNjZW5kYW50czxQPihjYWxsYmFjazogKHByZXZpb3VzOiBQLCBsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gUCwgaW5pdGlhbDogUCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBQIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gaW5pdGlhbDtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4geyByZXN1bHQgPSBjYWxsYmFjayhyZXN1bHQsIGxheWVyKSB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe0r+WKoOavj+S4gOS4quelluWFiOOAguexu+S8vOS6juaVsOe7hOeahHJlZHVjZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluaXRpYWwg5Yid5aeL5YC8XHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICByZWR1Y2VBbmNlc3RvcnM8UD4oY2FsbGJhY2s6IChwcmV2aW91czogUCwgbGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IFAsIGluaXRpYWw6IFAsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogUCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGluaXRpYWw7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7IHJlc3VsdCA9IGNhbGxiYWNrKHJlc3VsdCwgbGF5ZXIpIH0sIGluY2x1ZGVDdXJyZW50TGF5ZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u57uZ5a6a55qE5p2h5Lu25om+5Ye65LiA5Liq5ruh6Laz5p2h5Lu255qE5ZCO5LujXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Yik5pat5p2h5Lu277yM5aaC5p6c5ruh6Laz5YiZ6L+U5ZuedHJ1ZVxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZmluZERlc2NlbmRhbnQoY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gYm9vbGVhbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhsYXllcikpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrue7meWumueahOadoeS7tuaJvuWHuuS4gOS4qua7oei2s+adoeS7tueahOelluWFiFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWIpOaWreadoeS7tu+8jOWmguaenOa7oei2s+WImei/lOWbnnRydWVcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGZpbmRBbmNlc3RvcihjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiBib29sZWFuLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IEV2ZW50U3BhY2U8VD4gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IEV2ZW50U3BhY2U8VD4gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhsYXllcikpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5LqL5Lu25pON5L2c5pa55rOVXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgb248UCBleHRlbmRzIExpc3RlbmVyPFQ+PihsaXN0ZW5lcjogUCk6IFAge1xyXG4gICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuc2l6ZSA8IHRoaXMuX2xpc3RlbmVycy5hZGQobGlzdGVuZXIpLnNpemUpIHsgLy/noa7kv53mnInmlrDnmoTnm5HlkKzlmajooqvmt7vliqBcclxuICAgICAgICAgICAgdGhpcy5fb25BZGRMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIuX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGlzdGVuZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozlj6rkvb/nlKjkuIDmrKHnmoTkuovku7bnm5HlkKzlmajjgIIgICAgXHJcbiAgICAgKiDms6jmhI/vvJrnlLHkuo5yZWNlaXZlT25jZeS8muWvueS8oOWFpeeahGxpc3RlbmVy6L+b6KGM5LiA5qyh5YyF6KOF77yM5omA5Lul6L+U5Zue55qEbGlzdGVuZXLkuI7kvKDlhaXnmoRsaXN0ZW5lcuW5tuS4jeebuOWQjFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvbmNlKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IExpc3RlbmVyPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbihmdW5jdGlvbiBvbmNlKGRhdGEsIGxheWVyKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyKGRhdGEsIGxheWVyKTtcclxuICAgICAgICAgICAgbGF5ZXIub2ZmKG9uY2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJEYXRhV2hlbkVtcHR5IOaYr+WQpuWQjOaXtua4heeQhuivpeWxgueahGRhdGHlsZ7mgKfvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIG9mZihsaXN0ZW5lcj86IHVuZGVmaW5lZCwgY2xlYXJEYXRhV2hlbkVtcHR5PzogYm9vbGVhbik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk54m55a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg5Y+v5Lul5Lyg6YCS5LiA5LiqbGlzdGVuZXLmnaXlj6rmuIXpmaTkuIDkuKrnibnlrprnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBjbGVhckRhdGFXaGVuRW1wdHkg5aaC5p6c5Yig5YWJ5LqG6K+l5bGC55qE5omA5pyJ55uR5ZCs5Zmo77yM5piv5ZCm5riF55CG6K+l5bGC55qEZGF0YeWxnuaAp++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgb2ZmKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPiwgY2xlYXJEYXRhV2hlbkVtcHR5PzogYm9vbGVhbik6IHZvaWRcclxuICAgIG9mZihsaXN0ZW5lcj86IExpc3RlbmVyPFQ+LCBjbGVhckRhdGFXaGVuRW1wdHk6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2xlYXJEYXRhV2hlbkVtcHR5ICYmIHRoaXMuX2xpc3RlbmVycy5zaXplID09PSAwKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXnkIbmiYDmnInlkI7ku6PkuIrnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDlj6/ku6XkvKDpgJLkuIDkuKpsaXN0ZW5lcuadpea4hemZpOavj+S4gOS4quWQjuS7o+S4iueahOS4gOS4queJueWumuS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGNsZWFyRGF0YVdoZW5FbXB0eSDlpoLmnpzliKDlhYnkuobmn5DlsYLnmoTnm5HlkKzlmajvvIzmmK/lkKbmuIXnkIbor6XlsYLnmoRkYXRh5bGe5oCn77yM6buY6K6kdHJ1ZVxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOWPr+S7peS8oOmAkuS4gOS4qmJvb2xlYW7mnaXmjIfnpLrmmK/lkKbopoHlkIzml7bmuIXpmaToh6rouqvnmoTkuovku7bnm5HlkKzlmajvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIG9mZkRlc2NlbmRhbnRzKGxpc3RlbmVyPzogTGlzdGVuZXI8VD4sIGNsZWFyRGF0YVdoZW5FbXB0eTogYm9vbGVhbiA9IHRydWUsIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLm9mZihsaXN0ZW5lciBhcyBhbnksIGNsZWFyRGF0YVdoZW5FbXB0eSksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4heeQhuaJgOacieelluWFiOS4iueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOWPr+S7peS8oOmAkuS4gOS4qmxpc3RlbmVy5p2l5riF6Zmk5q+P5LiA5Liq56WW5YWI5LiK55qE5LiA5Liq54m55a6a5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJEYXRhV2hlbkVtcHR5IOWmguaenOWIoOWFieS6huafkOWxgueahOebkeWQrOWZqO+8jOaYr+WQpua4heeQhuivpeWxgueahGRhdGHlsZ7mgKfvvIzpu5jorqR0cnVlXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5Y+v5Lul5Lyg6YCS5LiA5LiqYm9vbGVhbuadpeaMh+ekuuaYr+WQpuimgeWQjOaXtua4hemZpOiHqui6q+eahOS6i+S7tuebkeWQrOWZqO+8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgb2ZmQW5jZXN0b3JzKGxpc3RlbmVyPzogTGlzdGVuZXI8VD4sIGNsZWFyRGF0YVdoZW5FbXB0eTogYm9vbGVhbiA9IHRydWUsIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci5vZmYobGlzdGVuZXIgYXMgYW55LCBjbGVhckRhdGFXaGVuRW1wdHkpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5Hkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBkYXRhIOimgeS8oOmAkueahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIGFzeW5jaHJvbm91cyDmmK/lkKbph4fnlKjlvILmraXosIPnlKjvvIzpu5jorqRmYWxzZeOAgijlhbblrp7lsLHmmK/mmK/lkKbkvb/nlKhcInNldFRpbWVvdXQobGlzdGVuZXIsIDApXCLmnaXosIPnlKjnm5HlkKzlmagpXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIoZGF0YT86IGFueSwgYXN5bmNocm9ub3VzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXN5bmNocm9ub3VzKVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChpdGVtLCAwLCBkYXRhLCB0aGlzKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaXRlbShkYXRhLCB0aGlzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieWQjuS7o+S4iueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYgIOWPr+S7peS8oOmAkuS4gOS4qmJvb2xlYW7mnaXmjIfnpLrmmK/lkKbopoHlkIzml7bop6blj5Hoh6rouqvnmoTkuovku7bnm5HlkKzlmajvvIzpu5jorqR0cnVlXHJcbiAgICAgKiBAcGFyYW0gYXN5bmNocm9ub3VzIOaYr+WQpumHh+eUqOW8guatpeiwg+eUqO+8jOm7mOiupGZhbHNl44CCKOWFtuWunuWwseaYr+aYr+WQpuS9v+eUqFwic2V0VGltZW91dChsaXN0ZW5lciwgMClcIuadpeiwg+eUqOebkeWQrOWZqClcclxuICAgICAqL1xyXG4gICAgdHJpZ2dlckRlc2NlbmRhbnRzKGRhdGE/OiBhbnksIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSwgYXN5bmNocm9ub3VzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLnRyaWdnZXIoZGF0YSwgYXN5bmNocm9ub3VzKSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5omA5pyJ56WW5YWI5LiK55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHkvKDpgJLnmoTmlbDmja5cclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiAg5Y+v5Lul5Lyg6YCS5LiA5LiqYm9vbGVhbuadpeaMh+ekuuaYr+WQpuimgeWQjOaXtuinpuWPkeiHqui6q+eahOS6i+S7tuebkeWQrOWZqO+8jOm7mOiupHRydWVcclxuICAgICAqIEBwYXJhbSBhc3luY2hyb25vdXMg5piv5ZCm6YeH55So5byC5q2l6LCD55So77yM6buY6K6kZmFsc2XjgIIo5YW25a6e5bCx5piv5piv5ZCm5L2/55SoXCJzZXRUaW1lb3V0KGxpc3RlbmVyLCAwKVwi5p2l6LCD55So55uR5ZCs5ZmoKVxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyQW5jZXN0b3JzKGRhdGE/OiBhbnksIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSwgYXN5bmNocm9ub3VzPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci50cmlnZ2VyKGRhdGEsIGFzeW5jaHJvbm91cyksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreaYr+WQpuazqOWGjOeahOacieS6i+S7tuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBoYXMoKTogYm9vbGVhblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3mmK/lkKbms6jlhoznmoTmnInnibnlrprnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDopoHov5vooYzliKTmlq3nmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgaGFzKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IGJvb2xlYW5cclxuICAgIGhhcyhsaXN0ZW5lcj86IExpc3RlbmVyPFQ+KTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGxpc3RlbmVyKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLmhhcyhsaXN0ZW5lcik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLnNpemUgPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5ZCO5Luj5piv5ZCm5rOo5YaM55qE5pyJ5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5piv5ZCm6KaB5ZCM5pe25Yik5pat6Ieq6Lqr77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBoYXNEZXNjZW5kYW50cyhsaXN0ZW5lcj86IHVuZGVmaW5lZCwgaW5jbHVkZVNlbGY/OiBib29sZWFuKTogYm9vbGVhblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lkI7ku6PmmK/lkKbms6jlhoznmoTmnInnibnlrprnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDopoHov5vooYzliKTmlq3nmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDmmK/lkKbopoHlkIzml7bliKTmlq3oh6rouqvvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIGhhc0Rlc2NlbmRhbnRzKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPiwgaW5jbHVkZVNlbGY/OiBib29sZWFuKTogYm9vbGVhblxyXG4gICAgaGFzRGVzY2VuZGFudHMobGlzdGVuZXI/OiBhbnksIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci5oYXMobGlzdGVuZXIpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3npZblhYjmmK/lkKbms6jlhoznmoTmnInkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDmmK/lkKbopoHlkIzml7bliKTmlq3oh6rouqvvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIGhhc0FuY2VzdG9ycyhsaXN0ZW5lcj86IHVuZGVmaW5lZCwgaW5jbHVkZVNlbGY/OiBib29sZWFuKTogYm9vbGVhblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3npZblhYjmmK/lkKbms6jlhoznmoTmnInnibnlrprnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDopoHov5vooYzliKTmlq3nmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDmmK/lkKbopoHlkIzml7bliKTmlq3oh6rouqvvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIGhhc0FuY2VzdG9ycyhsaXN0ZW5lcjogTGlzdGVuZXI8VD4sIGluY2x1ZGVTZWxmPzogYm9vbGVhbik6IGJvb2xlYW5cclxuICAgIGhhc0FuY2VzdG9ycyhsaXN0ZW5lcj86IGFueSwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci5oYXMobGlzdGVuZXIpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOazqOWGjOebkeWQrOebkeWQrOWZqOWPmOWMlueahOWbnuiwg+WHveaVsFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P5b2T5b2T5YmN5bGC5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIHdhdGNoKGV2ZW50OiAnYWRkTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/lvZPlvZPliY3lsYLmnInkuovku7bnm5HlkKzlmajooqvliKDpmaTml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgd2F0Y2goZXZlbnQ6ICdyZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOavj+W9k+elluWFiOacieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICB3YXRjaChldmVudDogJ2FuY2VzdG9yc0FkZExpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5q+P5b2T56WW5YWI5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIHdhdGNoKGV2ZW50OiAnYW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmr4/lvZPlkI7ku6PmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgd2F0Y2goZXZlbnQ6ICdkZXNjZW5kYW50c0FkZExpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5q+P5b2T5ZCO5Luj5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIHdhdGNoKGV2ZW50OiAnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICB3YXRjaChldmVudDogc3RyaW5nLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChldmVudCkge1xyXG4gICAgICAgICAgICBjYXNlICdhZGRMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW92ZUxpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdhbmNlc3RvcnNBZGRMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc0FkZExpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdhbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZXNjZW5kYW50c0FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqYWRkTGlzdGVuZXLnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgd2F0Y2hPZmYoZXZlbnQ6ICdhZGRMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKpyZW1vdmVMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICB3YXRjaE9mZihldmVudDogJ3JlbW92ZUxpc3RlbmVyJywgbGlzdGVuZXI/OiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOaJgOacieaIluWNleS4qmFuY2VzdG9yc0FkZExpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHdhdGNoT2ZmKGV2ZW50OiAnYW5jZXN0b3JzQWRkTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqYW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXLnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgd2F0Y2hPZmYoZXZlbnQ6ICdhbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKpkZXNjZW5kYW50c0FkZExpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHdhdGNoT2ZmKGV2ZW50OiAnZGVzY2VuZGFudHNBZGRMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKpkZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHdhdGNoT2ZmKGV2ZW50OiAnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgd2F0Y2hPZmYoZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI/OiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYW5jZXN0b3JzQWRkTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2VzdG9yc1JlbW92ZUxpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZXNjZW5kYW50c0FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL+i/meagt+WBmuaYr+S4uuS6humBv+WFjeWIoOmZpHJvb3TnmoRfY2xlYXJOb0xvbmdlclVzZWRMYXllclxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvb3QgPSB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay52YWx1ZXMoKS5uZXh0KCkudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5hZGQocm9vdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbn0iXX0=
