import { Loader } from "./loader";
export declare class HttpTextLoader extends Loader<any> {
    location: string;
    options: any;
    constructor(location: string, options?: any);
    load(): Promise<any>;
    crossOrigin: any;
}
