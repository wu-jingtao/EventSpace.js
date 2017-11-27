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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50TGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQTs7R0FFRztBQUNIO0lBQUE7UUFFcUIsZUFBVSxHQUFlLEVBQUUsQ0FBQyxDQUFXLFVBQVU7UUFDakQsY0FBUyxHQUE0QixJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUksZ0JBQWdCO0lBcUV4RixDQUFDO0lBakVHOzs7O09BSUc7SUFDSCxRQUFRLENBQUMsY0FBd0IsRUFBRSxrQkFBMkIsS0FBSztRQUMvRCxJQUFJLEtBQUssR0FBZSxJQUFJLENBQUMsQ0FBRyxVQUFVO1FBRTFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sV0FBVyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFcEQsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzdCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xCLFlBQVksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO29CQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ25ELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDckIsQ0FBQztZQUNMLENBQUM7WUFFRCxLQUFLLEdBQUcsWUFBWSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsV0FBVyxDQUFDLGNBQXdCLEVBQUUsUUFBa0I7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsY0FBYyxDQUFDLGNBQXdCO1FBQ25DLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDNUIsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLGNBQXdCLEVBQUUsSUFBUztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sZUFBZSxHQUFHLENBQUMsS0FBaUI7Z0JBQ3RDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFBO1lBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztDQUNMO0FBeEVELGdDQXdFQyIsImZpbGUiOiJFdmVudExldmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOaOpeaUtuWZqOWbnuiwg+WHveaVsFxyXG4gKi9cclxuZXhwb3J0IHR5cGUgcmVjZWl2ZXIgPSAoZGF0YT86IGFueSkgPT4gYW55O1xyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWxgue6p+exu1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEV2ZW50TGV2ZWwge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX3JlY2VpdmVyczogcmVjZWl2ZXJbXSA9IFtdOyAgICAgICAgICAgLy/lvZPliY3lsYLnuqfnmoTmjqXmlLblmahcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2NoaWxkcmVuOiBNYXA8c3RyaW5nLCBFdmVudExldmVsPiA9IG5ldyBNYXAoKTsgICAgLy/lrZDlsYLnuqcsIGtleTrlrZDlsYLnuqflkI3np7BcclxuXHJcbiAgICBnZXRMZXZlbChsZXZlbE5hbWVBcnJheTogc3RyaW5nW10sIGF1dG9DcmVhdGVMZXZlbD86IGZhbHNlKTogRXZlbnRMZXZlbCB8IHVuZGVmaW5lZFxyXG4gICAgZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBhdXRvQ3JlYXRlTGV2ZWw/OiB0cnVlKTogRXZlbnRMZXZlbFxyXG4gICAgLyoqXHJcbiAgICAgKiDojrflj5bmjIflrprlsYLnuqdcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDkuovku7blsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSBhdXRvQ3JlYXRlTGV2ZWwg5piv5ZCm6Ieq5Yqo5Yib5bu65LiN5a2Y5Zyo55qE5bGC57qn77yM6buY6K6kZmFsc2VcclxuICAgICAqL1xyXG4gICAgZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdLCBhdXRvQ3JlYXRlTGV2ZWw6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCBsZXZlbDogRXZlbnRMZXZlbCA9IHRoaXM7ICAgLy/mn6Xor6LliLDnmoTlr7nlupTlsYLnuqdcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjdXJyZW50TmFtZSBvZiBsZXZlbE5hbWVBcnJheSkge1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudExldmVsID0gbGV2ZWwuX2NoaWxkcmVuLmdldChjdXJyZW50TmFtZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudExldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRvQ3JlYXRlTGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGV2ZWwgPSBuZXcgRXZlbnRMZXZlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5zZXQoY3VycmVudE5hbWUsIGN1cnJlbnRMZXZlbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldmVsID0gY3VycmVudExldmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5o6l5pS25ZmoXHJcbiAgICAgKiBAcGFyYW0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu25bGC57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg55uR5ZCs5ZmoXHJcbiAgICAgKi9cclxuICAgIGFkZFJlY2VpdmVyKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgcmVjZWl2ZXI6IHJlY2VpdmVyKSB7ICAvL+a3u+WKoOaWsOeahOebkeWQrOWZqFxyXG4gICAgICAgIHRoaXMuZ2V0TGV2ZWwobGV2ZWxOYW1lQXJyYXksIHRydWUpLl9yZWNlaXZlcnMucHVzaChyZWNlaXZlcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmjIflrprlsYLnuqfnmoTkuovku7bnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDlsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSB0aGlzLmdldExldmVsKGxldmVsTmFtZUFycmF5KTtcclxuXHJcbiAgICAgICAgaWYgKGxldmVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbGV2ZWwuX3JlY2VpdmVycy5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBsZXZlbC5fY2hpbGRyZW4uY2xlYXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmiYDmnInmjIflrprnuqfliKvku6Xlj4rlrZDnuqfnmoTnm5HlkKzlmahcclxuICAgICAqIEBwYXJhbSBsZXZlbE5hbWVBcnJheSDkuovku7blsYLnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSBkYXRhIOimgee7meinpuWPkeeahOaWueazleS8oOmAkueahOaVsOaNrlxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKGxldmVsTmFtZUFycmF5OiBzdHJpbmdbXSwgZGF0YTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSB0aGlzLmdldExldmVsKGxldmVsTmFtZUFycmF5KTtcclxuXHJcbiAgICAgICAgaWYgKGxldmVsICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgdHJpZ2dlckNoaWxkcmVuID0gKGxldmVsOiBFdmVudExldmVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbC5fcmVjZWl2ZXJzLmZvckVhY2goaXRlbSA9PiBpdGVtKGRhdGEpKTtcclxuICAgICAgICAgICAgICAgIGxldmVsLl9jaGlsZHJlbi5mb3JFYWNoKHRyaWdnZXJDaGlsZHJlbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyaWdnZXJDaGlsZHJlbihsZXZlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSJdfQ==
