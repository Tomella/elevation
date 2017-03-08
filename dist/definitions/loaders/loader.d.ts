import { EventDispatcher } from "../utils/eventdispatcher";
export declare abstract class Loader<T> extends EventDispatcher {
    abstract load(): Promise<T>;
}
