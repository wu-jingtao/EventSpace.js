import { EventSpace } from "./classes/EventSpace";
declare var _default: {
    receive: <T extends (data?: any) => any>(eventName: string | string[], listener: T) => T;
    on: <T extends (data?: any) => any>(eventName: string | string[], listener: T) => T;
    receiveOnce: <T extends (data?: any) => any>(eventName: string | string[], listener: T) => T;
    once: <T extends (data?: any) => any>(eventName: string | string[], listener: T) => T;
    off: (eventName?: string | string[], lrc?: boolean | ((data?: any) => any)) => void;
    send: (eventName: string | string[], data?: any, includeChildren?: boolean, asynchronous?: boolean | undefined) => void;
    EventSpace: typeof EventSpace;
};
export = _default;
