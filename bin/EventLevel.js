"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventLevel = (function () {
    function EventLevel() {
        this.receivers = [];
        this.children = new Map();
    }
    EventLevel.prototype.addReceiver = function (levelNameArray, receiver) {
        if (levelNameArray.length === 0)
            this.receivers.push(receiver);
        else {
            var currentName = levelNameArray.shift();
            if (!this.children.has(currentName))
                this.children.set(currentName, new EventLevel());
            this.children.get(currentName).addReceiver(levelNameArray, receiver);
        }
    };
    EventLevel.prototype.removeReceiver = function (levelNameArray) {
        if (levelNameArray.length === 0) {
            this.receivers = [];
            this.children.clear();
        }
        else {
            var currentName = levelNameArray.shift();
            if (this.children.has(currentName))
                this.children.get(currentName).removeReceiver(levelNameArray);
        }
    };
    EventLevel.prototype.trigger = function (levelNameArray, data, _this, __originalLevelName) {
        if (__originalLevelName === undefined)
            __originalLevelName = Array.from(levelNameArray);
        if (levelNameArray.length === 0) {
            this.receivers.forEach(function (item) {
                item.call(_this, data, __originalLevelName);
            });
            this.children.forEach(function (child) {
                child.trigger(levelNameArray, data, _this, __originalLevelName);
            });
        }
        else {
            var currentName = levelNameArray.shift();
            if (this.children.has(currentName))
                this.children.get(currentName).trigger(levelNameArray, data, _this, __originalLevelName);
        }
    };
    ;
    return EventLevel;
}());
exports.default = EventLevel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QSxBQTJFQyxJQUFBIiwiZmlsZSI6IkV2ZW50TGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5LqL5Lu2562J57qn57G7XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcmVjZWl2ZXJzOiBGdW5jdGlvbltdID0gW107IC8v5b2T5YmN5bGC57qn55qE5o6l5pS25ZmoXHJcbiAgICBjaGlsZHJlbiA9IG5ldyBNYXA8YW55LCBFdmVudExldmVsPigpOyAgIC8v5a2Q5bGC57qnXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDmjqXmlLblmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthbnlbXX0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu2562J57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWNlaXZlciDnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgYWRkUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IGFueVtdLCByZWNlaXZlcjogRnVuY3Rpb24pIHsgIC8v5re75Yqg5paw55qE55uR5ZCs5ZmoXHJcbiAgICAgICAgaWYgKGxldmVsTmFtZUFycmF5Lmxlbmd0aCA9PT0gMCkgIC8v5piv5LiN5piv5pyA5ZCO5LiA57qn5LqGXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXJzLnB1c2gocmVjZWl2ZXIpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudE5hbWUgPSBsZXZlbE5hbWVBcnJheS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4uaGFzKGN1cnJlbnROYW1lKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc2V0KGN1cnJlbnROYW1lLCBuZXcgRXZlbnRMZXZlbCgpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZ2V0KGN1cnJlbnROYW1lKS5hZGRSZWNlaXZlcihsZXZlbE5hbWVBcnJheSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaMh+Wumuetiee6p+eahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FueVtdfSBsZXZlbE5hbWVBcnJheSDnrYnnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IGFueVtdKSB7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbE5hbWVBcnJheS5sZW5ndGggPT09IDApIHsgLy/mmK/kuI3mmK/mnIDlkI7kuIDnuqfkuoZcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5jbGVhcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9IGxldmVsTmFtZUFycmF5LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5oYXMoY3VycmVudE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpLnJlbW92ZVJlY2VpdmVyKGxldmVsTmFtZUFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmiYDmnInmjIflrprnuqfliKvku6Xlj4rlrZDnuqfnmoTnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthbnlbXX0gbGV2ZWxOYW1lQXJyYXkg562J57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEg6KaB57uZ6Kem5Y+R55qE5pa55rOV5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gX3RoaXMg5oyH5a6a55uR5ZCs5Zmo57uR5a6a55qEdGhpc+WvueixoVxyXG4gICAgICogQHBhcmFtIHtldmVudG5hbWVbXX0gX19vcmlnaW5hbExldmVsTmFtZSDlhoXpg6jkvb/nlKjnmoTvvIzkv53nlZnkuIDkuKrljp/lp4vnmoRsZXZlbE5hbWVcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihsZXZlbE5hbWVBcnJheTogYW55W10sIGRhdGE6IGFueSwgX3RoaXM/OiBPYmplY3QsIF9fb3JpZ2luYWxMZXZlbE5hbWU/OiBhbnlbXSkge1xyXG5cclxuICAgICAgICBpZiAoX19vcmlnaW5hbExldmVsTmFtZSA9PT0gdW5kZWZpbmVkKSAgLy/kv53nlZnkuIDkuKrljp/lp4vnmoRsZXZlbE5hbWVcclxuICAgICAgICAgICAgX19vcmlnaW5hbExldmVsTmFtZSA9IEFycmF5LmZyb20obGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWxOYW1lQXJyYXkubGVuZ3RoID09PSAwKSB7ICAvL+aYr+S4jeaYr+acgOWQjuS4gOe6p+S6hizpgY3ljoblvZPliY3nuqfliKvlkozlrZDnuqdcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYWxsKF90aGlzLCBkYXRhLCBfX29yaWdpbmFsTGV2ZWxOYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC50cmlnZ2VyKGxldmVsTmFtZUFycmF5LCBkYXRhLCBfdGhpcywgX19vcmlnaW5hbExldmVsTmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9IGxldmVsTmFtZUFycmF5LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5oYXMoY3VycmVudE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpLnRyaWdnZXIobGV2ZWxOYW1lQXJyYXksIGRhdGEsIF90aGlzLCBfX29yaWdpbmFsTGV2ZWxOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59Il19
