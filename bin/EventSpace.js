"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventLevel_1 = require("./EventLevel");
/**
 * 根据规则将事件名转换成数组的形式
 * @param eventName 事件名称
 */
function convertEventNameType(eventName) {
    if ('string' === typeof eventName)
        return eventName.length === 0 ? [] : eventName.split('.'); //避免空字符串返回[""]
    else
        return eventName;
}
class EventSpace {
    constructor() {
        this._eventLevel = new EventLevel_1.EventLevel();
        /**
         * 注册事件监听器（别名 on）
         * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 回调函数
         */
        this.receive = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be function');
            this._eventLevel.addReceiver(convertEventNameType(eventName), receiver);
            return receiver;
        };
        this.on = this.receive;
        /**
         * 注册只接收一次的事件监听器（别名 once）
         * @param eventName 接收事件的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 回调函数
         */
        this.receiveOnce = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be function');
            const en = convertEventNameType(eventName);
            en.push(Math.random().toString()); //确保只删除自身
            this._eventLevel.addReceiver(en, (data) => {
                receiver(data);
                this._eventLevel.removeReceiver(en);
            });
            return receiver;
        };
        this.once = this.receiveOnce;
        /**
         * 注销数据接收器（别名 off）
         * @param eventName 注销事件接收器的名称.可以为字符串或数组(字符串通过‘.’来分割层级)
         */
        this.cancel = (eventName) => {
            this._eventLevel.removeReceiver(convertEventNameType(eventName));
        };
        this.off = this.cancel;
        /**
         * 触发指定的事件接收器（别名 trigger）
         * @param eventName 要触发的事件名称.可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param data 要发送的数据
         */
        this.send = (eventName, data) => {
            this._eventLevel.trigger(convertEventNameType(eventName), data);
        };
        this.trigger = this.send;
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFNBQTRCO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLFNBQVMsQ0FBQztRQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxjQUFjO0lBQzlFLElBQUk7UUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3pCLENBQUM7QUFFRDtJQUFBO1FBRXFCLGdCQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFaEQ7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxDQUFDLFNBQTRCLEVBQUUsUUFBa0I7WUFDdkQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsZ0JBQVcsR0FBRyxDQUFDLFNBQTRCLEVBQUUsUUFBa0I7WUFDM0QsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsTUFBTSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFFLFNBQVM7WUFFN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSTtnQkFDbEMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxTQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUV4Qjs7O1dBR0c7UUFDSCxXQUFNLEdBQUcsQ0FBQyxTQUE0QjtZQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQTtRQUNELFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRWxCOzs7O1dBSUc7UUFDSCxTQUFJLEdBQUcsQ0FBQyxTQUE0QixFQUFFLElBQVM7WUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUFBO0FBMURELDZCQTBEQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRMZXZlbCwgcmVjZWl2ZXIgfSBmcm9tIFwiLi9FdmVudExldmVsXCI7XHJcblxyXG4vKipcclxuICog5qC55o2u6KeE5YiZ5bCG5LqL5Lu25ZCN6L2s5o2i5oiQ5pWw57uE55qE5b2i5byPXHJcbiAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nW10ge1xyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZXZlbnROYW1lKVxyXG4gICAgICAgIHJldHVybiBldmVudE5hbWUubGVuZ3RoID09PSAwID8gW10gOiBldmVudE5hbWUuc3BsaXQoJy4nKTsgIC8v6YG/5YWN56m65a2X56ym5Liy6L+U5ZueW1wiXCJdXHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb27vvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5o6l5pS25LqL5Lu255qE5ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiByZWNlaXZlcikgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpICAvKumqjOivgeaVsOaNruexu+WeiyovXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLmFkZFJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIHJlY2VpdmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb24gPSB0aGlzLnJlY2VpdmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozlj6rmjqXmlLbkuIDmrKHnmoTkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb25jZe+8iVxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDmjqXmlLbkuovku7bnmoTlkI3np7Au5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmVPbmNlID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiByZWNlaXZlcikgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpICAvKumqjOivgeaVsOaNruexu+WeiyovXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICBjb25zdCBlbiA9IGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSk7XHJcbiAgICAgICAgZW4ucHVzaChNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkpOyAgLy/noa7kv53lj6rliKDpmaToh6rouqtcclxuXHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC5hZGRSZWNlaXZlcihlbiwgKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgcmVjZWl2ZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIoZW4pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbmNlID0gdGhpcy5yZWNlaXZlT25jZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOmUgOaVsOaNruaOpeaUtuWZqO+8iOWIq+WQjSBvZmbvvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5rOo6ZSA5LqL5Lu25o6l5pS25Zmo55qE5ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICovXHJcbiAgICBjYW5jZWwgPSAoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIoY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSk7XHJcbiAgICB9XHJcbiAgICBvZmYgPSB0aGlzLmNhbmNlbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaMh+WumueahOS6i+S7tuaOpeaUtuWZqO+8iOWIq+WQjSB0cmlnZ2Vy77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSBkYXRhIOimgeWPkemAgeeahOaVsOaNrlxyXG4gICAgICovXHJcbiAgICBzZW5kID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwudHJpZ2dlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIgPSB0aGlzLnNlbmQ7XHJcbn0iXX0=
