export default class EventSpace {
    private readonly eventLevel;
    receive(eventName: any | any[], receiver: Function): Function;
    receiveOnce(eventName: any | any[], receiver: Function): Function;
    cancel(eventName: any | any[]): void;
    send(eventName: any | any[], data: any, _this: Object): void;
}
