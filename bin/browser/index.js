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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIOaOpeaUtuWZqOexu+Wei1xyXG4gKi9cclxuZXhwb3J0IHR5cGUgcmVjZWl2ZXJUeXBlID0gKGRhdGE/OiBhbnksIGV2ZW50TmFtZT86IGFueVtdKSA9PiBhbnk7XHJcblxyXG4vKipcclxuICog5LqL5Lu2562J57qn57G7XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRMZXZlbCB7XHJcblxyXG4gICAgcmVjZWl2ZXJzOiByZWNlaXZlclR5cGVbXSA9IFtdOyAvL+W9k+WJjeWxgue6p+eahOaOpeaUtuWZqFxyXG4gICAgY2hpbGRyZW4gPSBuZXcgTWFwPGFueSwgRXZlbnRMZXZlbD4oKTsgICAvL+WtkOWxgue6p1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5re75Yqg5o6l5pS25ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7YW55W119IGxldmVsTmFtZUFycmF5IOS6i+S7tuetiee6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVjZWl2ZXIg55uR5ZCs5ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBtZW1iZXJvZiBFdmVudExldmVsXHJcbiAgICAgKi9cclxuICAgIGFkZFJlY2VpdmVyKGxldmVsTmFtZUFycmF5OiBhbnlbXSwgcmVjZWl2ZXI6IHJlY2VpdmVyVHlwZSkgeyAgLy/mt7vliqDmlrDnmoTnm5HlkKzlmahcclxuICAgICAgICBpZiAobGV2ZWxOYW1lQXJyYXkubGVuZ3RoID09PSAwKSAgLy/mmK/kuI3mmK/mnIDlkI7kuIDnuqfkuoZcclxuICAgICAgICAgICAgdGhpcy5yZWNlaXZlcnMucHVzaChyZWNlaXZlcik7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50TmFtZSA9IGxldmVsTmFtZUFycmF5LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGlsZHJlbi5oYXMoY3VycmVudE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5zZXQoY3VycmVudE5hbWUsIG5ldyBFdmVudExldmVsKCkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5nZXQoY3VycmVudE5hbWUpLmFkZFJlY2VpdmVyKGxldmVsTmFtZUFycmF5LCByZWNlaXZlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog56e76Zmk5oyH5a6a562J57qn55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7YW55W119IGxldmVsTmFtZUFycmF5IOetiee6p+WQjeWtl+aVsOe7hFxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyb2YgRXZlbnRMZXZlbFxyXG4gICAgICovXHJcbiAgICByZW1vdmVSZWNlaXZlcihsZXZlbE5hbWVBcnJheTogYW55W10pIHtcclxuXHJcbiAgICAgICAgaWYgKGxldmVsTmFtZUFycmF5Lmxlbmd0aCA9PT0gMCkgeyAvL+aYr+S4jeaYr+acgOWQjuS4gOe6p+S6hlxyXG4gICAgICAgICAgICB0aGlzLnJlY2VpdmVycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmNsZWFyKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnROYW1lID0gbGV2ZWxOYW1lQXJyYXkuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmhhcyhjdXJyZW50TmFtZSkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmdldChjdXJyZW50TmFtZSkucmVtb3ZlUmVjZWl2ZXIobGV2ZWxOYW1lQXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOinpuWPkeaJgOacieaMh+Wumue6p+WIq+S7peWPiuWtkOe6p+eahOebkeWQrOWZqFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2FueVtdfSBsZXZlbE5hbWVBcnJheSDnrYnnuqflkI3lrZfmlbDnu4RcclxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSDopoHnu5nop6blj5HnmoTmlrnms5XkvKDpgJLnmoTmlbDmja5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBfdGhpcyDmjIflrprnm5HlkKzlmajnu5HlrprnmoR0aGlz5a+56LGhXHJcbiAgICAgKiBAcGFyYW0ge2V2ZW50bmFtZVtdfSBfX29yaWdpbmFsTGV2ZWxOYW1lIOWGhemDqOS9v+eUqOeahO+8jOS/neeVmeS4gOS4quWOn+Wni+eahGxldmVsTmFtZVxyXG4gICAgICogXHJcbiAgICAgKiBAbWVtYmVyb2YgRXZlbnRMZXZlbFxyXG4gICAgICovXHJcbiAgICB0cmlnZ2VyKGxldmVsTmFtZUFycmF5OiBhbnlbXSwgZGF0YTogYW55LCBfdGhpcz86IE9iamVjdCwgX19vcmlnaW5hbExldmVsTmFtZT86IGFueVtdKSB7XHJcblxyXG4gICAgICAgIGlmIChfX29yaWdpbmFsTGV2ZWxOYW1lID09PSB1bmRlZmluZWQpICAvL+S/neeVmeS4gOS4quWOn+Wni+eahGxldmVsTmFtZVxyXG4gICAgICAgICAgICBfX29yaWdpbmFsTGV2ZWxOYW1lID0gQXJyYXkuZnJvbShsZXZlbE5hbWVBcnJheSk7XHJcblxyXG4gICAgICAgIGlmIChsZXZlbE5hbWVBcnJheS5sZW5ndGggPT09IDApIHsgIC8v5piv5LiN5piv5pyA5ZCO5LiA57qn5LqGLOmBjeWOhuW9k+WJjee6p+WIq+WSjOWtkOe6p1xyXG4gICAgICAgICAgICB0aGlzLnJlY2VpdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNhbGwoX3RoaXMsIGRhdGEsIF9fb3JpZ2luYWxMZXZlbE5hbWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnRyaWdnZXIobGV2ZWxOYW1lQXJyYXksIGRhdGEsIF90aGlzLCBfX29yaWdpbmFsTGV2ZWxOYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnROYW1lID0gbGV2ZWxOYW1lQXJyYXkuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuLmhhcyhjdXJyZW50TmFtZSkpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuLmdldChjdXJyZW50TmFtZSkudHJpZ2dlcihsZXZlbE5hbWVBcnJheSwgZGF0YSwgX3RoaXMsIF9fb3JpZ2luYWxMZXZlbE5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0iXX0=


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
        this.send = (eventName, data, _this_) => {
            eventName = convertEventNameType(eventName);
            this.eventLevel.trigger(eventName, data, _this_);
        };
        this.trigger = this.send;
    }
}
exports.default = EventSpace;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV2ZW50U3BhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBd0Q7QUFReEQsOEJBQThCLFlBQXlCLEVBQUU7SUFDckQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLFNBQVMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNyQixDQUFDO0FBY0Q7SUFBQTtRQUVxQixlQUFVLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUM7UUFTL0MsWUFBTyxHQUFHLENBQUMsU0FBc0IsRUFBRSxRQUFzQjtZQUNyRCxFQUFFLENBQUMsQ0FBQyxVQUFVLEtBQUssT0FBTyxRQUFRLENBQUM7Z0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUVqRCxTQUFTLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsT0FBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFTbEIsZ0JBQVcsR0FBRyxDQUFDLFNBQXNCLEVBQUUsUUFBc0I7WUFDekQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLE9BQU8sUUFBUSxDQUFDO2dCQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFFakQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFNLEVBQUUsQ0FBUTtnQkFDOUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNkLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDcEIsQ0FBQyxDQUFBO1FBQ0QsU0FBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFReEIsV0FBTSxHQUFHLENBQUMsU0FBdUI7WUFDN0IsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQTtRQUNELFFBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBVWxCLFNBQUksR0FBRyxDQUFDLFNBQXNCLEVBQUUsSUFBUyxFQUFFLE1BQWU7WUFDdEQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFBO1FBQ0QsWUFBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDeEIsQ0FBQztDQUFBO0FBckVELDZCQXFFQyIsImZpbGUiOiJFdmVudFNwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50TGV2ZWwsIHsgcmVjZWl2ZXJUeXBlIH0gZnJvbSBcIi4vRXZlbnRMZXZlbFwiO1xyXG5cclxuXHJcblxyXG4vKipcclxuICog5qC55o2u6KeE5YiZ5bCG5LqL5Lu25ZCN6L2s5o2i5oiQ5pWw57uE55qE5b2i5byPXHJcbiAqIEBwYXJhbSB7YW55IHwgYW55W119IGV2ZW50TmFtZSDkuovku7blkI3np7BcclxuICovXHJcbmZ1bmN0aW9uIGNvbnZlcnRFdmVudE5hbWVUeXBlKGV2ZW50TmFtZTogYW55IHwgYW55W10gPSBbXSk6IGFueVtdIHtcclxuICAgIGlmICghQXJyYXkuaXNBcnJheShldmVudE5hbWUpKSB7ICAvL+aYr+aVsOe7hOWwseS4jeeUqOi9rOaNouS6hlxyXG4gICAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIGV2ZW50TmFtZSkgeyAgICAvL+aYr+Wtl+espuS4sui/mOmcgOimgeWwhuWtl+espuS4suWIhuWJsuS4gOS4i1xyXG4gICAgICAgICAgICBldmVudE5hbWUgPSBldmVudE5hbWUuc3BsaXQoJy4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBldmVudE5hbWUgPSBbZXZlbnROYW1lXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV2ZW50TmFtZTtcclxufVxyXG5cclxuLy/nlKjkuo7mlrnkvr/miYvlt6XnvJblhpnmtY/op4jlmajniYjlo7DmmI7mlofku7ZcclxuZXhwb3J0IGludGVyZmFjZSBFdmVudFNwYWNlU3RydWN0dXJlIHtcclxuICAgIG9uOiAoZXZlbnROYW1lOiBhbnkgfCBhbnlbXSwgcmVjZWl2ZXI6IHJlY2VpdmVyVHlwZSkgPT4gcmVjZWl2ZXJUeXBlO1xyXG4gICAgcmVjZWl2ZTogKGV2ZW50TmFtZTogYW55IHwgYW55W10sIHJlY2VpdmVyOiByZWNlaXZlclR5cGUpID0+IHJlY2VpdmVyVHlwZTtcclxuICAgIG9uY2U6IChldmVudE5hbWU6IGFueSB8IGFueVtdLCByZWNlaXZlcjogcmVjZWl2ZXJUeXBlKSA9PiByZWNlaXZlclR5cGU7XHJcbiAgICByZWNlaXZlT25jZTogKGV2ZW50TmFtZTogYW55IHwgYW55W10sIHJlY2VpdmVyOiByZWNlaXZlclR5cGUpID0+IHJlY2VpdmVyVHlwZTtcclxuICAgIG9mZjogKGV2ZW50TmFtZT86IGFueSB8IGFueVtdKSA9PiB2b2lkO1xyXG4gICAgY2FuY2VsOiAoZXZlbnROYW1lPzogYW55IHwgYW55W10pID0+IHZvaWQ7XHJcbiAgICB0cmlnZ2VyOiAoZXZlbnROYW1lOiBhbnkgfCBhbnlbXSwgZGF0YTogYW55LCBfdGhpc18/OiBPYmplY3QpID0+IHZvaWQ7XHJcbiAgICBzZW5kOiAoZXZlbnROYW1lOiBhbnkgfCBhbnlbXSwgZGF0YTogYW55LCBfdGhpc18/OiBPYmplY3QpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50U3BhY2UgaW1wbGVtZW50cyBFdmVudFNwYWNlU3RydWN0dXJlIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGV2ZW50TGV2ZWwgPSBuZXcgRXZlbnRMZXZlbCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiDliKvlkI0gb25cclxuICAgICAqIEBwYXJhbSB7YW55IHwgYW55W119IGV2ZW50TmFtZSDmjqXmlLbkuovku7bnmoTlkI3np7Au5Y+v5Lul5Li65a2X56ym5Liy5oiW5pWw57uEKOWtl+espuS4sumAmui/h+KAmC7igJnmnaXliIblibLlsYLnuqcpXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSByZWNlaXZlciDmjqXmlLbliLDkuovku7blkI7miafooYznmoTlm57osIPlh73mlbAgLOWbnuiwg+WHveaVsOaOpeWPl+S4pOS4quWPguaVsO+8iGRhdGE65pWw5o2u77yMZXZlbnROYW1lOuS6i+S7tueahOWQjeensOaVsOe7hO+8iVxyXG4gICAgICogQHJldHVybiB7ZnVuY3Rpb259IOi/lOWbniByZWNlaXZlclxyXG4gICAgICovXHJcbiAgICByZWNlaXZlID0gKGV2ZW50TmFtZTogYW55IHwgYW55W10sIHJlY2VpdmVyOiByZWNlaXZlclR5cGUpID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKSAgLyrpqozor4HmlbDmja7nsbvlnosqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuXHJcbiAgICAgICAgdGhpcy5ldmVudExldmVsLmFkZFJlY2VpdmVyKGV2ZW50TmFtZSwgcmVjZWl2ZXIpO1xyXG4gICAgICAgIHJldHVybiByZWNlaXZlcjtcclxuICAgIH1cclxuICAgIG9uID0gdGhpcy5yZWNlaXZlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5rOo5YaM5Y+q5o6l5pS25LiA5qyh55qE5LqL5Lu255uR5ZCs5ZmoXHJcbiAgICAgKiDliKvlkI0gb25jZVxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOaOpeaUtuS6i+S7tueahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHJlY2VpdmVyIOaOpeaUtuWIsOaVsOaNruWQjuaJp+ihjOeahOWbnuiwg+WHveaVsCAs5Zue6LCD5Ye95pWw5o6l5Y+X5Lik5Liq5Y+C5pWw77yIZGF0YTrmlbDmja7vvIxldmVudE5hbWU65LqL5Lu255qE5ZCN56ew5pWw57uE77yJXHJcbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0g6L+U5ZueIHJlY2VpdmVyXHJcbiAgICAgKi9cclxuICAgIHJlY2VpdmVPbmNlID0gKGV2ZW50TmFtZTogYW55IHwgYW55W10sIHJlY2VpdmVyOiByZWNlaXZlclR5cGUpID0+IHtcclxuICAgICAgICBpZiAoJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHJlY2VpdmVyKSAgLyrpqozor4HmlbDmja7nsbvlnosqL1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlY2VpdmVyIG11c3QgYmUgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICBldmVudE5hbWUucHVzaChNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKCkpOyAgLy/noa7kv53lj6rliKDpmaToh6rouqtcclxuXHJcbiAgICAgICAgdGhpcy5yZWNlaXZlKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGQ6IGFueSwgcDogYW55W10pIHtcclxuICAgICAgICAgICAgcmVjZWl2ZXIoZCwgcCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FuY2VsKGV2ZW50TmFtZSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICByZXR1cm4gcmVjZWl2ZXI7XHJcbiAgICB9XHJcbiAgICBvbmNlID0gdGhpcy5yZWNlaXZlT25jZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOazqOmUgOaVsOaNruaOpeaUtuWZqFxyXG4gICAgICog5Yir5ZCNIG9mZlxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOazqOmUgOS6i+S7tuaOpeaUtuWZqOeahOWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cclxuICAgICAqL1xyXG4gICAgY2FuY2VsID0gKGV2ZW50TmFtZT86IGFueSB8IGFueVtdKSA9PiB7XHJcbiAgICAgICAgZXZlbnROYW1lID0gY29udmVydEV2ZW50TmFtZVR5cGUoZXZlbnROYW1lKTtcclxuICAgICAgICB0aGlzLmV2ZW50TGV2ZWwucmVtb3ZlUmVjZWl2ZXIoZXZlbnROYW1lKTtcclxuICAgIH1cclxuICAgIG9mZiA9IHRoaXMuY2FuY2VsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog6Kem5Y+R5oyH5a6a55qE5LqL5Lu25o6l5pS25ZmoXHJcbiAgICAgKiDliKvlkI0gdHJpZ2dlclxyXG4gICAgICogQHBhcmFtIHthbnkgfCBhbnlbXX0gZXZlbnROYW1lIOimgeinpuWPkeeahOS6i+S7tuWQjeensC7lj6/ku6XkuLrlrZfnrKbkuLLmiJbmlbDnu4Qo5a2X56ym5Liy6YCa6L+H4oCYLuKAmeadpeWIhuWJsuWxgue6pylcclxuICAgICAqIEBwYXJhbSB7YW55fSBkYXRhIOimgeWPkemAgeeahOaVsOaNrlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IF90aGlzXyDopoHkuLrnm5HlkKzlmajnu5HlrprnmoR0aGlz5a+56LGhXHJcbiAgICAgKiBAcmV0dXJuIHt1bmRlZmluZWR9XHJcbiAgICAgKi9cclxuICAgIHNlbmQgPSAoZXZlbnROYW1lOiBhbnkgfCBhbnlbXSwgZGF0YTogYW55LCBfdGhpc18/OiBPYmplY3QpID0+IHtcclxuICAgICAgICBldmVudE5hbWUgPSBjb252ZXJ0RXZlbnROYW1lVHlwZShldmVudE5hbWUpO1xyXG4gICAgICAgIHRoaXMuZXZlbnRMZXZlbC50cmlnZ2VyKGV2ZW50TmFtZSwgZGF0YSwgX3RoaXNfKTtcclxuICAgIH1cclxuICAgIHRyaWdnZXIgPSB0aGlzLnNlbmQ7XHJcbn0iXX0=


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