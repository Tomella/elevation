import { Loader } from "../loaders/loader";
import { HttpTextLoader } from "../loaders/httptextloader";
import { Event } from "../domain/event";

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
export class OsmGeoJsonLoader extends Loader<GeoJSON.FeatureCollection<any>> {
   private loader: Loader<string>;

   constructor(public options: any) {
      super();
   }

   load(): Promise<GeoJSON.FeatureCollection<any>> {
      let request = this.options.loader ? this.options.loader : new HttpTextLoader(this.options.location);

      if (this.options.crossOrigin !== undefined) {
         request["crossOrigin"] = this.options.crossOrigin;
      }
      return request.load().then(response => {
         let parser = new X2JS();
         let json = parser.xml_str2json(response);
         // this.dispatchEvent(new Event("header", {width: parser.imageWidth, height: parser.imageLength} ));

         return jsonToGeoJson(json);
      });

      function jsonToGeoJson(json: any) {
         let osm = json.osm;
         let bounds = osm.bounds;
         let nodesMap = {};
         osm.node.forEach(node => {
            nodesMap[node._id] = node;
         });

         let response = {
            type: "FeatureCollection",
            bbox: [+bounds._minlon, +bounds._minlat, +bounds._maxlon, +bounds._maxlat],
            features: osm.way.map(function (way) {
               return createFeature(way);
            })
         };

         return response;

         function createFeature(way) {
            // If first and last nd are same, then its a polygon
            let nodes = way.nd;
            let first = nodes[0];
            let last = nodes[nodes.length - 1];
            let feature = {
               type: "Feature",
               properties: createProperties(way),
               geometry: {
                  coordinates: []
               }
            };
            let geometry: any = feature.geometry;
            let coordinates = geometry.coordinates;

            if (last._ref === first._ref) {
               geometry.type = "Polygon";
               coordinates.push([]);
               coordinates = coordinates[0];
            } else {
               geometry.type = "LineString";
            }

            nodes.forEach(nd => {
               let node = nodesMap[nd._ref];
               // Set the point on a zero plane
               let coords = [+node._lon, +node._lat, 0];
               coordinates.push(coords);
            });

            return feature;
         }

         function createProperties(way) {
            let properties = {};
            (Array.isArray(way.tag) ? way.tag : [way.tag]).forEach((tag) => {
               properties[tag._k] = tag._v;
            });
            return properties;
         }
      }
   }
}
