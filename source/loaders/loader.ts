import { EventDispatcher } from "../utils/eventdispatcher";

export abstract class Loader<T> extends EventDispatcher {
   abstract load(): Promise<T>;
}