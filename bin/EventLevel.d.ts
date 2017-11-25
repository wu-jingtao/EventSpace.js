export declare type receiver = (data?: any, eventName?: string[]) => void;
export declare class EventLevel {
    private readonly _receivers;
    private readonly _children;
    addReceiver(levelNameArray: string[], receiver: receiver): void;
    removeReceiver(levelNameArray: string[]): void;
    hasReceiver(levelNameArray: string[]): boolean;
    trigger(levelNameArray: string[], data: any): void;
}
