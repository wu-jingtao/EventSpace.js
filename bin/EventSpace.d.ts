export interface EventSpaceStructure {
    on: (eventName: any | any[], receiver: Function) => Function;
    receive: (eventName: any | any[], receiver: Function) => Function;
    once: (eventName: any | any[], receiver: Function) => Function;
    receiveOnce: (eventName: any | any[], receiver: Function) => Function;
    off: (eventName?: any | any[]) => void;
    cancel: (eventName?: any | any[]) => void;
    trigger: (eventName: any | any[], data: any, _this_?: Object) => void;
    send: (eventName: any | any[], data: any, _this_?: Object) => void;
}
export default class EventSpace implements EventSpaceStructure {
    private readonly eventLevel;
    receive: (eventName: any, receiver: Function) => Function;
    on: (eventName: any, receiver: Function) => Function;
    receiveOnce: (eventName: any, receiver: Function) => Function;
    once: (eventName: any, receiver: Function) => Function;
    cancel: (eventName?: any) => void;
    off: (eventName?: any) => void;
    send: (eventName: any, data: any, _this_?: Object) => void;
    trigger: (eventName: any, data: any, _this_?: Object) => void;
}
