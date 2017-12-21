import { EventLevel, Listener } from "./EventLevel";

/**
 * 事件名称类型
 */
export type EventName = string | string[];

export class EventSpace<T>{



    cancelDescendants = (eventName: string | string[] = [], includeSelf: boolean = true) => {
        const level = this._eventLevel.getChildren(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            if (includeSelf) level.receivers.clear();
            level.children.clear();
        }
    }
    offDescendants = this.cancelDescendants;

    cancelAncestors = (eventName: string | string[] = [], includeSelf: boolean = true) => {
        let level = this._eventLevel;

        for (const currentName of EventSpace.convertEventNameType(eventName)) {
            level.receivers.clear();

            const currentLevel = level.children.get(currentName);
            if (currentLevel !== undefined)
                level = currentLevel;
            else
                return;
        }

        if (includeSelf) level.receivers.clear();
    }
    offAncestors = this.cancelAncestors;

    trigger = (eventName: string | string[], data?: any, asynchronous?: boolean) => {
        const level = this._eventLevel.getChildren(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined)
            level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));
    }
    send = this.trigger;

    triggerDescendants = (eventName: string | string[], data?: any, includeSelf: boolean = true, asynchronous?: boolean) => {
        const level = this._eventLevel.getChildren(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            if (includeSelf) level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));

            function triggerChildren(level: EventLevel) {
                level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));
                level.children.forEach(triggerChildren);
            }
            level.children.forEach(triggerChildren);
        }
    }
    sendDescendants = this.triggerDescendants;

    triggerAncestors = (eventName: string | string[], data?: any, includeSelf: boolean = true, asynchronous?: boolean) => {
        let level = this._eventLevel;

        for (const currentName of EventSpace.convertEventNameType(eventName)) {
            level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));

            const currentLevel = level.children.get(currentName);
            if (currentLevel !== undefined)
                level = currentLevel;
            else
                return;
        }

        if (includeSelf) level.receivers.forEach(item => asynchronous ? setTimeout(item, 0, data) : item(data));
    }
    sendAncestors = this.triggerAncestors;

    has = (eventName: string | string[], listener?: Listener) => {
        const level = this._eventLevel.getChildren(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            if (listener !== undefined)
                return level.receivers.has(listener);
            else
                return level.receivers.size > 0;
        } else
            return false;
    }

    hasDescendants = (eventName: string | string[], includeSelf: boolean = true) => {
        const level = this._eventLevel.getChildren(EventSpace.convertEventNameType(eventName), false);
        if (level !== undefined) {
            if (includeSelf && level.receivers.size > 0) return true;

            function checkChildren(level: EventLevel) {
                if (level.receivers.size > 0) {
                    return true;
                } else {
                    for (const item of level.children.values())
                        if (checkChildren(item)) return true;

                    return false;
                }
            }

            for (const item of level.children.values())
                if (checkChildren(item)) return true;

            return false;
        } else
            return false;
    }

    hasAncestors = (eventName: string | string[], includeSelf: boolean = true) => {
        let level = this._eventLevel;

        for (const currentName of EventSpace.convertEventNameType(eventName)) {
            if (level.receivers.size > 0) return true;

            const currentLevel = level.children.get(currentName);
            if (currentLevel !== undefined)
                level = currentLevel;
            else
                return false;
        }

        if (includeSelf)
            return level.receivers.size > 0;
        else
            return false;
    }
}