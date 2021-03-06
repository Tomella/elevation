import { EventDispatcher } from "../utils/eventdispatcher";

export abstract class Pipeline extends EventDispatcher {
   constructor() {
      super();
   }
   abstract pipe(event: any): void;

   destroy(): void {
      this.removeAllListeners();
   }
}