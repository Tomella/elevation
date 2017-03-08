import { EventDispatcher } from "../utils/eventdispatcher";
export declare abstract class Pipeline extends EventDispatcher {
    constructor();
    abstract pipe(event: any): void;
    destroy(): void;
}
