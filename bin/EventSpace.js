"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventLevel_1 = require("./EventLevel");
/**
 * 根据规则将事件名转换成数组的形式
 * @param eventName 事件名称
 */
function convertEventNameType(eventName) {
    return 'string' === typeof eventName ? eventName.split('.') : eventName;
}
class EventSpace {
    constructor() {
        this._eventLevel = new EventLevel_1.EventLevel();
        /**
         * 注册事件监听器（别名 on）
         * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
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
         * 注册只使用一次的事件监听器（别名 once）
         * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 回调函数
         */
        this.receiveOnce = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be a function');
            const level = convertEventNameType(eventName);
            const once = (data) => {
                receiver(data);
                this._eventLevel.removeReceiver(level, once);
            };
            this._eventLevel.addReceiver(level, once);
            return receiver;
        };
        this.once = this.receiveOnce;
        /**
         * 移除指定的事件层级（别名 off）。可以传递第二个参数来只移除指定的事件监听器
         * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param receiver 要移除的回调函数
         */
        this.cancel = (eventName = [], receiver) => {
            this._eventLevel.removeReceiver(convertEventNameType(eventName), receiver);
        };
        this.off = this.cancel;
        /**
         * 触发事件监听器（别名 trigger）
         * @param eventName 事件名称。可以为字符串或数组(字符串通过‘.’来分割层级)
         * @param data 要发送的数据
         */
        this.send = (eventName, data) => {
            this._eventLevel.trigger(convertEventNameType(eventName), data);
        };
        this.trigger = this.send;
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFNBQTRCO0lBQ3RELE1BQU0sQ0FBQyxRQUFRLEtBQUssT0FBTyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDNUUsQ0FBQztBQUVEO0lBQUE7UUFFcUIsZ0JBQVcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUVoRDs7OztXQUlHO1FBQ0gsWUFBTyxHQUFHLENBQXFCLFNBQTRCLEVBQUUsUUFBVztZQUNwRSxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUNELE9BQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRWxCOzs7O1dBSUc7UUFDSCxnQkFBVyxHQUFHLENBQXFCLFNBQTRCLEVBQUUsUUFBVztZQUN4RSxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVuRCxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU5QyxNQUFNLElBQUksR0FBYSxDQUFDLElBQUk7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFBO1lBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsU0FBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFeEI7Ozs7V0FJRztRQUNILFdBQU0sR0FBRyxDQUFxQixZQUErQixFQUFFLEVBQUUsUUFBWTtZQUN6RSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFlLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUE7UUFDRCxRQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsU0FBSSxHQUFHLENBQUMsU0FBNEIsRUFBRSxJQUFVO1lBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQTtRQUNELFlBQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3hCLENBQUM7Q0FBQTtBQTVERCw2QkE0REMiLCJmaWxlIjoiRXZlbnRTcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50TGV2ZWwsIHJlY2VpdmVyIH0gZnJvbSBcIi4vRXZlbnRMZXZlbFwiO1xyXG5cclxuLyoqXHJcbiAqIOagueaNruinhOWImeWwhuS6i+S7tuWQjei9rOaNouaIkOaVsOe7hOeahOW9ouW8j1xyXG4gKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensFxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuICdzdHJpbmcnID09PSB0eXBlb2YgZXZlbnROYW1lID8gZXZlbnROYW1lLnNwbGl0KCcuJykgOiBldmVudE5hbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U3BhY2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TGV2ZWwgPSBuZXcgRXZlbnRMZXZlbCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5Zmo77yI5Yir5ZCNIG9u77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gPFQgZXh0ZW5kcyByZWNlaXZlcj4oZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgcmVjZWl2ZXI6IFQpID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKSAgXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwuYWRkUmVjZWl2ZXIoY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSwgcmVjZWl2ZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbiA9IHRoaXMucmVjZWl2ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOWPquS9v+eUqOS4gOasoeeahOS6i+S7tuebkeWQrOWZqO+8iOWIq+WQjSBvbmNl77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlT25jZSA9IDxUIGV4dGVuZHMgcmVjZWl2ZXI+KGV2ZW50TmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIHJlY2VpdmVyOiBUKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiByZWNlaXZlcikgIFxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICBjb25zdCBsZXZlbCA9IGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9uY2U6IHJlY2VpdmVyID0gKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgcmVjZWl2ZXIoZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIobGV2ZWwsIG9uY2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC5hZGRSZWNlaXZlcihsZXZlbCwgb25jZSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgIH1cclxuICAgIG9uY2UgPSB0aGlzLnJlY2VpdmVPbmNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5oyH5a6a55qE5LqL5Lu25bGC57qn77yI5Yir5ZCNIG9mZu+8ieOAguWPr+S7peS8oOmAkuesrOS6jOS4quWPguaVsOadpeWPquenu+mZpOaMh+WumueahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7DjgILlj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSByZWNlaXZlciDopoHnp7vpmaTnmoTlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgY2FuY2VsID0gPFQgZXh0ZW5kcyByZWNlaXZlcj4oZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSA9IFtdLCByZWNlaXZlcj86IFQpID0+IHtcclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLnJlbW92ZVJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIHJlY2VpdmVyIGFzIGFueSk7XHJcbiAgICB9XHJcbiAgICBvZmYgPSB0aGlzLmNhbmNlbDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeS6i+S7tuebkeWQrOWZqO+8iOWIq+WQjSB0cmlnZ2Vy77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIGRhdGEg6KaB5Y+R6YCB55qE5pWw5o2uXHJcbiAgICAgKi9cclxuICAgIHNlbmQgPSAoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgZGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwudHJpZ2dlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpLCBkYXRhKTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIgPSB0aGlzLnNlbmQ7XHJcbn0iXX0=
