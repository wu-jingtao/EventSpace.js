"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件层级类
 */
class EventLevel {
    constructor() {
        this._receivers = []; //当前层级的接收器
        this._children = new Map(); //子层级, key:子层级名称
    }
    /**
     * 获取指定层级
     * @param levelNameArray 事件层级名字数组
     * @param autoCreateLevel 是否自动创建不存在的层级，默认false
     */
    getLevel(levelNameArray, autoCreateLevel = false) {
        let level = this; //查询到的对应层级
        for (const currentName of levelNameArray) {
            let currentLevel = level._children.get(currentName);
            if (currentLevel === undefined) {
                if (autoCreateLevel) {
                    currentLevel = new EventLevel();
                    level._children.set(currentName, currentLevel);
                }
                else {
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
    addReceiver(levelNameArray, receiver) {
        this.getLevel(levelNameArray, true)._receivers.push(receiver);
    }
    /**
     * 移除指定层级的事件监听器
     * @param levelNameArray 层级名字数组
     */
    removeReceiver(levelNameArray) {
        const level = this.getLevel(levelNameArray);
        if (level !== undefined) {
            level._receivers.length = 0;
            level._children.clear();
        }
    }
    /**
     * 触发所有指定级别以及子级的监听器
     * @param levelNameArray 事件层级名字数组
     * @param data 要给触发的方法传递的数据
     */
    trigger(levelNameArray, data) {
        const level = this.getLevel(levelNameArray);
        if (level !== undefined) {
            const triggerChildren = (level) => {
                level._receivers.forEach(item => item(data));
                level._children.forEach(triggerChildren);
            };
            triggerChildren(level);
        }
    }
    ;
}
exports.EventLevel = EventLevel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50TGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQTs7R0FFRztBQUNIO0lBQUE7UUFFcUIsZUFBVSxHQUFlLEVBQUUsQ0FBQyxDQUFXLFVBQVU7UUFDakQsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUksZ0JBQWdCO0lBcUV4RixDQUFDO0lBakVHOzs7O09BSUc7SUFDSCxRQUFRLENBQUMsY0FBd0IsRUFBRSxrQkFBMkIsS0FBSztRQUMvRCxJQUFJLEtBQUssR0FBZSxJQUFJLENBQUMsQ0FBRyxVQUFVO1FBRTFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sV0FBVyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFcEQsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLFlBQVksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO29CQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDckIsQ0FBQztZQUNMLENBQUM7WUFFRCxLQUFLLEdBQUcsWUFBWSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsV0FBVyxDQUFDLGNBQXdCLEVBQUUsUUFBa0I7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsY0FBYyxDQUFDLGNBQXdCO1FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLGNBQXdCLEVBQUUsSUFBUztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBaUI7Z0JBQ3RDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztDQUNMO0FBeEVELGdDQXdFQyIsImZpbGUiOiJFdmVudExldmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOaOpeaUtuWZqOWbnuiwg+WHveaVsFxyXG4gKi9cclxuZXhwb3J0IHR5cGUgcmVjZWl2ZXIgPSAoZGF0YT86IGFueSwgZXZlbnROYW1lPzogc3RyaW5nW10pID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICog5LqL5Lu25bGC57qn57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVjZWl2ZXJzOiByZWNlaXZlcltdID0gW107ICAgICAgICAgICAvL+W9k+WJjeWxgue6p+eahOaOpeaUtuWZqFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2hpbGRyZW46IE1hcDxzdHJpbmcsIEV2ZW50TGV2ZWw+ID0gbmV3IE1hcCgpOyAgICAvL+WtkOWxgue6pywga2V5OuWtkOWxgue6p+WQjeensFxyXG5cclxuICAgIGdldExldmVsKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgYXV0b0NyZWF0ZUxldmVsPzogZmFsc2UpOiBFdmVudExldmVsIHwgdW5kZWZpbmVkXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbD86IHRydWUpOiBFdmVudExldmVsXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaMh+WumuWxgue6p1xyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIGF1dG9DcmVhdGVMZXZlbCDmmK/lkKboh6rliqjliJvlu7rkuI3lrZjlnKjnmoTlsYLnuqfvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGxldmVsOiBFdmVudExldmVsID0gdGhpczsgICAvL+afpeivouWIsOeahOWvueW6lOWxgue6p1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnROYW1lIG9mIGxldmVsTmFtZUFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TGV2ZWwgPSBsZXZlbC5fY2hpbGRyZW4uZ2V0KGN1cnJlbnROYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGV2ZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dG9DcmVhdGVMZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWwuX2NoaWxkcmVuLnNldChjdXJyZW50TmFtZSwgY3VycmVudExldmVsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV2ZWwgPSBjdXJyZW50TGV2ZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDmjqXmlLblmahcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDkuovku7blsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSByZWNlaXZlciDnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgYWRkUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCByZWNlaXZlcjogcmVjZWl2ZXIpIHsgIC8v5re75Yqg5paw55qE55uR5ZCs5ZmoXHJcbiAgICAgICAgdGhpcy5nZXRMZXZlbChsZXZlbE5hbWVBcnJheSwgdHJ1ZSkuX3JlY2VpdmVycy5wdXNoKHJlY2VpdmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaMh+WumuWxgue6p+eahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICovXHJcbiAgICByZW1vdmVSZWNlaXZlcihsZXZlbE5hbWVBcnJheTogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXZlbC5fcmVjZWl2ZXJzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieaMh+Wumue6p+WIq+S7peWPiuWtkOe6p+eahOebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB57uZ6Kem5Y+R55qE5pa55rOV5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmlnZ2VyQ2hpbGRyZW4gPSAobGV2ZWw6IEV2ZW50TGV2ZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldmVsLl9yZWNlaXZlcnMuZm9yRWFjaChpdGVtID0+IGl0ZW0oZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuX2NoaWxkcmVuLmZvckVhY2godHJpZ2dlckNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJpZ2dlckNoaWxkcmVuKGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59Il19
