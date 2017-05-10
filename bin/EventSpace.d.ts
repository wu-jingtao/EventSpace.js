import EventLevel, { eventname } from "./EventLevel";
export default class EventSpace {
    readonly eventLevel: EventLevel;
    readonly EventSpace: typeof EventSpace;
    on: (eventName: eventname | eventname[], receiver: Function) => Function;
    receive: (eventName: eventname | eventname[], receiver: Function) => Function;
    once: (eventName: eventname | eventname[], receiver: Function) => Function;
    receiveOnce: (eventName: eventname | eventname[], receiver: Function) => Function;
    off: (eventName: eventname | eventname[]) => undefined;
    cancel: (eventName: eventname | eventname[]) => undefined;
    trigger: (eventName: eventname | eventname[], data: any, _this: Object) => undefined;
    send: (eventName: eventname | eventname[], data: any, _this: Object) => undefined;
    constructor();
}
