/// <reference types="geojson" />
import { Loader } from "../loaders/loader";
export declare class GeojsonElevationLoader extends Loader<GeoJSON.FeatureCollection<GeoJSON.Point>> {
    options: any;
    private childLoader;
    constructor(options: any);
    load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>>;
    private calculateResolutionY(bbox, resolutionX, resolutionY?);
}
