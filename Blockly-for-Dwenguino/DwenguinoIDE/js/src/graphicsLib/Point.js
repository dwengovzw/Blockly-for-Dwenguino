export default class Point{
    x = 0;
    y = 0;

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    getEuclideanDistanceTo(point){
        return Math.sqrt((this.x - point.x)**2 + (this.y - point.y)**2);
    }
    /**
     * @brief draws the point using a specific context
     * @param {*} ctx 2D canvas drawing context
     * @param {*} diameter diameter of the point to draw
     */
    draw(ctx, diameter=5){
        ctx.beginPath();
        ctx.arc(this.x, this.y, diameter, 0, 360);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    getX(){
        return this.x;
    }

    setX(x){
        this.x = x;
    }

    getY(){
        return this.y;
    }

    setY(y){
        this.y = y;
    }


}
