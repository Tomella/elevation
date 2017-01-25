import { Loader } from "../loaders/loader";
import { Pipeline } from "./pipeline";
import { Event } from "../domain/event";

export class LinePusher {
   lineBuffer: string[] = [];

   constructor(public loader: Loader<string>, public pipeline: Pipeline) {
   }

   async start(targetFn: Function) {
      this.loader.addEventListener("data", (event: Event) => {
         this.scanData(event.data);
      });
      this.loader.addEventListener("load", (event: Event) => {
         console.log("=> Kaputski");
      });
      this.loader.load();
   }


   private scanData(data: string) {
      let index = 0;
      while (index < data.length) {
         let char = data[index++];
         if (char === "\r") {
            continue;
         }
         if (char === "\n") {
            break;
         }
         this.lineBuffer.push(char);
      }
      let line = this.lineBuffer.join("");
      this.lineBuffer = [];
      this.pipeline.pipe(line);
   }
}
