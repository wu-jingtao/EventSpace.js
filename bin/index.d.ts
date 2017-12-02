import { EventSpace } from "./classes/EventSpace";
import { EventSpaceType } from "./interfaces/EventSpaceType";
declare const es: EventSpaceType & {
    EventSpace: typeof EventSpace;
};
export = es;
