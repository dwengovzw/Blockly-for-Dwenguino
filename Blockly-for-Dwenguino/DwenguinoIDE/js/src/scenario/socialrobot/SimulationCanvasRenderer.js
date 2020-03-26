/**
 * This renderer renders the robot component canvases in the simulation
 * container. 
 */
export default class SimulationCanvasRenderer {
    constructor(){
        
    }

  /**
   * This function draws the current robot components in the simulation container
   */
  render(robot) {
    this.clearCanvases();
    this.drawLcd(robot);
    this.drawLeds(robot);
    this.drawServos(robot);
    this.drawPirs(robot);
    this.drawSonars(robot);
  }

    /**
     * Draw the lines of text on the lcd screen
     */
    drawLcd(robot){
        // Set the board text on the screen
        for (var row = 0 ; row < 2 ; ++row){
            // write new text to lcd screen and replace spaces with &nbsp;
            $("#sim_lcd_row" + row).text(robot.lcdstate[row]);
            if(document.getElementById('sim_lcd_row' + row) !== null){
                document.getElementById('sim_lcd_row' + row).innerHTML =
                document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
            }
        }
    }

    /**
     * Initialized the canvas with the given id (string) to the right dimensions and subsequently updates the simulation
     */
    initializeCanvas(canvasId, robot){
        var canvas = document.getElementById(canvasId);
        if(canvas !== null){
        this.configureCanvasDimensions(canvas);
        this.render(robot);
        }
    }

    /**
     * Clear all canvases in the simulator that are part
     * of the "sim_canvas" class.
     */
    clearCanvases(){
        // Clear canvases
        var canvases = document.getElementsByClassName("sim_canvas");
        for(var i = 0; i < canvases.length; i++)
        {
            if (canvases.item(i).getContext) {
                var ctx = canvases.item(i).getContext('2d');
                ctx.clearRect(0, 0, canvases.item(i).width, canvases.item(i).height);
            }
        }
    }

    clearCanvas(canvasId){
        var canvas = document.getElementById(canvasId);
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /***
     * Draw all leds on led canvases with the states specified in robot.
     */
    drawLeds(robot){
        var canvases = document.getElementsByClassName('sim_canvas led_canvas');
        for(var i = 0; i < canvases.length; i++)
        {
            this.drawLed(robot,canvases.item(i));
        }
    }

    /**
     * Draw an led on the given canvas with the state specified in robot.
     */
    drawLed(robot, canvas){
        if (canvas.getContext) {
            var id = canvas.id;
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, robot[id].radius, 0, 2 * Math.PI);
            if (robot[id].state === 1) {
                ctx.fillStyle = robot[id].onColor;
            } else {
                ctx.fillStyle = robot[id].offColor;
            }
            ctx.fill();
            ctx.fillStyle = robot[id].borderColor;
            ctx.stroke();
        } else {
            console.log(canvas, "This canvas has no context");
        }    
    }

    /**
     * Draw all servos on servo canvases with the states and images specified in robot.
     */
    drawServos(robot){
        var canvases = document.getElementsByClassName('sim_canvas servo_canvas');
        for(var i = 0; i < canvases.length; i++)
        {
            this.drawServo(robot,canvases.item(i));   
        }
    }

    /**
     * Draw a servo  on the given canvas with the state and image specified in robot.
     */
    drawServo(robot, canvas){
        if (canvas.getContext) {
            var id = canvas.id;
            // in case the image isn't loaded yet.
            var self = this;
            robot[id].image.onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = robot[id].backgroundColor;
                switch(robot[id].state){
                    case 'plain':
                        ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
                        self.drawRotatedServohead(ctx, robot[id]);
                        break;
                    case 'eye':
                    // ctx.fillRect(robot[id].x+2, robot[id].y-15, robot[id].width, robot[id].height-20);
                        self.drawEye(ctx,robot[id], canvas);
                        break;
                    case 'righthand':
                        ctx.fillRect(robot[id].x+100, robot[id].y+30, robot[id].width-100, robot[id].height-60);
                        self.drawRightHand(ctx,robot[id]);
                        break;
                    case 'lefthand':
                        ctx.fillRect(robot[id].x+10, robot[id].y+30, robot[id].width-28, robot[id].height-60);
                        self.drawLeftHand(ctx,robot[id]);
                        break;
                }
            }

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = robot[id].backgroundColor;
            switch(robot[id].state){
                case 'plain':
                    ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
                    self.drawRotatedServohead(ctx, robot[id]);
                    break;
                case 'eye':
                    //ctx.fillRect(robot[id].x+2, robot[id].y-15, robot[id].width, robot[id].height-20);
                    self.drawEye(ctx,robot[id], canvas);
                    break;
                case 'righthand':
                    ctx.fillRect(robot[id].x+100, robot[id].y+30, robot[id].width-100, robot[id].height-60);
                    self.drawRightHand(ctx,robot[id]);
                    break;
                case 'lefthand':
                    ctx.fillRect(robot[id].x+10, robot[id].y+30, robot[id].width-28, robot[id].height-60);
                    self.drawLeftHand(ctx,robot[id]);
                    break;
            }
        } else {
            console.log(canvas, "This canvas has no context");
        }    
    }

    /**
     * Draw all pir sensors on pir canvases with the image specified in robot.
     */
    drawPirs(robot){
        var canvases = document.getElementsByClassName('sim_canvas pir_canvas');
        for(var i = 0; i < canvases.length; i++)
        {
            this.drawPir(robot,canvases.item(i));
        }
    }

    /**
     * Draw a pir sensor on the given canvas with the image specified in robot.
     */
    drawPir(robot, canvas){
        if (canvas.getContext) {
            var id = canvas.id;

            // in case the image isn't loaded yet.
            var self = this;
            robot[id].image.onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height);
        } else {
            console.log(canvas, "This canvas has no context");
        }       
    }

    /**
     * Draw all sonar sensors on sonar canvases with the image specified in robot.
     */
    drawSonars(robot){
        var canvases = document.getElementsByClassName('sim_canvas sonar_canvas');
        for(var i = 0; i < canvases.length; i++)
        {
            this.drawSonar(robot,canvases.item(i));
        }
    }

    /**
     * Draw a sonar sensor on the given canvas with the image specified in robot.
     */
    drawSonar(robot, canvas){
        if (canvas.getContext) {
            var id = canvas.id;

            // in case the image isn't loaded yet.
            var self = this;
            robot[id].image.onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(robot[id].image,0,0,robot[id].width,robot[id].height);
        } else {
            console.log(canvas, "This canvas has no context");
        }       
    }

    /**
     * Draws a plain servohead of the given servo at the correct angle on the given context
     */
    drawRotatedServohead(ctx, servo){
        // make the servo rotate stepwise
        var direction = this.getDirection(servo.prevAngle, servo.angle);

        if((servo.angle-servo.prevAngle) != 0){
            if (((servo.angle-servo.prevAngle) > 5) || ((servo.angle-servo.prevAngle) < -5)) {
                servo.prevAngle = servo.prevAngle + (5 * direction);
                ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
                ctx.rotate(servo.prevAngle * Math.PI / 180);
                ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
                ctx.rotate(-servo.prevAngle * Math.PI / 180);
                ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
            } else {
                servo.prevAngle = servo.prevAngle + (servo.angle-servo.prevAngle);
                ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
                ctx.rotate(servo.angle * Math.PI / 180);
                ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
                ctx.rotate(-servo.angle * Math.PI / 180);
                ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
            }
        } else {
            ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
        }
    }

    drawEye(ctx, servo, canvas){
        this.renderEyeBall(ctx, servo, canvas);
        this.renderIris(ctx, servo, canvas);    
    }

    renderEyeBall(ctx, servo,canvas){
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, servo.width, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke(); 
    }

    renderIris(ctx, servo, canvas){
        var direction = this.getDirection(servo.prevAngle, servo.angle);

        if((servo.angle-servo.prevAngle) != 0){
            var factorBegin = Math.max((servo.prevAngle - 120)/10, 0.2);
            var factorEnd = Math.min(2- ((servo.prevAngle-120)/10), 1.8);
            var horTranslation = (servo.prevAngle / 120 * (canvas.width-60)) + 30;
            if (((servo.angle-servo.prevAngle) > 5) || ((servo.angle-servo.prevAngle) < -5)) {
                servo.prevAngle = servo.prevAngle + (5 * direction);
                if((servo.prevAngle >= 0) & (servo.prevAngle <= 120)){
                    ctx.beginPath();
                    ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = 'black';
                    ctx.fill();
                } else if (servo.prevAngle <= 130){
                    ctx.beginPath();
                    horTranslation = (canvas.width-60) + 30;
                    ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
                    ctx.fillStyle = 'black';
                    ctx.fill(); 
                }
            } else {
                servo.prevAngle = servo.prevAngle + (servo.angle-servo.prevAngle);
                if((servo.prevAngle >= 0) & (servo.prevAngle <= 120)){
                    ctx.beginPath();
                    ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = 'black';
                    ctx.fill();
                } else if (servo.prevAngle <= 130){
                    ctx.beginPath();
                    horTranslation = (canvas.width-60) + 30;
                    ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
                    ctx.fillStyle = 'black';
                    ctx.fill(); 
                }
            }
        } else {
            var factorBegin = Math.max((servo.angle - 120)/10,0.2);
            var factorEnd = Math.min(2- ((servo.angle-120)/10), 1.8);
            var horTranslation = (servo.angle / 120 * (canvas.width-60)) + 30;
            if((servo.angle >= 0) & (servo.angle <= 120)){
                ctx.beginPath();
                ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill();
            } else if (servo.angle <= 130){
                ctx.beginPath();
                horTranslation = (canvas.width-60) + 30;
                ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
                ctx.fillStyle = 'black';
                ctx.fill(); 
            }
        }
    }

    /**
     * Draws the servohead of the given servo at the correct angle on the given context. 
     * The selected servo skin is a right hand.
     */
    drawRightHand(ctx, servo){
        var diff = servo.angle-servo.prevAngle;
        if(diff > 0) {
            this.drawDown(ctx, servo);
        } else if(diff < 0) {
            this.drawUp(ctx, servo);
        } else {
            ctx.translate(servo.x+servo.width/2+50,servo.y+servo.height/2);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2-50, -servo.y-servo.height/2); 
        }
    }

    /**
     * Draw a counterclockwise downward movement of the given servo to the specified angle.
     */
    drawDown(ctx, servo){
        var diff2 = (servo.angle-servo.prevAngle);
        if ( diff2 >= 5 ) {
            servo.prevAngle = servo.prevAngle + 5;
            ctx.translate(servo.x+servo.width/2+50,servo.y+servo.height/2);
            ctx.rotate(-servo.prevAngle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.prevAngle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2-50, -servo.y-servo.height/2);
        } else {
            servo.prevAngle = servo.prevAngle + diff2;
            ctx.translate(servo.x+servo.width/2+50,servo.y+servo.height/2);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2-50, -servo.y-servo.height/2);       
        }
    }

    /**
     * Draw a clockwase upward movement of the given servo to the specified angle.
     */
    drawUp(ctx, servo){
        var diff3 = servo.prevAngle - servo.angle;
        if ( diff3 >= 5)  {
            servo.prevAngle = servo.prevAngle - 5;
            ctx.translate(servo.x+servo.width/2+50,servo.y+servo.height/2);
            ctx.rotate(-servo.prevAngle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.prevAngle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2-50, -servo.y-servo.height/2); 
        } else {
            servo.prevAngle = servo.prevAngle - diff3;
            ctx.translate(servo.x+servo.width/2+50,servo.y+servo.height/2);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2-50, -servo.y-servo.height/2); 
        }
    }

    /**
     * Draws the servohead of the given servo at the correct angle on the given context. 
     * The selected servo skin is a left hand.
     */
    drawLeftHand(ctx, servo){
        // make the servo rotate stepwise
        var direction = this.getDirection(servo.prevAngle, servo.angle);

        if((servo.angle-servo.prevAngle) != 0){
            if (((servo.angle-servo.prevAngle) > 5) || ((servo.angle-servo.prevAngle) < -5)) {
                servo.prevAngle = servo.prevAngle + (5 * direction);
                ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
                ctx.rotate(-servo.prevAngle * Math.PI / 180);
                ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
                ctx.rotate(servo.prevAngle * Math.PI / 180);
                ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
            } else {
                servo.prevAngle = servo.prevAngle + (servo.angle-servo.prevAngle);
                ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
                ctx.rotate(-servo.angle * Math.PI / 180);
                ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
                ctx.rotate(servo.angle * Math.PI / 180);
                ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
            }
        } else {
            ctx.translate(servo.x+servo.width/2,servo.y+servo.height/2);
            ctx.rotate(-servo.angle * Math.PI / 180);
            ctx.drawImage(servo.image,-servo.width/2,-servo.height/2,servo.width,servo.height);
            ctx.rotate(servo.angle * Math.PI / 180);
            ctx.translate(-servo.x-servo.width/2, -servo.y-servo.height/2); 
        }
    }

    /**
     * Correctly onfigure the canvas dimensions based on the device pixel ratio 
     * to avoid blurry drawings.
     */
    configureCanvasDimensions(canvas){

        var dpr = window.devicePixelRatio || 1;
        // Get the size of the canvas in CSS pixels.
        var rect = canvas.getBoundingClientRect();
        
        // Give the canvas pixel dimensions of their CSS
        // size * the device pixel ratio.
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        if(canvas.getContext){
        var ctx = canvas.getContext('2d');
        // Scale all drawing operations by the dpr, so you
        // don't have to worry about the difference.
        ctx.scale(dpr, dpr);
        }
    };

    getDirection(previousAngle, angle){
        var direction = 0;
        if((angle-previousAngle) > 0) {
            direction = 1;
        } else {
            direction = -1
        }
        return direction;
    }
}