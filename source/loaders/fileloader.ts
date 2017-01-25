import { Loader } from "./loader";
import { Event } from "../domain/event";

export class FileLoader extends Loader<any> {
   reader: FileReader;

   constructor(public file: File, options: any = {}, public callback: Function) {
      super();
      this.reader = new FileReader();
   }


   load(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         let self = this;

         this.reader.onloadend = (evt) => {
            console.log("We have loaded with ready state = " + evt.target["readyState"]);
            if (evt.target["readyState"] === FileReader.prototype.DONE) { // DONE == 2
               let result = evt.target["result"];
               self.dispatchEvent(new Event("data", result));
               self.dispatchEvent(new Event("complete", result));
               resolve(result);
            }
         };

         this.reader.onerror = (event) => {
            this.dispatchEvent(new Event("error", {event}));
            reject( event );
         };
         self.reader.readAsArrayBuffer(self.file);
      });
   }
}
