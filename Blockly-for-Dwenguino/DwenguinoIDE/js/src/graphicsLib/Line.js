import Point from './Point.js'

export default class Line{
    point1 = null;
    point2 = null;

    constructor(point1, point2){
        this.point1 = point1;
        this.point2 = point2;
    }

    getSlope(){
        return (this.point2.getY() - this.point1.getY())/(this.point2.getX() - this.point1.getX());
    }

    getOffset(){
        return this.point1.getY() - this.getSlope()*this.point1.getX();
    }
    /**
     * @brief get a point on "distanceFromLine" distance from the line measuring perpendicular from "pointOnLine"
     * @param {Point} pointOnLine A point on the line
     * @param {Number} distanceFromLine The distance perpendicular from pointOnLine
     * @returns {[Point, Point]} the point perpendicular above the line and below the line
     */
    getPointsPerpendicular(pointOnLine, distanceFromLine){
        let perpendicularSlope = 1/this.getSlope()*-1;
        return this.getPointAtDistanceFromPointWithSlope(pointOnLine, distanceFromLine, perpendicularSlope);
    }

    getPointAtDistanceFromPointWithSlope(pointOnLine, distanceFromPoint, slope){
        let alpha = Math.atan(slope);
        let xOffset = distanceFromPoint*Math.cos(alpha);
        let yOffset = distanceFromPoint*Math.sin(alpha);
        let p1 = new Point(pointOnLine.getX() + xOffset, pointOnLine.getY() + yOffset);
        let p2 = new Point(pointOnLine.getX() - xOffset, pointOnLine.getY() - yOffset);
        return [p1, p2];
    }

    /**
     * @brief returns the two points on the line at a set distance from a point on the line
     * @param {Point} pointOnLine 
     * @param {Number} distanceFromPoint 
     * @returns {[Point, Point]} 
     */
    getPointsOnLineAtSetDistanceFromOtherPointOnLine(pointOnLine, distanceFromPoint){
        return this.getPointAtDistanceFromPointWithSlope(pointOnLine, distanceFromPoint, this.getSlope());
    }
}