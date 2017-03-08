/// <reference types="geojson" />
export declare class WcsGeoJsonLoader {
    options: any;
    constructor(options?: any);
    load(): Promise<GeoJSON.FeatureCollection<GeoJSON.Point>>;
}
