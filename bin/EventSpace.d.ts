import { receiverType } from "./EventLevel";
export interface EventSpaceStructure {
    on: (eventName: any | any[], receiver: receiverType) => receiverType;
    receive: (eventName: any | any[], receiver: receiverType) => receiverType;
    once: (eventName: any | any[], receiver: receiverType) => receiverType;
    receiveOnce: (eventName: any | any[], receiver: receiverType) => receiverType;
    off: (eventName?: any | any[]) => void;
    cancel: (eventName?: any | any[]) => void;
    trigger: (eventName: any | any[], data: any, _this_?: Object) => void;
    send: (eventName: any | any[], data: any, _this_?: Object) => void;
}
export default class EventSpace implements EventSpaceStructure {
    private readonly eventLevel;
    receive: (eventName: any, receiver: receiverType) => receiverType;
    on: (eventName: any, receiver: receiverType) => receiverType;
    receiveOnce: (eventName: any, receiver: receiverType) => receiverType;
    once: (eventName: any, receiver: receiverType) => receiverType;
    cancel: (eventName?: any) => void;
    off: (eventName?: any) => void;
    send: (eventName: any, data: any, _this_?: Object) => void;
    trigger: (eventName: any, data: any, _this_?: Object) => void;
}
