import EventSpace from "./EventSpace";
declare var _default: {
    EventSpace: typeof EventSpace;
    receive: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    on: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    receiveOnce: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    once: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    cancel: <T extends (data?: any) => any>(eventName: string | string[], receiver?: T | undefined) => T | undefined;
    off: <T extends (data?: any) => any>(eventName: string | string[], receiver?: T | undefined) => T | undefined;
    send: (eventName: string | string[], data?: any) => void;
    trigger: (eventName: string | string[], data?: any) => void;
};
export = _default;
