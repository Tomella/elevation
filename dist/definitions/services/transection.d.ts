/// <reference types="geojson" />
import { Extent2d } from "../domain/extent2d";
export declare class Transection {
    serviceUrlTemplate: string;
    diagonal: number;
    extent: Extent2d;
    constructor(serviceUrlTemplate: string);
    getElevation(geometry: GeoJSON.LineString, buffer?: number): Promise<GeoJSON.LineString>;
    static calcSides(diagonal: number, ar: any): {
        y: number;
        x: number;
    };
}
