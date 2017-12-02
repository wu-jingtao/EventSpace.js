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
    cancel(eventName?: string | string[], lrc?: boolean | Listener): void;
    off: (eventName?: string | string[], lrc?: boolean | Listener) => void;
    trigger(eventName: string | string[], data?: any, includeChildren?: boolean, asynchronous?: boolean): void;
    send: (eventName: string | string[], data?: any, includeChildren?: boolean, asynchronous?: boolean | undefined) => void;
    has(eventName: string | string[], lrc?: boolean | Listener): boolean;
}
