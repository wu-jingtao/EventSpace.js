"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventSpace {
    constructor(parent, name = '') {
        /**
         * 当前层注册的事件监听器
         */
        this._listeners = new Set();
        /**
         * 当当前层有新的事件监听器被添加时触发的回调函数
         */
        this._onAddListenerCallback = new Set();
        /**
         * 当当前层有事件监听器被删除时触发的回调函数
         */
        this._onRemoveListenerCallback = new Set();
        /**
         * 相对于当前层，当祖先有新的事件监听器被添加时触发的回调函数
         */
        this._onAncestorsAddListenerCallback = new Set();
        /**
         * 相对于当前层，当祖先有事件监听器被删除时触发的回调函数
         */
        this._onAncestorsRemoveListenerCallback = new Set();
        /**
         * 相对于当前层，当后代有新的事件监听器被添加时触发的回调函数
         */
        this._onDescendantsAddListenerCallback = new Set();
        /**
         * 相对于当前层，当后代有事件监听器被删除时触发的回调函数
         */
        this._onDescendantsRemoveListenerCallback = new Set();
        /**
        * 子层, key:子层名称
        */
        this.children = new Map();
        this.parent = parent;
        this.name = name;
        //-------- 清理不再被使用的层 ---------
        let nextClearTime = (new Date).getTime() + EventSpace._gc_interval; //下一次清理的最早时间
        this.on('descendantsRemoveListener', (listener, layer) => {
            if ((new Date).getTime() > nextClearTime) {
                this._clearNoLongerUsedLayer();
                nextClearTime = (new Date).getTime() + EventSpace._gc_interval;
            }
        });
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
    getDescendant(eventName) {
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
        else
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
    receive(listener) {
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
    receiveOnce(listener) {
        return this.receive(function once(data, layer) {
            listener(data, layer);
            layer.cancel(once);
        });
    }
    cancel(listener, clearDataWhenEmpty = true) {
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
    cancelDescendants(listener, clearDataWhenEmpty, includeSelf = true) {
        this.forEachDescendants(layer => layer.cancel(listener, clearDataWhenEmpty), includeSelf);
    }
    /**
     * 清理所有祖先上的事件监听器
     * @param listener 可以传递一个listener来清除每一个祖先上的一个特定事件监听器
     * @param clearDataWhenEmpty 如果删光了某层的监听器，是否清理该层的data属性，默认true
     * @param includeSelf 可以传递一个boolean来指示是否要同时清除自身的事件监听器，默认true
     */
    cancelAncestors(listener, clearDataWhenEmpty, includeSelf = true) {
        this.forEachAncestors(layer => layer.cancel(listener, clearDataWhenEmpty), includeSelf);
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
    on(event, listener) {
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
    off(event, listener) {
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
                else
                    this._onDescendantsRemoveListenerCallback.clear();
                break;
        }
    }
}
//#region 属性与构造
/**
 * 每隔多长时间清理一次未被使用的空层
 */
EventSpace._gc_interval = 60 * 1000;
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFzQkE7SUEyR0ksWUFBWSxNQUFzQixFQUFFLE9BQWUsRUFBRTtRQWxHckQ7O1dBRUc7UUFDYyxlQUFVLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFFMUQ7O1dBRUc7UUFDYywyQkFBc0IsR0FBd0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUV6Rjs7V0FFRztRQUNjLDhCQUF5QixHQUF3QyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRTVGOztXQUVHO1FBQ2Msb0NBQStCLEdBQXdDLElBQUksR0FBRyxFQUFFLENBQUM7UUFFbEc7O1dBRUc7UUFDYyx1Q0FBa0MsR0FBd0MsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVyRzs7V0FFRztRQUNjLHNDQUFpQyxHQUF3QyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXBHOztXQUVHO1FBQ2MseUNBQW9DLEdBQXdDLElBQUksR0FBRyxFQUFFLENBQUM7UUFPdkc7O1VBRUU7UUFDTyxhQUFRLEdBQStCLElBQUksR0FBRyxFQUFFLENBQUM7UUF3RHRELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLDhCQUE4QjtRQUM5QixJQUFJLGFBQWEsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFHLFlBQVk7UUFDbEYsSUFBSSxDQUFDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRSxDQUFDLFFBQVEsRUFBRSxLQUFLO1lBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztnQkFDL0IsYUFBYSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1lBQ25FLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUF0REQ7O09BRUc7SUFDSCxJQUFJLFFBQVE7UUFDUixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUk7WUFDRixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksYUFBYTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLHNCQUFzQjtRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQzVFLElBQUk7WUFDQSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksd0JBQXdCO1FBQ3hCLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVmLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sSUFBSSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7UUFDbkUsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQWdCRCxZQUFZO0lBRVosY0FBYztJQUVkOztPQUVHO0lBQ0ssdUJBQXVCO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO1FBRTlELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsTUFBTSxTQUFTLEdBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQztnQkFDMUIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksS0FBSyxDQUFDO2dCQUN0QyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxLQUFLLENBQUM7Z0JBQ3pDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxJQUFJLEtBQUssQ0FBQztnQkFDL0MsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLElBQUksS0FBSyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsaUNBQWlDLENBQUMsSUFBSSxLQUFLLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxJQUFJLEtBQUssQ0FBQztnQkFDcEQsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQTRCO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLEVBQUUsQ0FBQztZQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ2QsSUFBSTtZQUNBLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxhQUFhLENBQUMsU0FBNEI7UUFDdEMsSUFBSSxLQUFLLEdBQWtCLElBQUksQ0FBQztRQUVoQyxHQUFHLENBQUMsQ0FBQyxNQUFNLFdBQVcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRW5ELEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUksS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUNyRCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUVELEtBQUssR0FBRyxZQUFZLENBQUM7UUFDekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsa0JBQWtCLENBQUMsUUFBa0QsRUFBRSxzQkFBK0IsS0FBSztRQUN2RyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUVwQyxHQUFHLENBQUMsQ0FBQyxNQUFNLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDN0QsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsZ0JBQWdCLENBQUMsUUFBa0QsRUFBRSxzQkFBK0IsS0FBSztRQUNyRyxFQUFFLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQztZQUNwQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hELElBQUk7WUFDQSxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFrQkQsY0FBYyxDQUFDLFFBQW1CLEVBQUUsbUJBQTZCO1FBQzdELE1BQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSztZQUN6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJO2dCQUNBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBY0QsWUFBWSxDQUFDLFFBQW1CLEVBQUUsbUJBQTZCO1FBQzNELE1BQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSztZQUN2QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJO2dCQUNBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQkFBaUIsQ0FBSSxRQUFrRCxFQUFFLE9BQVUsRUFBRSxtQkFBNkI7UUFDOUcsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBRXJCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUU1RixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBSSxRQUFrRCxFQUFFLE9BQVUsRUFBRSxtQkFBNkI7UUFDNUcsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBRXJCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUEsQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUUxRixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLFFBQTJDLEVBQUUsbUJBQTZCO1FBQ3JGLElBQUksTUFBaUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSztZQUN6QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDaEIsQ0FBQztRQUNMLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBRXhCLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsUUFBMkMsRUFBRSxtQkFBNkI7UUFDbkYsSUFBSSxNQUFpQyxDQUFDO1FBRXRDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNoQixDQUFDO1FBQ0wsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFeEIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsWUFBWTtJQUVaLGdCQUFnQjtJQUVoQjs7T0FFRztJQUNILE9BQU8sQ0FBd0IsUUFBVztRQUN0QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUcsQ0FBQztRQUVELE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsUUFBcUI7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxJQUFJLEVBQUUsS0FBSztZQUN6QyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBYUQsTUFBTSxDQUFDLFFBQXNCLEVBQUUscUJBQThCLElBQUk7UUFDN0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pILENBQUM7UUFDTCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRO2dCQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pILENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQkFBaUIsQ0FBQyxRQUFzQixFQUFFLGtCQUE0QixFQUFFLGNBQXVCLElBQUk7UUFDL0YsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQWUsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGVBQWUsQ0FBQyxRQUFzQixFQUFFLGtCQUE0QixFQUFFLGNBQXVCLElBQUk7UUFDN0YsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQWUsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLElBQVUsRUFBRSxZQUFzQjtRQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFDYixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsSUFBSTtnQkFDQSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsa0JBQWtCLENBQUMsSUFBVSxFQUFFLGNBQXVCLElBQUksRUFBRSxZQUFzQjtRQUM5RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILGdCQUFnQixDQUFDLElBQVUsRUFBRSxjQUF1QixJQUFJLEVBQUUsWUFBc0I7UUFDNUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBV0QsR0FBRyxDQUFDLFFBQXNCO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJO1lBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBYUQsY0FBYyxDQUFDLFFBQWMsRUFBRSxjQUF1QixJQUFJO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQWFELFlBQVksQ0FBQyxRQUFjLEVBQUUsY0FBdUIsSUFBSTtRQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUE4QkQsRUFBRSxDQUFDLEtBQWEsRUFBRSxRQUF3QztRQUN0RCxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1osS0FBSyxhQUFhO2dCQUNkLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzFDLEtBQUssQ0FBQztZQUNWLEtBQUssZ0JBQWdCO2dCQUNqQixJQUFJLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QyxLQUFLLENBQUM7WUFDVixLQUFLLHNCQUFzQjtnQkFDdkIsSUFBSSxDQUFDLCtCQUErQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbkQsS0FBSyxDQUFDO1lBQ1YsS0FBSyx5QkFBeUI7Z0JBQzFCLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RELEtBQUssQ0FBQztZQUNWLEtBQUssd0JBQXdCO2dCQUN6QixJQUFJLENBQUMsaUNBQWlDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRCxLQUFLLENBQUM7WUFDVixLQUFLLDJCQUEyQjtnQkFDNUIsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEQsS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNMLENBQUM7SUEwQkQsR0FBRyxDQUFDLEtBQWEsRUFBRSxRQUF5QztRQUN4RCxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1osS0FBSyxhQUFhO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJO29CQUNBLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDeEMsS0FBSyxDQUFDO1lBQ1YsS0FBSyxnQkFBZ0I7Z0JBQ2pCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNwRCxJQUFJO29CQUNBLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDM0MsS0FBSyxDQUFDO1lBQ1YsS0FBSyxzQkFBc0I7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMsK0JBQStCLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMxRCxJQUFJO29CQUNBLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDakQsS0FBSyxDQUFDO1lBQ1YsS0FBSyx5QkFBeUI7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMsa0NBQWtDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJO29CQUNBLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDcEQsS0FBSyxDQUFDO1lBQ1YsS0FBSyx3QkFBd0I7Z0JBQ3pCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMsaUNBQWlDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM1RCxJQUFJO29CQUNBLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkQsS0FBSyxDQUFDO1lBQ1YsS0FBSywyQkFBMkI7Z0JBQzVCLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQztvQkFDVCxJQUFJLENBQUMsb0NBQW9DLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvRCxJQUFJO29CQUNBLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDdEQsS0FBSyxDQUFDO1FBQ2QsQ0FBQztJQUNMLENBQUM7O0FBOWxCRCxlQUFlO0FBRWY7O0dBRUc7QUFDcUIsdUJBQVksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBUHJELDZCQW1tQkMiLCJmaWxlIjoiRXZlbnRTcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDkuovku7bnm5HlkKzlmahcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGlzdGVuZXI8VD4ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDkvKDpgJLnmoTmlbDmja5cclxuICAgICAqIEBwYXJhbSBsYXllciDnm5HlkKzlmajmiYDlnKjlsYLnmoTlvJXnlKhcclxuICAgICAqL1xyXG4gICAgKGRhdGE6IGFueSwgbGF5ZXI6IEV2ZW50U3BhY2U8VD4pOiBhbnk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmt7vliqDmiJbliKDpmaTkuovku7bnm5HlkKzlmajlm57osINcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+IHtcclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOWPkeeUn+WPmOWMlueahOebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxheWVyIOWPkeeUn+WPmOWMlueahOWxglxyXG4gICAgICovXHJcbiAgICAobGlzdGVuZXI6IExpc3RlbmVyPFQ+LCBsYXllcjogRXZlbnRTcGFjZTxUPik6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZTxUPiB7XHJcblxyXG4gICAgLy8jcmVnaW9uIOWxnuaAp+S4juaehOmAoFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5q+P6ZqU5aSa6ZW/5pe26Ze05riF55CG5LiA5qyh5pyq6KKr5L2/55So55qE56m65bGCXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IF9nY19pbnRlcnZhbCA9IDYwICogMTAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjeWxguazqOWGjOeahOS6i+S7tuebkeWQrOWZqCAgICAgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2xpc3RlbmVyczogU2V0PExpc3RlbmVyPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+W9k+WJjeWxguacieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFkZExpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5b2T5YmN5bGC5pyJ5LqL5Lu255uR5ZCs5Zmo6KKr5Yig6Zmk5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnm7jlr7nkuo7lvZPliY3lsYLvvIzlvZPnpZblhYjmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5HnmoTlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOebuOWvueS6juW9k+WJjeWxgu+8jOW9k+elluWFiOacieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2s6IFNldDxBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4+ID0gbmV3IFNldCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog55u45a+55LqO5b2T5YmN5bGC77yM5b2T5ZCO5Luj5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+R55qE5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrOiBTZXQ8QWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+PiA9IG5ldyBTZXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOebuOWvueS6juW9k+WJjeWxgu+8jOW9k+WQjuS7o+acieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkeeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazogU2V0PEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPj4gPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDniLblsYLjgILmoLnnmoTniLblsYLkuLp1bmRlZmluZWQgICBcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgcGFyZW50PzogRXZlbnRTcGFjZTxUPjtcclxuXHJcbiAgICAvKipcclxuICAgICog5a2Q5bGCLCBrZXk65a2Q5bGC5ZCN56ewXHJcbiAgICAqL1xyXG4gICAgcmVhZG9ubHkgY2hpbGRyZW46IE1hcDxzdHJpbmcsIEV2ZW50U3BhY2U8VD4+ID0gbmV3IE1hcCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5b2T5YmN5bGC55qE5ZCN56ew44CC5qC555qE5ZCN56ew5Li656m65a2X56ym5LiyICAgIFxyXG4gICAgICog5rOo5oSP77ya5Lul5pWw57uE6KGo56S65pe277yM56m65pWw57uE5omN5Luj6KGo5qC5XHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuXHJcbiAgICAvKipcclxuICAgICAqIOS+m+eUqOaIt+S/neWtmOS4gOS6m+iHquWumuS5ieaVsOaNruOAgiAgICBcclxuICAgICAqL1xyXG4gICAgZGF0YT86IFQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5blvZPliY3lsYLnmoTlrozmlbTkuovku7blkI3np7DjgILvvIjov5Tlm57ku47moLnliLDlvZPliY3lsYLvvIznlLHmr4/kuIDlsYLnmoRuYW1l57uE5oiQ55qE5pWw57uE77yJXHJcbiAgICAgKi9cclxuICAgIGdldCBmdWxsTmFtZSgpOiBzdHJpbmdbXSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucGFyZW50LmZ1bGxOYW1lXHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WJjeWxguazqOWGjOS6huWkmuWwkeebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBnZXQgbGlzdGVuZXJDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOebuOWvueS6juW9k+WJjeWxgu+8jOiOt+WPluaJgOacieelluWFiOS4iuazqOWGjOS6huWkmuWwkeebkeWQrOWZqOOAgijkuI3ljIXmi6zlvZPliY3lsYIpXHJcbiAgICAgKi9cclxuICAgIGdldCBhbmNlc3RvcnNMaXN0ZW5lckNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuYW5jZXN0b3JzTGlzdGVuZXJDb3VudCArIHRoaXMucGFyZW50Ll9saXN0ZW5lcnMuc2l6ZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55u45a+55LqO5b2T5YmN5bGC77yM6I635Y+W5omA5pyJ5ZCO5Luj5LiK5rOo5YaM5LqG5aSa5bCR55uR5ZCs5Zmo44CCKOS4jeWMheaLrOW9k+WJjeWxgilcclxuICAgICAqL1xyXG4gICAgZ2V0IGRlc2NlbmRhbnRzTGlzdGVuZXJDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbi52YWx1ZXMoKSkge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gaXRlbS5kZXNjZW5kYW50c0xpc3RlbmVyQ291bnQgKyBpdGVtLl9saXN0ZW5lcnMuc2l6ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50PzogRXZlbnRTcGFjZTxUPiwgbmFtZTogc3RyaW5nID0gJycpIHtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG5cclxuICAgICAgICAvLy0tLS0tLS0tIOa4heeQhuS4jeWGjeiiq+S9v+eUqOeahOWxgiAtLS0tLS0tLS1cclxuICAgICAgICBsZXQgbmV4dENsZWFyVGltZSA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpICsgRXZlbnRTcGFjZS5fZ2NfaW50ZXJ2YWw7ICAgLy/kuIvkuIDmrKHmuIXnkIbnmoTmnIDml6nml7bpl7RcclxuICAgICAgICB0aGlzLm9uKCdkZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyJywgKGxpc3RlbmVyLCBsYXllcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoKG5ldyBEYXRlKS5nZXRUaW1lKCkgPiBuZXh0Q2xlYXJUaW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCk7XHJcbiAgICAgICAgICAgICAgICBuZXh0Q2xlYXJUaW1lID0gKG5ldyBEYXRlKS5nZXRUaW1lKCkgKyBFdmVudFNwYWNlLl9nY19pbnRlcnZhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgIC8vI3JlZ2lvbiDlt6Xlhbfmlrnms5VcclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4heeQhuS4jeWGjeiiq+S9v+eUqOeahOWxglxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIF9jbGVhck5vTG9uZ2VyVXNlZExheWVyKCkge1xyXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IGl0ZW0uX2NsZWFyTm9Mb25nZXJVc2VkTGF5ZXIoKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZWVkQ2xlYXIgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BZGRMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5zaXplID09PSAwICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc0FkZExpc3RlbmVyQ2FsbGJhY2suc2l6ZSA9PT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25BbmNlc3RvcnNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLnNpemUgPT09IDAgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9PT0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5lZWRDbGVhcilcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLmRlbGV0ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuS6i+S7tuWQjei9rOaNouaIkOaVsOe7hOeahOW9ouW8jyAgICBcclxuICAgICAqIOazqOaEj++8muepuuWtl+espuS4suWwhuS8muiiq+i9rOaNouaIkOepuuaVsOe7hFxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7BcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShldmVudE5hbWUpKVxyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnROYW1lO1xyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gJycpXHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE5hbWUuc3BsaXQoJy4nKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruS6i+S7tuWQjeensOiOt+WPlueJueWumueahOWQjuS7o+OAgijkuI3lrZjlnKjkvJroh6rliqjliJvlu7opXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICovXHJcbiAgICBnZXREZXNjZW5kYW50KGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10pOiBFdmVudFNwYWNlPFQ+IHtcclxuICAgICAgICBsZXQgbGF5ZXI6IEV2ZW50U3BhY2U8VD4gPSB0aGlzO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnROYW1lIG9mIEV2ZW50U3BhY2UuY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudExheWVyID0gbGF5ZXIuY2hpbGRyZW4uZ2V0KGN1cnJlbnROYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGF5ZXIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudExheWVyID0gbmV3IEV2ZW50U3BhY2U8VD4obGF5ZXIsIGN1cnJlbnROYW1lKTtcclxuICAgICAgICAgICAgICAgIGxheWVyLmNoaWxkcmVuLnNldChjdXJyZW50TmFtZSwgY3VycmVudExheWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGF5ZXIgPSBjdXJyZW50TGF5ZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGF5ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvqrnjq/pgY3ljobmr4/kuIDkuKrlkI7ku6PjgILov5Tlm55ib29sZWFu77yM55So5LqO5Yik5pat6YGN5Y6G5piv5ZCm5Y+R55Sf5Lit5patICAgICBcclxuICAgICAqIOaPkOekuu+8muWmguaenOaKimNhbGxiYWNr5L2c5Li65Yik5pat5p2h5Lu277yM5Y+v5Lul5bCGZm9yRWFjaERlc2NlbmRhbnRz5qih5ouf5oiQaW5jbHVkZXPmnaXkvb/nlKhcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDlm57osIPjgILov5Tlm550cnVl5YiZ57uI5q2i6YGN5Y6GXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBmb3JFYWNoRGVzY2VuZGFudHMoY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gdm9pZCB8IGJvb2xlYW4sIGluY2x1ZGVDdXJyZW50TGF5ZXI6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChpbmNsdWRlQ3VycmVudExheWVyKVxyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sodGhpcykpIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5jaGlsZHJlbi52YWx1ZXMoKSkge1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5mb3JFYWNoRGVzY2VuZGFudHMoY2FsbGJhY2ssIHRydWUpKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW+queOr+mBjeWOhuavj+S4gOS4quelluWFiOOAgui/lOWbnmJvb2xlYW7vvIznlKjkuo7liKTmlq3pgY3ljobmmK/lkKblj5HnlJ/kuK3mlq0gICAgIFxyXG4gICAgICog5o+Q56S677ya5aaC5p6c5oqKY2FsbGJhY2vkvZzkuLrliKTmlq3mnaHku7bvvIzlj6/ku6XlsIZmb3JFYWNoQW5jZXN0b3Jz5qih5ouf5oiQaW5jbHVkZXPmnaXkvb/nlKhcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayDlm57osIPjgILov5Tlm550cnVl5YiZ57uI5q2i6YGN5Y6GXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBmb3JFYWNoQW5jZXN0b3JzKGNhbGxiYWNrOiAobGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IHZvaWQgfCBib29sZWFuLCBpbmNsdWRlQ3VycmVudExheWVyOiBib29sZWFuID0gZmFsc2UpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoaW5jbHVkZUN1cnJlbnRMYXllcilcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKHRoaXMpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJlbnQuZm9yRWFjaEFuY2VzdG9ycyhjYWxsYmFjaywgdHJ1ZSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlsIbmiYDmnInlkI7ku6Pkv53lrZjliLDkuIDkuKrmlbDnu4TkuK0gICAgXHJcbiAgICAgKiDms6jmhI/vvJrlkI7ku6PnmoTmlbDnm67pmo/ml7blj6/og73kvJrlj5jljJbvvIzlm6DkuLrlj6/og73kvJrmnInnm5HlkKzlmajlnKjmlrDnmoTlkI7ku6PkuIrms6jlhoxcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHVuZGVmaW5lZFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwRGVzY2VuZGFudHMoY2FsbGJhY2s/OiB1bmRlZmluZWQsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogRXZlbnRTcGFjZTxUPltdXHJcbiAgICAvKipcclxuICAgICAqIOmBjeWOhuavj+S4gOS4quWQjuS7o++8jOWwhuavj+S4gOasoemBjeWOhueahOe7k+aenOS/neWtmOWIsOS4gOS4quaVsOe7hOS4rSAgICBcclxuICAgICAqIOazqOaEj++8muWQjuS7o+eahOaVsOebrumaj+aXtuWPr+iDveS8muWPmOWMlu+8jOWboOS4uuWPr+iDveS8muacieebkeWQrOWZqOWcqOaWsOeahOWQjuS7o+S4iuazqOWGjFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBtYXBEZXNjZW5kYW50czxQPihjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiBQLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IFBbXVxyXG4gICAgbWFwRGVzY2VuZGFudHMoY2FsbGJhY2s/OiBGdW5jdGlvbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBhbnlbXSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0OiBhbnlbXSA9IFtdO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKGxheWVyKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxheWVyKTtcclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWwhuaJgOacieelluWFiOS/neWtmOWIsOS4gOS4quaVsOe7hOS4rVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHVuZGVmaW5lZFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgbWFwQW5jZXN0b3JzKGNhbGxiYWNrPzogdW5kZWZpbmVkLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IEV2ZW50U3BhY2U8VD5bXVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgY3ljobmr4/kuIDkuKrnpZblhYjvvIzlsIbmr4/kuIDmrKHpgY3ljobnmoTnu5Pmnpzkv53lrZjliLDkuIDkuKrmlbDnu4TkuK0gICAgXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Zue6LCDXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBtYXBBbmNlc3RvcnM8UD4oY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gUCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBQW11cclxuICAgIG1hcEFuY2VzdG9ycyhjYWxsYmFjaz86IEZ1bmN0aW9uLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IGFueVtdIHtcclxuICAgICAgICBjb25zdCByZXN1bHQ6IGFueVtdID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKGxheWVyKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGxheWVyKTtcclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe0r+WKoOavj+S4gOS4quWQjuS7o+OAguexu+S8vOS6juaVsOe7hOeahHJlZHVjZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluaXRpYWwg5Yid5aeL5YC8XHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICByZWR1Y2VEZXNjZW5kYW50czxQPihjYWxsYmFjazogKHByZXZpb3VzOiBQLCBsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gUCwgaW5pdGlhbDogUCwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBQIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gaW5pdGlhbDtcclxuXHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4geyByZXN1bHQgPSBjYWxsYmFjayhyZXN1bHQsIGxheWVyKSB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe0r+WKoOavj+S4gOS4quelluWFiOOAguexu+S8vOS6juaVsOe7hOeahHJlZHVjZVxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWbnuiwg1xyXG4gICAgICogQHBhcmFtIGluaXRpYWwg5Yid5aeL5YC8XHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZUN1cnJlbnRMYXllciDmmK/lkKbljIXlkKvlvZPliY3lsYLvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICByZWR1Y2VBbmNlc3RvcnM8UD4oY2FsbGJhY2s6IChwcmV2aW91czogUCwgbGF5ZXI6IEV2ZW50U3BhY2U8VD4pID0+IFAsIGluaXRpYWw6IFAsIGluY2x1ZGVDdXJyZW50TGF5ZXI/OiBib29sZWFuKTogUCB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGluaXRpYWw7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7IHJlc3VsdCA9IGNhbGxiYWNrKHJlc3VsdCwgbGF5ZXIpIH0sIGluY2x1ZGVDdXJyZW50TGF5ZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5qC55o2u57uZ5a6a55qE5p2h5Lu25om+5Ye65LiA5Liq5ruh6Laz5p2h5Lu255qE5ZCO5LujXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sg5Yik5pat5p2h5Lu277yM5aaC5p6c5ruh6Laz5YiZ6L+U5ZuedHJ1ZVxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVDdXJyZW50TGF5ZXIg5piv5ZCm5YyF5ZCr5b2T5YmN5bGC77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZmluZERlc2NlbmRhbnQoY2FsbGJhY2s6IChsYXllcjogRXZlbnRTcGFjZTxUPikgPT4gYm9vbGVhbiwgaW5jbHVkZUN1cnJlbnRMYXllcj86IGJvb2xlYW4pOiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcmVzdWx0OiBFdmVudFNwYWNlPFQ+IHwgdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhsYXllcikpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrue7meWumueahOadoeS7tuaJvuWHuuS4gOS4qua7oei2s+adoeS7tueahOelluWFiFxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIOWIpOaWreadoeS7tu+8jOWmguaenOa7oei2s+WImei/lOWbnnRydWVcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlQ3VycmVudExheWVyIOaYr+WQpuWMheWQq+W9k+WJjeWxgu+8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGZpbmRBbmNlc3RvcihjYWxsYmFjazogKGxheWVyOiBFdmVudFNwYWNlPFQ+KSA9PiBib29sZWFuLCBpbmNsdWRlQ3VycmVudExheWVyPzogYm9vbGVhbik6IEV2ZW50U3BhY2U8VD4gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCByZXN1bHQ6IEV2ZW50U3BhY2U8VD4gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhsYXllcikpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBpbmNsdWRlQ3VycmVudExheWVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5LqL5Lu25pON5L2c5pa55rOVXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgcmVjZWl2ZTxQIGV4dGVuZHMgTGlzdGVuZXI8VD4+KGxpc3RlbmVyOiBQKTogUCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycy5zaXplIDwgdGhpcy5fbGlzdGVuZXJzLmFkZChsaXN0ZW5lcikuc2l6ZSkgeyAvL+ehruS/neacieaWsOeahOebkeWQrOWZqOiiq+a3u+WKoFxyXG4gICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmZvckVhY2hEZXNjZW5kYW50cyhsYXllciA9PiBsYXllci5fb25BbmNlc3RvcnNBZGRMaXN0ZW5lckNhbGxiYWNrLmZvckVhY2goY2IgPT4gY2IobGlzdGVuZXIsIHRoaXMpKSk7XHJcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaEFuY2VzdG9ycyhsYXllciA9PiBsYXllci5fb25EZXNjZW5kYW50c0FkZExpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaXN0ZW5lcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOWPquS9v+eUqOS4gOasoeeahOS6i+S7tuebkeWQrOWZqOOAgiAgICBcclxuICAgICAqIOazqOaEj++8mueUseS6jnJlY2VpdmVPbmNl5Lya5a+55Lyg5YWl55qEbGlzdGVuZXLov5vooYzkuIDmrKHljIXoo4XvvIzmiYDku6Xov5Tlm57nmoRsaXN0ZW5lcuS4juS8oOWFpeeahGxpc3RlbmVy5bm25LiN55u45ZCMXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmVPbmNlKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPik6IExpc3RlbmVyPFQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZWNlaXZlKGZ1bmN0aW9uIG9uY2UoZGF0YSwgbGF5ZXIpIHtcclxuICAgICAgICAgICAgbGlzdGVuZXIoZGF0YSwgbGF5ZXIpO1xyXG4gICAgICAgICAgICBsYXllci5jYW5jZWwob25jZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBjbGVhckRhdGFXaGVuRW1wdHkg5piv5ZCm5ZCM5pe25riF55CG6K+l5bGC55qEZGF0YeWxnuaAp++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgY2FuY2VsKGxpc3RlbmVyPzogdW5kZWZpbmVkLCBjbGVhckRhdGFXaGVuRW1wdHk/OiBib29sZWFuKTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTnibnlrprnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsaXN0ZW5lciDlj6/ku6XkvKDpgJLkuIDkuKpsaXN0ZW5lcuadpeWPqua4hemZpOS4gOS4queJueWumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGNsZWFyRGF0YVdoZW5FbXB0eSDlpoLmnpzliKDlhYnkuobor6XlsYLnmoTmiYDmnInnm5HlkKzlmajvvIzmmK/lkKbmuIXnkIbor6XlsYLnmoRkYXRh5bGe5oCn77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBjYW5jZWwobGlzdGVuZXI6IExpc3RlbmVyPFQ+LCBjbGVhckRhdGFXaGVuRW1wdHk/OiBib29sZWFuKTogdm9pZFxyXG4gICAgY2FuY2VsKGxpc3RlbmVyPzogTGlzdGVuZXI8VD4sIGNsZWFyRGF0YVdoZW5FbXB0eTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgICAgICBpZiAobGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIuX29uQW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2gobGlzdGVuZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vblJlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZm9yRWFjaChjYiA9PiBjYihsaXN0ZW5lciwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIuX29uQW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5mb3JFYWNoKGNiID0+IGNiKGxpc3RlbmVyLCB0aGlzKSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjbGVhckRhdGFXaGVuRW1wdHkgJiYgdGhpcy5fbGlzdGVuZXJzLnNpemUgPT09IDApXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa4heeQhuaJgOacieWQjuS7o+S4iueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOWPr+S7peS8oOmAkuS4gOS4qmxpc3RlbmVy5p2l5riF6Zmk5q+P5LiA5Liq5ZCO5Luj5LiK55qE5LiA5Liq54m55a6a5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gY2xlYXJEYXRhV2hlbkVtcHR5IOWmguaenOWIoOWFieS6huafkOWxgueahOebkeWQrOWZqO+8jOaYr+WQpua4heeQhuivpeWxgueahGRhdGHlsZ7mgKfvvIzpu5jorqR0cnVlXHJcbiAgICAgKiBAcGFyYW0gaW5jbHVkZVNlbGYg5Y+v5Lul5Lyg6YCS5LiA5LiqYm9vbGVhbuadpeaMh+ekuuaYr+WQpuimgeWQjOaXtua4hemZpOiHqui6q+eahOS6i+S7tuebkeWQrOWZqO+8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgY2FuY2VsRGVzY2VuZGFudHMobGlzdGVuZXI/OiBMaXN0ZW5lcjxUPiwgY2xlYXJEYXRhV2hlbkVtcHR5PzogYm9vbGVhbiwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIuY2FuY2VsKGxpc3RlbmVyIGFzIGFueSwgY2xlYXJEYXRhV2hlbkVtcHR5KSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5riF55CG5omA5pyJ56WW5YWI5LiK55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGlzdGVuZXIg5Y+v5Lul5Lyg6YCS5LiA5LiqbGlzdGVuZXLmnaXmuIXpmaTmr4/kuIDkuKrnpZblhYjkuIrnmoTkuIDkuKrnibnlrprkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBjbGVhckRhdGFXaGVuRW1wdHkg5aaC5p6c5Yig5YWJ5LqG5p+Q5bGC55qE55uR5ZCs5Zmo77yM5piv5ZCm5riF55CG6K+l5bGC55qEZGF0YeWxnuaAp++8jOm7mOiupHRydWVcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDlj6/ku6XkvKDpgJLkuIDkuKpib29sZWFu5p2l5oyH56S65piv5ZCm6KaB5ZCM5pe25riF6Zmk6Ieq6Lqr55qE5LqL5Lu255uR5ZCs5Zmo77yM6buY6K6kdHJ1ZVxyXG4gICAgICovXHJcbiAgICBjYW5jZWxBbmNlc3RvcnMobGlzdGVuZXI/OiBMaXN0ZW5lcjxUPiwgY2xlYXJEYXRhV2hlbkVtcHR5PzogYm9vbGVhbiwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLmNhbmNlbChsaXN0ZW5lciBhcyBhbnksIGNsZWFyRGF0YVdoZW5FbXB0eSksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0gYXN5bmNocm9ub3VzIOaYr+WQpumHh+eUqOW8guatpeiwg+eUqO+8jOm7mOiupGZhbHNl44CCKOWFtuWunuWwseaYr+aYr+WQpuS9v+eUqFwic2V0VGltZW91dChsaXN0ZW5lciwgMClcIuadpeiwg+eUqOebkeWQrOWZqClcclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihkYXRhPzogYW55LCBhc3luY2hyb25vdXM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChhc3luY2hyb25vdXMpXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGl0ZW0sIDAsIGRhdGEsIHRoaXMpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBpdGVtKGRhdGEsIHRoaXMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5omA5pyJ5ZCO5Luj5LiK55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHkvKDpgJLnmoTmlbDmja5cclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiAg5Y+v5Lul5Lyg6YCS5LiA5LiqYm9vbGVhbuadpeaMh+ekuuaYr+WQpuimgeWQjOaXtuinpuWPkeiHqui6q+eahOS6i+S7tuebkeWQrOWZqO+8jOm7mOiupHRydWVcclxuICAgICAqIEBwYXJhbSBhc3luY2hyb25vdXMg5piv5ZCm6YeH55So5byC5q2l6LCD55So77yM6buY6K6kZmFsc2XjgIIo5YW25a6e5bCx5piv5piv5ZCm5L2/55SoXCJzZXRUaW1lb3V0KGxpc3RlbmVyLCAwKVwi5p2l6LCD55So55uR5ZCs5ZmoKVxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyRGVzY2VuZGFudHMoZGF0YT86IGFueSwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlLCBhc3luY2hyb25vdXM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoRGVzY2VuZGFudHMobGF5ZXIgPT4gbGF5ZXIudHJpZ2dlcihkYXRhLCBhc3luY2hyb25vdXMpLCBpbmNsdWRlU2VsZik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmiYDmnInnpZblhYjkuIrnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBkYXRhIOimgeS8oOmAkueahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmICDlj6/ku6XkvKDpgJLkuIDkuKpib29sZWFu5p2l5oyH56S65piv5ZCm6KaB5ZCM5pe26Kem5Y+R6Ieq6Lqr55qE5LqL5Lu255uR5ZCs5Zmo77yM6buY6K6kdHJ1ZVxyXG4gICAgICogQHBhcmFtIGFzeW5jaHJvbm91cyDmmK/lkKbph4fnlKjlvILmraXosIPnlKjvvIzpu5jorqRmYWxzZeOAgijlhbblrp7lsLHmmK/mmK/lkKbkvb/nlKhcInNldFRpbWVvdXQobGlzdGVuZXIsIDApXCLmnaXosIPnlKjnm5HlkKzlmagpXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXJBbmNlc3RvcnMoZGF0YT86IGFueSwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlLCBhc3luY2hyb25vdXM/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLnRyaWdnZXIoZGF0YSwgYXN5bmNocm9ub3VzKSwgaW5jbHVkZVNlbGYpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5pat5piv5ZCm5rOo5YaM55qE5pyJ5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIGhhcygpOiBib29sZWFuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreaYr+WQpuazqOWGjOeahOacieeJueWumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOimgei/m+ihjOWIpOaWreeahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBoYXMobGlzdGVuZXI6IExpc3RlbmVyPFQ+KTogYm9vbGVhblxyXG4gICAgaGFzKGxpc3RlbmVyPzogTGlzdGVuZXI8VD4pOiBib29sZWFuIHtcclxuICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuaGFzKGxpc3RlbmVyKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lcnMuc2l6ZSA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKTmlq3lkI7ku6PmmK/lkKbms6jlhoznmoTmnInkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBpbmNsdWRlU2VsZiDmmK/lkKbopoHlkIzml7bliKTmlq3oh6rouqvvvIzpu5jorqR0cnVlXHJcbiAgICAgKi9cclxuICAgIGhhc0Rlc2NlbmRhbnRzKGxpc3RlbmVyPzogdW5kZWZpbmVkLCBpbmNsdWRlU2VsZj86IGJvb2xlYW4pOiBib29sZWFuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreWQjuS7o+aYr+WQpuazqOWGjOeahOacieeJueWumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOimgei/m+ihjOWIpOaWreeahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOaYr+WQpuimgeWQjOaXtuWIpOaWreiHqui6q++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgaGFzRGVzY2VuZGFudHMobGlzdGVuZXI6IExpc3RlbmVyPFQ+LCBpbmNsdWRlU2VsZj86IGJvb2xlYW4pOiBib29sZWFuXHJcbiAgICBoYXNEZXNjZW5kYW50cyhsaXN0ZW5lcj86IGFueSwgaW5jbHVkZVNlbGY6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9yRWFjaERlc2NlbmRhbnRzKGxheWVyID0+IGxheWVyLmhhcyhsaXN0ZW5lciksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreelluWFiOaYr+WQpuazqOWGjOeahOacieS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOaYr+WQpuimgeWQjOaXtuWIpOaWreiHqui6q++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgaGFzQW5jZXN0b3JzKGxpc3RlbmVyPzogdW5kZWZpbmVkLCBpbmNsdWRlU2VsZj86IGJvb2xlYW4pOiBib29sZWFuXHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreelluWFiOaYr+WQpuazqOWGjOeahOacieeJueWumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxpc3RlbmVyIOimgei/m+ihjOWIpOaWreeahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGluY2x1ZGVTZWxmIOaYr+WQpuimgeWQjOaXtuWIpOaWreiHqui6q++8jOm7mOiupHRydWVcclxuICAgICAqL1xyXG4gICAgaGFzQW5jZXN0b3JzKGxpc3RlbmVyOiBMaXN0ZW5lcjxUPiwgaW5jbHVkZVNlbGY/OiBib29sZWFuKTogYm9vbGVhblxyXG4gICAgaGFzQW5jZXN0b3JzKGxpc3RlbmVyPzogYW55LCBpbmNsdWRlU2VsZjogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mb3JFYWNoQW5jZXN0b3JzKGxheWVyID0+IGxheWVyLmhhcyhsaXN0ZW5lciksIGluY2x1ZGVTZWxmKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAvLyNyZWdpb24g5rOo5YaM55uR5ZCs55uR5ZCs5Zmo5Y+Y5YyW5Zue6LCD5Ye95pWwXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPlvZPliY3lsYLmnInmlrDnmoTkuovku7bnm5HlkKzlmajooqvmt7vliqDml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6ICdhZGRMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOW9k+W9k+WJjeWxguacieS6i+S7tuebkeWQrOWZqOiiq+WIoOmZpOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogJ3JlbW92ZUxpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5b2T56WW5YWI5pyJ5paw55qE5LqL5Lu255uR5ZCs5Zmo6KKr5re75Yqg5pe26Kem5Y+RXHJcbiAgICAgKi9cclxuICAgIG9uKGV2ZW50OiAnYW5jZXN0b3JzQWRkTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPnpZblhYjmnInkuovku7bnm5HlkKzlmajooqvliKDpmaTml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6ICdhbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICAvKipcclxuICAgICAqIOW9k+WQjuS7o+acieaWsOeahOS6i+S7tuebkeWQrOWZqOiiq+a3u+WKoOaXtuinpuWPkVxyXG4gICAgICovXHJcbiAgICBvbihldmVudDogJ2Rlc2NlbmRhbnRzQWRkTGlzdGVuZXInLCBsaXN0ZW5lcjogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDlvZPlkI7ku6PmnInkuovku7bnm5HlkKzlmajooqvliKDpmaTml7bop6blj5FcclxuICAgICAqL1xyXG4gICAgb24oZXZlbnQ6ICdkZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyJywgbGlzdGVuZXI6IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIG9uKGV2ZW50OiBzdHJpbmcsIGxpc3RlbmVyOiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQWRkTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3JlbW92ZUxpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2VzdG9yc0FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2VzdG9yc1JlbW92ZUxpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5hZGQobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2Rlc2NlbmRhbnRzQWRkTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c0FkZExpc3RlbmVyQ2FsbGJhY2suYWRkKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmFkZChsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKphZGRMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnQ6ICdhZGRMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKpyZW1vdmVMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnQ6ICdyZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKphbmNlc3RvcnNBZGRMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnQ6ICdhbmNlc3RvcnNBZGRMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKphbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnQ6ICdhbmNlc3RvcnNSZW1vdmVMaXN0ZW5lcicsIGxpc3RlbmVyPzogQWRkT3JSZW1vdmVMaXN0ZW5lckNhbGxiYWNrPFQ+KTogdm9pZFxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTmiYDmnInmiJbljZXkuKpkZXNjZW5kYW50c0FkZExpc3RlbmVy55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIG9mZihldmVudDogJ2Rlc2NlbmRhbnRzQWRkTGlzdGVuZXInLCBsaXN0ZW5lcj86IEFkZE9yUmVtb3ZlTGlzdGVuZXJDYWxsYmFjazxUPik6IHZvaWRcclxuICAgIC8qKlxyXG4gICAgICog5riF6Zmk5omA5pyJ5oiW5Y2V5LiqZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcuebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBvZmYoZXZlbnQ6ICdkZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyJywgbGlzdGVuZXI/OiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkXHJcbiAgICBvZmYoZXZlbnQ6IHN0cmluZywgbGlzdGVuZXI/OiBBZGRPclJlbW92ZUxpc3RlbmVyQ2FsbGJhY2s8VD4pOiB2b2lkIHtcclxuICAgICAgICBzd2l0Y2ggKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFkZExpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdyZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmRlbGV0ZShsaXN0ZW5lcik7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25SZW1vdmVMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnYW5jZXN0b3JzQWRkTGlzdGVuZXInOlxyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uQW5jZXN0b3JzQWRkTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2FuY2VzdG9yc1JlbW92ZUxpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkFuY2VzdG9yc1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdkZXNjZW5kYW50c0FkZExpc3RlbmVyJzpcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lcilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzQWRkTGlzdGVuZXJDYWxsYmFjay5kZWxldGUobGlzdGVuZXIpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29uRGVzY2VuZGFudHNBZGRMaXN0ZW5lckNhbGxiYWNrLmNsZWFyKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZGVzY2VuZGFudHNSZW1vdmVMaXN0ZW5lcic6XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb25EZXNjZW5kYW50c1JlbW92ZUxpc3RlbmVyQ2FsbGJhY2suZGVsZXRlKGxpc3RlbmVyKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vbkRlc2NlbmRhbnRzUmVtb3ZlTGlzdGVuZXJDYWxsYmFjay5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59Il19
