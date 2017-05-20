import EventSpace from "./EventSpace";
export default class Global extends EventSpace {
    readonly EventSpace: typeof EventSpace;
}
