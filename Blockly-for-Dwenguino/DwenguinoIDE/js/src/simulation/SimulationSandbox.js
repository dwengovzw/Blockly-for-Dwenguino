import ButtonMap from "./ButtonMap.js";

/*
 * Contains all the functions that can be executed by the code that was created by the students.
 * Block translations can use these functions. If extra bocks are added, this is the place to add the 
 * code behind those blocks.
*/

export default class SimulationSandbox{
    boardState = null;
    constructor(boardState){
        this.boardState = boardState;
    }

  /*
  * Clears the lcd display.
  *
  */
  clearLcd(){
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
    this.boardState.backlight = true;
    // replace text in current content (if text is hello and then a is written this gives aello)
    text = this.boardState.lcdContent[row].substr(0, column) +
    text.substring(0, 16 - column) +
    this.boardState.lcdContent[row].substr(text.length + column, 16);
    this.boardState.lcdContent[row] = text;
 
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
        pin=== 13 ? this.boardState.leds[8] = 1 : this.boardState.leds[pin] = 1;
      } else {
        pin === 13 ? this.boardState.leds[8] = 0 : this.boardState.leds[pin] = 0;
      }
    }
  }

  analogWrite(pinNumber, state) {

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
        return this.boardState.buttons[pinIndex];
    }

    // Return the value that is set to the leds
    pin = Number(pin);
    if ((pin >= 32 && pin <= 39) || pin === 13) {
      if (pin >= 32 && pin <= 39) {
        pin -= 32;
      }
      return this.boardState.leds[pin];
    }

    // Otherwise, assume the value of the pin is high can possibly be extended.
    return 1;
  }

  // TODO: implement this when the time is right :p
  analogRead(pin) {
    return 0;
  }

  /*
  * Changes the state of all eight lights
  * @param {String} bin "0b00000000" to turn all lights off, "0b11111111" to turn all lights on
  */
  setLeds(bin) {
    //Convert number to binary string
    bin = bin.toString(2);

    // Turn all leds off
    for (var i = 0 ; i < 8 ; i++){
        this.digitalWrite(32+i, 0);
    }
    // Turn on the respective leds
    var diff = 8 - bin.length;
    if (diff < 0){
      diff = 0
    }
    for (var i = 0 ; i < Math.min(bin.length, 8) ; i++){
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
    this.boardState.buzzer.tonePlaying = frequency;
  }

  /*
  * Stops the buzzer
  * @param {string} id of the pin "BUZZER"
  */
  noTone(pin) {
    if (pin === "BUZZER") {
      // stop tone
      this.boardState.buzzer.tonePlaying = 0;
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

    if (angle !== this.boardState.servoAngles[channel - 1]) {
        this.boardState.servoAngles[channel - 1] = angle;
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
    if (speed === this.boardState.motorSpeeds[channel - 1]) {
      return;
    }
    this.boardState.motorSpeeds[channel - 1] = speed;

  }


  /*
  * Returns the distance between the sonar and the wall
  * @param {int} trigPin 11
  * @param {int} echoPin 12
  * @returns {int} distance in cm
  */
  sonar(trigPin, echoPin) {
    return Math.round(this.boardState.sonarDistance);
  }

  /**
   * Returns the state of PIR sensor if it was added to the scenario. Otherwise it returns a low signal by default.
   * Displays the pin number that is used by the PIR sensor as output.
   * @param {int} trigPin 
   */
  pir(trigPin) {
      // TODO: figure out hou to access the pir data
    return 0;
  }
}
