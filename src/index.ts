import EventSpace from "./EventSpace";

const global = new EventSpace();

export = {
    EventSpace,
    receive: global.receive,
    on: global.on,
    receiveOnce: global.receiveOnce,
    once: global.once,
    cancel: global.cancel,
    off: global.off,
    send: global.send,
    trigger: global.trigger
}
