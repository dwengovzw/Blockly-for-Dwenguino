import csvtojson from "csvtojson";
import { SocialRobotLedMatrix } from "./components/ledmatrix.js";
import { TypesEnum } from "./robot_components_factory.js"

/**
 * This renderer renders the robot component canvases in the simulation
 * container. 
 */
class SimulationCanvasRenderer {
    constructor(){
        
    }

  /**
   * This function draws the current robot components in the simulation container
   *
   * @param {RobotComponent[]} robot 
   */
  render(robot) {
    this.clearCanvases();
    this.drawLcd(robot);
    this.drawLeds(robot);
    this.drawRgbLeds(robot);
    this.drawLedmatrices(robot);
    this.drawLedmatricesSegments(robot);
    this.drawServos(robot);
    this.drawTouchSensors(robot);
    this.drawPirs(robot);
    this.drawSonars(robot);
    this.drawSoundSensors(robot);
    this.drawLightSensors(robot);
  }

    /**
     * Draw the lines of text on the lcd screen 
     * @param {RobotComponent[]} robot 
     */
    drawLcd(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LCD){
                for (var row = 0 ; row < 2 ; ++row){
                    $("#sim_lcd_row" + row).text(robot[i].getState()[row]);
                    if(document.getElementById('sim_lcd_row' + row) !== null){
                        document.getElementById('sim_lcd_row' + row).innerHTML =
                        document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
                    }
                }
                // repaint
                var element = document.getElementById("sim_lcds");
                if(element !== null){
                    element.style.display = 'none';
                    element.offsetHeight;
                    element.style.display = 'block';
                }
            }
        }   
    }

    /**
     * Initialized the canvas with the given id (string) to the right dimensions and 
     * subsequently updates the simulation.
     * @param {RobotComponent[]} robot 
     * @param {RobotComponent} component 
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

    /**
     * 
     * @param {string} canvasId 
     */
    clearCanvas(canvasId){
        var canvas = document.getElementById(canvasId);
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    /***
     * Draw all leds on led canvases with the states specified in robot.
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotLed} led 
     * @param {HTMLCanvasElement} canvas 
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

    /***
     * Draw all rgb leds on rgb led canvases with the states specified in robot.
     * @param {RobotComponent[]} robot 
     */
    drawRgbLeds(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.RGBLED){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawRgbLed(robot[i], canvas);
            }
        }
    }

    /**
     * Draw an RGB LED on the given canvas with the state specified in robot.
     * @param {SocialRobotRgbLed} rgbLed 
     * @param {HTMLCanvasElement} canvas 
     */
    drawRgbLed(rgbLed, canvas){

        if(canvas.getContext){
            var self = this;
            rgbLed.getLedBackground().onload = function() {
                var ctx = canvas.getContext('2d');
                let background = rgbLed.getLedBackground();
                ctx.drawImage(background,0, 0, 40, 30);

                ctx.beginPath();
                ctx.arc(25, 15, rgbLed.getRadius(), 0, 2 * Math.PI);
                let rgbColor = rgbLed.getState();
                if(rgbColor[0] == 0 && rgbColor[1] == 0 && rgbColor[2] == 0){
                    ctx.fillStyle = "#CCCCCC";
                } else {
                    let hex = self.rgbToHex(rgbColor);
                    ctx.fillStyle = hex;
                }
                ctx.fill();

                ctx.translate(16,6);
                let image = rgbLed.getLedSvg();
                ctx.drawImage(image,0,0,18,18);
                ctx.translate(-16, -6);   
            }
            var ctx = canvas.getContext('2d');

            // RGB Led background
            let background = rgbLed.getLedBackground();
            ctx.drawImage(background,0, 0, 40, 30);

            // RGB Led color layer
            ctx.beginPath();
            ctx.arc(25, 15, rgbLed.getRadius(), 0, 2 * Math.PI);
            let rgbColor = rgbLed.getState();
            if(rgbColor[0] == 0 && rgbColor[1] == 0 && rgbColor[2] == 0){
                ctx.fillStyle = "#CCCCCC";
            } else {
                let hex = self.rgbToHex(rgbColor);
                ctx.fillStyle = hex;
            }
            ctx.fill();

            // RGB Led top layer
            ctx.translate(16,6);
            let image = rgbLed.getLedSvg();
            ctx.drawImage(image,0,0,18,18);
            ctx.translate(-16, -6); 
        } else {
            console.log(canvas, "This canvas has no context");   
        }
    }

    rgbToHex(rgbColor) {
        return "#" + this.componentToHex(rgbColor[0]) + this.componentToHex(rgbColor[1]) + this.componentToHex(rgbColor[2]);
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    /***
     * Draw all led matrices on led matrix canvases with the states specified in robot.
     * @param {RobotComponent[]} robot 
     */
    drawLedmatrices(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LEDMATRIX){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawLedmatrix(robot[i], canvas);
            }
        }
    }

    /**
     * Draw an RGB LED on the given canvas with the state specified in robot.
     * @param {SocialRobotLedMatrix} ledmatrix 
     * @param {HTMLCanvasElement} canvas 
     */
    drawLedmatrix(ledmatrix, canvas){

        if(canvas.getContext){
            var self = this;
            ledmatrix.getLedmatrixBackground().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(ledmatrix.getLedmatrixBackground(),0, 0, 296, 70);
            }

            ledmatrix.getLedSvg().onload = function() {
                var ctx = canvas.getContext('2d');
                let ledOffsets = ledmatrix.getLedOffsets();
                let state = ledmatrix.getState();

                for(var currentSegment = 0; currentSegment < 4; currentSegment++) {
                    for(var row = 0; row < 8; row++){
                        for(var column = 0; column < 8; column++){
                            if(Array.isArray(state) && state[currentSegment][column][row] == 1){
                                let x = ledOffsets['left'] + ledOffsets['led_x'] + (column * ledOffsets['led_between_x']) + (currentSegment * ledOffsets['matrix_segment_between_x']);
                                let y = ledOffsets['led_y'] + (row * ledOffsets['led_between_y']);
                                let width = ledOffsets['led_radius'];
                                let height = ledOffsets['led_radius'];
                                ctx.drawImage(ledmatrix.getLedSvg(),x,y,width,height);
                            }
                        }
                    }
                }
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(ledmatrix.getLedmatrixBackground(),0, 0, 296, 70);

            let ledOffsets = ledmatrix.getLedOffsets();
            let state = ledmatrix.getState();

            for(var currentSegment = 0; currentSegment < 4; currentSegment++) {
                for(var row = 0; row < 8; row++){
                    for(var column = 0; column < 8; column++){
                        if(Array.isArray(state)){
                            if(state[currentSegment][column][row] == 1){
                                let x = ledOffsets['left'] + ledOffsets['led_x'] + (column * ledOffsets['led_between_x']) + (currentSegment * ledOffsets['matrix_segment_between_x']);
                                let y = ledOffsets['led_y'] + (row * ledOffsets['led_between_y']);
                                let width = ledOffsets['led_radius'];
                                let height = ledOffsets['led_radius'];
                                ctx.drawImage(ledmatrix.getLedSvg(),x,y,width,height);
                            }
                        }
                    }
                }
            }
        } else {
            console.log(canvas, "This canvas has no context");   
        }
    }

    /***
     * Draw all led matrices on led matrix segment canvases with the states specified in robot.
     * @param {RobotComponent[]} robot 
     */
    drawLedmatricesSegments(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.LEDMATRIXSEGMENT){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawLedmatrixSegment(robot[i], canvas);
            }
        }
    }

        /**
     * Draw an RGB LED on the given canvas with the state specified in robot.
     * @param {SocialRobotLedMatrix} ledmatrix 
     * @param {HTMLCanvasElement} canvas 
     */
    drawLedmatrixSegment(ledmatrix, canvas){

        if(canvas.getContext){
            var self = this;
            ledmatrix.getLedmatrixBackground().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(ledmatrix.getLedmatrixBackground(),0, 0, 84, 70);
            }

            ledmatrix.getLedSvg().onload = function() {
                var ctx = canvas.getContext('2d');
                let ledOffsets = ledmatrix.getLedOffsets();
                let state = ledmatrix.getState();

                let currentSegment = ledmatrix.getId() - 1;
                for(var row = 0; row < 8; row++){
                    for(var column = 0; column < 8; column++){
                        if(Array.isArray(state) && state[currentSegment][column][row] == 1){
                            let x = ledOffsets['left'] + ledOffsets['led_x'] + (column * ledOffsets['led_between_x']);
                            let y = ledOffsets['led_y'] + (row * ledOffsets['led_between_y']);
                            let width = ledOffsets['led_radius'];
                            let height = ledOffsets['led_radius'];
                            ctx.drawImage(ledmatrix.getLedSvg(),x,y,width,height);
                        }
                    }
                }

            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(ledmatrix.getLedmatrixBackground(),0, 0, 84, 70);

            let ledOffsets = ledmatrix.getLedOffsets();
            let state = ledmatrix.getState();

            let currentSegment = ledmatrix.getId() - 1;
            for(var row = 0; row < 8; row++){
                for(var column = 0; column < 8; column++){
                    if(Array.isArray(state) && state[currentSegment][column][row] == 1){
                        let x = ledOffsets['left'] + ledOffsets['led_x'] + (column * ledOffsets['led_between_x']);
                        let y = ledOffsets['led_y'] + (row * ledOffsets['led_between_y']);
                        let width = ledOffsets['led_radius'];
                        let height = ledOffsets['led_radius'];
                        ctx.drawImage(ledmatrix.getLedSvg(),x,y,width,height);
                    }
                }
            }
        } else {
            console.log(canvas, "This canvas has no context");   
        }
    }

    /**
     * Draw all servos on servo canvases with the states and images specified in robot.
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotServo} servo 
     * @param {HTMLCanvasElement} canvas 
     */
    drawServo(servo, canvas){
        if (canvas.getContext) {
            // in case the image isn't loaded yet.
            var self = this;
            servo.getServoBackground().onload = function() {
                var ctx = canvas.getContext('2d');
                switch(servo.getCostume()){
                    case 'plain':
                        self.drawServoBackground(ctx, servo);
                        break;
                    case 'plainrotate90':
                        self.drawServoBackground(ctx, servo, 90);
                        break;
                    case 'eye':
                        break;
                    case 'righthand':
                        break;
                    case 'lefthand':
                        break;
                }
            }

            servo.getImage(0).onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.fillStyle = servo.getBackgroundColor();
                switch(servo.getCostume()){
                    case 'plain':
                        self.drawRotatedServohead(ctx, servo);
                        break;
                    case 'plainrotate90':
                        self.drawRotatedServoheadRotated(ctx, servo, 90);
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
                    self.drawServoBackground(ctx, servo);
                    self.drawRotatedServohead(ctx, servo);
                    break;
                case 'plainrotate90':
                    self.drawServoBackground(ctx, servo, 90);
                    self.drawRotatedServoheadRotated(ctx, servo, 90);
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
     *
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotPir} pir 
     * @param {HTMLCanvasElement} canvas 
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
     * Draw all touch sensors on canvases with the image specified in robot.
     *
     * @param {RobotComponent[]} robot 
     */
    drawTouchSensors(robot){
        for(var i = 0; i < robot.length; i++){
            if(robot[i].getType() == TypesEnum.TOUCH){
                let canvas = document.getElementById(robot[i].getCanvasId());
                this.drawTouchSensor(robot[i], canvas);
            }
        }
    }

    /**
     * Draw a touch sensor on the given canvas with the image specified in robot.
     * @param {SocialRobotTouchSensor} touchSensor 
     * @param {HTMLCanvasElement} canvas 
     */
    drawTouchSensor(touchSensor, canvas){
        if (canvas.getContext) {

            // in case the image isn't loaded yet.
            var self = this;
            touchSensor.getImage().onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(touchSensor.getImage(),0,0,touchSensor.getWidth(),touchSensor.getHeight()); 
            }

            var ctx = canvas.getContext('2d');
            ctx.drawImage(touchSensor.getImage(),0,0,touchSensor.getWidth(),touchSensor.getHeight());
        } else {
            console.log(canvas, "This canvas has no context");
        } 
    }

    /**
     * Draw all sonar sensors on sonar canvases with the image specified in robot.
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotSonar} sonar 
     * @param {HTMLCanvasElement} canvas 
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
     * 
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     * @param {int} angle
     */
    drawServoBackground(ctx, servo, angle=0){
        let background = servo.getServoBackground();
        if(angle != 0){
            background = servo.getServoBackgroundRotated();
        }
        ctx.translate(servo.getX(),servo.getY());
        ctx.drawImage(background,0,0,servo.getWidth(),servo.getHeight());
        ctx.translate(-servo.getX(), -servo.getY()); 
    }

    /**
     * Draws a plain servohead of the given servo at the correct angle on the given context
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     * @param {int} degrees
     */
    drawRotatedServohead(ctx, servo, degrees=0){
        // make the servo rotate stepwise
        var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

        let difference = servo.getAngle()-servo.getPrevAngle();
        if(difference != 0){
            if ((difference > 5) || (difference < -5)) {
                let prevAngle = servo.getPrevAngle() + (5 * direction);
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(degrees * Math.PI / 180);
                ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
                ctx.rotate(-degrees * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            } else {
                let prevAngle = servo.getPrevAngle() + (difference);
                servo.setPrevAngle(prevAngle);
                ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
                ctx.rotate(degrees * Math.PI / 180);
                ctx.rotate(servo.getAngle() * Math.PI / 180);
                ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
                ctx.rotate(-servo.getAngle() * Math.PI / 180);
                ctx.rotate(-degrees * Math.PI / 180);
                ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
            }
        } else {
            ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
            ctx.rotate(degrees * Math.PI / 180);
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getWidth()/2,-servo.getHeight()/2,servo.getWidth(),servo.getHeight());
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.rotate(-degrees * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
        }
    }

    /**
     * Draws a plain servohead of the given servo at the correct angle on the given context
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     */
    drawRotatedServoheadRotated(ctx, servo, degrees){
    // make the servo rotate stepwise
    var direction = this.getDirection(servo.getPrevAngle(), servo.getAngle());

    let difference = servo.getAngle()-servo.getPrevAngle();
    if(difference != 0){
        if ((difference > 5) || (difference < -5)) {
            let prevAngle = servo.getPrevAngle() + (5 * direction);
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
            ctx.rotate(degrees * Math.PI / 180);
            ctx.rotate(servo.getPrevAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getHeight()/2,-servo.getWidth()/2,servo.getHeight(),servo.getWidth());
            ctx.rotate(-servo.getPrevAngle() * Math.PI / 180);
            ctx.rotate(-degrees * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
        } else {
            let prevAngle = servo.getPrevAngle() + (difference);
            servo.setPrevAngle(prevAngle);
            ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
            ctx.rotate(degrees * Math.PI / 180);
            ctx.rotate(servo.getAngle() * Math.PI / 180);
            ctx.drawImage(servo.getImage(0),-servo.getHeight()/2,-servo.getWidth()/2,servo.getHeight(),servo.getWidth());
            ctx.rotate(-servo.getAngle() * Math.PI / 180);
            ctx.rotate(-degrees * Math.PI / 180);
            ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
        }
    } else {
        ctx.translate(servo.getX()+servo.getWidth()/2,servo.getY()+servo.getHeight()/2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.rotate(servo.getAngle() * Math.PI / 180);
        ctx.drawImage(servo.getImage(0),-servo.getHeight()/2,-servo.getWidth()/2,servo.getHeight(),servo.getWidth());
        ctx.rotate(-servo.getAngle() * Math.PI / 180);
        ctx.rotate(-degrees * Math.PI / 180);
        ctx.translate(-servo.getX()-servo.getWidth()/2, -servo.getY()-servo.getHeight()/2); 
    }
}

    /**
     * 
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     * @param {HTMLCanvasElement} canvas 
     */
    drawEye(ctx, servo, canvas){
        this.renderEyeBall(ctx, servo, canvas);
        this.renderIris(ctx, servo, canvas);    
    }

    /**
     * 
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     * @param {HTMLCanvasElement} canvas 
     */
    renderEyeBall(ctx, servo,canvas){
        let image = servo.getImage(0);
        ctx.drawImage(image,0,0,100,100);
    }

    /**
     * 
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
     * @param {HTMLCanvasElement} canvas 
     */
    renderIris(ctx, servo, canvas){
        let image = servo.getImage(1);
        image.src = `${settings.basepath}DwenguinoIDE/img/socialrobot/eye1_forground.svg`;

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

    /**
     * Draws the servohead of the given servo at the correct angle on the given context. 
     * The selected servo skin is a right hand.
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
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
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
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
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
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
     * @param {RenderingContext} ctx 
     * @param {SocialRobotServo} servo 
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
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotSoundSensor} soundSensor 
     * @param {HTMLCanvasElement} canvas 
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
     * @param {RobotComponent[]} robot 
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
     * @param {SocialRobotLightSensor} lightSensor 
     * @param {HTMLCanvasElement} canvas 
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
     * @param {HTMLCanvasElement} canvas 
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

    /**
     * 
     * @param {int} previousAngle 
     * @param {int} angle 
     */
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

export default SimulationCanvasRenderer;