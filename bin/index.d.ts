import { EventSpace } from "./classes/EventSpace";
import { EventSpaceType } from "./interfaces/EventSpaceType";
declare const es: EventSpaceType & {
    EventSpace: EventSpace;
};
export = es;
