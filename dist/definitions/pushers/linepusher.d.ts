import { Loader } from "../loaders/loader";
import { Pipeline } from "./pipeline";
export declare class LinePusher {
    loader: Loader<string>;
    pipeline: Pipeline;
    lineBuffer: string[];
    constructor(loader: Loader<string>, pipeline: Pipeline);
    start(targetFn: Function): Promise<void>;
    private scanData(data);
}
