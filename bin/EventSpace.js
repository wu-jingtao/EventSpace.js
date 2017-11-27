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
         * @param eventName 接收事件的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 回调函数
         */
        this.receive = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be a function');
            this._eventLevel.addReceiver(convertEventNameType(eventName), receiver);
            return receiver;
        };
        this.on = this.receive;
        /**
         * 注册只接收一次的事件监听器（别名 once）
         * @param eventName 接收事件的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 回调函数
         */
        this.receiveOnce = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be a function');
            const level = convertEventNameType(eventName);
            const once = (data) => {
                receiver(data);
                this.cancel(level, once);
            };
            this.receive(level, once);
            return receiver;
        };
        this.once = this.receiveOnce;
        /**
         * 移除指定层级上的数据接收器（别名 off）。可以传递第二个参数来确保只移除指定的接收器
         * @param eventName 移除事件接收器的名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 要移除的回调函数
         */
        this.cancel = (eventName, receiver) => {
            this._eventLevel.removeReceiver(convertEventNameType(eventName), receiver);
            return receiver;
        };
        this.off = this.cancel;
        /**
         * 触发指定的事件接收器（别名 trigger）
         * @param eventName 要触发的事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param data 要发送的数据
         */
        this.send = (eventName, data) => {
            this._eventLevel.trigger(convertEventNameType(eventName), data);
        };
        this.trigger = this.send;
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFNBQTRCO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLFNBQVMsQ0FBQztRQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxjQUFjO0lBQzlFLElBQUk7UUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3pCLENBQUM7QUFFRDtJQUFBO1FBRXFCLGdCQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFaEQ7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxDQUFxQixTQUE0QixFQUFFLFFBQVc7WUFDcEUsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFFbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsZ0JBQVcsR0FBRyxDQUFxQixTQUE0QixFQUFFLFFBQVc7WUFDeEUsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFFbkQsTUFBTSxLQUFLLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFOUMsTUFBTSxJQUFJLEdBQWEsQ0FBQyxJQUFJO2dCQUN4QixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFBO1lBRUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxTQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUV4Qjs7OztXQUlHO1FBQ0gsV0FBTSxHQUFHLENBQXFCLFNBQTRCLEVBQUUsUUFBWTtZQUNwRSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzRSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUNELFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRWxCOzs7O1dBSUc7UUFDSCxTQUFJLEdBQUcsQ0FBQyxTQUE0QixFQUFFLElBQVU7WUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUFBO0FBN0RELDZCQTZEQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRMZXZlbCwgcmVjZWl2ZXIgfSBmcm9tIFwiLi9FdmVudExldmVsXCI7XHJcblxyXG4vKipcclxuICog5qC55o2u6KeE5YiZ5bCG5LqL5Lu25ZCN6L2s5o2i5oiQ5pWw57uE55qE5b2i5byPXHJcbiAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nW10ge1xyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZXZlbnROYW1lKVxyXG4gICAgICAgIHJldHVybiBldmVudE5hbWUubGVuZ3RoID09PSAwID8gW10gOiBldmVudE5hbWUuc3BsaXQoJy4nKTsgIC8v6YG/5YWN56m65a2X56ym5Liy6L+U5ZueW1wiXCJdXHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb27vvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5o6l5pS25LqL5Lu255qE5ZCN56ew44CC5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmUgPSA8VCBleHRlbmRzIHJlY2VpdmVyPihldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCByZWNlaXZlcjogVCkgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpICAvKumqjOivgeaVsOaNruexu+WeiyovXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwuYWRkUmVjZWl2ZXIoY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSwgcmVjZWl2ZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbiA9IHRoaXMucmVjZWl2ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOWPquaOpeaUtuS4gOasoeeahOS6i+S7tuebkeWQrOWZqO+8iOWIq+WQjSBvbmNl77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOaOpeaUtuS6i+S7tueahOWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlT25jZSA9IDxUIGV4dGVuZHMgcmVjZWl2ZXI+KGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiBUKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiByZWNlaXZlcikgIC8q6aqM6K+B5pWw5o2u57G75Z6LKi9cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWNlaXZlciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBvbmNlOiByZWNlaXZlciA9IChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHJlY2VpdmVyKGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbmNlbChsZXZlbCwgb25jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVjZWl2ZShsZXZlbCwgb25jZSk7XHJcbiAgICAgXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb25jZSA9IHRoaXMucmVjZWl2ZU9uY2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmjIflrprlsYLnuqfkuIrnmoTmlbDmja7mjqXmlLblmajvvIjliKvlkI0gb2Zm77yJ44CC5Y+v5Lul5Lyg6YCS56ys5LqM5Liq5Y+C5pWw5p2l56Gu5L+d5Y+q56e76Zmk5oyH5a6a55qE5o6l5pS25ZmoXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOenu+mZpOS6i+S7tuaOpeaUtuWZqOeahOWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOimgeenu+mZpOeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBjYW5jZWwgPSA8VCBleHRlbmRzIHJlY2VpdmVyPihldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCByZWNlaXZlcj86IFQpID0+IHtcclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLnJlbW92ZVJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIHJlY2VpdmVyKTtcclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvZmYgPSB0aGlzLmNhbmNlbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaMh+WumueahOS6i+S7tuaOpeaUtuWZqO+8iOWIq+WQjSB0cmlnZ2Vy77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Y+R6YCB55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHNlbmQgPSAoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgZGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwudHJpZ2dlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIgPSB0aGlzLnNlbmQ7XHJcbn0iXX0=
