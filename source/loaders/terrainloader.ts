export class TerrainLoader {
   constructor(public options: any = {}) {}

   load(url): Promise<number[]> {
      return new Promise<number[]>((onload, onerror) => {
         let request = new XMLHttpRequest();

         request.addEventListener("load", function ( event ) {
            let parser = new GeotiffParser();
            parser.parseHeader(event.target["response"]);
            onload(parser.loadPixels());
         }, false );

         request.addEventListener("error", function ( event ) {
            onerror( event );
         }, false );

         if ( this.options.crossOrigin !== undefined ) {
            request["crossOrigin"] = this.options.crossOrigin;
         }

         request.open("GET", url, true );
         request.responseType = "arraybuffer";
         request.send( null );
      });
   };

   set crossOrigin( value ) {
      this.options.crossOrigin = value;
   };
}
