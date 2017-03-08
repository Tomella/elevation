import { Extent2d } from "../domain/extent2d";
import { Loader } from "../loaders/loader";
export declare class XyzElevationLoader extends Loader<any[]> {
    options: any;
    private childLoader;
    resolutionX: number;
    extent: Extent2d;
    constructor(options: any);
    load(): Promise<any[]>;
}
