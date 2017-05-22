export default class EventSpace {
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
