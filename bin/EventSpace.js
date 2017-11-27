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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFNBQTRCO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLFNBQVMsQ0FBQztRQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxjQUFjO0lBQzlFLElBQUk7UUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3pCLENBQUM7QUFFRDtJQUFBO1FBRXFCLGdCQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFaEQ7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxDQUFxQixTQUE0QixFQUFFLFFBQVc7WUFDcEUsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsZ0JBQVcsR0FBRyxDQUFxQixTQUE0QixFQUFFLFFBQVc7WUFDeEUsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsTUFBTSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFFLFNBQVM7WUFFN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBUztnQkFDdkMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxTQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUV4Qjs7O1dBR0c7UUFDSCxXQUFNLEdBQUcsQ0FBQyxTQUE0QjtZQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQTtRQUNELFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRWxCOzs7O1dBSUc7UUFDSCxTQUFJLEdBQUcsQ0FBQyxTQUE0QixFQUFFLElBQVM7WUFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUFBO0FBMURELDZCQTBEQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRMZXZlbCwgcmVjZWl2ZXIgfSBmcm9tIFwiLi9FdmVudExldmVsXCI7XHJcblxyXG4vKipcclxuICog5qC55o2u6KeE5YiZ5bCG5LqL5Lu25ZCN6L2s5o2i5oiQ5pWw57uE55qE5b2i5byPXHJcbiAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nW10ge1xyXG4gICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgZXZlbnROYW1lKVxyXG4gICAgICAgIHJldHVybiBldmVudE5hbWUubGVuZ3RoID09PSAwID8gW10gOiBldmVudE5hbWUuc3BsaXQoJy4nKTsgIC8v6YG/5YWN56m65a2X56ym5Liy6L+U5ZueW1wiXCJdXHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb27vvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5o6l5pS25LqL5Lu255qE5ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gPFQgZXh0ZW5kcyByZWNlaXZlcj4oZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgcmVjZWl2ZXI6IFQpID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKSAgLyrpqozor4HmlbDmja7nsbvlnosqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC5hZGRSZWNlaXZlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpLCByZWNlaXZlcik7XHJcblxyXG4gICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgIH1cclxuICAgIG9uID0gdGhpcy5yZWNlaXZlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5Y+q5o6l5pS25LiA5qyh55qE5LqL5Lu255uR5ZCs5Zmo77yI5Yir5ZCNIG9uY2XvvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5o6l5pS25LqL5Lu255qE5ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlT25jZSA9IDxUIGV4dGVuZHMgcmVjZWl2ZXI+KGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiBUKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiByZWNlaXZlcikgIC8q6aqM6K+B5pWw5o2u57G75Z6LKi9cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWNlaXZlciBtdXN0IGJlIGZ1bmN0aW9uJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGVuID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICBlbi5wdXNoKE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSk7ICAvL+ehruS/neWPquWIoOmZpOiHqui6q1xyXG5cclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLmFkZFJlY2VpdmVyKGVuLCAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHJlY2VpdmVyKGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudExldmVsLnJlbW92ZVJlY2VpdmVyKGVuKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb25jZSA9IHRoaXMucmVjZWl2ZU9uY2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jplIDmlbDmja7mjqXmlLblmajvvIjliKvlkI0gb2Zm77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOazqOmUgOS6i+S7tuaOpeaUtuWZqOeahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqL1xyXG4gICAgY2FuY2VsID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10pID0+IHtcclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLnJlbW92ZVJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSkpO1xyXG4gICAgfVxyXG4gICAgb2ZmID0gdGhpcy5jYW5jZWw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmjIflrprnmoTkuovku7bmjqXmlLblmajvvIjliKvlkI0gdHJpZ2dlcu+8iVxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDopoHop6blj5HnmoTkuovku7blkI3np7Au5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHlj5HpgIHnmoTmlbDmja5cclxuICAgICAqL1xyXG4gICAgc2VuZCA9IChldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCBkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLnRyaWdnZXIoY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0cmlnZ2VyID0gdGhpcy5zZW5kO1xyXG59Il19
