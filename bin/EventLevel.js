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
     * 移除指定层级的事件监听器。还可以传递一个监听器来确保只删除它自身。
     * @param levelNameArray 层级名字数组
     * @param receiver 要删除的监听器
     */
    removeReceiver(levelNameArray, receiver) {
        const level = this.getLevel(levelNameArray);
        if (level !== undefined) {
            if (receiver !== undefined)
                level._receivers.delete(receiver);
            else {
                level._receivers.clear();
                level._children.clear();
            }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50TGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQTs7R0FFRztBQUNIO0lBQUE7UUFFcUIsZUFBVSxHQUFrQixJQUFJLEdBQUcsRUFBRSxDQUFDLENBQWEsVUFBVTtRQUM3RCxjQUFTLEdBQTRCLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBSSxnQkFBZ0I7SUEwRXhGLENBQUM7SUF0RUc7Ozs7T0FJRztJQUNILFFBQVEsQ0FBQyxjQUF3QixFQUFFLGtCQUEyQixLQUFLO1FBQy9ELElBQUksS0FBSyxHQUFlLElBQUksQ0FBQyxDQUFHLFVBQVU7UUFFMUMsR0FBRyxDQUFDLENBQUMsTUFBTSxXQUFXLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQztZQUN2QyxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUVwRCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDbEIsWUFBWSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDbkQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsU0FBUyxDQUFDO2dCQUNyQixDQUFDO1lBQ0wsQ0FBQztZQUVELEtBQUssR0FBRyxZQUFZLENBQUM7UUFDekIsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsY0FBd0IsRUFBRSxRQUFrQjtRQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsY0FBYyxDQUFDLGNBQXdCLEVBQUUsUUFBbUI7UUFDeEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU1QyxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO2dCQUN2QixLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsQ0FBQztnQkFDRixLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUN6QixLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsY0FBd0IsRUFBRSxJQUFTO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsTUFBTSxlQUFlLEdBQUcsQ0FBQyxLQUFpQjtnQkFDdEMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM3QyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUE7WUFFRCxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztJQUNMLENBQUM7SUFBQSxDQUFDO0NBQ0w7QUE3RUQsZ0NBNkVDIiwiZmlsZSI6IkV2ZW50TGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5o6l5pS25Zmo5Zue6LCD5Ye95pWwXHJcbiAqL1xyXG5leHBvcnQgdHlwZSByZWNlaXZlciA9IChkYXRhPzogYW55KSA9PiBhbnk7XHJcblxyXG4vKipcclxuICog5LqL5Lu25bGC57qn57G7XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfcmVjZWl2ZXJzOiBTZXQ8cmVjZWl2ZXI+ID0gbmV3IFNldCgpOyAgICAgICAgICAgICAvL+W9k+WJjeWxgue6p+eahOaOpeaUtuWZqFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfY2hpbGRyZW46IE1hcDxzdHJpbmcsIEV2ZW50TGV2ZWw+ID0gbmV3IE1hcCgpOyAgICAvL+WtkOWxgue6pywga2V5OuWtkOWxgue6p+WQjeensFxyXG5cclxuICAgIGdldExldmVsKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgYXV0b0NyZWF0ZUxldmVsPzogZmFsc2UpOiBFdmVudExldmVsIHwgdW5kZWZpbmVkXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbD86IHRydWUpOiBFdmVudExldmVsXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPluaMh+WumuWxgue6p1xyXG4gICAgICogQHBhcmFtIGxldmVsTmFtZUFycmF5IOS6i+S7tuWxgue6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIGF1dG9DcmVhdGVMZXZlbCDmmK/lkKboh6rliqjliJvlu7rkuI3lrZjlnKjnmoTlsYLnuqfvvIzpu5jorqRmYWxzZVxyXG4gICAgICovXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgbGV0IGxldmVsOiBFdmVudExldmVsID0gdGhpczsgICAvL+afpeivouWIsOeahOWvueW6lOWxgue6p1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGN1cnJlbnROYW1lIG9mIGxldmVsTmFtZUFycmF5KSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50TGV2ZWwgPSBsZXZlbC5fY2hpbGRyZW4uZ2V0KGN1cnJlbnROYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50TGV2ZWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dG9DcmVhdGVMZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWwuX2NoaWxkcmVuLnNldChjdXJyZW50TmFtZSwgY3VycmVudExldmVsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV2ZWwgPSBjdXJyZW50TGV2ZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDmjqXmlLblmahcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDkuovku7blsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSByZWNlaXZlciDnm5HlkKzlmahcclxuICAgICAqL1xyXG4gICAgYWRkUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCByZWNlaXZlcjogcmVjZWl2ZXIpIHsgIC8v5re75Yqg5paw55qE55uR5ZCs5ZmoXHJcbiAgICAgICAgdGhpcy5nZXRMZXZlbChsZXZlbE5hbWVBcnJheSwgdHJ1ZSkuX3JlY2VpdmVycy5hZGQocmVjZWl2ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5oyH5a6a5bGC57qn55qE5LqL5Lu255uR5ZCs5Zmo44CC6L+Y5Y+v5Lul5Lyg6YCS5LiA5Liq55uR5ZCs5Zmo5p2l56Gu5L+d5Y+q5Yig6Zmk5a6D6Ieq6Lqr44CCXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg6KaB5Yig6Zmk55qE55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVJlY2VpdmVyKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgcmVjZWl2ZXI/OiByZWNlaXZlcikge1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gdGhpcy5nZXRMZXZlbChsZXZlbE5hbWVBcnJheSk7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChyZWNlaXZlciAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbGV2ZWwuX3JlY2VpdmVycy5kZWxldGUocmVjZWl2ZXIpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldmVsLl9yZWNlaXZlcnMuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5omA5pyJ5oyH5a6a57qn5Yir5Lul5Y+K5a2Q57qn55qE55uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu25bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHnu5nop6blj5HnmoTmlrnms5XkvKDpgJLnmoTmlbDmja5cclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGRhdGE6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IGxldmVsID0gdGhpcy5nZXRMZXZlbChsZXZlbE5hbWVBcnJheSk7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJDaGlsZHJlbiA9IChsZXZlbDogRXZlbnRMZXZlbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV2ZWwuX3JlY2VpdmVycy5mb3JFYWNoKGl0ZW0gPT4gaXRlbShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5fY2hpbGRyZW4uZm9yRWFjaCh0cmlnZ2VyQ2hpbGRyZW4pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cmlnZ2VyQ2hpbGRyZW4obGV2ZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iXX0=
