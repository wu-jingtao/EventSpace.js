import { EventSpaceType } from './../interfaces/EventSpaceType';
import { EventLevel } from "./EventLevel";
import { Listener } from '../interfaces/ListenerType';

export class EventSpace implements EventSpaceType {
    /**
     * 将事件名转换成数组的形式
     * @param eventName 事件名称
     */
    static convertEventNameType(eventName: string | string[]) {
        return 'string' === typeof eventName ? eventName.split('.') : eventName;
    }

    private readonly _eventLevel = new EventLevel();

    receive = <T extends Listener>(eventName: string | string[], listener: T) => {
        this._eventLevel
            .getChild(EventSpace.convertEventNameType(eventName), true)
            .receivers.add(listener);

        return listener;
    }
    on = this.receive;

    receiveOnce = <T extends Listener>(eventName: string | string[], listener: T) => {
        const level = this._eventLevel.getChild(EventSpace.convertEventNameType(eventName), true);
        level.receivers.add(function once(data) {
            listener(data);
            level.receivers.delete(once);
        });

        return listener;
    }
    once = this.receiveOnce;

    cancel(eventName: string | string[] = [], lrc: boolean | Listener = true) {
        const level = this._eventLevel.getChild(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            if (lrc === true) {
                level.receivers.clear();
                level.children.clear();
            } else if (lrc === false) {
                level.receivers.clear();
            } else {
                level.receivers.delete(lrc);
            }
        }
    }
    off = this.cancel;

    trigger(eventName: string | string[], data?: any, includeChildren: boolean = true, asynchronous?: boolean): void {
        const level = this._eventLevel.getChild(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));
            
            if (includeChildren) {
                function triggerChildren(level: EventLevel) {
                    level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));
                    level.children.forEach(triggerChildren);
                }
                level.children.forEach(triggerChildren);
            }
        }
    }
    send = this.trigger;

    has(eventName: string | string[], lrc: boolean | Listener = true): boolean {
        const level = this._eventLevel.getChild(EventSpace.convertEventNameType(eventName), false);
        if (level === undefined) {
            return false;
        } else {
            if (lrc === true) {
                function checkChildren(level: EventLevel) {
                    if (level.receivers.size > 0)
                        return true;
                    else {
                        for (const item of level.children.values()) {
                            if (checkChildren(item) === true)
                                return true;
                        }
                        return false;
                    }
                }

                return checkChildren(level);
            } else if (lrc === false) {
                return level.receivers.size > 0;
            } else {
                return level.receivers.has(lrc);
            }
        }
    }
}