import ButtonMap from "./ButtonMap.js";
import PlotterConstants from "../scenario/plotter/PlotterConstants.js"

/*
 * Contains all the functions that can be executed by the code that was created by the students.
 * Block translations can use these functions. If extra bocks are added, this is the place to add the 
 * code behind those blocks.
*/

export default class SimulationSandbox {
  boardState = null;
  currentScenario = null;
  constructor(boardState) {
    this.boardState = boardState;
  }

  setCurrentScenario(scenario){
    this.currentScenario = scenario;
  }

  /*
  * Clears the lcd display.
  *
  */
  clearLcd() {
    // clear lcd by writing spaces to it
    for (var i = 0; i < 2; i++) {
      this.writeLcd(" ".repeat(16), i, 1);
    }
  }

  /*
  * Writes text to the lcd on the given row starting fro position column
  * @param {string} text: text to write
  * @param {int} row: 0 or 1 addresses the row
  * @param {int} column: 0-15: the start position on the given row
  */
  writeLcd(text, row, column) {
    // Turn on lcd backlight
    this.boardState.setBacklight(1);
    // replace text in current content (if text is hello and then a is written this gives aello)
    text = this.boardState.getLcdContent(row).substr(0, column) +
      text.substring(0, 16 - column) +
      this.boardState.getLcdContent(row).substr(text.length + column, 16);
    this.boardState.setLcdContent(row, text);

  }

  /*
  * Write value 'HIGH' or 'LOW' to a pin, used to turn light on and off
  * @param {int} pinNumber: 13 or 32-39 adresses a light
  * @param {string} state: 'HIGH' to trun light on or 'LOW' to turn light off
  */
  digitalWrite(pinNumber, state) {
    // turns light on or off
    var pin = Number(pinNumber);
    if ((pin >= 32 && pin <= 39) || pin === 13) {
      if (pin >= 32 && pin <= 39) {
        pin -= 32;
      }
      if (state === 'HIGH' || state == 1) {
        pin === 13 ? this.boardState.setLedState(8, 1) : this.boardState.setLedState(pin, 1);
      } else {
        pin === 13 ? this.boardState.setLedState(8, 0) : this.boardState.setLedState(pin, 0);
      }
    } else {
      this.boardState.setIoPinState(pin, state);
    }
  }

  analogWrite(pinName, state) {
    this.boardState.setAnalogIoPinState(pinName, state);
  }


  /*
  * Reads the value of the given pin, used to know the value of a button
  * @param {string} id of the button "SW_N","SW_W,SW_C","SW_E" or "SW_S"
  * @returns {int} 1 if not pressed, 0 if pressed
  */
  digitalRead(pin) {
    // read value from buttons
    if (pin.startsWith("SW_")) {
      let pinIndex = ButtonMap.mapButtonPinNameToIndex(pin);
      return this.boardState.getButtonState(pinIndex);
    }

    // Return the value that is set to the leds
    pin = Number(pin);
    if ((pin >= 32 && pin <= 39) || pin === 13) {
      if (pin >= 32 && pin <= 39) {
        pin -= 32;
      }
      return this.boardState.getButtonState(pin);
    }

    // Otherwise, assume the value of the pin is high can possibly be extended.
    return 1;
  }

  // TODO: implement this when the time is right :p
  analogRead(pinName) {
    return this.boardState.getAnalogIoPinState(pinName);
  }

  /*
  * Changes the state of all eight lights
  * @param {String} bin "0b00000000" to turn all lights off, "0b11111111" to turn all lights on
  */
  setLeds(bin) {
    //Convert number to binary string
    bin = bin.toString(2);

    // Turn all leds off
    for (var i = 0; i < 8; i++) {
      this.digitalWrite(32 + i, 0);
    }
    // Turn on the respective leds
    var diff = 8 - bin.length;
    if (diff < 0) {
      diff = 0
    }
    for (var i = 0; i < Math.min(bin.length, 8); i++) {
      this.digitalWrite(39 - (diff + i), bin[i]);
    }
  }

  /*
  * Turns the buzzer to a given frequancy
  * @param {string} id of the pin "BUZZER"
  * @param {int} frequency of the wanted sound
  */
  tone(pin, frequency) {
    if (pin !== "BUZZER") {
      return;
    }
    this.boardState.setTonePlaying(frequency);
  }

  /*
  * Stops the buzzer
  * @param {string} id of the pin "BUZZER"
  */
  noTone(pin) {
    if (pin === "BUZZER") {
      // stop tone
      this.boardState.setTonePlaying(0);
    }
  }

  /*
  * Sets the servo to a given angle
  * @param {int} channel id of servo 1 or 2
  * @param {int} angle between 0 and 180
  */
  servo(channel, angle) {
    //set angle
    if (angle > 180) {
      angle = 180;
    }
    if (angle < 0) {
      angle = 0;
    }

    let pin = channel + 35;

    if (angle !== this.boardState.getServoAngle(channel)) {
      this.boardState.setServoAngle(channel, angle);
      this.boardState.setIoPinState(pin, angle); // for completion also save the angle on the corresponding pin
    }
  }

  /**
   * Sets the (extra) servo on the given pin to a given angle
   * @param {int} pin 
   * @param {int} angle 
   */
  servoWithPin(pin, angle) {
    if (angle !== this.boardState.getIoPinState(pin)) {
      this.boardState.setIoPinState(pin, angle);
    }
  }


  /*
  * Turn a motor on at given speed
  * @param {int} channel id of motor 1 or 2
  * @param {int} speed between 0 and 255
  */
  startDcMotor(channel, speed) {

    //set angle
    if (speed > 255) {
      speed = 255;
    }
    if (speed < -255) {
      speed = -255;
    }

    // change view of motor
    if (speed === this.boardState.getMotorSpeed(channel)) {
      return;
    }
    this.boardState.setMotorSpeed(channel, speed);

  }


  /*
  * Returns the distance between the sonar and the wall
  * @param {int} trigPin 11
  * @param {int} echoPin 12
  * @returns {int} distance in cm
  */
  sonar(trigPin, echoPin) {
    //return Math.round(this.boardState.getSonarDistance());
    return Math.round(this.boardState.getSonarDistance(trigPin, echoPin));
  }

  /**
   * Returns the state of PIR sensor if it was added to the scenario. Otherwise it returns a low signal by default.
   * Displays the pin number that is used by the PIR sensor as output.
   * 
   * !!!! For now we assume the pir sensor is connected to io pin 0
   * 
   * @param {int} trigPin 
   */
  pir(trigPin) {
    // TODO: figure out hou to access the pir data

    //invert state (low = pressed)
    return this.boardState.getIoPinState(trigPin);
  }

  /**
   * This function is just a stub for the debugging environment 
   * The acutal waiting is done in the step function in DwenguinoSimulation
   * @param {int} time The time that should be waited in miliseconds
   */
  sleep(time) {
    return;
  }


  stepmotorQueue = [];
  servoAngleQueue = [];
  colorQueue = [];
  stepperPins = [33, 34];
  penPositionPins = [36, 37];
  colorPin = 35;

  /**
   * 
   * @param {Number} channel The pin on which the stepper motor is connected.
   * @param {Number} direction The direction of the step positive = right, negative = left.
   */
  stepperMotorStep(channel, direction) {
    let step = (direction > 0) ? 1 : -1;
    this.boardState.setIoPinState(channel, this.boardState.getIoPinState(channel) + step);
  }

  stepMotorSteps(channel, steps) {
    for (let i = 0; i < Math.abs(steps); ++i) {
      this.stepperMotorStep(channel, steps);
    }
  }

  stepMotorsTo(increments) {
    let newPosition  = [0, 0];
    for (let i = 0 ; i < newPosition.length ; ++i){
      newPosition[i] = this.boardState.getIoPinState(this.penPositionPins[i]) + increments[i];
    }
    let steps = this.coordinatesToSteps(newPosition);
    for (let i = 0; i < steps.length; ++i) {
      this.boardState.setIoPinState(
        this.stepperPins[i],
        steps[i]
      );
    }
  }

  coordinatesToSteps(coords){
    let l1 = Math.sqrt(coords[0]**2 + coords[1]**2);
    let l2 = Math.sqrt(coords[1]**2 + (PlotterConstants.motorDistance - coords[0])**2);
    let steplength = 2*Math.PI*PlotterConstants.motorRadius/PlotterConstants.nrOfSteps;
    l1 /= steplength;
    l2 /= steplength;
    
    return [l1, l2]
  }

  stepsToCoordinates(steps){

  }

  drawingrobotStep() {
    // Get the next point and calculate the line lengths for this point
    if (this.stepmotorQueue.length !== 0) {
      var endPoint = this.stepmotorQueue.shift();

      var angle = this.servoAngleQueue.shift();
      this.boardState.setIoPinState(this.stepperPins[0], angle);

      var color = this.colorQueue.shift();
      this.boardState.setIoPinState(this.colorPin, color);

      /*var endLength = DwenguinoSimulation.currentScenario.getLength(endPoint[0],endPoint[1]);

      // Calculate the step difference between the default starting position and the next position
      var stepL = endLength[0] - DwenguinoSimulation.currentScenario.line.lengthBase;
      var stepR = endLength[1] - DwenguinoSimulation.currentScenario.line.lengthBase;*/

      this.boardState.setIoPinState(this.stepperPins[0], endPoint[0]);
      this.boardState.setIoPinState(this.stepperPins[0], endPoint[1]);

    }
  };

 

  drawRobotCurrentPosition() {


    // Get the current moterstep locations
    var stepL = this.boardState.getIoPinState(this.stepperPins[0]);
    var stepR = this.boardState.getIoPinState(this.stepperPins[1]);

    // Calculate the position using the current steps
    var lStartL = dw.line.lengthBase + stepL;
    var lStartR = dw.line.lengthBase + stepR;

    // If the queue isn't empty, there are still other drawings that need to be finished. So the previously calculated positions are wrong
    if (this.stepmotorQueue.length !== 0) {
      var lastPoint = this.stepmotorQueue[this.stepmotorQueue.length - 1];
      var l = dw.getLength(lastPoint[0], lastPoint[1]);
      lStartL = l[0];
      lStartR = l[1];
    }

    return dw.getPosition(lStartL, lStartR);
  };

  drawRobotCheckPosition(position) {
    var sc = DwenguinoSimulation.currentScenario;
    if (position[0] < sc.paper.position.x || position[0] > sc.paper.position.x + sc.paper.width || position[1] < sc.paper.position.y || position[1] > sc.paper.position.y + sc.paper.height) {
      if (!window.stepMotorError) {
        alert(MSG.bounds);
        DwenguinoSimulation.handleSimulationStop();
        window.stepMotorError = true;
      }
    }
  };

  drawRobotMove(direction, amount) {
    var position = DwenguinoSimulation.drawRobotCurrentPosition();
    switch (direction) {
      case 0: //Move up
        DwenguinoSimulation.drawRobotLine(position[0], position[1] - amount, false);
        // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
        break;
      case 1: //Move down
        DwenguinoSimulation.drawRobotLine(position[0], position[1] + amount, false);
        // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
        break;
      case 2: //Move left
        DwenguinoSimulation.drawRobotLine(position[0] - amount, position[1], false);
        // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
        break;
      case 3: //Move right
        DwenguinoSimulation.drawRobotLine(position[0] + amount, position[1], false);
        // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
        break;
      default:
        break;
    }
  };


  drawRobotLine(x, y, screenCoord) {
    if (screenCoord) { //if the coordinates are taken from the screen
      x += 20;
      y += 40;
    }

    // Find the starting position
    let currentPosition  = [0, 0];
    for (let i = 0 ; i < currentPosition.length ; ++i){
      currentPosition[i] = this.boardState.getIoPinState(this.penPositionPins[i]);
    }
    var pStart = currentPosition;

    // Find all the points between start and end
    let angle  = Math.atan((y - pStart[1])/(x - pStart[0]));
    let length = Math.sqrt((pStart[0] - x)**2 + (pStart[1] - y)**2);
    let xIncrement = Math.cos(angle);
    let yIncrement = Math.sin(angle);
    this.update(length, xIncrement, yIncrement);

    
    
    /*var points = this.bresenham(pStart[0], pStart[1], x, y);


    // Check if all the points are inside the allowed area
    for (var i = 0; i < points.length; i++) {
      this.drawRobotCheckPosition(points[i]);
    }

    // Add points to queue
    this.stepmotorQueue = this.stepmotorQueue.concat(points);

    // Add angles/colors to queue
    var angle = this.servoAngleQueue[this.servoAngleQueue.length - 1];
    var color = this.colorQueue[this.colorQueue.length - 1];
    for (var i = 0; i < points.length; i++) {
      this.servoAngleQueue.push(angle);
      this.colorQueue.push(color);
    }*/
  };

  update(stepsLeft, xIncrement, yIncrement){
    if (stepsLeft > 0){
      this.stepMotorsTo([xIncrement, yIncrement]);
      this.currentScenario.updateScenario(this.boardState);
      setTimeout(() => {this.update(stepsLeft-1, xIncrement, yIncrement)}, 30);
    }
  }

  drawRobotCircle(radius) {

    // Get the current position
    var position = DwenguinoSimulation.drawRobotCurrentPosition();
    var xCircle = position[0] - radius;
    var yCircle = position[1];

    // Get the current lengths
    var LR = DwenguinoSimulation.currentScenario.getLength(position[0], position[1]);
    var L = LR[0];
    var R = LR[1];

    //stack for all points in the circles
    var stack = [];
    // var stackL = [];
    // var stackR = [];

    for (var i = 0; i < 360; i += 5) { // Calculate X and Y points in the circle
      var radians = i * (Math.PI / 180);
      pointX = xCircle + radius * Math.cos(radians); // x  =  h + r cosθ
      pointY = yCircle + radius * Math.sin(radians); // y  =  k + r sinθ

      LRNew = DwenguinoSimulation.currentScenario.getLength(pointX, pointY);
      Lnew = LRNew[0];
      Rnew = LRNew[1];

      // stepsL = Math.round(Lnew-L,0);
      // stepsR = Math.round(Rnew-R,0);
      stepsL = Lnew - L;
      stepsR = Rnew - R;

      L = Lnew;
      R = Rnew;

      var nextPosition = DwenguinoSimulation.currentScenario.getPosition(L, R);
      // stackL.push(stepsL);
      // stackR.push(stepsR);
      DwenguinoSimulation.drawRobotCheckPosition(nextPosition);

      stack.push(nextPosition);
    }

    this.stepmotorQueue = this.stepmotorQueue.concat(stack);

    var angle = this.servoAngleQueue[this.servoAngleQueue.length - 1];
    var color = this.colorQueue[this.colorQueue.length - 1];
    for (var i = 0; i < stack.length; i++) {
      this.servoAngleQueue.push(angle);
      this.colorQueue.push(color);
    }


  };

  drawRobotRectangle(width, height) {
    DwenguinoSimulation.drawRobotMove(1, height); //move down
    // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
    DwenguinoSimulation.drawRobotMove(2, width); //move left
    // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
    DwenguinoSimulation.drawRobotMove(0, height); //move up
    // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
    DwenguinoSimulation.drawRobotMove(3, width); //move right
    // DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
  };

  drawRobotLowerStylus() {
    if (this.servoAngleQueue.length === 0) {
      this.servoAngleQueue.push(0);
    } else {
      this.servoAngleQueue[this.servoAngleQueue.length - 1] = 0;
    }

  };

  drawRobotLiftStylus() {
    if (this.servoAngleQueue.length === 0) {
      this.servoAngleQueue.push(90);
    } else {
      this.servoAngleQueue[this.servoAngleQueue.length - 1] = 90;
    }

  };

  changeColor(color) {
    if (this.colorQueue.length === 0) {
      this.colorQueue.push(color);
    } else {
      this.colorQueue[this.colorQueue.length - 1] = color;
    }

  };


  bresenham(x1, y1, x2, y2) {
    // console.log("van (" + x1 + "," + y1 + ") tot (" + x2 + "," + y2 + ")");
    var queue = [];

    var x, y;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dxAbs = Math.abs(dx);
    var dyAbs = Math.abs(dy);
    var err1 = 2 * dyAbs - dxAbs;
    var err2 = 2 * dxAbs - dyAbs;
    var reverse;
    var end;

    var nr = ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) ? 1 : -1; //count up or down

    if (x1 === x2) { // vertical line
      for (var i = 0; i <= dyAbs; i++) {
        // console.log("add (" + x1 + "," + y1+i + ")");
        if (dy > 0) {
          queue.push([x1, y1 + i]);
        } else {
          queue.push([x1, y1 - i]);
        }

      }

      return queue;
    }

    if (dyAbs <= dxAbs) { // X-axis dominant
      if (dx >= 0) {  //left -> right
        reverse = false;
        x = x1;
        y = y1;
        end = x2;
      } else {  //right -> left
        reverse = true;
        x = x2;
        y = y2;
        end = x1;
      }

      queue.push([x, y]);

      for (var i = 0; x < end; i++) {
        x++;
        if (err1 < 0) {
          err1 = err1 + 2 * dyAbs;
        } else {
          y += nr;
          err1 = err1 + 2 * (dyAbs - dxAbs);
        }
        // console.log("add (" + x + "," + y + ")");
        if (reverse) {
          queue.unshift([x, y]);
        } else {
          queue.push([x, y]);
        }
      }

    } else { // Y-axis dominant
      if (dy >= 0) {  //left -> right
        reverse = false;
        x = x1;
        y = y1;
        end = y2;
      } else {  //right -> left
        reverse = true;
        x = x2;
        y = y2;
        end = y1;
      }

      queue.push([x, y]);

      for (var i = 0; y < end; i++) {
        y++;

        if (err2 <= 0) {
          err2 = err2 + 2 * dxAbs;
        } else {
          x += nr;
          err2 = err2 + 2 * (dxAbs - dyAbs);
        }
        // console.log("add (" + x + "," + y + ")");
        if (reverse) {
          queue.unshift([x, y]);
        } else {
          queue.push([x, y]);
        }
      }
    }
    return queue;
  };

}
