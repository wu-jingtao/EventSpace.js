import { EventSpace } from "./classes/EventSpace";
import { EventSpaceType } from "./interfaces/EventSpaceType";

const es: EventSpaceType & { EventSpace: typeof EventSpace } = {
    EventSpace,
    ... new EventSpace()
} as any;
export = es;