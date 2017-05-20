/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const Global_1 = __webpack_require__(3);
module.exports = new Global_1.default();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQSxxQ0FBOEI7QUFFOUIsaUJBQVMsSUFBSSxnQkFBTSxFQUFFLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ3JlYXRlZCBieSDlkLTlirLpn6wgb24gMjAxNy8zLzEyLlxyXG4gKi9cclxuXHJcbmltcG9ydCBHbG9iYWwgZnJvbSAnLi9HbG9iYWwnO1xyXG5cclxuZXhwb3J0ID0gbmV3IEdsb2JhbCgpO1xyXG4iXX0=


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class EventLevel {
    constructor() {
        this.receivers = [];
        this.children = new Map();
    }
    addReceiver(levelNameArray, receiver) {
        if (levelNameArray.length === 0)
            this.receivers.push(receiver);
        else {
            var currentName = levelNameArray.shift();
            if (!this.children.has(currentName))
                this.children.set(currentName, new EventLevel());
            this.children.get(currentName).addReceiver(levelNameArray, receiver);
        }
    }
    removeReceiver(levelNameArray) {
        if (levelNameArray.length === 0) {
            this.receivers = [];
            this.children.clear();
        }
        else {
            var currentName = levelNameArray.shift();
            if (this.children.has(currentName))
                this.children.get(currentName).removeReceiver(levelNameArray);
        }
    }
    trigger(levelNameArray, data, _this, __originalLevelName) {
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
    }
    ;
}
exports.default = EventLevel;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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anMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog5LqL5Lu2562J57qn57G7XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcmVjZWl2ZXJzOiBGdW5jdGlvbltdID0gW107IC8v5b2T5YmN5bGC57qn55qE5o6l5pS25ZmoXHJcbiAgICBjaGlsZHJlbiA9IG5ldyBNYXA8YW55LCBFdmVudExldmVsPigpOyAgIC8v5a2Q5bGC57qnXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmt7vliqDmjqXmlLblmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthbnlbXX0gbGV2ZWxOYW1lQXJyYXkg5LqL5Lu2562J57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZWNlaXZlciDnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgYWRkUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IGFueVtdLCByZWNlaXZlcjogRnVuY3Rpb24pIHsgIC8v5re75Yqg5paw55qE55uR5ZCs5ZmoXHJcbiAgICAgICAgaWYgKGxldmVsTmFtZUFycmF5Lmxlbmd0aCA9PT0gMCkgIC8v5piv5LiN5piv5pyA5ZCO5LiA57qn5LqGXHJcbiAgICAgICAgICAgIHRoaXMucmVjZWl2ZXJzLnB1c2gocmVjZWl2ZXIpO1xyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudE5hbWUgPSBsZXZlbE5hbWVBcnJheS5zaGlmdCgpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4uaGFzKGN1cnJlbnROYW1lKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uc2V0KGN1cnJlbnROYW1lLCBuZXcgRXZlbnRMZXZlbCgpKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZ2V0KGN1cnJlbnROYW1lKS5hZGRSZWNlaXZlcihsZXZlbE5hbWVBcnJheSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOenu+mZpOaMh+Wumuetiee6p+eahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FueVtdfSBsZXZlbE5hbWVBcnJheSDnrYnnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXk6IGFueVtdKSB7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbE5hbWVBcnJheS5sZW5ndGggPT09IDApIHsgLy/mmK/kuI3mmK/mnIDlkI7kuIDnuqfkuoZcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5jbGVhcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9IGxldmVsTmFtZUFycmF5LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5oYXMoY3VycmVudE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpLnJlbW92ZVJlY2VpdmVyKGxldmVsTmFtZUFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDop6blj5HmiYDmnInmjIflrprnuqfliKvku6Xlj4rlrZDnuqfnmoTnm5HlkKzlmahcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHthbnlbXX0gbGV2ZWxOYW1lQXJyYXkg562J57qn5ZCN5a2X5pWw57uEXHJcbiAgICAgKiBAcGFyYW0geyp9IGRhdGEg6KaB57uZ6Kem5Y+R55qE5pa55rOV5Lyg6YCS55qE5pWw5o2uXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gX3RoaXMg5oyH5a6a55uR5ZCs5Zmo57uR5a6a55qEdGhpc+WvueixoVxyXG4gICAgICogQHBhcmFtIHtldmVudG5hbWVbXX0gX19vcmlnaW5hbExldmVsTmFtZSDlhoXpg6jkvb/nlKjnmoTvvIzkv53nlZnkuIDkuKrljp/lp4vnmoRsZXZlbE5hbWVcclxuICAgICAqIFxyXG4gICAgICogQG1lbWJlcm9mIEV2ZW50TGV2ZWxcclxuICAgICAqL1xyXG4gICAgdHJpZ2dlcihsZXZlbE5hbWVBcnJheTogYW55W10sIGRhdGE6IGFueSwgX3RoaXM/OiBPYmplY3QsIF9fb3JpZ2luYWxMZXZlbE5hbWU/OiBhbnlbXSkge1xyXG5cclxuICAgICAgICBpZiAoX19vcmlnaW5hbExldmVsTmFtZSA9PT0gdW5kZWZpbmVkKSAgLy/kv53nlZnkuIDkuKrljp/lp4vnmoRsZXZlbE5hbWVcclxuICAgICAgICAgICAgX19vcmlnaW5hbExldmVsTmFtZSA9IEFycmF5LmZyb20obGV2ZWxOYW1lQXJyYXkpO1xyXG5cclxuICAgICAgICBpZiAobGV2ZWxOYW1lQXJyYXkubGVuZ3RoID09PSAwKSB7ICAvL+aYr+S4jeaYr+acgOWQjuS4gOe6p+S6hizpgY3ljoblvZPliY3nuqfliKvlkozlrZDnuqdcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5jYWxsKF90aGlzLCBkYXRhLCBfX29yaWdpbmFsTGV2ZWxOYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC50cmlnZ2VyKGxldmVsTmFtZUFycmF5LCBkYXRhLCBfdGhpcywgX19vcmlnaW5hbExldmVsTmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9IGxldmVsTmFtZUFycmF5LnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGlsZHJlbi5oYXMoY3VycmVudE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpLnRyaWdnZXIobGV2ZWxOYW1lQXJyYXksIGRhdGEsIF90aGlzLCBfX29yaWdpbmFsTGV2ZWxOYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59Il19


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EventLevel_1 = __webpack_require__(1);
function convertEventNameType(eventName = []) {
    if (!Array.isArray(eventName)) {
        if ('string' === typeof eventName) {
            eventName = eventName.split('.');
        }
        else {
            eventName = [eventName];
        }
    }
    return eventName;
}
class EventSpace {
    constructor() {
        this.eventLevel = new EventLevel_1.default();
        this.receive = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be function');
            eventName = convertEventNameType(eventName);
            this.eventLevel.addReceiver(eventName, receiver);
            return receiver;
        };
        this.on = this.receive;
        this.receiveOnce = (eventName, receiver) => {
            if ('function' !== typeof receiver)
                throw new Error('receiver must be function');
            eventName = convertEventNameType(eventName);
            eventName.push(Math.random().toString());
            this.receive(eventName, function (d, p) {
                receiver(d, p);
                this.cancel(eventName);
            }.bind(this));
            return receiver;
        };
        this.once = this.receiveOnce;
        this.cancel = (eventName) => {
            eventName = convertEventNameType(eventName);
            this.eventLevel.removeReceiver(eventName);
        };
        this.off = this.cancel;
        this.send = (eventName, data, _this) => {
            eventName = convertEventNameType(eventName);
            this.eventLevel.trigger(eventName, data, _this);
        };
        this.trigger = this.send;
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBc0M7QUFNdEMsOEJBQThCLFlBQXlCLEVBQUU7SUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBRUQ7SUFBQTtRQUVxQixlQUFVLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUM7UUFTL0MsWUFBTyxHQUFHLENBQUMsU0FBc0IsRUFBRSxRQUFrQjtZQUNqRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUVqRCxTQUFTLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsT0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFTbEIsZ0JBQVcsR0FBRyxDQUFDLFNBQXNCLEVBQUUsUUFBa0I7WUFDckQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFNLEVBQUUsQ0FBUTtnQkFDOUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsU0FBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFReEIsV0FBTSxHQUFHLENBQUMsU0FBdUI7WUFDN0IsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQTtRQUNELFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBVWxCLFNBQUksR0FBRyxDQUFDLFNBQXNCLEVBQUUsSUFBUyxFQUFFLEtBQWM7WUFDckQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUFBO0FBckVELDZCQXFFQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50TGV2ZWwgZnJvbSBcIi4vRXZlbnRMZXZlbFwiO1xyXG5cclxuLyoqXHJcbiAqIOagueaNruinhOWImeWwhuS6i+S7tuWQjei9rOaNouaIkOaVsOe7hOeahOW9ouW8j1xyXG4gKiBAcGFyYW0ge2FueSB8IGFueVtdfSBldmVudE5hbWUg5LqL5Lu25ZCN56ewXHJcbiAqL1xyXG5mdW5jdGlvbiBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWU6IGFueSB8IGFueVtdID0gW10pOiBhbnlbXSB7XHJcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZXZlbnROYW1lKSkgeyAgLy/mmK/mlbDnu4TlsLHkuI3nlKjovazmjaLkuoZcclxuICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiBldmVudE5hbWUpIHsgICAgLy/mmK/lrZfnrKbkuLLov5jpnIDopoHlsIblrZfnrKbkuLLliIblibLkuIDkuItcclxuICAgICAgICAgICAgZXZlbnROYW1lID0gZXZlbnROYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXZlbnROYW1lID0gW2V2ZW50TmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBldmVudE5hbWU7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U3BhY2Uge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZXZlbnRMZXZlbCA9IG5ldyBFdmVudExldmVsKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDms6jlhozkuovku7bnm5HlkKzlmahcclxuICAgICAqIOWIq+WQjSBvblxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOaOpeaUtuS6i+S7tueahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlY2VpdmVyIOaOpeaUtuWIsOS6i+S7tuWQjuaJp+ihjOeahOWbnuiwg+WHveaVsCAs5Zue6LCD5Ye95pWw5o6l5Y+X5Lik5Liq5Y+C5pWw77yIZGF0YTrmlbDmja7vvIxldmVudE5hbWU65LqL5Lu255qE5ZCN56ew5pWw57uE77yJXHJcbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0g6L+U5ZueIHJlY2VpdmVyXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmUgPSAoZXZlbnROYW1lOiBhbnkgfCBhbnlbXSwgcmVjZWl2ZXI6IEZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiByZWNlaXZlcikgIC8q6aqM6K+B5pWw5o2u57G75Z6LKi9cclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWNlaXZlciBtdXN0IGJlIGZ1bmN0aW9uJyk7XHJcblxyXG4gICAgICAgIGV2ZW50TmFtZSA9IGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZSk7XHJcblxyXG4gICAgICAgIHRoaXMuZXZlbnRMZXZlbC5hZGRSZWNlaXZlcihldmVudE5hbWUsIHJlY2VpdmVyKTtcclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbiA9IHRoaXMucmVjZWl2ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOWGjOWPquaOpeaUtuS4gOasoeeahOS6i+S7tuebkeWQrOWZqFxyXG4gICAgICog5Yir5ZCNIG9uY2VcclxuICAgICAqIEBwYXJhbSB7YW55IHwgYW55W119IGV2ZW50TmFtZSDmjqXmlLbkuovku7bnmoTlkI3np7Au5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSByZWNlaXZlciDmjqXmlLbliLDmlbDmja7lkI7miafooYznmoTlm57osIPlh73mlbAgLOWbnuiwg+WHveaVsOaOpeWPl+S4pOS4quWPguaVsO+8iGRhdGE65pWw5o2u77yMZXZlbnROYW1lOuS6i+S7tueahOWQjeensOaVsOe7hO+8iVxyXG4gICAgICogQHJldHVybiB7ZnVuY3Rpb259IOi/lOWbniByZWNlaXZlclxyXG4gICAgICovXHJcbiAgICByZWNlaXZlT25jZSA9IChldmVudE5hbWU6IGFueSB8IGFueVtdLCByZWNlaXZlcjogRnVuY3Rpb24pID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKSAgLyrpqozor4HmlbDmja7nsbvlnosqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICBldmVudE5hbWUucHVzaChNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkpOyAgLy/noa7kv53lj6rliKDpmaToh6rouqtcclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGQ6IGFueSwgcDogYW55W10pIHtcclxuICAgICAgICAgICAgcmVjZWl2ZXIoZCwgcCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKGV2ZW50TmFtZSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbmNlID0gdGhpcy5yZWNlaXZlT25jZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOmUgOaVsOaNruaOpeaUtuWZqFxyXG4gICAgICog5Yir5ZCNIG9mZlxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOazqOmUgOS6i+S7tuaOpeaUtuWZqOeahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgY2FuY2VsID0gKGV2ZW50TmFtZT86IGFueSB8IGFueVtdKSA9PiB7XHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICB0aGlzLmV2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIoZXZlbnROYW1lKTtcclxuICAgIH1cclxuICAgIG9mZiA9IHRoaXMuY2FuY2VsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5oyH5a6a55qE5LqL5Lu25o6l5pS25ZmoXHJcbiAgICAgKiDliKvlkI0gdHJpZ2dlclxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSB7YW55fSBkYXRhIOimgeWPkemAgeeahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IF90aGlzIOimgeS4uuebkeWQrOWZqOe7keWumueahHRoaXPlr7nosaFcclxuICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgc2VuZCA9IChldmVudE5hbWU6IGFueSB8IGFueVtdLCBkYXRhOiBhbnksIF90aGlzPzogT2JqZWN0KSA9PiB7XHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICB0aGlzLmV2ZW50TGV2ZWwudHJpZ2dlcihldmVudE5hbWUsIGRhdGEsIF90aGlzKTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIgPSB0aGlzLnNlbmQ7XHJcbn0iXX0=


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const EventSpace_1 = __webpack_require__(2);
class Global extends EventSpace_1.default {
    constructor() {
        super(...arguments);
        this.EventSpace = EventSpace_1.default;
    }
}
exports.default = Global;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdsb2JhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUFzQztBQUV0QyxZQUE0QixTQUFRLG9CQUFVO0lBQTlDOztRQUNhLGVBQVUsR0FBRyxvQkFBVSxDQUFDO0lBQ3JDLENBQUM7Q0FBQTtBQUZELHlCQUVDIiwiZmlsZSI6Ikdsb2JhbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudFNwYWNlIGZyb20gXCIuL0V2ZW50U3BhY2VcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdsb2JhbCBleHRlbmRzIEV2ZW50U3BhY2Uge1xyXG4gICAgcmVhZG9ubHkgRXZlbnRTcGFjZSA9IEV2ZW50U3BhY2U7XHJcbn0iXX0=


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
* Please compile the code before packaging
*/

(function(){
    window.es = __webpack_require__(0);
})()



/***/ })
/******/ ]);