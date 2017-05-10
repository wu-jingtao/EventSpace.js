/**
 * Created by 吴劲韬 on 2017/3/12.
 */

import EventSpace from './EventSpace';

const es = new EventSpace();

export = (function (): {
    EventSpace: typeof EventSpace,
    on: (eventName: any | any[], receiver: Function) => Function,
    receive: (eventName: any | any[], receiver: Function) => Function,
    once: (eventName: any | any[], receiver: Function) => Function,
    receiveOnce: (eventName: any | any[], receiver: Function) => Function,
    off: (eventName: any | any[]) => undefined,
    cancel: (eventName: any | any[]) => undefined,
    trigger: (eventName: any | any[], data: any, _this: Object) => undefined,
    send: (eventName: any | any[], data: any, _this: Object) => undefined,
} {
    return {
        EventSpace,

        on: es.receive.bind(es),
        receive: es.receive.bind(es),

        once: es.receiveOnce.bind(es),
        receiveOnce: es.receiveOnce.bind(es),

        off: es.cancel.bind(es),
        cancel: es.cancel.bind(es),

        trigger: es.send.bind(es),
        send: es.send.bind(es),
    };
})();
