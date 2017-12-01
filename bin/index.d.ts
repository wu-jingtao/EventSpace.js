import EventSpace from "./EventSpace";
declare var _default: {
    EventSpace: typeof EventSpace;
    receive: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    on: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    receiveOnce: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    once: <T extends (data?: any) => any>(eventName: string | string[], receiver: T) => T;
    cancel: <T extends (data?: any) => any>(eventName?: string | string[], receiver?: T | undefined) => void;
    off: <T extends (data?: any) => any>(eventName?: string | string[], receiver?: T | undefined) => void;
    send: (eventName: string | string[], data?: any) => void;
    trigger: (eventName: string | string[], data?: any) => void;
    has: (eventName: string | string[], receiverOrChildren?: boolean | ((data?: any) => any) | undefined) => boolean;
};
export = _default;
