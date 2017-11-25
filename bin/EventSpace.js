"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventLevel_1 = require("./EventLevel");
/**
 * 根据规则将事件名转换成数组的形式
 * @param eventName 事件名称
 */
function convertEventNameType(eventName = []) {
    if ('string' === typeof eventName)
        return eventName.split('.');
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
            eventName = convertEventNameType(eventName);
            eventName.push(Math.random().toString()); //确保只删除自身
            this.receive(eventName, (data) => {
                receiver(data);
                this.cancel(eventName);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFlBQStCLEVBQUU7SUFDM0QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sU0FBUyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLElBQUk7UUFDQSxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3pCLENBQUM7QUFFRDtJQUFBO1FBRXFCLGdCQUFXLEdBQUcsSUFBSSx1QkFBVSxFQUFFLENBQUM7UUFFaEQ7Ozs7V0FJRztRQUNILFlBQU8sR0FBRyxDQUFDLFNBQTRCLEVBQUUsUUFBa0I7WUFDdkQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFeEUsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNwQixDQUFDLENBQUE7UUFDRCxPQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsZ0JBQVcsR0FBRyxDQUFDLFNBQTRCLEVBQUUsUUFBa0I7WUFDM0QsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBRSxTQUFTO1lBRXBELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSTtnQkFDekIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUNELFNBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXhCOzs7V0FHRztRQUNILFdBQU0sR0FBRyxDQUFDLFNBQTZCO1lBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckUsQ0FBQyxDQUFBO1FBQ0QsUUFBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFbEI7Ozs7V0FJRztRQUNILFNBQUksR0FBRyxDQUFDLFNBQTRCLEVBQUUsSUFBUztZQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUE7UUFDRCxZQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUN4QixDQUFDO0NBQUE7QUExREQsNkJBMERDIiwiZmlsZSI6IkV2ZW50U3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudExldmVsLCByZWNlaXZlciB9IGZyb20gXCIuL0V2ZW50TGV2ZWxcIjtcclxuXHJcbi8qKlxyXG4gKiDmoLnmja7op4TliJnlsIbkuovku7blkI3ovazmjaLmiJDmlbDnu4TnmoTlvaLlvI9cclxuICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7BcclxuICovXHJcbmZ1bmN0aW9uIGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10gPSBbXSk6IHN0cmluZ1tdIHtcclxuICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGV2ZW50TmFtZSlcclxuICAgICAgICByZXR1cm4gZXZlbnROYW1lLnNwbGl0KCcuJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRTcGFjZSB7XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZXZlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb27vvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5o6l5pS25LqL5Lu255qE5ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiByZWNlaXZlcikgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpICAvKumqjOivgeaVsOaNruexu+WeiyovXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLmFkZFJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIHJlY2VpdmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb24gPSB0aGlzLnJlY2VpdmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozlj6rmjqXmlLbkuIDmrKHnmoTkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb25jZe+8iVxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDmjqXmlLbkuovku7bnmoTlkI3np7Au5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0gcmVjZWl2ZXIg5Zue6LCD5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmVPbmNlID0gKGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiByZWNlaXZlcikgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpICAvKumqjOivgeaVsOaNruexu+WeiyovXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICBldmVudE5hbWUgPSBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpO1xyXG4gICAgICAgIGV2ZW50TmFtZS5wdXNoKE1hdGgucmFuZG9tKCkudG9TdHJpbmcoKSk7ICAvL+ehruS/neWPquWIoOmZpOiHqui6q1xyXG5cclxuICAgICAgICB0aGlzLnJlY2VpdmUoZXZlbnROYW1lLCAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICByZWNlaXZlcihkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5jYW5jZWwoZXZlbnROYW1lKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb25jZSA9IHRoaXMucmVjZWl2ZU9uY2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jplIDmlbDmja7mjqXmlLblmajvvIjliKvlkI0gb2Zm77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOazqOmUgOS6i+S7tuaOpeaUtuWZqOeahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqL1xyXG4gICAgY2FuY2VsID0gKGV2ZW50TmFtZT86IHN0cmluZyB8IHN0cmluZ1tdKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC5yZW1vdmVSZWNlaXZlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpKTtcclxuICAgIH1cclxuICAgIG9mZiA9IHRoaXMuY2FuY2VsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5oyH5a6a55qE5LqL5Lu25o6l5pS25Zmo77yI5Yir5ZCNIHRyaWdnZXLvvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg6KaB6Kem5Y+R55qE5LqL5Lu25ZCN56ewLuWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Y+R6YCB55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHNlbmQgPSAoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC50cmlnZ2VyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdHJpZ2dlciA9IHRoaXMuc2VuZDtcclxufSJdfQ==
