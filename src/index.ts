import { EventSpace } from "./classes/EventSpace";
import { EventSpaceType } from "./interfaces/EventSpaceType";

const es: EventSpaceType & { EventSpace: EventSpace } = {
    EventSpace,
    ... new EventSpace()
} as any;
export = es;