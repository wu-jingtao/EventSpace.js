"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 事件层级类
 */
class EventLevel {
    constructor() {
        this._receivers = new Set(); //当前层级的接收器
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
        this.getLevel(levelNameArray, true)._receivers.add(receiver);
    }
    /**
     * 移除指定层级的事件监听器
     * @param levelNameArray 层级名字数组
     */
    removeReceiver(levelNameArray) {
        const level = this.getLevel(levelNameArray);
        if (level !== undefined) {
            level._receivers.clear();
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50TGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQTs7R0FFRztBQUNIO0lBQUE7UUFFcUIsZUFBVSxHQUFrQixJQUFJLEdBQUcsRUFBRSxDQUFDLENBQVcsVUFBVTtRQUMzRCxjQUFTLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBSSxnQkFBZ0I7SUFxRXhGLENBQUM7SUFqRUc7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxjQUF3QixFQUFFLGtCQUEyQixLQUFLO1FBQy9ELElBQUksS0FBSyxHQUFlLElBQUksQ0FBQyxDQUFHLFVBQVU7UUFFMUMsR0FBRyxDQUFDLENBQUMsTUFBTSxXQUFXLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVwRCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsWUFBWSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUNyQixDQUFDO1lBQ0wsQ0FBQztZQUVELEtBQUssR0FBRyxZQUFZLENBQUM7UUFDekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsY0FBd0IsRUFBRSxRQUFrQjtRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7O09BR0c7SUFDSCxjQUFjLENBQUMsY0FBd0I7UUFDbkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU1QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0QixLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLGNBQXdCLEVBQUUsSUFBUztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBaUI7Z0JBQ3RDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztDQUNMO0FBeEVELGdDQXdFQyIsImZpbGUiOiJFdmVudExldmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOaOpeaUtuWZqOWbnuiwg+WHveaVsFxyXG4gKi9cclxuZXhwb3J0IHR5cGUgcmVjZWl2ZXIgPSAoZGF0YT86IGFueSwgZXZlbnROYW1lPzogc3RyaW5nW10pID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICog5LqL5Lu25bGC57qn57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVjZWl2ZXJzOiBTZXQ8cmVjZWl2ZXI+ID0gbmV3IFNldCgpOyAgICAgICAgICAgLy/lvZPliY3lsYLnuqfnmoTmjqXmlLblmahcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NoaWxkcmVuOiBNYXA8c3RyaW5nLCBFdmVudExldmVsPiA9IG5ldyBNYXAoKTsgICAgLy/lrZDlsYLnuqcsIGtleTrlrZDlsYLnuqflkI3np7BcclxuXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbD86IGZhbHNlKTogRXZlbnRMZXZlbCB8IHVuZGVmaW5lZFxyXG4gICAgZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBhdXRvQ3JlYXRlTGV2ZWw/OiB0cnVlKTogRXZlbnRMZXZlbFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprlsYLnuqdcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDkuovku7blsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSBhdXRvQ3JlYXRlTGV2ZWwg5piv5ZCm6Ieq5Yqo5Yib5bu65LiN5a2Y5Zyo55qE5bGC57qn77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBhdXRvQ3JlYXRlTGV2ZWw6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBsZXZlbDogRXZlbnRMZXZlbCA9IHRoaXM7ICAgLy/mn6Xor6LliLDnmoTlr7nlupTlsYLnuqdcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjdXJyZW50TmFtZSBvZiBsZXZlbE5hbWVBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudExldmVsID0gbGV2ZWwuX2NoaWxkcmVuLmdldChjdXJyZW50TmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudExldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRvQ3JlYXRlTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBuZXcgRXZlbnRMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5zZXQoY3VycmVudE5hbWUsIGN1cnJlbnRMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldmVsID0gY3VycmVudExldmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5o6l5pS25ZmoXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu25bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIGFkZFJlY2VpdmVyKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgcmVjZWl2ZXI6IHJlY2VpdmVyKSB7ICAvL+a3u+WKoOaWsOeahOebkeWQrOWZqFxyXG4gICAgICAgIHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXksIHRydWUpLl9yZWNlaXZlcnMuYWRkKHJlY2VpdmVyKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaMh+WumuWxgue6p+eahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICovXHJcbiAgICByZW1vdmVSZWNlaXZlcihsZXZlbE5hbWVBcnJheTogc3RyaW5nW10pIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXZlbC5fcmVjZWl2ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieaMh+Wumue6p+WIq+S7peWPiuWtkOe6p+eahOebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB57uZ6Kem5Y+R55qE5pa55rOV5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCB0cmlnZ2VyQ2hpbGRyZW4gPSAobGV2ZWw6IEV2ZW50TGV2ZWwpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldmVsLl9yZWNlaXZlcnMuZm9yRWFjaChpdGVtID0+IGl0ZW0oZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuX2NoaWxkcmVuLmZvckVhY2godHJpZ2dlckNoaWxkcmVuKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJpZ2dlckNoaWxkcmVuKGxldmVsKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59Il19
