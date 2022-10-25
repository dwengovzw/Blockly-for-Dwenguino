import SimulationCanvasRenderer from "./simulation_canvas_renderer.js"
import { EVENT_NAMES } from "../../logging/event_names.js"

import { CostumesEnum } from "./components/base_servo.js"
import { SocialRobotServo } from "./components/servo.js"
import { SocialRobotContinuousServo } from "./components/continuous_servo.js"
import { SocialRobotLed } from "./components/led.js"
import { SocialRobotLcd } from "./components/lcd.js"
import { SocialRobotSonar } from "./components/sonar.js"
import { SocialRobotPir } from "./components/pir.js"
import { SocialRobotSoundSensor } from "./components/sound_sensor.js"
import { SocialRobotLightSensor } from "./components/light_sensor.js"
import { SocialRobotRgbLed } from "./components/rgbled.js"
import { SocialRobotTouchSensor } from "./components/touch_sensor.js"
import { SocialRobotButton } from "./components/button.js"
import { SocialRobotLedMatrix } from "./components/ledmatrix.js"
import { SocialRobotLedMatrixSegment } from "./components/ledmatrix_segment.js"
import { SocialRobotBuzzer } from "./components/buzzer.js"

export { TypesEnum as TypesEnum, RobotComponentsFactory }

/**
 * The supported robot component types
 * @readonly
 * @enum {string}
 */
const TypesEnum = {
  SERVO: 'servo',
  CONTINUOUSSERVO: 'continuousservo',
  LED: 'led',
  RGBLED: 'rgbled',
  LEDMATRIX: 'ledmatrix',
  LEDMATRIXSEGMENT: 'ledmatrixsegment',
  TOUCH: 'touch',
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  SOUND: 'sound',
  LIGHT: 'light',
  BUTTON: 'button',
  BUZZER: 'buzzer',
};
Object.freeze(TypesEnum);

/**
 * This factory produces robot components of certain types.
 * @param {SocialRobot} robot 
 */
class RobotComponentsFactory {
  logger = null;
 
  /**
   * 
   * @constructs
   * @param {DwenguinoScenarioUtils} scenarioUtils 
   * @param {DwenguinoEventLogger} logger 
   * @param {EventBus} eventBus 
   */
  constructor(scenarioUtils, logger, eventBus) {
    this.logger = logger;
    this._eventBus = eventBus;
    this._robot = [];
    this._numberOfComponentsOfType = {};
    this.scenarioUtils = scenarioUtils;
    this.renderer = new SimulationCanvasRenderer();

    for (const [type, t] of Object.entries(TypesEnum)) {
      this._numberOfComponentsOfType[t] = 0;
    }
  }
/**
 * Sets the state of the simulation
 * @param {*} isSimulationRunning true or false depending on if simulation is running or not.
 */
  setIsSimulationRunning(isSimulationRunning){
    for(var i = 0; i < this._robot.length; i++){
      this._robot[i].setIsSimulationRunning(isSimulationRunning);
    }
  }

  /**
   * 
   * @returns {RobotComponent[]} The array of RobotComponent objects in social robot scenario
   */
  getRobot(){
    return this._robot;
  }

  /**
   * Resets all social robot components to their initial state.
   */
  resetSocialRobot(){
    for(var i = 0; i < this._robot.length; i++){
      this._robot[i].reset();
    }
  }

  /**
   * Remove all social robot components from the scenario.
   */
  removeAllSocialRobotComponents(){
    for(var i = 0; i < this._robot.length; i++){
      this.removeRobotComponentWithTypeAndId(this._robot[i].getType(), this._robot[i].getId());
    }
  }

  /**
   * Update the state and other properties of the robot components when an update of
   * the Dwenguino Boardstate is received.
   * @param {BoardState} dwenguinoState 
   */
  updateScenarioState(dwenguinoState){
    for(var i = 0; i < this._robot.length; i++){
      let type = this._robot[i].getType();
      let pin = 0;
      let state = 0;
      switch (type) {
        case TypesEnum.SERVO:
          pin = this._robot[i].getPin();
          if(this._robot[i].getAngle() != dwenguinoState.getIoPinState(pin)){
            this._robot[i].setPrevAngle(this._robot[i].getAngle());
            this._robot[i].setAngle(dwenguinoState.getIoPinState(pin));
          }
          break;
        case TypesEnum.CONTINUOUSSERVO:
          pin = this._robot[i].getPin();
          if(this._robot[i].getSpeed() != dwenguinoState.getIoPinState(pin)){
            this._robot[i].setPrevSpeed(this._robot[i].getSpeed());
            this._robot[i].setSpeed(dwenguinoState.getIoPinState(pin));
          }
          this._robot[i].startInnerLoop();
          break;
        case TypesEnum.LED:
          pin = this._robot[i].getPin();
          this._robot[i].setState(dwenguinoState.getIoPinState(pin));  
          break;
        case TypesEnum.RGBLED:
          let redPin = this._robot[i].getPin(SocialRobotRgbLed.pinNames.redPin);
          let greenPin = this._robot[i].getPin(SocialRobotRgbLed.pinNames.greenPin); 
          let bluePin = this._robot[i].getPin(SocialRobotRgbLed.pinNames.bluePin);
          state = [dwenguinoState.getIoPinState(redPin), dwenguinoState.getIoPinState(greenPin), dwenguinoState.getIoPinState(bluePin)];
          this._robot[i].setState(state);
          break;
        case TypesEnum.LEDMATRIX:
          let dataPin = this._robot[i].getDataPin();
          state = dwenguinoState.getIoPinState(dataPin);
          this._robot[i].setState(state);
          break;
        case TypesEnum.LEDMATRIXSEGMENT:
          let segmentDataPin = this._robot[i].getDataPin();
          state = dwenguinoState.getIoPinState(segmentDataPin);
          this._robot[i].setState(state);
          break;
        case TypesEnum.TOUCH:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.BUTTON:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.PIR:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.SONAR:
          let echoPin = this._robot[i].getPin(SocialRobotSonar.pinNames.echoPin);
          let triggerPin = this._robot[i].getPin(SocialRobotSonar.pinNames.triggerPin);
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(echoPin, this._robot[i].getState());
            dwenguinoState.setIoPinState(triggerPin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.LCD:
          this._robot[i].setState(dwenguinoState.getLcdContent(0), dwenguinoState.getLcdContent(1));
          break;
        case TypesEnum.SOUND:
          pin = this._robot[i].getPin(SocialRobotSoundSensor.pinNames.digitalPIn);
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.LIGHT:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.BUZZER:
           this._robot[i].setTone(dwenguinoState.getTonePlaying());

      }
    }
  }


  /**
   * Get the robot component in the simulation with a given type and id.
   * @param {TypesEnum} type 
   * @param {string} id 
   */
  getRobotComponentWithTypeAndId(type, id){
    for(let i = 0; i < this._robot.length; i++){
      if(this._robot[i].getType() == type && this._robot[i].getId() == id){
        return this._robot[i];
      }
    }
  }

  /**
   * Remove the robot component from the simulation with a given type and id.
   * @param {TypesEnum} type 
   * @param {string} id 
   */
  removeRobotComponentWithTypeAndId(type, id){
    let component = this.getRobotComponentWithTypeAndId(type, id);
    //component.reset();
    component.removeHtml();

    for(let i = 0; i < this._robot.length; i++){
      if(this._robot[i].getType() == type && this._robot[i].getId() == id){
        this._robot.splice(i, 1);
        this.decrementNumberOf(type);
      }
    }

  }
  
  /**
   * Add a new robot component with a certain type and a unique id to the social robot simulation. 
   * The robot component is instanciated with the default properties.
   * @param {TypesEnum} type 
   */
  addRobotComponent(type) {
    switch (type) {
      case TypesEnum.SERVO:
        this.addServo();
        break;
      case TypesEnum.CONTINUOUSSERVO:
        this.addContinuousServo();
        break;
      case TypesEnum.LED:
        this.addLed();
        break;
      case TypesEnum.RGBLED:
        this.addRgbLed();
        break;
      case TypesEnum.LEDMATRIX:
        this.addLedmatrix();
        break;
      case TypesEnum.LEDMATRIXSEGMENT:
        this.addLedmatrixSegment();
        break;  
      case TypesEnum.TOUCH:
        this.addTouchSensor();
        break;
      case TypesEnum.BUTTON:
        this.addButton();
        break;
      case TypesEnum.PIR:;
        this.addPir();
        break;
      case TypesEnum.SONAR:
        this.addSonar();
        break;
      case TypesEnum.LCD:
        this.addLcd();
        break;
      case TypesEnum.SOUND:
        this.addSoundSensor();
        break;
      case TypesEnum.LIGHT:
        this.addLightSensor();
        break;
      case TypesEnum.BUZZER:
        this.addBuzzer();
        break;
    }
  }

  /**
   * Remove the most recently created robot component of the specified type from the simulation.
   * @param {TypesEnum} type 
   */
  removeRobotComponent(type) {
    switch (type) {
      case TypesEnum.SERVO:
        this.removeServo();
        break;
      case TypesEnum.CONTINUOUSSERVO:
        this.removeContinuousServo();
        break;
      case TypesEnum.LED:
        this.removeLed();
        break;
      case TypesEnum.RGBLED:
        this.removeRgbLed();
        break;
      case TypesEnum.LEDMATRIX:
        this.removeLedmatrix();
        break;
      case TypesEnum.LEDMATRIXSEGMENT:
        this.removeLedmatrixSegment();
        break;
      case TypesEnum.TOUCH:
        this.removeTouchSensor();
        break;
      case TypesEnum.BUTTON:
        this.removeButton();
        break;
      case TypesEnum.PIR:
        this.removePir();
        break;
      case TypesEnum.SONAR:
        this.removeSonar();
        break;
      case TypesEnum.LCD:
        this.removeLcd();
        break;
      case TypesEnum.SOUND:
        this.removeSoundSensor();
        break;
      case TypesEnum.LIGHT:
        this.removeLightSensor();
        break;
      case TypesEnum.BUZZER:
        this.removeBuzzer();
        break;
    }
  }

  /**
   * Add a robot component to the simulation scenario from a data object containing one robot component
   * in XML format.
   * @param {Object} data - Data object containing one robot component in XML format.
   */
  addRobotComponentFromXml(data){
    let type = data.getAttribute('Type');
    switch (type) {
      case TypesEnum.SERVO:
        this.addServoFromXml(data);
        break;
      case TypesEnum.CONTINUOUSSERVO:
        this.addContinuousServoFromXml(data);
        break;
      case TypesEnum.LED:
        this.addLedFromXml(data);
        break;
      case TypesEnum.RGBLED:
        this.addRgbLedFromXml(data);
        break;
      case TypesEnum.LEDMATRIX:
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var dataPin = data.getAttribute('DataPin');
        var csPin = data.getAttribute('csPin');
        var clkPin = data.getAttribute('clkPin');
        var htmlClasses = data.getAttribute('Classes');
        this.addLedmatrix(dataPin, csPin, clkPin, true, 0, 0, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.LEDMATRIXSEGMENT:
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var dataPin = data.getAttribute('DataPin');
        var csPin = data.getAttribute('csPin');
        var clkPin = data.getAttribute('clkPin');
        var htmlClasses = data.getAttribute('Classes');
        this.addLedmatrixSegment(dataPin, csPin, clkPin, true, 0, 0, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.TOUCH:
        this.addTouchSensorFromXml(data);
        break;
      case TypesEnum.BUTTON:
        this.addButtonFromXml(data);
        break;
      case TypesEnum.PIR:
        this.addPirFromXml(data);
        break;
      case TypesEnum.SONAR:
        this.addSonarFromXml(data);
        break;
      case TypesEnum.LCD:
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var htmlClasses = data.getAttribute('Classes');
        this.addLcd(true, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.SOUND:
        this.addSoundSensorFromXml(data);
        break;
      case TypesEnum.LIGHT:
        this.addLightSensorFromXml(data);
        break;
      case TypesEnum.BUZZER:
        this.addBuzzerFromXml(data);
    }
  }

  /**
    * Add a new servo to the simulation container using default or custom values for the properties.
    * @param {int} pin 
    * @param {CostumesEnum} costume 
    * @param {int} angle 
    * @param {boolean} visible 
    * @param {int} x 
    * @param {int} y 
    * @param {int} width 
    * @param {int} height 
    * @param {int} offsetLeft 
    * @param {int} offsetTop 
    * @param {string} htmlClasses 
    */
  addServo(pin=0, costume=CostumesEnum.PLAIN, angle=0, visible=true, width=100, height=100, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas servo_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SERVO));
    this.incrementNumberOf(TypesEnum.SERVO);
    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];

    let pins = {}
    if (id <= 4){
      pins[SocialRobotServo.pinNames.digitalPin] = 'SERVO_' + (id + 2); // The servo's in the simulator are on pins 3 to 6 by default
    }else{
      pins[SocialRobotServo.pinNames.digitalPin] = 20 - id;
    }
    
    let servo = new SocialRobotServo();
    servo.initComponent(this._eventBus, id, pins, costume, angle, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(servo);

    this.renderer.initializeCanvas(this._robot, servo); 
  }

  addServoFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SERVO));
    this.incrementNumberOf(TypesEnum.SERVO);
    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];

    let servo = new SocialRobotServo();
    servo.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(servo);

    this.renderer.initializeCanvas(this._robot, servo);
  }

  /**
   * Remove the most recently created servo from the simulation container.
   */
  removeServo(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SERVO));

    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SERVO, id);
  }


    /**
    * Add a new servo to the simulation container using default or custom values for the properties.
    * @param {int} pin 
    * @param {CostumesEnum} costume 
    * @param {int} angle 
    * @param {boolean} visible 
    * @param {int} x 
    * @param {int} y 
    * @param {int} width 
    * @param {int} height 
    * @param {int} offsetLeft 
    * @param {int} offsetTop 
    * @param {string} htmlClasses 
    */
     addContinuousServo(pin=0, costume=CostumesEnum.PLAIN, speed=0, visible=true, width=100, height=100, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas continuous_servo_canvas'){

      this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.CONTINUOUSSERVO));
      this.incrementNumberOf(TypesEnum.CONTINUOUSSERVO);
      let id = this._numberOfComponentsOfType[TypesEnum.CONTINUOUSSERVO];
  
      let pins = {}
      if (id <= 4){
        pins[SocialRobotContinuousServo.pinNames.digitalPin] = 'SERVO_' + (id + 2); // The servo's in the simulator are on pins 3 to 6 by default
      }else{
        pins[SocialRobotContinuousServo.pinNames.digitalPin] = 20 - id;
      }
  
      let servo = new SocialRobotContinuousServo();
      servo.initComponent(this._eventBus, id, pins, costume, speed, visible, width, height, offsetLeft, offsetTop, htmlClasses);
      this._robot.push(servo);
  
      this.renderer.initializeCanvas(this._robot, servo); 
    }
  
    addContinuousServoFromXml(xml){
      this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.CONTINUOUSSERVO));
      this.incrementNumberOf(TypesEnum.CONTINUOUSSERVO);
      let id = this._numberOfComponentsOfType[TypesEnum.CONTINUOUSSERVO];
  
      let servo = new SocialRobotContinuousServo();
      servo.initComponentFromXml(this._eventBus, id, xml);
      this._robot.push(servo);
  
      this.renderer.initializeCanvas(this._robot, servo);
    }
  
    /**
     * Remove the most recently created servo from the simulation container.
     */
    removeContinuousServo(){
      this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.CONTINUOUSSERVO));
  
      let id = this._numberOfComponentsOfType[TypesEnum.CONTINUOUSSERVO];
      this.removeRobotComponentWithTypeAndId(TypesEnum.CONTINUOUSSERVO, id);
    }


  /**
   * 
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} radius 
   * @param {int} x 
   * @param {int} y 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} onColor 
   * @param {string} offColor 
   * @param {string} borderColor 
   * @param {string} htmlClasses 
   */
  addLed(pin=0, state=0, visible=true, radius=10, x=0, y=0, offsetLeft=5, offsetTop=5, onColor='yellow', offColor='gray', borderColor='black', htmlClasses='sim_canvas led_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LED));
    this.incrementNumberOf(TypesEnum.LED);
    let id = this._numberOfComponentsOfType[TypesEnum.LED];

    let pins = {};
    pins[SocialRobotLed.pinNames.digitalPin] = `LED${id-1}`

    let led = new SocialRobotLed();
    led.initComponent(onColor, offColor, this._eventBus, id, pins, state, visible, radius, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
  }

  addLedFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LED));
    this.incrementNumberOf(TypesEnum.LED);
    let id = this._numberOfComponentsOfType[TypesEnum.LED];

    let led = new SocialRobotLed();
    led.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
  }

  /**
   * Remove the most recently created LED from the simulation container.
   */
  removeLed(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LED));

    let id = this._numberOfComponentsOfType[TypesEnum.LED];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LED, id);
  }

  /**
   * 
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} radius 
   * @param {int} x 
   * @param {int} y 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} offColor 
   * @param {string} borderColor 
   * @param {string} htmlClasses 
   */
  addRgbLed(redPin='11', greenPin='14', bluePin='15', state=[0,0,0], visible=true, radius=10, x=0, y=0, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas rgbled_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.RGBLED));
    this.incrementNumberOf(TypesEnum.RGBLED);
    let id = this._numberOfComponentsOfType[TypesEnum.RGBLED];

    let pins = {};
    pins[SocialRobotRgbLed.pinNames.redPin] = redPin;
    pins[SocialRobotRgbLed.pinNames.greenPin] = greenPin;
    pins[SocialRobotRgbLed.pinNames.bluePin] = bluePin;

    let rgbled = new SocialRobotRgbLed();
    rgbled.initComponent(this._eventBus, id, pins, state, visible, radius, offsetLeft, offsetTop, htmlClasses);
    
    this._robot.push(rgbled);

    this.renderer.initializeCanvas(this._robot, rgbled); 
  }

  addRgbLedFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.RGBLED));
    this.incrementNumberOf(TypesEnum.RGBLED);
    let id = this._numberOfComponentsOfType[TypesEnum.RGBLED];

    let led = new SocialRobotRgbLed();
    led.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
  }

  /**
   * Remove the most recently created LED from the simulation container.
   */
  removeRgbLed(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.RGBLED));

    let id = this._numberOfComponentsOfType[TypesEnum.RGBLED];
    this.removeRobotComponentWithTypeAndId(TypesEnum.RGBLED, id);
  }

  addLedmatrix(dataPin='2', csPin='10', clkPin='13', visible=true, x=0, y=0, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas ledmatrix_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LEDMATRIX));
    this.incrementNumberOf(TypesEnum.LEDMATRIX);
    let id = this._numberOfComponentsOfType[TypesEnum.LEDMATRIX];

    let ledmatrix = new SocialRobotLedMatrix(this._eventBus, id, dataPin, csPin, clkPin, visible, x, y, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(ledmatrix);

    this.renderer.initializeCanvas(this._robot, ledmatrix);
  }

  removeLedmatrix(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LEDMATRIX));
  
    let id = this._numberOfComponentsOfType[TypesEnum.LEDMATRIX];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LEDMATRIX, id);
  }

  addLedmatrixSegment(dataPin='2', csPin='10', clkPin='13', visible=true, x=0, y=0, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas ledmatrixsegment_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LEDMATRIXSEGMENT));
    this.incrementNumberOf(TypesEnum.LEDMATRIXSEGMENT);
    let id = this._numberOfComponentsOfType[TypesEnum.LEDMATRIXSEGMENT];

    let ledmatrix = new SocialRobotLedMatrixSegment(this._eventBus, id, dataPin, csPin, clkPin, visible, x, y, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(ledmatrix);

    this.renderer.initializeCanvas(this._robot, ledmatrix);
  }

  removeLedmatrixSegment(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LEDMATRIXSEGMENT));
  
    let id = this._numberOfComponentsOfType[TypesEnum.LEDMATRIXSEGMENT];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LEDMATRIXSEGMENT, id);
  }

  /**
   * Add a new touch sensor to the simulation container.
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} width 
   * @param {int} height 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addTouchSensor(pin=12, state=0, visible=true, width=60, height=60, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas touch_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.TOUCH));
    this.incrementNumberOf(TypesEnum.TOUCH);
    let id = this._numberOfComponentsOfType[TypesEnum.TOUCH];

    let pins = {};
    pins[SocialRobotTouchSensor.pinNames.digitalPin] = pin + id - 1;

    let touchSensor = new SocialRobotTouchSensor();
    touchSensor.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(touchSensor);

    this.renderer.initializeCanvas(this._robot, touchSensor); 
  }

  addTouchSensorFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.TOUCH));
    this.incrementNumberOf(TypesEnum.TOUCH);
    let id = this._numberOfComponentsOfType[TypesEnum.TOUCH];

    let touchSensor = new SocialRobotTouchSensor();
    touchSensor.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(touchSensor);

    this.renderer.initializeCanvas(this._robot, touchSensor); 
  }

  /**
   * Remove the most recently created PIR sensor from the simulation container.
   */
  removeTouchSensor(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.TOUCH));

    let id = this._numberOfComponentsOfType[TypesEnum.TOUCH];
    this.removeRobotComponentWithTypeAndId(TypesEnum.TOUCH, id);
  }

    /**
   * Add a new button to the simulation container.
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} width 
   * @param {int} height 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addButton(pin=12, visible=true, width=50, height=50, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas button_canvas', state=0){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.BUTTON));
    this.incrementNumberOf(TypesEnum.BUTTON);
    let id = this._numberOfComponentsOfType[TypesEnum.BUTTON];

    let pins = {};
    pins[SocialRobotButton.pinNames.digitalPin] = pin + id - 1;

    let button = new SocialRobotButton();
    button.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(button);

    this.renderer.initializeCanvas(this._robot, button); 
  }

  addButtonFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.BUTTON));
    this.incrementNumberOf(TypesEnum.BUTTON);
    let id = this._numberOfComponentsOfType[TypesEnum.BUTTON];

    let button = new SocialRobotButton();
    button.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(button);

    this.renderer.initializeCanvas(this._robot, button);
  }

  /**
   * Remove the most recently created button from the simulation container.
   */
  removeButton(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.BUTTON));

    let id = this._numberOfComponentsOfType[TypesEnum.BUTTON];
    this.removeRobotComponentWithTypeAndId(TypesEnum.BUTTON, id);
  }

  /**
   * Add a new PIR sensor to the simulation container.
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} width 
   * @param {int} height 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addPir(pin=12, state=0, visible=true, width=75, height=75, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas pir_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pins = {};
    pins[SocialRobotPir.pinNames.digitalPin] = pin + id - 1;

    let pir = new SocialRobotPir();
    pir.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(pir);

    this.renderer.initializeCanvas(this._robot, pir); 
  }

  addPirFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pir = new SocialRobotPir();
    pir.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(pir);

    this.renderer.initializeCanvas(this._robot, pir);
  }

  /**
   * Remove the most recently created PIR sensor from the simulation container.
   */
  removePir(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.PIR));

    let id = this._numberOfComponentsOfType[TypesEnum.PIR];
    this.removeRobotComponentWithTypeAndId(TypesEnum.PIR, id);
  }

  /**
   * Add a new SONAR sensor to the simulation container.
   * 
   * @param {int} echoPin 
   * @param {int} triggerPin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} width 
   * @param {int} height 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addSonar(echoPin=12, triggerPin=1, state=0, visible=true, width=100, height=58, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sonar_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let pins = {};
    if(id == 1){
      pins[SocialRobotSonar.pinNames.triggerPin] = "A1";
      pins[SocialRobotSonar.pinNames.echoPin] = "A0";
    } else if (id == 2){
      pins[SocialRobotSonar.pinNames.triggerPin] = "A3";
      pins[SocialRobotSonar.pinNames.echoPin] = "A2";
    }

    let sonar = new SocialRobotSonar();
    sonar.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar);
  }

  addSonarFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let sonar = new SocialRobotSonar();
    sonar.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar);
  }
  
  /**
   * Remove the most recently created SONAR sensor from the simulation container.
   */
  removeSonar(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SONAR));

    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SONAR, id);
  }

  /**
   * Add a new decoration component to the simulation container.
   * @param {boolean} visible 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addLcd(visible=true, offsetLeft=5, offsetTop=5, htmlClasses=''){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LCD));
    this.incrementNumberOf(TypesEnum.LCD);
    let id = this._numberOfComponentsOfType[TypesEnum.LCD];

    let lcd = new SocialRobotLcd(this._eventBus, id, visible, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(lcd);
  }
  

  /**
  * Remove the most recently created decoration element from the simulation container.
  */
  removeLcd(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.Lcd));
    
    let id = this._numberOfComponentsOfType[TypesEnum.LCD];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LCD, id);
  }


  /**
   * Add a new Sound sensor to the simulation container.
    * @param {int} pin 
    * @param {int} state 
    * @param {boolean} visible 
    * @param {int} width 
    * @param {int} height 
    * @param {int} offsetLeft 
    * @param {int} offsetTop 
    * @param {string} htmlClasses 
    */
  addSoundSensor(digitalPin=15, state=0, visible=true, width=100, height=42, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sound_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SOUND));
    this.incrementNumberOf(TypesEnum.SOUND);
    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];
    let pins = {};
    if(id == 1){
      pins[SocialRobotSoundSensor.pinNames.digitalPin] = "SOUND_1";
    }else{
      pins[SocialRobotSoundSensor.pinNames.digitalPin] = id;
    }
    let soundSensor = new SocialRobotSoundSensor();
    soundSensor.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(soundSensor);

    this.renderer.initializeCanvas(this._robot, soundSensor); 
  }

  addSoundSensorFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SOUND));
    this.incrementNumberOf(TypesEnum.SOUND);
    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];
    
    let soundSensor = new SocialRobotSoundSensor();
    soundSensor.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(soundSensor);

    this.renderer.initializeCanvas(this._robot, soundSensor); 
  }

  /**
   * Remove the most recently created Sound sensor from the simulation container.
   */
  removeSoundSensor(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SOUND));

    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SOUND, id);
  }

    /**
   * Add a new Light sensor to the simulation container.
   * @param {int} pin 
   * @param {int} state 
   * @param {boolean} visible 
   * @param {int} width 
   * @param {int} height 
   * @param {int} offsetLeft 
   * @param {int} offsetTop 
   * @param {string} htmlClasses 
   */
  addLightSensor(pin=6, state=0, visible=true, width=100, height=45, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas light_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LIGHT));
    this.incrementNumberOf(TypesEnum.LIGHT);
    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];

    let pins = {};
    pins[SocialRobotLightSensor.pinNames.digitalPin] = pin + id;

    let lightSensor = new SocialRobotLightSensor();
    lightSensor.initComponent(this._eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(lightSensor);

    this.renderer.initializeCanvas(this._robot, lightSensor); 
  }

  addLightSensorFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LIGHT));
    this.incrementNumberOf(TypesEnum.LIGHT);
    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];
    
    let lightSensor = new SocialRobotLightSensor();
    lightSensor.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(lightSensor);

    this.renderer.initializeCanvas(this._robot, lightSensor); 
  }

  /**
   * Remove the most recently created Light sensor from the simulation container.
   */
  removeLightSensor(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LIGHT));

    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LIGHT, id);
  }

  /**
   * Add new buzzer component to the scenario
   */

   addBuzzer(pin=0, radius=50, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas buzzer_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.BUZZER));
    this.incrementNumberOf(TypesEnum.BUZZER);
    let id = this._numberOfComponentsOfType[TypesEnum.BUZZER];

    let pins = {}
    pins[SocialRobotBuzzer.pinNames.digitalPin] = "BUZZER";
    let state = 0; // no tone
    
    let buzzer = new SocialRobotBuzzer();
    buzzer.initComponent(this._eventBus, id, pins, state, true, radius, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(buzzer);

    this.renderer.initializeCanvas(this._robot, buzzer); 
  }

  addBuzzerFromXml(xml){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.BUZZER));
    this.incrementNumberOf(TypesEnum.BUZZER);
    let id = this._numberOfComponentsOfType[TypesEnum.BUZZER];

    let buzzer = new SocialRobotBuzzer();
    buzzer.initComponentFromXml(this._eventBus, id, xml);
    this._robot.push(buzzer);

    this.renderer.initializeCanvas(this._robot, buzzer);
  }

   /**
   * Remove the most recently created buzzer from the simulation container.
   */
    removeBuzzer(){
      this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.BUZZER));
  
      let id = this._numberOfComponentsOfType[TypesEnum.BUZZER];
      let buzzer = this.getRobotComponentWithTypeAndId(TypesEnum.BUZZER, id);
      buzzer.killComponentAudio();
      this.removeRobotComponentWithTypeAndId(TypesEnum.BUZZER, id);
    }

  /**
   * Increment the number of a certain robot component in the scenario.
   * @param {TypesEnum} type 
   */
  incrementNumberOf(type) {
    this._numberOfComponentsOfType[type] += 1;
  }

  /**
   * Decrement the number of a certain robot component in the scenario.
   * @param {TypesEnum} type 
   */
  decrementNumberOf(type) {
    this._numberOfComponentsOfType[type] -= 1;
  }

}

export default RobotComponentsFactory;