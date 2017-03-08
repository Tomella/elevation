/**
 * Slightly modified for TypeScript. Also we want it in the domain
 * https://github.com/mrdoob/eventdispatcher.js/
 */
import { Event } from "../domain/event";
export declare class EventDispatcher {
    listeners: any;
    addEventListener(type: string, listener: Function): void;
    hasEventListener(type: string, listener: Function): boolean;
    removeEventListener(type: string, listener: Function): void;
    dispatchEvent(event: Event): void;
    removeAllListeners(): void;
}
