declare namespace es {
    //对应EventSpace.ts中的EventSpaceStructure
    export class EventSpace {
        on: (eventName: any | any[], receiver: Function) => Function;
        receive: (eventName: any | any[], receiver: Function) => Function;
        once: (eventName: any | any[], receiver: Function) => Function;
        receiveOnce: (eventName: any | any[], receiver: Function) => Function;
        off: (eventName?: any | any[]) => void;
        cancel: (eventName?: any | any[]) => void;
        trigger: (eventName: any | any[], data: any, _this_?: Object) => void;
        send: (eventName: any | any[], data: any, _this_?: Object) => void;
    }

    export const on: (eventName: any | any[], receiver: Function) => Function;
    export const receive: (eventName: any | any[], receiver: Function) => Function;
    export const once: (eventName: any | any[], receiver: Function) => Function;
    export const receiveOnce: (eventName: any | any[], receiver: Function) => Function;
    export const off: (eventName?: any | any[]) => undefined;
    export const cancel: (eventName?: any | any[]) => undefined;
    export const trigger: (eventName: any | any[], data: any, _this?: Object) => undefined;
    export const send: (eventName: any | any[], data: any, _this?: Object) => undefined;
}