import { EventSpaceType } from './../interfaces/EventSpaceType';
import { Listener } from '../interfaces/ListenerType';
export declare class EventSpace implements EventSpaceType {
    /**
     * 将事件名转换成数组的形式
     * @param eventName 事件名称
     */
    static convertEventNameType(eventName: string | string[]): string[];
    private readonly _eventLevel;
    receive: <T extends Listener>(eventName: string | string[], listener: T) => T;
    on: <T extends Listener>(eventName: string | string[], listener: T) => T;
    receiveOnce: <T extends Listener>(eventName: string | string[], listener: T) => T;
    once: <T extends Listener>(eventName: string | string[], listener: T) => T;
    cancel: (eventName?: string | string[], listener?: Listener | undefined) => void;
    off: (eventName?: string | string[], listener?: Listener | undefined) => void;
    cancelDescendants: (eventName?: string | string[], includeSelf?: boolean) => void;
    offDescendants: (eventName?: string | string[], includeSelf?: boolean) => void;
    cancelAncestors: (eventName?: string | string[], includeSelf?: boolean) => void;
    offAncestors: (eventName?: string | string[], includeSelf?: boolean) => void;
    trigger: (eventName: string | string[], data?: any, asynchronous?: boolean | undefined) => void;
    send: (eventName: string | string[], data?: any, asynchronous?: boolean | undefined) => void;
    triggerDescendants: (eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean | undefined) => void;
    sendDescendants: (eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean | undefined) => void;
    triggerAncestors: (eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean | undefined) => void;
    sendAncestors: (eventName: string | string[], data?: any, includeSelf?: boolean, asynchronous?: boolean | undefined) => void;
    has: (eventName: string | string[], listener?: Listener | undefined) => boolean;
    hasDescendants: (eventName: string | string[], includeSelf?: boolean) => boolean;
    hasAncestors: (eventName: string | string[], includeSelf?: boolean) => boolean;
}
