export default class EventSpace {
    private readonly eventLevel;
    on: (eventName: any, receiver: Function) => Function;
    receive(eventName: any | any[], receiver: Function): Function;
    once: (eventName: any, receiver: Function) => Function;
    receiveOnce(eventName: any | any[], receiver: Function): Function;
    off: (eventName?: any) => void;
    cancel(eventName?: any | any[]): void;
    trigger: (eventName: any, data: any, _this?: Object) => void;
    send(eventName: any | any[], data: any, _this?: Object): void;
}
