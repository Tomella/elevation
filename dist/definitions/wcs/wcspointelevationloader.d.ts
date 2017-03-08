import { Loader } from "../loaders/loader";
export declare class WcsPointElevationLoader extends Loader<number[]> {
    options: any;
    constructor(options?: any);
    point: number[];
    load(): Promise<number[]>;
}
