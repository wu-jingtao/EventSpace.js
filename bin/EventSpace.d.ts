import { receiver } from "./EventLevel";
export default class EventSpace {
    private readonly _eventLevel;
    receive: (eventName: string | string[], receiver: receiver) => receiver;
    on: (eventName: string | string[], receiver: receiver) => receiver;
    receiveOnce: (eventName: string | string[], receiver: receiver) => receiver;
    once: (eventName: string | string[], receiver: receiver) => receiver;
    cancel: (eventName?: string | string[]) => void;
    off: (eventName?: string | string[]) => void;
    send: (eventName: any, data: any, _this_?: Object) => void;
    trigger: (eventName: any, data: any, _this_?: Object) => void;
}
