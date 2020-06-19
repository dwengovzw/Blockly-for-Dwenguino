import { TypesEnum } from "./RobotComponentsFactory.js"

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
    this.drawSoundSensors(robot);
    this.drawLightSensors(robot);
  }

    /**
     * Draw the lines of text on the lcd screen
     */
    drawLcd(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LCD){
                for(var row = 0; row < 2; ++row){
                    $("#sim_lcd_row" + row).text(robot[i].getState()[row]);
                }
                if(document.getElementById('sim_lcd_row' + row) !== null){
                    document.getElementById('sim_lcd_row' + row).innerHTML =
                    document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
                }
            }
        }   
    }

    /**
     * Initialized the canvas with the given id (string) to the right dimensions and subsequently updates the simulation
     */
    initializeCanvas(robot, component){
        let canvasId = component.getCanvasId();
        let canvas = document.getElementById(canvasId);
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
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LED){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawLed(robot[i], canvas);
            }
        }
    }

    /**
     * Draw an led on the given canvas with the state specified in robot.
     */
    drawLed(led, canvas){
        if(canvas.getContext){
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(canvas.width/2, canvas.height/2, led.getRadius(), 0, 2 * Math.PI);
            if (led.getState() === 1) {
                ctx.fillStyle = led.getOnColor();
            } else {
                ctx.fillStyle = led.getOffColor();
            }
            ctx.fill();
            ctx.fillStyle = led.getBorderColor();
            ctx.stroke();
        } else {
            console.log(canvas, "This canvas has no context");   
        }
    }

    /**
     * Draw all servos on servo canvases with the states and images specified in robot.
     */
    drawServos(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.SERVO){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.clearCanvas(robot[i].getCanvasId());
                this.drawServo(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a servo  on the given canvas with the state and image specified in robot.
     */
    drawServo(servo, canvas){
        if (canvas.getContext) {
            // in case the image isn't loaded yet.
            var self = this;
            servo.getImage(0).onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = servo.getBackgroundColor();
                switch(servo.getCostume()){
                    case 'plain':
                        ctx.fillRect(servo.getX(), servo.getY(), servo.getWidth(), servo.getHeight());
                        self.drawRotatedServohead(ctx, servo);
                        break;
                    case 'eye':
                        self.drawEye(ctx,servo, canvas);
                        break;
                    case 'righthand':
                        ctx.fillRect(servo.getX()+100, servo.getY()+30, servo.getWidth()-100, servo.getHeight()-60);
                        self.drawRightHand(ctx,servo);
                        break;
                    case 'lefthand':
                        ctx.fillRect(servo.getX()+10, servo.getY()+30, servo.getWidth()-28, servo.getHeight()-60);
                        self.drawLeftHand(ctx,servo);
                        break;
                }
            }

            var ctx = canvas.getContext('2d');
            ctx.fillStyle = servo.getBackgroundColor();
            switch(servo.getCostume()){
                case 'plain':
                    ctx.fillRect(servo.getX(), servo.getY(), servo.getWidth(), servo.getHeight());
                    self.drawRotatedServohead(ctx, servo);
                    break;
                case 'eye':
                    self.drawEye(ctx,servo, canvas);
                    break;
                case 'righthand':
                    ctx.fillRect(servo.getX()+100, servo.getY()+30, servo.getWidth()-100, servo.getHeight()-60);
                    self.drawRightHand(ctx,servo);
                    break;
                case 'lefthand':
                    ctx.fillRect(servo.getX()+10, servo.getY()+30, servo.getWidth()-28, servo.getHeight()-60);
                    self.drawLeftHand(ctx,servo);
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
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.PIR){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawPir(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a pir sensor on the given canvas with the image specified in robot.
     */
    drawPir(pir, canvas){
        if (canvas.getContext) {

            // in case the image isn't loaded yet.
            var self = this;
            pir.getImage().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(pir.getImage(),0,0,pir.getWidth(),pir.getHeight()); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(pir.getImage(),0,0,pir.getWidth(),pir.getHeight());
        } else {
            console.log(canvas, "This canvas has no context");
        } 
    }

    /**
     * Draw all sonar sensors on sonar canvases with the image specified in robot.
     */
    drawSonars(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.SONAR){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawSonar(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a sonar sensor on the given canvas with the image specified in robot.
     */
    drawSonar(sonar, canvas){
        if (canvas.getContext) {

            // in case the image isn't loaded yet.
            var self = this;
            sonar.getImage().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(sonar.getImage(),0,0,sonar.getWidth(), sonar.getHeight()); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(sonar.getImage(),0,0,sonar.getWidth(),sonar.getHeight());
        } else {
            console.log(canvas, "This canvas has no context");
        }
    }   

    /**
     * Draws a plain servohead of the given servo at the correct angle on the given context
     */
    drawRotatedServohead(ctx, servo){
        // make the servo rotate stepwise
        var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

        let difference = servo.getAngle()-servo.getPrevAngle();
        if(difference != 0){
            if ((difference > 5) || (difference < -5)) {
                let prevAngle = servo.getPrevAngle() + (5 * direction);
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            } else {
                let prevAngle = servo.getPrevAngle() + (difference);
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(servo.getAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(-servo.getAngle() * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            }
        } else {
            ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
        }
    }

    drawEye(ctx, servo, canvas){
        this.renderEyeBall(ctx, servo, canvas);
        this.renderIris(ctx, servo, canvas);    
    }

    renderEyeBall(ctx, servo,canvas){
        let image = servo.getImage(0);
        ctx.drawImage(image,0,0,100,100);
    }

    renderIris(ctx, servo, canvas){
        let image = servo.getImage(1);
        image.src = './DwenguinoIDE/img/socialrobot/eye1_forground.svg';

        var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

        let difference = servo.getAngle()-servo.getPrevAngle();
        if(difference != 0){
            var horTranslation = (servo.getPrevAngle() / 120 * (canvas.width-60)) + 5;
            if ((difference > 5) || (difference < -5)) {
                let prevAngle = servo.getPrevAngle() + (5 * direction);
                servo.setPrevAngle(prevAngle);
                if((servo.getPrevAngle() >= 0) & (servo.getPrevAngle() <= 120)){
                    ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
                } else if (servo.getPrevAngle() <= 130){
                    horTranslation = (canvas.width-60) + 5;
                    ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
                }
            } else {
                let prevAngle = servo.getPrevAngle() + difference;
                servo.setPrevAngle(prevAngle);
                if((servo.getPrevAngle() >= 0) & (servo.getPrevAngle() <= 120)){
                    ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
                } else if (servo.getPrevAngle() <= 130){
                    horTranslation = (canvas.width-60) + 5;
                    ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
                }
            }
        } else {
            var horTranslation = (servo.getAngle() / 120 * (canvas.width-60)) + 5;
            if((servo.getAngle() >= 0) & (servo.getAngle() <= 120)){
                ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
            } else if (servo.getAngle() <= 130){
                horTranslation = (canvas.width-60) + 5;
                ctx.drawImage(image, horTranslation, canvas.height/2-30, 60, 60);
            }
        }
    }

    // renderEyeBall(ctx, servo,canvas){
    //     ctx.beginPath();
    //     ctx.arc(canvas.width/2, canvas.height/2, servo.getWidth(), 0, 2 * Math.PI);
    //     ctx.fillStyle = 'white';
    //     ctx.fill();
    //     ctx.fillStyle = 'black';
    //     ctx.stroke(); 
    // }

    // renderIris(ctx, servo, canvas){
    //     var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

    //     let difference = servo.getAngle()-servo.getPrevAngle();
    //     if(difference != 0){
    //         var factorBegin = Math.max((servo.getPrevAngle() - 120)/10, 0.2);
    //         var factorEnd = Math.min(2- ((servo.getPrevAngle()-120)/10), 1.8);
    //         var horTranslation = (servo.getPrevAngle() / 120 * (canvas.width-60)) + 30;
    //         if ((difference > 5) || (difference < -5)) {
    //             let prevAngle = servo.getPrevAngle() + (5 * direction);
    //             servo.setPrevAngle(prevAngle);
    //             if((servo.getPrevAngle() >= 0) & (servo.getPrevAngle() <= 120)){
    //                 ctx.beginPath();
    //                 ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
    //                 ctx.fillStyle = 'black';
    //                 ctx.fill();
    //             } else if (servo.getPrevAngle() <= 130){
    //                 ctx.beginPath();
    //                 horTranslation = (canvas.width-60) + 30;
    //                 ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
    //                 ctx.fillStyle = 'black';
    //                 ctx.fill(); 
    //             }
    //         } else {
    //             let prevAngle = servo.getPrevAngle() + difference;
    //             servo.setPrevAngle(prevAngle);
    //             if((servo.getPrevAngle() >= 0) & (servo.getPrevAngle() <= 120)){
    //                 ctx.beginPath();
    //                 ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
    //                 ctx.fillStyle = 'black';
    //                 ctx.fill();
    //             } else if (servo.getPrevAngle() <= 130){
    //                 ctx.beginPath();
    //                 horTranslation = (canvas.width-60) + 30;
    //                 ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
    //                 ctx.fillStyle = 'black';
    //                 ctx.fill(); 
    //             }
    //         }
    //     } else {
    //         var factorBegin = Math.max((servo.getAngle() - 120)/10,0.2);
    //         var factorEnd = Math.min(2- ((servo.getAngle()-120)/10), 1.8);
    //         var horTranslation = (servo.getAngle() / 120 * (canvas.width-60)) + 30;
    //         if((servo.getAngle() >= 0) & (servo.getAngle() <= 120)){
    //             ctx.beginPath();
    //             ctx.arc(horTranslation, canvas.height/2, 10, 0, 2 * Math.PI);
    //             ctx.fillStyle = 'black';
    //             ctx.fill();
    //         } else if (servo.getAngle() <= 130){
    //             ctx.beginPath();
    //             horTranslation = (canvas.width-60) + 30;
    //             ctx.arc(horTranslation, canvas.height/2, 10, factorBegin * Math.PI, factorEnd * Math.PI);
    //             ctx.fillStyle = 'black';
    //             ctx.fill(); 
    //         }
    //     }
    // }

    /**
     * Draws the servohead of the given servo at the correct angle on the given context. 
     * The selected servo skin is a right hand.
     */
    drawRightHand(ctx, servo){
        var diff = servo.getAngle()-servo.getPrevAngle();
        if(diff > 0) {
            this.drawDown(ctx, servo);
        } else if(diff < 0) {
            this.drawUp(ctx, servo);
        } else {
            ctx.translate(servo.getX()+servo.getWidth()/2+50,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2-50, -servo.getY()-servo.getHeight()/2); 
        }
    }

    /**
     * Draw a counterclockwise downward movement of the given servo to the specified angle.
     */
    drawDown(ctx, servo){
        var diff2 = (servo.getAngle()-servo.getPrevAngle());
        if ( diff2 >= 5 ) {
            let prevAngle = servo.getPrevAngle() + 5;
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2+50,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2-50, -servo.getY()-servo.getHeight()/2);
        } else {
            let prevAngle = servo.getPrevAngle() + diff2;
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2+50,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2-50, -servo.getY()-servo.getHeight()/2);       
        }
    }

    /**
     * Draw a clockwase upward movement of the given servo to the specified angle.
     */
    drawUp(ctx, servo){
        var diff3 = servo.getPrevAngle() - servo.getAngle();
        if ( diff3 >= 5)  {
            let prevAngle = servo.getPrevAngle() - 5;
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2+50,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2-50, -servo.getY()-servo.getHeight()/2); 
        } else {
            let prevAngle = servo.getPrevAngle() - diff3;
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2+50,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2-50, -servo.getY()-servo.getHeight()/2); 
        }
    }

    /**
     * Draws the servohead of the given servo at the correct angle on the given context. 
     * The selected servo skin is a left hand.
     */
    drawLeftHand(ctx, servo){
        // make the servo rotate stepwise
        var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

        let difference = servo.getAngle() - servo.getPrevAngle();
        if(difference != 0){
            if ((difference > 5) || (difference < -5)) {
                let prevAngle = servo.getPrevAngle() + (5 * direction);
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            } else {
                let prevAngle = servo.getPrevAngle() + difference;
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(-servo.getAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(servo.getAngle() * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            }
        } else {
            ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
        }
    }

    /**
     * Draw all sound sensors on sound canvases with the image specified in robot.
     */
    drawSoundSensors(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.SOUND){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawSoundSensor(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a pir sensor on the given canvas with the image specified in robot.
     */
    drawSoundSensor(soundSensor, canvas){
        if (canvas.getContext) {

            // in case the image isn't loaded yet.
            var self = this;
            soundSensor.getImage().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(soundSensor.getImage(),0,0,soundSensor.getWidth(),soundSensor.getHeight()); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(soundSensor.getImage(),0,0,soundSensor.getWidth(),soundSensor.getHeight());
        } else {
            console.log(canvas, "This canvas has no context");
        } 
    }

        /**
     * Draw all light sensors on light canvases with the image specified in robot.
     */
    drawLightSensors(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LIGHT){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawLightSensor(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a pir sensor on the given canvas with the image specified in robot.
     */
    drawLightSensor(lightSensor, canvas){
        if (canvas.getContext) {

            // in case the image isn't loaded yet.
            var self = this;
            lightSensor.getImage().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(lightSensor.getImage(),0,0,lightSensor.getWidth(),lightSensor.getHeight()); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(lightSensor.getImage(),0,0,lightSensor.getWidth(),lightSensor.getHeight());
        } else {
            console.log(canvas, "This canvas has no context");
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