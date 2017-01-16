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
export let RADIANS_TO_METERS = 6371000;
export let METERS_TO_RADIANS = 1 / RADIANS_TO_METERS;

// OK
export let convertDegreesToRadians: Function = function (multiplier) {
   return function (num: number) {
      return num * multiplier;
   };
} (Math.PI / 180);

// OK
export let convertRadiansToDegree: Function = function (multiplier) {
   return function (num: number) {
      return num * multiplier;
   };
} (180 / Math.PI);

export function normalizeRadians(angle) {
    let newAngle = angle;
    while (newAngle <= -Math.PI) newAngle += 2 * Math.PI;
    while (newAngle > Math.PI) newAngle -= 2 * Math.PI;
    return newAngle;
}

// OK
export function expandBbox(bbox: number[], rawPoint: number[]) {
   bbox[0] = Math.min(bbox[0], rawPoint[0]);
   bbox[1] = Math.min(bbox[1], rawPoint[1]);
   bbox[2] = Math.max(bbox[2], rawPoint[0]);
   bbox[3] = Math.max(bbox[3], rawPoint[1]);
}

// OK. Bounding Box like bbox
export function createBboxFromPoints(coords: GeoJSON.Position[]): number[] {
   let bbox = [Infinity, Infinity, -Infinity, -Infinity];
   coords.forEach(point => {
      expandBbox(bbox, point);
   });
   return bbox;
}

export function positionWithinBbox(bbox: number[], position: GeoJSON.Position): boolean {
   return bbox[0] <= position[0]
      && bbox[1] <= position[1]
      && bbox[2] >= position[0]
      && bbox[3] >= position[1];
}

/**
 * Taken a few points make the line have more points, with each point along the line.
 */
export function densify(line: GeoJSON.Position[], count: number) {
   let segmentDetails = calculateSegmentDetails(line);
   let wayPointLength = calculateLineLength(line) / (count - 1);
   let segmentIndex = 0;
   let buffer: GeoJSON.Position[] = [line[0]];
   for (let i = 1; i < count - 1; i++) {
      let distanceAlong = wayPointLength * i;

      while (distanceAlong > segmentDetails[segmentIndex].startOrigin + segmentDetails[segmentIndex].length) {
         segmentIndex++;
      }
      let segment = segmentDetails[segmentIndex];

      let point = calculatePosition(segment.start, segment.bearing, distanceAlong - segment.startOrigin);

      buffer.push(point);
   }
   buffer.push(line[line.length - 1]);
   return buffer;
}

export function calculatePosition(pt: GeoJSON.Position, bearing: number, distance: number): GeoJSON.Position {
   let dist = distance / 6371000;  // convert dist to angular distance in radians
   let brng = convertDegreesToRadians(bearing);

   let lon1 = convertDegreesToRadians(pt[0]);
   let lat1 = convertDegreesToRadians(pt[1]);

   let sinLat1 = Math.sin(lat1);
   let cosLat1 = Math.cos(lat1);


   let lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
      Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
   let lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1),
      Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
   lon2 = normalizeRadians(lon2 + 3 * Math.PI);  // normalise -180 to +180

   return [convertRadiansToDegree(lon2), convertRadiansToDegree(lat2)];
}

export function calculateSegmentDetails(line: GeoJSON.Position[]) {
   if(line.length < 2) {
      return [0];
   }

   let lengths = [];
   let accumulateLength = 0;
   for(let i = 1; i < line.length; i++) {
      let length = calculateDistance(line[i - 1], line[i]);
      let endLength = accumulateLength + length;
      lengths.push({
         start: line[i-1],
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
export function calculateLineLength(points: GeoJSON.Position[]) {
   let accumulator = 0;
   if (points.length > 1) {
      for (let i = 1; i < points.length; i++) {
         accumulator += calculateDistance(points[i - 1], points[i]);
      }
   }
   return accumulator;
}

// from http://www.movable-type.co.uk/scripts/latlong.html
export function calculateDistance(pt1: GeoJSON.Position, pt2: GeoJSON.Position) {
   let lon1 = pt1[0],
      lat1 = pt1[1],
      lon2 = pt2[0],
      lat2 = pt2[1],
      dLat = convertDegreesToRadians(lat2 - lat1),
      dLon = convertDegreesToRadians(lon2 - lon1),
      a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(convertDegreesToRadians(lat1))
         * Math.cos(convertDegreesToRadians(lat2)) * Math.pow(Math.sin(dLon / 2), 2),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return c * RADIANS_TO_METERS; // returns meters
}

function calculatePositionAlong(coords: GeoJSON.Position[], distance: number) {
   if(!coords) {
      return null;
   }
   if (coords.length < 2) {
      return coords[0];
   }

   let fromStart = 0;

   for (let i = 0; i < coords.length; i++) {
      let segmentStart = coords[i];
      let segmentEnd = coords[i + 1];

      let segmentLength = calculateDistance(segmentStart, segmentEnd);
      if (fromStart + segmentLength < distance) {
         fromStart += segmentLength;
         continue;
      }

      let brng = calculateBearing(segmentStart, segmentEnd);
      return destination(segmentStart, distance - fromStart, brng);
   }
}


/**
 * Give a start point, a bearing give me the point that distance meters along the path
 */
export function destination(from: GeoJSON.Position, distance: number, bearing: number): GeoJSON.Position {
   let longitude1 = convertDegreesToRadians(from[0]);
   let latitude1 = convertDegreesToRadians(from[1]);
   let bearing_rad = convertDegreesToRadians(bearing);

   let radians = distance * METERS_TO_RADIANS;

   let latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(radians) +
      Math.cos(latitude1) * Math.sin(radians) * Math.cos(bearing_rad));
   let longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) *
      Math.sin(radians) * Math.cos(latitude1),
      Math.cos(radians) - Math.sin(latitude1) * Math.sin(latitude2));

   return [convertRadiansToDegree(longitude2), convertRadiansToDegree(latitude2)];
};

/**
 * Given two positions return the bearing from one to the other (source -> destination)
 */
export function calculateBearing(source: GeoJSON.Position, destination: GeoJSON.Position) {
   let lon1 = convertDegreesToRadians(source[0]);
   let lat1 = convertDegreesToRadians(source[1]);
   let lon2 = convertDegreesToRadians(destination[0]);
   let lat2 = convertDegreesToRadians(destination[1]);

   let a = Math.sin(lon2 - lon1) * Math.cos(lat2);
   let b = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

   return convertRadiansToDegree(Math.atan2(a, b));
}