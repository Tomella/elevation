(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Elevation = global.Elevation || {})));
}(this, (function (exports) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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
// At the equator
/**
 * Look here for inspiration as needed...
 * http://www.movable-type.co.uk/scripts/latlong.html
 *
 * and here
 * http://paulbourke.net/
 *
 * Between those descriptions we should be able to build most things.
 *
 */ var RADIANS_TO_METERS = 6371000;
var METERS_TO_RADIANS = 1 / RADIANS_TO_METERS;
// OK
var convertDegreesToRadians = function (multiplier) {
    return function (num) {
        return num * multiplier;
    };
}(Math.PI / 180);
// OK
var convertRadiansToDegree = function (multiplier) {
    return function (num) {
        return num * multiplier;
    };
}(180 / Math.PI);
function normalizeRadians(angle) {
    var newAngle = angle;
    while (newAngle <= -Math.PI)
        newAngle += 2 * Math.PI;
    while (newAngle > Math.PI)
        newAngle -= 2 * Math.PI;
    return newAngle;
}
// OK
function expandBbox(bbox, rawPoint) {
    bbox[0] = Math.min(bbox[0], rawPoint[0]);
    bbox[1] = Math.min(bbox[1], rawPoint[1]);
    bbox[2] = Math.max(bbox[2], rawPoint[0]);
    bbox[3] = Math.max(bbox[3], rawPoint[1]);
}
// Not OK
function culledBbox(container, subset) {
    // We try to pull them into line
    var left = subset[0] < container[0] ? container[0] : subset[0];
    var right = subset[2] > container[2] ? container[2] : subset[2];
    var bottom = subset[1] < container[1] ? container[1] : subset[1];
    var top = subset[3] > container[3] ? container[3] : subset[3];
    // Now make sure that they are still within.
    if (left > subset[2] // To far right
        || right < subset[0] // To far left
        || top < subset[1] // To low
        || bottom > subset[3] // To high
        || left >= right // To narrow
        || top <= bottom) {
        return null;
    }
    return [left, bottom, right, top];
}
// OK. Bounding Box like bbox
function createBboxFromPoints(coords) {
    var bbox = [Infinity, Infinity, -Infinity, -Infinity];
    coords.forEach(function (point) {
        expandBbox(bbox, point);
    });
    return bbox;
}
function positionWithinBbox(bbox, position) {
    return bbox[0] <= position[0]
        && bbox[1] <= position[1]
        && bbox[2] >= position[0]
        && bbox[3] >= position[1];
}
/**
 * Taken a few points make the line have more points, with each point along the line.
 */
function densify(line, count) {
    var segmentDetails = calculateSegmentDetails(line);
    var wayPointLength = calculateLineLength(line) / (count - 1);
    var segmentIndex = 0;
    var buffer = [line[0]];
    for (var i = 1; i < count - 1; i++) {
        var distanceAlong = wayPointLength * i;
        while (distanceAlong > segmentDetails[segmentIndex].startOrigin + segmentDetails[segmentIndex].length) {
            segmentIndex++;
        }
        var segment = segmentDetails[segmentIndex];
        var point = calculatePosition(segment.start, segment.bearing, distanceAlong - segment.startOrigin);
        buffer.push(point);
    }
    buffer.push(line[line.length - 1]);
    return buffer;
}
function calculatePosition(pt, bearing, distance) {
    var dist = distance / 6371000; // convert dist to angular distance in radians
    var brng = convertDegreesToRadians(bearing);
    var lon1 = convertDegreesToRadians(pt[0]);
    var lat1 = convertDegreesToRadians(pt[1]);
    var sinLat1 = Math.sin(lat1);
    var cosLat1 = Math.cos(lat1);
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
    var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
    lon2 = normalizeRadians(lon2 + 3 * Math.PI); // normalise -180 to +180
    return [convertRadiansToDegree(lon2), convertRadiansToDegree(lat2)];
}
function calculateSegmentDetails(line) {
    if (line.length < 2) {
        return [0];
    }
    var lengths = [];
    var accumulateLength = 0;
    for (var i = 1; i < line.length; i++) {
        var length = calculateDistance(line[i - 1], line[i]);
        var endLength = accumulateLength + length;
        lengths.push({
            start: line[i - 1],
            end: line[i],
            bearing: calculateBearing(line[i - 1], line[i]),
            length: length,
            startOrigin: accumulateLength
        });
        accumulateLength = endLength;
    }
    return lengths;
}
/**
 * Tested and working OK.
 */
function calculateLineLength(points) {
    var accumulator = 0;
    if (points.length > 1) {
        for (var i = 1; i < points.length; i++) {
            accumulator += calculateDistance(points[i - 1], points[i]);
        }
    }
    return accumulator;
}
// from http://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(pt1, pt2) {
    var lon1 = pt1[0], lat1 = pt1[1], lon2 = pt2[0], lat2 = pt2[1], dLat = convertDegreesToRadians(lat2 - lat1), dLon = convertDegreesToRadians(lon2 - lon1), a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(convertDegreesToRadians(lat1))
        * Math.cos(convertDegreesToRadians(lat2)) * Math.pow(Math.sin(dLon / 2), 2), c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return c * RADIANS_TO_METERS; // returns meters
}
/**
 * Give a start point, a bearing give me the point that distance meters along the path
 */
function destination(from, distance, bearing) {
    var longitude1 = convertDegreesToRadians(from[0]);
    var latitude1 = convertDegreesToRadians(from[1]);
    var bearing_rad = convertDegreesToRadians(bearing);
    var radians = distance * METERS_TO_RADIANS;
    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
        Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
    var longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) *
        Math.sin(radians) * Math.cos(latitude1), Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));
    return [convertRadiansToDegree(longitude2), convertRadiansToDegree(latitude2)];
}

/**
 * Given two positions return the bearing from one to the other (source -> destination)
 */
function calculateBearing(source, destination) {
    var lon1 = convertDegreesToRadians(source[0]);
    var lat1 = convertDegreesToRadians(source[1]);
    var lon2 = convertDegreesToRadians(destination[0]);
    var lat2 = convertDegreesToRadians(destination[1]);
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    return convertRadiansToDegree(Math.atan2(a, b));
}

var Extent2d = (function () {
    function Extent2d(lngMin, latMin, lngMax, latMax) {
        if (lngMin === void 0) { lngMin = -180; }
        if (latMin === void 0) { latMin = -90; }
        if (lngMax === void 0) { lngMax = 180; }
        if (latMax === void 0) { latMax = -90; }
        this._extent = [];
        this._extent = [lngMin, latMin, lngMax, latMax];
    }
    Object.defineProperty(Extent2d.prototype, "lngMin", {
        get: function () {
            return this._extent[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Extent2d.prototype, "latMin", {
        get: function () {
            return this._extent[1];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Extent2d.prototype, "lngMax", {
        get: function () {
            return this._extent[2];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Extent2d.prototype, "latMax", {
        get: function () {
            return this._extent[3];
        },
        enumerable: true,
        configurable: true
    });
    Extent2d.prototype.set = function (extent) {
        this._extent = [extent.lngMin, extent.latMin, extent.lngMax, extent.latMin];
        return this;
    };
    Extent2d.prototype.setFromPoints = function (points) {
        this._extent = createBboxFromPoints(points);
        return this;
    };
    Extent2d.prototype.expand = function (point) {
        expandBbox(this._extent, point);
        return this;
    };
    Extent2d.prototype.toBbox = function () {
        // Clone it.
        return [this.lngMin, this.latMin, this.lngMax, this.latMax];
    };
    Extent2d.prototype.clone = function () {
        return new Extent2d().set(this);
    };
    return Extent2d;
}());
Extent2d.AUSTRALIA = new Extent2d(113, -44, 154, -10);
Extent2d.WORLD = new Extent2d(-180, -90, 180, 90);
Extent2d.REVERSE_WORLD = new Extent2d(180, 90, -180, -90);

var Transection = (function () {
    function Transection(serviceUrlTemplate) {
        this.serviceUrlTemplate = serviceUrlTemplate;
        this.diagonal = 500;
    }
    Transection.prototype.getElevation = function (geometry, buffer) {
        var _this = this;
        if (buffer === void 0) { buffer = 0; }
        return new Promise(function (resolve, reject) {
            _this.extent = new Extent2d();
        });
    };
    Transection.calcSides = function (diagonal, ar) {
        // x * x + ar * ar * x * x = diagonal * diagonal
        // (1 + ar * ar) * x * x = diagonal * diagonal
        // x * x = diagonal * diagonal / (1 + ar * ar)
        var y = Math.sqrt(diagonal * diagonal / (1 + ar * ar));
        return { y: Math.ceil(y), x: Math.ceil(y * ar) };
    };
    return Transection;
}());

var EventDispatcher = (function () {
    function EventDispatcher() {
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        if (this.listeners === undefined)
            this.listeners = {};
        var listeners = this.listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        if (this.listeners === undefined)
            return false;
        var listeners = this.listeners;
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        if (this.listeners === undefined)
            return;
        var listenerArray = this.listeners[type];
        if (listenerArray !== undefined) {
            this.listeners[type] = listenerArray.filter(function (existing) { return listener !== existing; });
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var _this = this;
        var listeners = this.listeners;
        if (listeners === undefined)
            return;
        var array = [];
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            listenerArray.forEach(function (listener) { return listener.call(_this, event); });
        }
    };
    EventDispatcher.prototype.removeAllListeners = function () {
        this.listeners = undefined;
    };
    return EventDispatcher;
}());

var Loader = (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Loader;
}(EventDispatcher));

var Event = (function () {
    function Event(type, data, target) {
        this.type = type;
        this.data = data;
        this.target = target;
    }
    return Event;
}());

var FileLoader = (function (_super) {
    __extends(FileLoader, _super);
    function FileLoader(file, options, callback) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.file = file;
        _this.callback = callback;
        _this.reader = new FileReader();
        return _this;
    }
    FileLoader.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var self = _this;
            _this.reader.onloadend = function (evt) {
                console.log("We have loaded with ready state = " + evt.target["readyState"]);
                if (evt.target["readyState"] === FileReader.prototype.DONE) {
                    var result = evt.target["result"];
                    self.dispatchEvent(new Event("data", result));
                    self.dispatchEvent(new Event("complete", result));
                    resolve(result);
                }
            };
            _this.reader.onerror = function (event) {
                _this.dispatchEvent(new Event("error", { event: event }));
                reject(event);
            };
            self.reader.readAsArrayBuffer(self.file);
        });
    };
    return FileLoader;
}(Loader));

var HttpTextLoader = (function (_super) {
    __extends(HttpTextLoader, _super);
    function HttpTextLoader(location, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.location = location;
        _this.options = options;
        return _this;
    }
    HttpTextLoader.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var index = 0;
            var request = new XMLHttpRequest();
            // We handle the load in here.
            request.addEventListener("readystatechange", function (evt) {
                if (request.readyState !== null && (request.readyState < 3 || request.status !== 200)) {
                    return;
                }
                var text = request.responseText;
                _this.dispatchEvent(new Event("data", text.substr(index)));
                index = text.length;
                // If we have loaded then resolve
                if (request.readyState === 4) {
                    _this.dispatchEvent(new Event("complete", request.responseText));
                    resolve(text);
                }
            }, false);
            request.addEventListener("error", function (event) {
                _this.dispatchEvent(new Event("error", { event: event }));
                reject(event);
            }, false);
            if (_this.options.crossOrigin !== undefined) {
                request["crossOrigin"] = _this.options.crossOrigin;
            }
            request.open("GET", _this.location, true);
            request.responseType = "arraybuffer";
            request.send(null);
        });
    };
    
    Object.defineProperty(HttpTextLoader.prototype, "crossOrigin", {
        set: function (value) {
            this.options.crossOrigin = value;
        },
        enumerable: true,
        configurable: true
    });
    
    return HttpTextLoader;
}(Loader));

// Given a GeoTiff end point, return a promise that resolves to a one dimensional array of z values.
// A bit like a stream loader but it is all or nothing. It's up to the composer to turn it into a 2d array.
var TerrainLoader = (function (_super) {
    __extends(TerrainLoader, _super);
    function TerrainLoader(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    TerrainLoader.prototype.load = function () {
        var _this = this;
        var request = this.options.loader ? this.options.loader : new DefaultLoader(this.options);
        if (this.options.crossOrigin !== undefined) {
            request["crossOrigin"] = this.options.crossOrigin;
        }
        return request.load().then(function (response) {
            var parser = new GeotiffParser();
            parser.parseHeader(response);
            _this.dispatchEvent(new Event("header", { width: parser.imageWidth, height: parser.imageLength }));
            return parser.loadPixels();
        });
    };
    
    Object.defineProperty(TerrainLoader.prototype, "crossOrigin", {
        set: function (value) {
            this.options.crossOrigin = value;
        },
        enumerable: true,
        configurable: true
    });
    
    return TerrainLoader;
}(Loader));
var DefaultLoader = (function (_super) {
    __extends(DefaultLoader, _super);
    function DefaultLoader(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    DefaultLoader.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var intersectingBbox = culledBbox(_this.options.extent.toBbox(), _this.options.bbox);
            if (!intersectingBbox) {
                reject("Not within the data extent");
                return;
            }
            var request = new XMLHttpRequest();
            request.addEventListener("load", function (event) {
                resolve(event.target["response"]);
            }, false);
            request.addEventListener("error", function (event) {
                reject(event);
            }, false);
            if (_this.options.crossOrigin !== undefined) {
                request["crossOrigin"] = _this.options.crossOrigin;
            }
            request.open("GET", _this.options.location, true);
            request.responseType = "arraybuffer";
            request.send(null);
        });
    };
    
    Object.defineProperty(DefaultLoader.prototype, "crossOrigin", {
        set: function (value) {
            this.options.crossOrigin = value;
        },
        enumerable: true,
        configurable: true
    });
    
    return DefaultLoader;
}(Loader));

// Given a point, return a piint with the same x, y coordinates plus a z-coordinate as returned by the TerrainLoader
var PointElevationLoader = (function () {
    function PointElevationLoader(options) {
        this.options = options;
    }
    PointElevationLoader.prototype.load = function () {
        var _this = this;
        return new TerrainLoader(this.options)
            .load()
            .then(function (pointArray) {
            return [_this.options.point[0], _this.options.point[1], pointArray[0]];
        });
    };
    return PointElevationLoader;
}());

var CswPointOptions = (function () {
    function CswPointOptions(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    Object.defineProperty(CswPointOptions.prototype, "template", {
        get: function () {
            return this.options.point;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswPointOptions.prototype, "point", {
        get: function () {
            return this.options.point;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswPointOptions.prototype, "bbox", {
        get: function () {
            return [
                this.point[0] - 0.000001,
                this.point[1] - 0.000001,
                this.point[0] + 0.000001,
                this.point[1] + 0.000001
            ];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswPointOptions.prototype, "extent", {
        get: function () {
            return new (Extent2d.bind.apply(Extent2d, [void 0].concat(this.bbox)))();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswPointOptions.prototype, "location", {
        get: function () {
            return this.template
                .replace("${resx}", 1)
                .replace("${resy}", 1)
                .replace("${width}", 1)
                .replace("${height}", 1)
                .replace("${bbox}", this.bbox.join(","));
        },
        enumerable: true,
        configurable: true
    });
    return CswPointOptions;
}());

var CswPointElevationLoader = (function (_super) {
    __extends(CswPointElevationLoader, _super);
    function CswPointElevationLoader(options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.options = options;
        return _this;
    }
    Object.defineProperty(CswPointElevationLoader.prototype, "point", {
        set: function (pt) {
            this.options.point = pt;
        },
        enumerable: true,
        configurable: true
    });
    CswPointElevationLoader.prototype.load = function () {
        var cswPointElevationOptions = new CswPointOptions(this.options);
        var loader = new PointElevationLoader(cswPointElevationOptions);
        return loader.load();
    };
    return CswPointElevationLoader;
}(Loader));

var CswUrlOptions = (function () {
    function CswUrlOptions(options) {
        this.options = options;
    }
    Object.defineProperty(CswUrlOptions.prototype, "resolutionY", {
        get: function () {
            return this.options.resolutionY ? this.options.resolutionY : Math.round(this.resolutionX * (this.bbox[3] - this.bbox[1]) / (this.bbox[2] - this.bbox[0]));
        },
        set: function (val) {
            this.options.resolutionY = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswUrlOptions.prototype, "resolutionX", {
        get: function () {
            return this.options.resolutionX ? this.options.resolutionX : 500;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswUrlOptions.prototype, "template", {
        get: function () {
            return this.options.template;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswUrlOptions.prototype, "bbox", {
        get: function () {
            return this.options.bbox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswUrlOptions.prototype, "extent", {
        get: function () {
            return this.options.extent ? this.options.extent : Extent2d.WORLD;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CswUrlOptions.prototype, "location", {
        get: function () {
            return this.template
                .replace("${resx}", this.resolutionX)
                .replace("${resy}", this.resolutionY)
                .replace("${width}", this.resolutionX)
                .replace("${height}", this.resolutionY)
                .replace("${bbox}", this.bbox.join(","));
        },
        enumerable: true,
        configurable: true
    });
    return CswUrlOptions;
}());

var CswTerrainLoader = (function () {
    function CswTerrainLoader(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    CswTerrainLoader.prototype.load = function () {
        var cswUrlOptions = new CswUrlOptions(this.options);
        var loader = new TerrainLoader(cswUrlOptions);
        return loader.load();
    };
    return CswTerrainLoader;
}());

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
var XyzElevationLoader = (function (_super) {
    __extends(XyzElevationLoader, _super);
    function XyzElevationLoader(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.resolutionX = 500;
        _this.extent = Extent2d.WORLD;
        _this.childLoader = new TerrainLoader(options);
        return _this;
    }
    XyzElevationLoader.prototype.load = function () {
        var options = this.options;
        var template = this.options.template;
        var bbox = options.bbox;
        var deltaX = (bbox[2] - bbox[0]) / (options.resolutionX - 1);
        var deltaY = (bbox[3] - bbox[1]) / (options.resolutionY - 1);
        var top = bbox[3];
        var left = bbox[0];
        return this.childLoader.load().then(function (responseArr) {
            return responseArr.map(function (z, index) {
                var x = index % options.resolutionX;
                var y = Math.floor(index / options.resolutionX);
                return {
                    x: left + x * deltaX,
                    y: top - y * deltaY,
                    z: z
                };
            });
        });
    };
    return XyzElevationLoader;
}(Loader));

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
var GeojsonElevationLoader = (function (_super) {
    __extends(GeojsonElevationLoader, _super);
    function GeojsonElevationLoader(options) {
        var _this = _super.call(this) || this;
        _this.options = options;
        _this.childLoader = new XyzElevationLoader(options);
        return _this;
    }
    GeojsonElevationLoader.prototype.load = function () {
        var options = this.options;
        var bbox = options.bbox;
        var deltaX = (bbox[2] - bbox[0]) / (options.resolutionX - 1);
        var deltaY = (bbox[3] - bbox[1]) / (options.resolutionY - 1);
        var bottom = bbox[1];
        var left = bbox[0];
        return this.childLoader.load().then(function (responseArr) {
            var response = {
                type: "FeatureCollection",
                bbox: [bbox[0], bbox[1], bbox[2], bbox[3]],
                features: responseArr.map(function (entry) {
                    return {
                        type: "Feature",
                        properties: [],
                        geometry: {
                            type: "Point",
                            coordinates: [
                                entry.x,
                                entry.y,
                                entry.z
                            ]
                        }
                    };
                })
            };
            return response;
        });
    };
    GeojsonElevationLoader.prototype.calculateResolutionY = function (bbox, resolutionX, resolutionY) {
        return resolutionY ? resolutionY : Math.round(resolutionX * (bbox[3] - bbox[1]) / (bbox[2] - bbox[0]));
    };
    return GeojsonElevationLoader;
}(Loader));

var CswGeoJsonLoader = (function () {
    function CswGeoJsonLoader(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
    }
    CswGeoJsonLoader.prototype.load = function () {
        var cswUrlOptions = new CswUrlOptions(this.options);
        var loader = new GeojsonElevationLoader(cswUrlOptions);
        return loader.load();
    };
    return CswGeoJsonLoader;
}());

var CswXyzLoader = (function () {
    function CswXyzLoader(options) {
        this.options = options;
    }
    CswXyzLoader.prototype.load = function () {
        var cswUrlOptions = new CswUrlOptions(this.options);
        var loader = new XyzElevationLoader(cswUrlOptions);
        return loader.load();
    };
    return CswXyzLoader;
}());

// Given a bbox, return a 2d grid with the same x, y coordinates plus a z-coordinate as returned by the 1d TerrainLoader.
var GridElevationLoader = (function () {
    function GridElevationLoader(options) {
        this.options = options;
        this.childLoader = new TerrainLoader(options);
    }
    GridElevationLoader.prototype.load = function () {
        var _this = this;
        return this.childLoader.load().then(function (responseArr) {
            var response = [];
            var lastRow;
            responseArr.forEach(function (z, index) {
                if (!(index % _this.options.resolutionX)) {
                    lastRow = [];
                    response.push(lastRow);
                }
                lastRow.push(z);
            });
            return response;
        });
    };
    return GridElevationLoader;
}());

exports.Extent2d = Extent2d;
exports.Transection = Transection;
exports.FileLoader = FileLoader;
exports.HttpTextLoader = HttpTextLoader;
exports.CswPointElevationLoader = CswPointElevationLoader;
exports.CswTerrainLoader = CswTerrainLoader;
exports.CswGeoJsonLoader = CswGeoJsonLoader;
exports.CswXyzLoader = CswXyzLoader;
exports.TerrainLoader = TerrainLoader;
exports.PointElevationLoader = PointElevationLoader;
exports.GeojsonElevationLoader = GeojsonElevationLoader;
exports.GridElevationLoader = GridElevationLoader;
exports.XyzElevationLoader = XyzElevationLoader;
exports.RADIANS_TO_METERS = RADIANS_TO_METERS;
exports.METERS_TO_RADIANS = METERS_TO_RADIANS;
exports.convertDegreesToRadians = convertDegreesToRadians;
exports.convertRadiansToDegree = convertRadiansToDegree;
exports.normalizeRadians = normalizeRadians;
exports.expandBbox = expandBbox;
exports.culledBbox = culledBbox;
exports.createBboxFromPoints = createBboxFromPoints;
exports.positionWithinBbox = positionWithinBbox;
exports.densify = densify;
exports.calculatePosition = calculatePosition;
exports.calculateSegmentDetails = calculateSegmentDetails;
exports.calculateLineLength = calculateLineLength;
exports.calculateDistance = calculateDistance;
exports.destination = destination;
exports.calculateBearing = calculateBearing;

Object.defineProperty(exports, '__esModule', { value: true });

})));
