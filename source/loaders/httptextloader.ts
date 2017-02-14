import { Loader } from "./loader";
import { Event } from "../domain/event";

export class HttpTextLoader extends Loader<any> {
   constructor(public location: string, public options: any = {}) {
      super();
   }

   load(): Promise<any> {
      return new Promise<any>((resolve, reject) => {
         let index = 0;
         let request = new XMLHttpRequest();

         // We handle the load in here.
         request.addEventListener("readystatechange", evt => {
            if (request.readyState !== null && (request.readyState < 3 || request.status !== 200)) {
               return;
            }

            let text = request.responseText;

            this.dispatchEvent(new Event("data", text.substr(index)));
            index = text.length;

            // If we have loaded then resolve
            if (request.readyState === 4) {
               this.dispatchEvent(new Event("complete", request.responseText));
               resolve(text);
            }

         }, false);

         request.addEventListener("error", ( event ) => {
            this.dispatchEvent(new Event("error", {event}));
            reject( event );
         }, false );

         if ( this.options.crossOrigin !== undefined ) {
            request["crossOrigin"] = this.options.crossOrigin;
         }

         request.open("GET", this.location, true );
         request.responseType = "text";
         request.send( null );
      });
   };

   set crossOrigin( value ) {
      this.options.crossOrigin = value;
   };
}
