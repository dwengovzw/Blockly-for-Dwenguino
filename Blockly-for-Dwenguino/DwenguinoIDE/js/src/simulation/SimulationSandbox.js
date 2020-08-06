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
  stylusPosPin =38;
  drawingActive = false;

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
    this.drawingActive = true;

  };

  update(stepsLeft, xIncrement, yIncrement){
    if (stepsLeft > 0){
      this.stepMotorsTo([xIncrement, yIncrement]);
      this.currentScenario.updateScenario(this.boardState);
      setTimeout(() => {this.update(stepsLeft-1, xIncrement, yIncrement)}, 30);
    }else{
      this.drawingActive = false;
    }
  }



  drawRobotLowerStylus() {
    this.boardState.setIoPinState(this.stylusPosPin, 0);

  };

  drawRobotLiftStylus() {
    this.boardState.setIoPinState(this.stylusPosPin, 90);

  };

  changeColor(color) {
    this.boardState.setIoPinState(this.colorPin, color);

  };

}
