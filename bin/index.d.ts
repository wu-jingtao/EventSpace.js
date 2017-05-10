import EventSpace from './EventSpace';
declare var _default: {
    EventSpace: typeof EventSpace;
    on: (eventName: any, receiver: Function) => Function;
    receive: (eventName: any, receiver: Function) => Function;
    once: (eventName: any, receiver: Function) => Function;
    receiveOnce: (eventName: any, receiver: Function) => Function;
    off: (eventName: any) => undefined;
    cancel: (eventName: any) => undefined;
    trigger: (eventName: any, data: any, _this: Object) => undefined;
    send: (eventName: any, data: any, _this: Object) => undefined;
};
export = _default;
