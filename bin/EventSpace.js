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
        /**
         * 检查某个事件名称下是否包含的有监听器。
         * 可以传递一个boolean，判断子级是否包含的有，或者传递一个receiver，判定是否有指定的监听器。
         */
        this.has = (eventName, receiverOrChildren) => {
            return this._eventLevel.hasReceiver(convertEventNameType(eventName), receiverOrChildren);
        };
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBb0Q7QUFFcEQ7OztHQUdHO0FBQ0gsOEJBQThCLFNBQTRCO0lBQ3RELE1BQU0sQ0FBQyxRQUFRLEtBQUssT0FBTyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDNUUsQ0FBQztBQUVEO0lBQUE7UUFFcUIsZ0JBQVcsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztRQUVoRDs7OztXQUlHO1FBQ0gsWUFBTyxHQUFHLENBQXFCLFNBQTRCLEVBQUUsUUFBVztZQUNwRSxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVuRCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUV4RSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ3BCLENBQUMsQ0FBQTtRQUNELE9BQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRWxCOzs7O1dBSUc7UUFDSCxnQkFBVyxHQUFHLENBQXFCLFNBQTRCLEVBQUUsUUFBVztZQUN4RSxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUVuRCxNQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUU5QyxNQUFNLElBQUksR0FBYSxDQUFDLElBQUk7Z0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFBO1lBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRTFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsU0FBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFeEI7Ozs7V0FJRztRQUNILFdBQU0sR0FBRyxDQUFxQixZQUErQixFQUFFLEVBQUUsUUFBWTtZQUN6RSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxRQUFlLENBQUMsQ0FBQztRQUN0RixDQUFDLENBQUE7UUFDRCxRQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUVsQjs7OztXQUlHO1FBQ0gsU0FBSSxHQUFHLENBQUMsU0FBNEIsRUFBRSxJQUFVO1lBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BFLENBQUMsQ0FBQTtRQUNELFlBQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBRXBCOzs7V0FHRztRQUNILFFBQUcsR0FBRyxDQUFDLFNBQTRCLEVBQUUsa0JBQXVDO1lBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxrQkFBeUIsQ0FBQyxDQUFDO1FBQ3BHLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FBQTtBQXBFRCw2QkFvRUMiLCJmaWxlIjoiRXZlbnRTcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50TGV2ZWwsIHJlY2VpdmVyIH0gZnJvbSBcIi4vRXZlbnRMZXZlbFwiO1xyXG5cclxuLyoqXHJcbiAqIOagueaNruinhOWImeWwhuS6i+S7tuWQjei9rOaNouaIkOaVsOe7hOeahOW9ouW8j1xyXG4gKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensFxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xyXG4gICAgcmV0dXJuICdzdHJpbmcnID09PSB0eXBlb2YgZXZlbnROYW1lID8gZXZlbnROYW1lLnNwbGl0KCcuJykgOiBldmVudE5hbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U3BhY2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2V2ZW50TGV2ZWwgPSBuZXcgRXZlbnRMZXZlbCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5Zmo77yI5Yir5ZCNIG9u77yJXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gPFQgZXh0ZW5kcyByZWNlaXZlcj4oZXZlbnROYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgcmVjZWl2ZXI6IFQpID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG5cclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLmFkZFJlY2VpdmVyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIHJlY2VpdmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb24gPSB0aGlzLnJlY2VpdmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozlj6rkvb/nlKjkuIDmrKHnmoTkuovku7bnm5HlkKzlmajvvIjliKvlkI0gb25jZe+8iVxyXG4gICAgICogQHBhcmFtIGV2ZW50TmFtZSDkuovku7blkI3np7DjgILlj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSByZWNlaXZlciDlm57osIPlh73mlbBcclxuICAgICAqL1xyXG4gICAgcmVjZWl2ZU9uY2UgPSA8VCBleHRlbmRzIHJlY2VpdmVyPihldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCByZWNlaXZlcjogVCkgPT4ge1xyXG4gICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgcmVjZWl2ZXIpXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVjZWl2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxldmVsID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25jZTogcmVjZWl2ZXIgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICByZWNlaXZlcihkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC5yZW1vdmVSZWNlaXZlcihsZXZlbCwgb25jZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9ldmVudExldmVsLmFkZFJlY2VpdmVyKGxldmVsLCBvbmNlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVyO1xyXG4gICAgfVxyXG4gICAgb25jZSA9IHRoaXMucmVjZWl2ZU9uY2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnp7vpmaTmjIflrprnmoTkuovku7blsYLnuqfvvIjliKvlkI0gb2Zm77yJ44CC5Y+v5Lul5Lyg6YCS56ys5LqM5Liq5Y+C5pWw5p2l5Y+q56e76Zmk5oyH5a6a55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBAcGFyYW0gZXZlbnROYW1lIOS6i+S7tuWQjeensOOAguWPr+S7peS4uuWtl+espuS4suaIluaVsOe7hCjlrZfnrKbkuLLpgJrov4figJgu4oCZ5p2l5YiG5Ymy5bGC57qnKVxyXG4gICAgICogQHBhcmFtIHJlY2VpdmVyIOimgeenu+mZpOeahOWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBjYW5jZWwgPSA8VCBleHRlbmRzIHJlY2VpdmVyPihldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdID0gW10sIHJlY2VpdmVyPzogVCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX2V2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIoY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKSwgcmVjZWl2ZXIgYXMgYW55KTtcclxuICAgIH1cclxuICAgIG9mZiA9IHRoaXMuY2FuY2VsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5LqL5Lu255uR5ZCs5Zmo77yI5Yir5ZCNIHRyaWdnZXLvvIlcclxuICAgICAqIEBwYXJhbSBldmVudE5hbWUg5LqL5Lu25ZCN56ew44CC5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0gZGF0YSDopoHlj5HpgIHnmoTmlbDmja5cclxuICAgICAqL1xyXG4gICAgc2VuZCA9IChldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCBkYXRhPzogYW55KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRMZXZlbC50cmlnZ2VyKGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSksIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdHJpZ2dlciA9IHRoaXMuc2VuZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOajgOafpeafkOS4quS6i+S7tuWQjeensOS4i+aYr+WQpuWMheWQq+eahOacieebkeWQrOWZqOOAglxyXG4gICAgICog5Y+v5Lul5Lyg6YCS5LiA5LiqYm9vbGVhbu+8jOWIpOaWreWtkOe6p+aYr+WQpuWMheWQq+eahOacie+8jOaIluiAheS8oOmAkuS4gOS4qnJlY2VpdmVy77yM5Yik5a6a5piv5ZCm5pyJ5oyH5a6a55qE55uR5ZCs5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIGhhcyA9IChldmVudE5hbWU6IHN0cmluZyB8IHN0cmluZ1tdLCByZWNlaXZlck9yQ2hpbGRyZW4/OiByZWNlaXZlciB8IGJvb2xlYW4pID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZXZlbnRMZXZlbC5oYXNSZWNlaXZlcihjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpLCByZWNlaXZlck9yQ2hpbGRyZW4gYXMgYW55KTtcclxuICAgIH1cclxufSJdfQ==
