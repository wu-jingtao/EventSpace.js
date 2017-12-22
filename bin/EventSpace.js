"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventSpace {
    constructor(parent, name = '') {
        /**
         * 当当前层有新的事件监听器被添加时触发的回调函数
         */
        this._onAddListenerCallback = new Set();
        /**
         * 当当前层有事件监听器被删除时触发的回调函数
         */
        this._onRemoveListenerCallback = new Set();
        /**
         * 当祖先有新的事件监听器被添加时触发的回调函数
         */
        this._onAncestorsAddListenerCallback = new Set();
        /**
         * 当祖先有事件监听器被删除时触发的回调函数
         */
        this._onAncestorsRemoveListenerCallback = new Set();
        /**
         * 当后代有新的事件监听器被添加时触发的回调函数
         */
        this._onDescendantsAddListenerCallback = new Set();
        /**
         * 当后代有事件监听器被删除时触发的回调函数
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
        //-------- 清理不再被使用的层 ---------
        if (this.parent === undefined && this.name === '') {
            let nextClearTime = (new Date).getTime() + EventSpace._gc_interval; //下一次清理的最早时间
            this.watch('descendantsRemoveListener', () => {
                if ((new Date).getTime() > nextClearTime) {
                    this._clearNoLongerUsedLayer();
                    nextClearTime = (new Date).getTime() + EventSpace._gc_interval;
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
    static convertEventNameType(eventName) {
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
    offDescendants(listener, clearDataWhenEmpty, includeSelf = true) {
        this.forEachDescendants(layer => layer.off(listener, clearDataWhenEmpty), includeSelf);
    }
    /**
     * 清理所有祖先上的事件监听器
     * @param listener 可以传递一个listener来清除每一个祖先上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    offAncestors(listener, clearDataWhenEmpty, includeSelf = true) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztvQkFDN0UsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNsRCxJQUFJLENBQUMsb0NBQW9DLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4RCxDQUFDO2dCQUNELEtBQUssQ0FBQztRQUNkLENBQUM7SUFDTCxDQUFDOztBQXRtQkQsZUFBZTtBQUVmOztHQUVHO0FBQ3FCLHVCQUFZLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQVByRCw2QkEybUJDIiwiZmlsZSI6IkV2ZW50U3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5LqL5Lu255uR5ZCs5ZmoXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIExpc3RlbmVyPFQ+IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGRhdGEg5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gbGF5ZXIg55uR5ZCs5Zmo5omA5Zyo5bGC55qE5byV55SoXHJcbiAgICAgKi9cclxuICAgIChkYXRhOiBhbnksIGxheWVyOiBFdmVudFNwYWNlPFQ+KTogYW55O1xyXG59XHJcblxyXG4vKipcclxuICog5re75Yqg5oiW5Yig6Zmk5LqL5Lu255uR5ZCs5Zmo5Zue6LCDXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPiB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDlj5HnlJ/lj5jljJbnmoTnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsYXllciDlj5HnlJ/lj5jljJbnmoTlsYJcclxuICAgICAqL1xyXG4gICAgKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPiwgbGF5ZXI6IEV2ZW50U3BhY2U8VD4pOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blkI3np7BcclxuICovXHJcbmV4cG9ydCB0eXBlIEV2ZW50TmFtZSA9IHN0cmluZyB8IHN0cmluZ1tdO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZTxUPiB7XHJcblxyXG4gICAgLy8jcmVnaW9uIOWxnuaAp+S4juaehOmAoFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P6ZqU5aSa6ZW/5pe26Ze05riF55CG5LiA5qyh5LiN5YaN6KKr5L2/55So55qE56m65bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9nY19pbnRlcnZhbCA9IDYwICogMTAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+W9k+WJjeWxguacieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFkZExpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5b2T5YmN5bGC5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPnpZblhYjmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5HnmoTlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+elluWFiOacieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5ZCO5Luj5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WQjuS7o+acieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3lsYLms6jlhoznmoTkuovku7bnm5HlkKzlmaggICAgIFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9saXN0ZW5lcnM6IFNldDxMaXN0ZW5lcjxUPj4gPSBuZXcgU2V0KCk7XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgKiDlrZDlsYIsIGtleTrlrZDlsYLlkI3np7BcclxuICAgICovXHJcbiAgICByZWFkb25seSBjaGlsZHJlbjogTWFwPHN0cmluZywgRXZlbnRTcGFjZTxUPj4gPSBuZXcgTWFwKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDniLblsYLjgILmoLnnmoTniLblsYLkuLp1bmRlZmluZWQgICBcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgcGFyZW50PzogRXZlbnRTcGFjZTxUPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjeWxgueahOWQjeensOOAguagueeahOWQjeensOS4uuepuuWtl+espuS4siAgICBcclxuICAgICAqIOazqOaEj++8muS7peaVsOe7hOihqOekuuaXtu+8jOepuuaVsOe7hOaJjeS7o+ihqOaguVxyXG4gICAgICovXHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvpvnlKjmiLfkv53lrZjkuIDkupvoh6rlrprkuYnmlbDmja7jgIIgICAgXHJcbiAgICAgKi9cclxuICAgIGRhdGE/OiBUO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5b2T5YmN5bGC55qE5a6M5pW05LqL5Lu25ZCN56ew44CC77yI6L+U5Zue5LuO5qC55Yiw5b2T5YmN5bGC77yM55Sx5q+P5LiA5bGC55qEbmFtZee7hOaIkOeahOaVsOe7hO+8iVxyXG4gICAgICovXHJcbiAgICBnZXQgZnVsbE5hbWUoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnBhcmVudC5mdWxsTmFtZVxyXG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPliY3lsYLms6jlhozkuoblpJrlsJHnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgZ2V0IGxpc3RlbmVyQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlzdGVuZXJzLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnm7jlr7nkuo7lvZPliY3lsYLvvIzojrflj5bmiYDmnInnpZblhYjkuIrms6jlhozkuoblpJrlsJHnm5HlkKzlmajjgIIo5LiN5YyF5ous5b2T5YmN5bGCKVxyXG4gICAgICovXHJcbiAgICBnZXQgYW5jZXN0b3JzTGlzdGVuZXJDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmFuY2VzdG9yc0xpc3RlbmVyQ291bnQgKyB0aGlzLnBhcmVudC5fbGlzdGVuZXJzLnNpemU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOebuOWvueS6juW9k+WJjeWxgu+8jOiOt+WPluaJgOacieWQjuS7o+S4iuazqOWGjOS6huWkmuWwkeebkeWQrOWZqOOAgijkuI3ljIXmi6zlvZPliY3lsYIpXHJcbiAgICAgKi9cclxuICAgIGdldCBkZXNjZW5kYW50c0xpc3RlbmVyQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuY2hpbGRyZW4udmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGl0ZW0uZGVzY2VuZGFudHNMaXN0ZW5lckNvdW50ICsgaXRlbS5fbGlzdGVuZXJzLnNpemU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBhcmVudD86IEV2ZW50U3BhY2U8VD4sIG5hbWU6IHN0cmluZyA9ICcnKSB7XHJcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuXHJcbiAgICAgICAgLy8tLS0tLS0tLSDmuIXnkIbkuI3lho3ooqvkvb/nlKjnmoTlsYIgLS0tLS0tLS0tXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ID09PSB1bmRlZmluZWQgJiYgdGhpcy5uYW1lID09PSAnJykgeyAgICAvL+ehruS/neaYr+aguVxyXG4gICAgICAgICAgICBsZXQgbmV4dENsZWFyVGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpICsgRXZlbnRTcGFjZS5fZ2NfaW50ZXJ2YWw7ICAgLy/kuIvkuIDmrKHmuIXnkIbnmoTmnIDml6nml7bpl7RcclxuICAgICAgICAgICAgdGhpcy53YXRjaCgnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgobmV3IERhdGUpLmdldFRpbWUoKSA+IG5leHRDbGVhclRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dENsZWFyVGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpICsgRXZlbnRTcGFjZS5fZ2NfaW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5bel5YW35pa55rOVXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXnkIbkuI3lho3ooqvkvb/nlKjnmoTlsYJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY2xlYXJOb0xvbmdlclVzZWRMYXllcigpIHtcclxuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goaXRlbSA9PiBpdGVtLl9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgbmVlZENsZWFyID1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQWRkTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW92ZUxpc3RlbmVyQ2FsbGJhY2suc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPT09IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChuZWVkQ2xlYXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5kZWxldGUodGhpcy5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbkuovku7blkI3ovazmjaLmiJDmlbDnu4TnmoTlvaLlvI8gICAgXHJcbiAgICAgKiDms6jmhI/vvJrnqbrlrZfnrKbkuLLlsIbkvJrooqvovazmjaLmiJDnqbrmlbDnu4RcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWU6IEV2ZW50TmFtZSkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGV2ZW50TmFtZSkpXHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE5hbWU7XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnROYW1lID09PSAnJylcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TmFtZS5zcGxpdCgnLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u5LqL5Lu25ZCN56ew6I635Y+W54m55a6a55qE5ZCO5Luj44CCKOS4jeWtmOWcqOS8muiHquWKqOWIm+W7uilcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ew44CC5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKi9cclxuICAgIGdldChldmVudE5hbWU6IEV2ZW50TmFtZSk6IEV2ZW50U3BhY2U8VD4ge1xyXG4gICAgICAgIGxldCBsYXllcjogRXZlbnRTcGFjZTxUPiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY3VycmVudE5hbWUgb2YgRXZlbnRTcGFjZS5jb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TGF5ZXIgPSBsYXllci5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRMYXllciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGF5ZXIgPSBuZXcgRXZlbnRTcGFjZTxUPihsYXllciwgY3VycmVudE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuY2hpbGRyZW4uc2V0KGN1cnJlbnROYW1lLCBjdXJyZW50TGF5ZXIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYXllciA9IGN1cnJlbnRMYXllcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsYXllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW+queOr+mBjeWOhuavj+S4gOS4quWQjuS7o+OAgui/lOWbnmJvb2xlYW7vvIznlKjkuo7liKTmlq3pgY3ljobmmK/lkKblj5HnlJ/kuK3mlq0gICAgIFxyXG4gICAgICog5o+Q56S677ya5aaC5p6c5oqKY2FsbGJhY2vkvZzkuLrliKTmlq3mnaHku7bvvIzlj6/ku6XlsIZmb3JFYWNoRGVzY2VuZGFudHPmqKHmi5/miJBpbmNsdWRlc+adpeS9v+eUqFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg+OAgui/lOWbnnRydWXliJnnu4jmraLpgY3ljoZcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGZvckVhY2hEZXNjZW5kYW50cyhjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiB2b2lkIHwgYm9vbGVhbiwgaW5jbHVkZUN1cnJlbnRMYXllcjogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKGluY2x1ZGVDdXJyZW50TGF5ZXIpXHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayh0aGlzKSkgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLmNoaWxkcmVuLnZhbHVlcygpKSB7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmZvckVhY2hEZXNjZW5kYW50cyhjYWxsYmFjaywgdHJ1ZSkpIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b6q546v6YGN5Y6G5q+P5LiA5Liq56WW5YWI44CC6L+U5ZueYm9vbGVhbu+8jOeUqOS6juWIpOaWremBjeWOhuaYr+WQpuWPkeeUn+S4reaWrSAgICAgXHJcbiAgICAgKiDmj5DnpLrvvJrlpoLmnpzmiopjYWxsYmFja+S9nOS4uuWIpOaWreadoeS7tu+8jOWPr+S7peWwhmZvckVhY2hBbmNlc3RvcnPmqKHmi5/miJBpbmNsdWRlc+adpeS9v+eUqFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg+OAgui/lOWbnnRydWXliJnnu4jmraLpgY3ljoZcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGZvckVhY2hBbmNlc3RvcnMoY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gdm9pZCB8IGJvb2xlYW4sIGluY2x1ZGVDdXJyZW50TGF5ZXI6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChpbmNsdWRlQ3VycmVudExheWVyKVxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sodGhpcykpIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcmVudC5mb3JFYWNoQW5jZXN0b3JzKGNhbGxiYWNrLCB0cnVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5bCG5omA5pyJ5ZCO5Luj5L+d5a2Y5Yiw5LiA5Liq5pWw57uE5LitICAgIFxyXG4gICAgICog5rOo5oSP77ya5ZCO5Luj55qE5pWw55uu6ZqP5pe25Y+v6IO95Lya5Y+Y5YyW77yM5Zug5Li65Y+v6IO95Lya5pyJ55uR5ZCs5Zmo5Zyo5paw55qE5ZCO5Luj5LiK5rOo5YaMXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB1bmRlZmluZWRcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIG1hcERlc2NlbmRhbnRzKGNhbGxiYWNrPzogdW5kZWZpbmVkLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IEV2ZW50U3BhY2U8VD5bXVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgY3ljobmr4/kuIDkuKrlkI7ku6PvvIzlsIbmr4/kuIDmrKHpgY3ljobnmoTnu5Pmnpzkv53lrZjliLDkuIDkuKrmlbDnu4TkuK0gICAgXHJcbiAgICAgKiDms6jmhI/vvJrlkI7ku6PnmoTmlbDnm67pmo/ml7blj6/og73kvJrlj5jljJbvvIzlm6DkuLrlj6/og73kvJrmnInnm5HlkKzlmajlnKjmlrDnmoTlkI7ku6PkuIrms6jlhoxcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwRGVzY2VuZGFudHM8UD4oY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gUCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBQW11cclxuICAgIG1hcERlc2NlbmRhbnRzKGNhbGxiYWNrPzogRnVuY3Rpb24sIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogYW55W10ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdDogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjYWxsYmFjayhsYXllcikpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsYXllcik7XHJcbiAgICAgICAgfSwgaW5jbHVkZUN1cnJlbnRMYXllcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbmiYDmnInnpZblhYjkv53lrZjliLDkuIDkuKrmlbDnu4TkuK1cclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB1bmRlZmluZWRcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIG1hcEFuY2VzdG9ycyhjYWxsYmFjaz86IHVuZGVmaW5lZCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBFdmVudFNwYWNlPFQ+W11cclxuICAgIC8qKlxyXG4gICAgICog6YGN5Y6G5q+P5LiA5Liq56WW5YWI77yM5bCG5q+P5LiA5qyh6YGN5Y6G55qE57uT5p6c5L+d5a2Y5Yiw5LiA5Liq5pWw57uE5LitICAgIFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwQW5jZXN0b3JzPFA+KGNhbGxiYWNrOiAobGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IFAsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogUFtdXHJcbiAgICBtYXBBbmNlc3RvcnMoY2FsbGJhY2s/OiBGdW5jdGlvbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBhbnlbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjYWxsYmFjayhsYXllcikpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChsYXllcik7XHJcbiAgICAgICAgfSwgaW5jbHVkZUN1cnJlbnRMYXllcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDntK/liqDmr4/kuIDkuKrlkI7ku6PjgILnsbvkvLzkuo7mlbDnu4TnmoRyZWR1Y2VcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDlm57osINcclxuICAgICAqIEBwYXJhbSBpbml0aWFsIOWIneWni+WAvFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgcmVkdWNlRGVzY2VuZGFudHM8UD4oY2FsbGJhY2s6IChwcmV2aW91czogUCwgbGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IFAsIGluaXRpYWw6IFAsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogUCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGluaXRpYWw7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IHsgcmVzdWx0ID0gY2FsbGJhY2socmVzdWx0LCBsYXllcikgfSwgaW5jbHVkZUN1cnJlbnRMYXllcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDntK/liqDmr4/kuIDkuKrnpZblhYjjgILnsbvkvLzkuo7mlbDnu4TnmoRyZWR1Y2VcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDlm57osINcclxuICAgICAqIEBwYXJhbSBpbml0aWFsIOWIneWni+WAvFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgcmVkdWNlQW5jZXN0b3JzPFA+KGNhbGxiYWNrOiAocHJldmlvdXM6IFAsIGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiBQLCBpbml0aWFsOiBQLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IFAge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSBpbml0aWFsO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4geyByZXN1bHQgPSBjYWxsYmFjayhyZXN1bHQsIGxheWVyKSB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrue7meWumueahOadoeS7tuaJvuWHuuS4gOS4qua7oei2s+adoeS7tueahOWQjuS7o1xyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWIpOaWreadoeS7tu+8jOWmguaenOa7oei2s+WImei/lOWbnnRydWVcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGZpbmREZXNjZW5kYW50KGNhbGxiYWNrOiAobGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IGJvb2xlYW4sIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogRXZlbnRTcGFjZTxUPiB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdDogRXZlbnRTcGFjZTxUPiB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sobGF5ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBsYXllcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgaW5jbHVkZUN1cnJlbnRMYXllcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja7nu5nlrprnmoTmnaHku7bmib7lh7rkuIDkuKrmu6HotrPmnaHku7bnmoTnpZblhYhcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDliKTmlq3mnaHku7bvvIzlpoLmnpzmu6HotrPliJnov5Tlm550cnVlXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBmaW5kQW5jZXN0b3IoY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gYm9vbGVhbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sobGF5ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBsYXllcjtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgaW5jbHVkZUN1cnJlbnRMYXllcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcblxyXG4gICAgLy8jcmVnaW9uIOS6i+S7tuaTjeS9nOaWueazlVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIG9uPFAgZXh0ZW5kcyBMaXN0ZW5lcjxUPj4obGlzdGVuZXI6IFApOiBQIHtcclxuICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzLnNpemUgPCB0aGlzLl9saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKS5zaXplKSB7IC8v56Gu5L+d5pyJ5paw55qE55uR5ZCs5Zmo6KKr5re75YqgXHJcbiAgICAgICAgICAgIHRoaXMuX29uQWRkTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLl9vbkFuY2VzdG9yc0FkZExpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICAgICAgdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5Y+q5L2/55So5LiA5qyh55qE5LqL5Lu255uR5ZCs5Zmo44CCICAgIFxyXG4gICAgICog5rOo5oSP77ya55Sx5LqOcmVjZWl2ZU9uY2XkvJrlr7nkvKDlhaXnmoRsaXN0ZW5lcui/m+ihjOS4gOasoeWMheijhe+8jOaJgOS7pei/lOWbnueahGxpc3RlbmVy5LiO5Lyg5YWl55qEbGlzdGVuZXLlubbkuI3nm7jlkIxcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgb25jZShsaXN0ZW5lcjogTGlzdGVuZXI8VD4pOiBMaXN0ZW5lcjxUPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub24oZnVuY3Rpb24gb25jZShkYXRhLCBsYXllcikge1xyXG4gICAgICAgICAgICBsaXN0ZW5lcihkYXRhLCBsYXllcik7XHJcbiAgICAgICAgICAgIGxheWVyLm9mZihvbmNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOaJgOacieS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGNsZWFyRGF0YVdoZW5FbXB0eSDmmK/lkKblkIzml7bmuIXnkIbor6XlsYLnmoRkYXRh5bGe5oCn77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBvZmYobGlzdGVuZXI/OiB1bmRlZmluZWQsIGNsZWFyRGF0YVdoZW5FbXB0eT86IGJvb2xlYW4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOeJueWumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOWPr+S7peS8oOmAkuS4gOS4qmxpc3RlbmVy5p2l5Y+q5riF6Zmk5LiA5Liq54m55a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJEYXRhV2hlbkVtcHR5IOWmguaenOWIoOWFieS6huivpeWxgueahOaJgOacieebkeWQrOWZqO+8jOaYr+WQpua4heeQhuivpeWxgueahGRhdGHlsZ7mgKfvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIG9mZihsaXN0ZW5lcjogTGlzdGVuZXI8VD4sIGNsZWFyRGF0YVdoZW5FbXB0eT86IGJvb2xlYW4pOiB2b2lkXHJcbiAgICBvZmYobGlzdGVuZXI/OiBMaXN0ZW5lcjxUPiwgY2xlYXJEYXRhV2hlbkVtcHR5OiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNsZWFyRGF0YVdoZW5FbXB0eSAmJiB0aGlzLl9saXN0ZW5lcnMuc2l6ZSA9PT0gMClcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF55CG5omA5pyJ5ZCO5Luj5LiK55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg5Y+v5Lul5Lyg6YCS5LiA5LiqbGlzdGVuZXLmnaXmuIXpmaTmr4/kuIDkuKrlkI7ku6PkuIrnmoTkuIDkuKrnibnlrprkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBjbGVhckRhdGFXaGVuRW1wdHkg5aaC5p6c5Yig5YWJ5LqG5p+Q5bGC55qE55uR5ZCs5Zmo77yM5piv5ZCm5riF55CG6K+l5bGC55qEZGF0YeWxnuaAp++8jOm7mOiupHRydWVcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDlj6/ku6XkvKDpgJLkuIDkuKpib29sZWFu5p2l5oyH56S65piv5ZCm6KaB5ZCM5pe25riF6Zmk6Ieq6Lqr55qE5LqL5Lu255uR5ZCs5Zmo77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBvZmZEZXNjZW5kYW50cyhsaXN0ZW5lcj86IExpc3RlbmVyPFQ+LCBjbGVhckRhdGFXaGVuRW1wdHk/OiBib29sZWFuLCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci5vZmYobGlzdGVuZXIgYXMgYW55LCBjbGVhckRhdGFXaGVuRW1wdHkpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXnkIbmiYDmnInnpZblhYjkuIrnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDlj6/ku6XkvKDpgJLkuIDkuKpsaXN0ZW5lcuadpea4hemZpOavj+S4gOS4quelluWFiOS4iueahOS4gOS4queJueWumuS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGNsZWFyRGF0YVdoZW5FbXB0eSDlpoLmnpzliKDlhYnkuobmn5DlsYLnmoTnm5HlkKzlmajvvIzmmK/lkKbmuIXnkIbor6XlsYLnmoRkYXRh5bGe5oCn77yM6buY6K6kdHJ1ZVxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOWPr+S7peS8oOmAkuS4gOS4qmJvb2xlYW7mnaXmjIfnpLrmmK/lkKbopoHlkIzml7bmuIXpmaToh6rouqvnmoTkuovku7bnm5HlkKzlmajvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIG9mZkFuY2VzdG9ycyhsaXN0ZW5lcj86IExpc3RlbmVyPFQ+LCBjbGVhckRhdGFXaGVuRW1wdHk/OiBib29sZWFuLCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIub2ZmKGxpc3RlbmVyIGFzIGFueSwgY2xlYXJEYXRhV2hlbkVtcHR5KSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHkvKDpgJLnmoTmlbDmja5cclxuICAgICAqIEBwYXJhbSBhc3luY2hyb25vdXMg5piv5ZCm6YeH55So5byC5q2l6LCD55So77yM6buY6K6kZmFsc2XjgIIo5YW25a6e5bCx5piv5piv5ZCm5L2/55SoXCJzZXRUaW1lb3V0KGxpc3RlbmVyLCAwKVwi5p2l6LCD55So55uR5ZCs5ZmoKVxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKGRhdGE/OiBhbnksIGFzeW5jaHJvbm91cz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgaWYgKGFzeW5jaHJvbm91cylcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaXRlbSwgMCwgZGF0YSwgdGhpcyk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGl0ZW0oZGF0YSwgdGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmiYDmnInlkI7ku6PkuIrnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBkYXRhIOimgeS8oOmAkueahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmICDlj6/ku6XkvKDpgJLkuIDkuKpib29sZWFu5p2l5oyH56S65piv5ZCm6KaB5ZCM5pe26Kem5Y+R6Ieq6Lqr55qE5LqL5Lu255uR5ZCs5Zmo77yM6buY6K6kdHJ1ZVxyXG4gICAgICogQHBhcmFtIGFzeW5jaHJvbm91cyDmmK/lkKbph4fnlKjlvILmraXosIPnlKjvvIzpu5jorqRmYWxzZeOAgijlhbblrp7lsLHmmK/mmK/lkKbkvb/nlKhcInNldFRpbWVvdXQobGlzdGVuZXIsIDApXCLmnaXosIPnlKjnm5HlkKzlmagpXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXJEZXNjZW5kYW50cyhkYXRhPzogYW55LCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUsIGFzeW5jaHJvbm91cz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci50cmlnZ2VyKGRhdGEsIGFzeW5jaHJvbm91cyksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieelluWFiOS4iueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYgIOWPr+S7peS8oOmAkuS4gOS4qmJvb2xlYW7mnaXmjIfnpLrmmK/lkKbopoHlkIzml7bop6blj5Hoh6rouqvnmoTkuovku7bnm5HlkKzlmajvvIzpu5jorqR0cnVlXHJcbiAgICAgKiBAcGFyYW0gYXN5bmNocm9ub3VzIOaYr+WQpumHh+eUqOW8guatpeiwg+eUqO+8jOm7mOiupGZhbHNl44CCKOWFtuWunuWwseaYr+aYr+WQpuS9v+eUqFwic2V0VGltZW91dChsaXN0ZW5lciwgMClcIuadpeiwg+eUqOebkeWQrOWZqClcclxuICAgICAqL1xyXG4gICAgdHJpZ2dlckFuY2VzdG9ycyhkYXRhPzogYW55LCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUsIGFzeW5jaHJvbm91cz86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIudHJpZ2dlcihkYXRhLCBhc3luY2hyb25vdXMpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3mmK/lkKbms6jlhoznmoTmnInkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgaGFzKCk6IGJvb2xlYW5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5piv5ZCm5rOo5YaM55qE5pyJ54m55a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg6KaB6L+b6KGM5Yik5pat55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIGhhcyhsaXN0ZW5lcjogTGlzdGVuZXI8VD4pOiBib29sZWFuXHJcbiAgICBoYXMobGlzdGVuZXI/OiBMaXN0ZW5lcjxUPik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5oYXMobGlzdGVuZXIpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3RlbmVycy5zaXplID4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWQjuS7o+aYr+WQpuazqOWGjOeahOacieS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOaYr+WQpuimgeWQjOaXtuWIpOaWreiHqui6q++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgaGFzRGVzY2VuZGFudHMobGlzdGVuZXI/OiB1bmRlZmluZWQsIGluY2x1ZGVTZWxmPzogYm9vbGVhbik6IGJvb2xlYW5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5ZCO5Luj5piv5ZCm5rOo5YaM55qE5pyJ54m55a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg6KaB6L+b6KGM5Yik5pat55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5piv5ZCm6KaB5ZCM5pe25Yik5pat6Ieq6Lqr77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBoYXNEZXNjZW5kYW50cyhsaXN0ZW5lcjogTGlzdGVuZXI8VD4sIGluY2x1ZGVTZWxmPzogYm9vbGVhbik6IGJvb2xlYW5cclxuICAgIGhhc0Rlc2NlbmRhbnRzKGxpc3RlbmVyPzogYW55LCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIuaGFzKGxpc3RlbmVyKSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat56WW5YWI5piv5ZCm5rOo5YaM55qE5pyJ5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5piv5ZCm6KaB5ZCM5pe25Yik5pat6Ieq6Lqr77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBoYXNBbmNlc3RvcnMobGlzdGVuZXI/OiB1bmRlZmluZWQsIGluY2x1ZGVTZWxmPzogYm9vbGVhbik6IGJvb2xlYW5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat56WW5YWI5piv5ZCm5rOo5YaM55qE5pyJ54m55a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg6KaB6L+b6KGM5Yik5pat55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5piv5ZCm6KaB5ZCM5pe25Yik5pat6Ieq6Lqr77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBoYXNBbmNlc3RvcnMobGlzdGVuZXI6IExpc3RlbmVyPFQ+LCBpbmNsdWRlU2VsZj86IGJvb2xlYW4pOiBib29sZWFuXHJcbiAgICBoYXNBbmNlc3RvcnMobGlzdGVuZXI/OiBhbnksIGluY2x1ZGVTZWxmOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZvckVhY2hBbmNlc3RvcnMobGF5ZXIgPT4gbGF5ZXIuaGFzKGxpc3RlbmVyKSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDms6jlhoznm5HlkKznm5HlkKzlmajlj5jljJbnmoTlm57osIPlh73mlbBcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+W9k+WJjeWxguacieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICB3YXRjaChldmVudDogJ2FkZExpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5b2T5b2T5YmN5bGC5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIHdhdGNoKGV2ZW50OiAncmVtb3ZlTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPnpZblhYjmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgd2F0Y2goZXZlbnQ6ICdhbmNlc3RvcnNBZGRMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOW9k+elluWFiOacieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICB3YXRjaChldmVudDogJ2FuY2VzdG9yc1JlbW92ZUxpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5b2T5ZCO5Luj5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIHdhdGNoKGV2ZW50OiAnZGVzY2VuZGFudHNBZGRMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WQjuS7o+acieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICB3YXRjaChldmVudDogJ2Rlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgd2F0Y2goZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWQge1xyXG4gICAgICAgIHN3aXRjaCAoZXZlbnQpIHtcclxuICAgICAgICAgICAgY2FzZSAnYWRkTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BZGRMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVtb3ZlTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYW5jZXN0b3JzQWRkTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVzY2VuZGFudHNBZGRMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOaJgOacieaIluWNleS4qmFkZExpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHdhdGNoT2ZmKGV2ZW50OiAnYWRkTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqcmVtb3ZlTGlzdGVuZXLnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgd2F0Y2hPZmYoZXZlbnQ6ICdyZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKphbmNlc3RvcnNBZGRMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICB3YXRjaE9mZihldmVudDogJ2FuY2VzdG9yc0FkZExpc3RlbmVyJywgbGlzdGVuZXI/OiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOa4hemZpOaJgOacieaIluWNleS4qmFuY2VzdG9yc1JlbW92ZUxpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHdhdGNoT2ZmKGV2ZW50OiAnYW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqZGVzY2VuZGFudHNBZGRMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICB3YXRjaE9mZihldmVudDogJ2Rlc2NlbmRhbnRzQWRkTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICB3YXRjaE9mZihldmVudDogJ2Rlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIHdhdGNoT2ZmKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZCB7XHJcbiAgICAgICAgc3dpdGNoIChldmVudCkge1xyXG4gICAgICAgICAgICBjYXNlICdhZGRMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BZGRMaXN0ZW5lckNhbGxiYWNrLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BZGRMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAncmVtb3ZlTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2VzdG9yc0FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc0FkZExpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc0FkZExpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdhbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVzY2VuZGFudHNBZGRMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c0FkZExpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBhcmVudClcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy/ov5nmoLflgZrmmK/kuLrkuobpgb/lhY3liKDpmaRyb29055qEX2NsZWFyTm9Mb25nZXJVc2VkTGF5ZXJcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByb290ID0gdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2sudmFsdWVzKCkubmV4dCgpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suYWRkKHJvb3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59Il19
