export default class EventLevel {
    receivers: Function[];
    children: Map<any, EventLevel>;
    addReceiver(levelNameArray: any[], receiver: Function): void;
    removeReceiver(levelNameArray: any[]): void;
    trigger(levelNameArray: any[], data: any, _this: Object, __originalLevelName?: any[]): void;
}
