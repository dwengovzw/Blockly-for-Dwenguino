import Line from "../../graphicsLib/Line.js"
import Point from "../../graphicsLib/Point.js";

export default class SpyrographGraphicsLib{

    drawRobotArm(ctx, startPoint, endPoint, numberOfSegments, width, holeDiameter){
        this.drawConvexHull(ctx, startPoint, endPoint, width);
        this.drawArmHoles(ctx, startPoint, endPoint, numberOfSegments, holeDiameter);
    }

    drawArmHoles(ctx, startPoint, endPoint, numberOfSegments, holeDiameter){
        let armLength = startPoint.getEuclideanDistanceTo(endPoint);
        let distanceBetweenHoles = armLength/numberOfSegments;
        let startEndLine = new Line(startPoint, endPoint);
        let lineSlope = startEndLine.getSlope();
        let angle = Math.atan(lineSlope)
        if (startPoint.getX() > endPoint.getX()){
            angle+=Math.PI;  
        }
        
        let currentPoint = startPoint;
        for (let i = 0 ; i < numberOfSegments ; ++i){
            ctx.beginPath();
            ctx.arc(currentPoint.getX(), currentPoint.getY(), holeDiameter, 0, 360);
            ctx.closePath();
            ctx.stroke();

            let deltaX = distanceBetweenHoles*Math.cos(angle);
            let deltaY = distanceBetweenHoles*Math.sin(angle);
            currentPoint = new Point(currentPoint.getX() + deltaX, currentPoint.getY() + deltaY);
        }
    }

    drawConvexHull(ctx, startPoint, endPoint, width){
        let line  = new Line(startPoint, endPoint);
        let perpPoints1 = line.getPointsPerpendicular(startPoint, width/2);
        let perpPoints2 = line.getPointsPerpendicular(endPoint, width/2);
        let parPoints1 = line.getPointsOnLineAtSetDistanceFromOtherPointOnLine(startPoint, width/2);
        let parPoints2 = line.getPointsOnLineAtSetDistanceFromOtherPointOnLine(endPoint, width/2);

        let points = [];
        
        // Extract all the key points for drawing the path.
        points.push(perpPoints1[0]);
        points.push(perpPoints2[0]);
        let targetPoint = null;
        if (this.checkIfInnerPointOfLineBetweenPoints(startPoint, endPoint, parPoints2[0])){
            targetPoint = parPoints2[1];
        }else{
            targetPoint = parPoints2[0];
        }
        let cornerPoint = new Point(targetPoint.getX() + (perpPoints2[0].getX() - endPoint.getX()), 
                                    targetPoint.getY() + (perpPoints2[0].getY() - endPoint.getY()));
        points.push(cornerPoint);
        points.push(targetPoint);
        cornerPoint = new Point(targetPoint.getX() + (perpPoints2[1].getX() - endPoint.getX()),
                                targetPoint.getY() + (perpPoints2[1].getY() - endPoint.getY()));
        points.push(cornerPoint);
        points.push(perpPoints2[1]);
        points.push(perpPoints1[1]);
        if (this.checkIfInnerPointOfLineBetweenPoints(startPoint, endPoint, parPoints1[0])){
            targetPoint = parPoints1[1];
        }else{
            targetPoint = parPoints1[0];
        }
        cornerPoint = new Point(targetPoint.getX() + (perpPoints1[1].getX() - startPoint.getX()),
                                targetPoint.getY() + (perpPoints1[1].getY() - startPoint.getY()));
        points.push(cornerPoint);
        points.push(targetPoint);
        cornerPoint = new Point(targetPoint.getX() + (perpPoints1[0].getX() - startPoint.getX()),
                                targetPoint.getY() + (perpPoints1[0].getY() - startPoint.getY()));
        points.push(cornerPoint);

        // Draw the path
        ctx.beginPath();
        ctx.moveTo(points[0].getX(), points[0].getY());
        ctx.lineTo(points[1].getX(), points[1].getY());
        ctx.quadraticCurveTo(points[2].getX(), points[2].getY(), points[3].getX(), points[3].getY());
        ctx.quadraticCurveTo(points[4].getX(), points[4].getY(), points[5].getX(), points[5].getY());
        ctx.lineTo(points[6].getX(), points[6].getY());
        ctx.quadraticCurveTo(points[7].getX(), points[7].getY(), points[8].getX(), points[8].getY());
        ctx.quadraticCurveTo(points[9].getX(), points[9].getY(), points[0].getX(), points[0].getY());
        ctx.closePath();
        ctx.stroke();
    }

    drawBasePlate(ctx, startPoint, endPoint){
        this.drawConvexHull(ctx, startPoint, endPoint, 80);
        ctx.fillStyle = "#8bab42";
        ctx.font = "40px Courier New";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("dwengo", startPoint.getX() + (endPoint.getX() - startPoint.getX())/2, startPoint.getY());
    }


    checkIfInnerPointOfLineBetweenPoints(startPoint, endPoint, thirdPoint){
        if (thirdPoint.getEuclideanDistanceTo(startPoint) + 
            thirdPoint.getEuclideanDistanceTo(endPoint) <= 
            startPoint.getEuclideanDistanceTo(endPoint) + 0.1 /*account for rounding errors*/ ){
                return true;
        }else{
            return false;
        }
    }


}