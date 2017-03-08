/// <reference types="geojson" />
/**
 * Look here for inspiration as needed...
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * and here
 * http://paulbourke.net/
 *
 * Between those descriptions we should be able to build most things.
 *
 */
export declare let RADIANS_TO_METERS: number;
export declare let METERS_TO_RADIANS: number;
export declare function convertDegreesToRadians(num: number): number;
export declare function convertRadiansToDegree(num: number): number;
export declare function normalizeRadians(angle: any): any;
export declare function expandBbox(bbox: number[], rawPoint: number[]): void;
export declare function culledBbox(container: number[], subset: number[]): number[];
/**
 * Given an array of points, create a bounding box that encompasses them all.
 * Optionally buffer the box by a proportion amount eg 0.05 represents a 5% further south, west east and north.
 * Keep in mind with this example that is 21% more area because it grows 5% in 4 directions.
 */
export declare function createBboxFromPoints(coords: GeoJSON.Position[], buffer?: number): number[];
/**
 * Buffer the box by a proportion amount eg 0.05 represents a 5% further south, west east and north.
 * Keep in mind with this example that is 21% more area because it grows 5% in 4 directions.
 * That is it is 10% wider and 10% higher.
 *
 */
export declare function createBufferedBbox(bbox: number[], buffer: number): number[];
/**
 * Test that a position is within the bounding box.
 */
export declare function positionWithinBbox(bbox: number[], position: GeoJSON.Position): boolean;
/**
 * Taken a few points make the line have more points, with each point along the line.
 */
export declare function densify(line: GeoJSON.Position[], count: number): number[][];
export declare function calculatePosition(pt: GeoJSON.Position, bearing: number, distance: number): GeoJSON.Position;
export declare function calculateSegmentDetails(line: GeoJSON.Position[]): any[];
/**
 * Tested and working OK.
 */
export declare function calculateLineLength(points: GeoJSON.Position[]): number;
export declare function calculateDistance(pt1: GeoJSON.Position, pt2: GeoJSON.Position): number;
/**
 * Give a start point, a bearing give me the point that distance meters along the path
 */
export declare function destination(from: GeoJSON.Position, distance: number, bearing: number): GeoJSON.Position;
/**
 * Given two positions return the bearing from one to the other (source -> destination)
 */
export declare function calculateBearing(source: GeoJSON.Position, destination: GeoJSON.Position): number;
