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
            this._receivers.clear();
            this._children.clear();
        }
    }
    /**
     * 判定在指定的事件层级下是否绑定的有监听器
     * @param levelNameArray 层级名字数组
     */
    hasReceiver(levelNameArray) {
        const level = this.getLevel(levelNameArray);
        if (level !== undefined) {
            return this._receivers.size > 0 || this._children.size > 0;
        }
        else {
            return false;
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
            level._receivers.forEach(function (item) {
                item(data);
            });
            level._children.forEach(function (child) {
                child.trigger([], data);
            });
        }
    }
    ;
}
exports.EventLevel = EventLevel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUM1QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztDQUNMO0FBeEZELGdDQXdGQyIsImZpbGUiOiJFdmVudExldmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOaOpeaUtuWZqOWbnuiwg+WHveaVsFxyXG4gKi9cclxuZXhwb3J0IHR5cGUgcmVjZWl2ZXIgPSAoZGF0YT86IGFueSwgZXZlbnROYW1lPzogc3RyaW5nW10pID0+IHZvaWQ7XHJcblxyXG4vKipcclxuICog5LqL5Lu25bGC57qn57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVjZWl2ZXJzOiBTZXQ8cmVjZWl2ZXI+ID0gbmV3IFNldCgpOyAgICAgICAgICAgLy/lvZPliY3lsYLnuqfnmoTmjqXmlLblmahcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NoaWxkcmVuOiBNYXA8c3RyaW5nLCBFdmVudExldmVsPiA9IG5ldyBNYXAoKTsgICAgLy/lrZDlsYLnuqcsIGtleTrlrZDlsYLnuqflkI3np7BcclxuXHJcblxyXG4gICAgZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBhdXRvQ3JlYXRlTGV2ZWw/OiBmYWxzZSk6IEV2ZW50TGV2ZWwgfCB1bmRlZmluZWRcclxuICAgIGdldExldmVsKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgYXV0b0NyZWF0ZUxldmVsPzogdHJ1ZSk6IEV2ZW50TGV2ZWxcclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W5oyH5a6a5bGC57qnXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu25bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gYXV0b0NyZWF0ZUxldmVsIOaYr+WQpuiHquWKqOWIm+W7uuS4jeWtmOWcqOeahOWxgue6p++8jOm7mOiupGZhbHNlXHJcbiAgICAgKi9cclxuICAgIGdldExldmVsKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgYXV0b0NyZWF0ZUxldmVsOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgbGV2ZWw6IEV2ZW50TGV2ZWwgPSB0aGlzOyAgIC8v5p+l6K+i5Yiw55qE5a+55bqU5bGC57qnXHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY3VycmVudE5hbWUgb2YgbGV2ZWxOYW1lQXJyYXkpIHtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRMZXZlbCA9IGxldmVsLl9jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRMZXZlbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0b0NyZWF0ZUxldmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudExldmVsID0gbmV3IEV2ZW50TGV2ZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbC5fY2hpbGRyZW4uc2V0KGN1cnJlbnROYW1lLCBjdXJyZW50TGV2ZWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXZlbCA9IGN1cnJlbnRMZXZlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsZXZlbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOa3u+WKoOaOpeaUtuWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOebkeWQrOWZqFxyXG4gICAgICovXHJcbiAgICBhZGRSZWNlaXZlcihsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIHJlY2VpdmVyOiByZWNlaXZlcikgeyAgLy/mt7vliqDmlrDnmoTnm5HlkKzlmahcclxuICAgICAgICB0aGlzLmdldExldmVsKGxldmVsTmFtZUFycmF5LCB0cnVlKS5fcmVjZWl2ZXJzLmFkZChyZWNlaXZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmjIflrprlsYLnuqfnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDlsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSB0aGlzLmdldExldmVsKGxldmVsTmFtZUFycmF5KTtcclxuXHJcbiAgICAgICAgaWYgKGxldmVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVjZWl2ZXJzLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yik5a6a5Zyo5oyH5a6a55qE5LqL5Lu25bGC57qn5LiL5piv5ZCm57uR5a6a55qE5pyJ55uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKi9cclxuICAgIGhhc1JlY2VpdmVyKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gdGhpcy5nZXRMZXZlbChsZXZlbE5hbWVBcnJheSk7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWNlaXZlcnMuc2l6ZSA+IDAgfHwgdGhpcy5fY2hpbGRyZW4uc2l6ZSA+IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieaMh+Wumue6p+WIq+S7peWPiuWtkOe6p+eahOebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB57uZ6Kem5Y+R55qE5pa55rOV5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHRyaWdnZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBkYXRhOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9IHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZXZlbC5fcmVjZWl2ZXJzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0oZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbGV2ZWwuX2NoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC50cmlnZ2VyKFtdLCBkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSJdfQ==
