export declare type eventname = string | number;
export default class EventLevel {
    receivers: Function[];
    children: Map<string | number, EventLevel>;
    addReceiver(levelNameArray: eventname[], receiver: Function): void;
    removeReceiver(levelNameArray: eventname[]): void;
    trigger(levelNameArray: eventname[], data: any, _this: Object, __originalLevelName?: eventname[]): void;
}
