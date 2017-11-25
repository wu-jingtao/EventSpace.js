import EventSpace from "./EventSpace";
declare var _default: {
    EventSpace: typeof EventSpace;
    receive: (eventName: string | string[], receiver: (data?: any, eventName?: string[] | undefined) => void) => (data?: any, eventName?: string[] | undefined) => void;
    on: (eventName: string | string[], receiver: (data?: any, eventName?: string[] | undefined) => void) => (data?: any, eventName?: string[] | undefined) => void;
    receiveOnce: (eventName: string | string[], receiver: (data?: any, eventName?: string[] | undefined) => void) => (data?: any, eventName?: string[] | undefined) => void;
    once: (eventName: string | string[], receiver: (data?: any, eventName?: string[] | undefined) => void) => (data?: any, eventName?: string[] | undefined) => void;
    cancel: (eventName?: string | string[] | undefined) => void;
    off: (eventName?: string | string[] | undefined) => void;
    send: (eventName: string | string[], data: any) => void;
    trigger: (eventName: string | string[], data: any) => void;
};
export = _default;
