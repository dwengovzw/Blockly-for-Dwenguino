function DwenguinoDrawSimulationCanvas(){
}

/**
 * Clear all canvases in the simulator that are part
 * of the "sim_canvas" class.
 */
DwenguinoDrawSimulationCanvas.prototype.clearCanvases = function(){
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

DwenguinoDrawSimulationCanvas.prototype.clearCanvas = function(canvasId){
    var canvas = document.getElementById(canvasId);
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/***
 * Draw all leds on led canvases with the states specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawLeds = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas led_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawLed(robot,canvases.item(i));
    }
}

/**
 * Draw an led on the given canvas with the state specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawLed = function(robot, canvas){
    console.log('draw Led');
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
DwenguinoDrawSimulationCanvas.prototype.drawServos = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas servo_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawServo(robot,canvases.item(i));   
    }
}

/**
 * Draw a servo  on the given canvas with the state and image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawServo = function(robot, canvas){
    if (canvas.getContext) {
        var id = canvas.id;
        // in case the image isn't loaded yet.
        var self = this;
        robot[id].image.onload = function() {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = robot[id].backgroundColor;
            console.log(robot[id].state);
            switch(robot[id].state){
                case 'plain':
                    console.log(robot[id],'plain');
                    ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
                    self.drawRotatedServohead(ctx, robot[id]);
                    break;
                case 'eye':
                    console.log(robot[id],'eye');
                    ctx.fillRect(robot[id].x+2, robot[id].y-15, robot[id].width, robot[id].height-20);
                    self.drawEye(ctx,robot[id]);
                    break;
                case 'righthand':
                    console.log('draw right hand');
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
        console.log(robot[id].state)
        switch(robot[id].state){
            case 'plain':
                console.log(robot[id],'plain');
                ctx.fillRect(robot[id].x, robot[id].y, robot[id].width, robot[id].height);
                self.drawRotatedServohead(ctx, robot[id]);
                break;
            case 'eye':
                ctx.fillRect(robot[id].x+2, robot[id].y-15, robot[id].width, robot[id].height-20);
                self.drawEye(ctx,robot[id]);
                break;
            case 'righthand':
                    console.log('draw right hand');
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
DwenguinoDrawSimulationCanvas.prototype.drawPirs = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas pir_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawPir(robot,canvases.item(i));
    }
}

/**
 * Draw a pir sensor on the given canvas with the image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawPir = function(robot, canvas){
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
DwenguinoDrawSimulationCanvas.prototype.drawSonars = function(robot){
    var canvases = document.getElementsByClassName('sim_canvas sonar_canvas');
    for(var i = 0; i < canvases.length; i++)
    {
        this.drawSonar(robot,canvases.item(i));
    }
}

/**
 * Draw a sonar sensor on the given canvas with the image specified in robot.
 */
DwenguinoDrawSimulationCanvas.prototype.drawSonar = function(robot, canvas){
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
 * Draws the servohead of the given servo at the correct angle on the given context
 */
DwenguinoDrawSimulationCanvas.prototype.drawRotatedServohead = function(ctx, servo){
    // make the servo rotate stepwise
    var direction = 0;
    if((servo.angle-servo.prevAngle) > 0) {
        direction = 1;
    } else {
        direction = -1
    }

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

DwenguinoDrawSimulationCanvas.prototype.drawEye = function(ctx, servo){
    // TODO
    // make the servo rotate stepwise
    var angle = 0;
    if((servo.angle-servo.prevAngle) != 0){
        if ((servo.angle-servo.prevAngle) > 5) {
            servo.prevAngle = servo.prevAngle + 5;
        } else {
            servo.prevAngle = servo.prevAngle + (servo.angle-servo.prevAngle);
        }
        angle = servo.prevAngle;
    } else {
        angle = servo.angle
    }

    console.log('angle', angle);
    var verScale = 0;
    var minWidth = 0.1*servo.width;
    console.log('minWidth', minWidth);
    
    var maxWidth = servo.width;
    console.log('maxWidth', maxWidth);

    var horTranslation = 0;
    if(angle <= 90){
        verScale = (0.01*angle)+0.1;
        //horTranslation = (servo.width/4)/90*angle;
        horTranslation = ( ( ( ((servo.width/2) - (maxWidth/2)) - (minWidth/2) ) / (90) ) * angle ) + (minWidth/2)
    } else {
        verScale = (((1-0.1)/(91-180))*(angle-180))+0.1;
        //horTranslation = (((servo.width/2) - (servo.width))/(91-180) * angle) + (((servo.width/2) - (servo.width))/(91-180) *(-180)) + (servo.width);
        horTranslation = ( ( ( ((servo.width/2) - (maxWidth/2)) - (servo.width - (minWidth/2)) / (91 - 180) ) * (angle - 180) ) ) + (servo.width - (minWidth/2));
    }
    
    console.log('verScale', verScale);
    console.log('horTranslation', horTranslation);
    ctx.transform(verScale, 0, 0, 1, horTranslation, 0);
    ctx.drawImage(servo.image,0,0,servo.width,servo.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Draws the servohead of the given servo at the correct angle on the given context
 */
DwenguinoDrawSimulationCanvas.prototype.drawRightHand = function(ctx, servo){
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

DwenguinoDrawSimulationCanvas.prototype.drawDown = function(ctx, servo){
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

DwenguinoDrawSimulationCanvas.prototype.drawUp = function(ctx, servo){
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
 * Draws the servohead of the given servo at the correct angle on the given context
 */
DwenguinoDrawSimulationCanvas.prototype.drawLeftHand = function(ctx, servo){
    // make the servo rotate stepwise
    console.log('drawHand');
    var direction = 0;
    if((servo.angle-servo.prevAngle) > 0) {
        direction = 1;
    } else {
        direction = -1
    }

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
 * Configure the canvas pixel dimensions to avoid blurry drawings.
 */
DwenguinoDrawSimulationCanvas.prototype.configureCanvasDimensions = function(canvas){

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