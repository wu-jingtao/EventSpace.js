export declare type receiverType = (data?: any, eventName?: any[]) => any;
export default class EventLevel {
    receivers: receiverType[];
    children: Map<any, EventLevel>;
    addReceiver(levelNameArray: any[], receiver: receiverType): void;
    removeReceiver(levelNameArray: any[]): void;
    trigger(levelNameArray: any[], data: any, _this?: Object, __originalLevelName?: any[]): void;
}
