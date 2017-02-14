import { Extent2d } from "../domain/extent2d";

export class OsmUrlOptions {
   // Ends up like http://api.openstreetmap.org/api/0.6/map?bbox=144.9473,-38.3531,144.9511,-38.3499
   static defaultTemplate = "http://api.openstreetmap.org/api/0.6/map?bbox=${bbox}";

   constructor(public options: any) {}

   get template(): string {
      return this.options.template ? this.options.template : OsmUrlOptions.defaultTemplate;
   }

   get bbox(): number[] {
      return this.options.bbox;
   }

   set bbox(bbox) {
      this.options.bbox = bbox;
   }

   get location() {
      return this.template.replace("${bbox}", this.bbox.join(","));
   }
}