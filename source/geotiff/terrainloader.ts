import { Loader } from "../loaders/loader";
import { Event } from "../domain/event";
import { positionWithinBbox, culledBbox } from "../utils/geojson2d";

// Given a GeoTiff end point, return a promise that resolves to a one dimensional array of z values.
// A bit like a stream loader but it is all or nothing. It's up to the composer to turn it into a 2d array.
export class TerrainLoader extends Loader<number[]> {

   constructor(public options: any = {}) {
      super();
   }

   load(): Promise<number[]> {
      let request = this.options.loader ? this.options.loader : new DefaultLoader(this.options);

      if (this.options.crossOrigin !== undefined) {
         request["crossOrigin"] = this.options.crossOrigin;
      }
      return request.load().then(response => {
         let parser = new GeotiffParser();
         parser.parseHeader(response);
         this.dispatchEvent(new Event("header", {width: parser.imageWidth, height: parser.imageLength} ));
         return parser.loadPixels();
      });
   };

   set crossOrigin(value) {
      this.options.crossOrigin = value;
   };
}

class DefaultLoader extends Loader<ArrayBuffer> {
   constructor(public options: any = {}) {
      super();
   }

   load(): Promise<ArrayBuffer> {
      return new Promise<ArrayBuffer>((resolve, reject) => {

         let intersectingBbox = culledBbox(this.options.extent.toBbox(), this.options.bbox);
         if (!intersectingBbox) {
            reject("Not within the data extent");
            return;
         }

         let request = new XMLHttpRequest();

         request.addEventListener("load", function (event) {
            resolve(event.target["response"]);
         }, false);

         request.addEventListener("error", function (event) {
            reject(event);
         }, false);

         if (this.options.crossOrigin !== undefined) {
            request["crossOrigin"] = this.options.crossOrigin;
         }

         request.open("GET", this.options.location, true);
         request.responseType = "arraybuffer";
         request.send(null);
      });
   };

   set crossOrigin(value) {
      this.options.crossOrigin = value;
   };
}
