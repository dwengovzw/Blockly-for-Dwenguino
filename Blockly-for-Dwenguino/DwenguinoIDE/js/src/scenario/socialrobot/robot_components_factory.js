import SimulationCanvasRenderer from "./simulation_canvas_renderer.js"
import { EVENT_NAMES } from "../../logging/event_names.js"

import { SocialRobotServo, CostumesEnum } from "./components/servo.js"
import { SocialRobotLed } from "./components/led.js"
import { SocialRobotLcd } from "./components/lcd.js"
import { SocialRobotSonar } from "./components/sonar.js"
import { SocialRobotPir } from "./components/pir.js"
import { SocialRobotSoundSensor } from "./components/sound_sensor.js"
import { SocialRobotLightSensor } from "./components/light_sensor.js"
import { SocialRobotRgbLed } from "./components/rgbled.js"

export { TypesEnum as TypesEnum, RobotComponentsFactory }

/**
 * The supported robot component types
 * @readonly
 * @enum {string}
 */
const TypesEnum = {
  SERVO: 'servo',
  LED: 'led',
  RGBLED: 'rgbled',
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  SOUND: 'sound',
  LIGHT: 'light'
};
Object.freeze(TypesEnum);

/**
 * This factory produces robot components of certain types.
 * @param {SocialRobot} robot 
 */
class RobotComponentsFactory {
  logger = null;
  inputState = {
    pir: 0,
    buttons: [1, 1, 1, 1, 1],
    sonarDistance: -1
  }

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
   * Update the state and other properties of the robot components when an update of
   * the Dwenguino Boardstate is received.
   * @param {DwenguinoBoardSimulation} dwenguinoState 
   */
  updateScenarioState(dwenguinoState){
    for(var i = 0; i < this._robot.length; i++){
      let type = this._robot[i].getType();
      let pin = 0;
      switch (type) {
        case TypesEnum.SERVO:;
          pin = this._robot[i].getPin();
          if(pin === 36){
            if(this._robot[i].getAngle() != dwenguinoState.getServoAngle(1)){
              this._robot[i].setPrevAngle(this._robot[i].getAngle());
              this._robot[i].setAngle(dwenguinoState.getServoAngle(1));
            }
          } else if(pin === 37){
            if(this._robot[i].getAngle() != dwenguinoState.getServoAngle(2)){
              this._robot[i].setPrevAngle(this._robot[i].getAngle());
              this._robot[i].setAngle(dwenguinoState.getServoAngle(2));
            }
          } else {
            if(this._robot[i].getAngle() != dwenguinoState.getIoPinState(pin)){
              this._robot[i].setPrevAngle(this._robot[i].getAngle());
              this._robot[i].setAngle(dwenguinoState.getIoPinState(pin));
            }
          }
          break;
        case TypesEnum.LED:
          pin = this._robot[i].getPin();
          this._robot[i].setState(dwenguinoState.getIoPinState(pin));  
          break;
        case TypesEnum.RGBLED:
          let redPin = this._robot[i].getRedPin();
          let greenPin = this._robot[i].getGreenPin(); 
          let bluePin = this._robot[i].getBluePin();
          let state = [dwenguinoState.getIoPinState(redPin), dwenguinoState.getIoPinState(greenPin), dwenguinoState.getIoPinState(bluePin)];
          this._robot[i].setState(state);
          break;
        case TypesEnum.PIR:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
        case TypesEnum.SONAR:
          let echoPin = this._robot[i].getEchoPin();
          let triggerPin = this._robot[i].getTriggerPin();
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
          pin = this._robot[i].getPin();
          console.log(pin);
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
            console.log(this._robot[i].getState());
          }
          break;
        case TypesEnum.LIGHT:
          pin = this._robot[i].getPin();
          if(this._robot[i].isStateUpdated()){
            dwenguinoState.setIoPinState(pin, this._robot[i].getState());
            this._robot[i]._stateUpdated = false;
          }
          break;
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
      case TypesEnum.LED:
        this.addLed();
        break;
      case TypesEnum.RGBLED:
        this.addRgbLed();
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
      case TypesEnum.LED:
        this.removeLed();
        break;
      case TypesEnum.RGBLED:
        this.removeRgbLed();
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
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var angle = parseInt(data.getAttribute('Angle'));
        var pin = parseInt(data.getAttribute('Pin'));
        var costume = data.getAttribute('Costume');
        var htmlClasses = data.getAttribute('Classes');
        this.addServo(pin, costume, angle, true, 0, 0, width, height, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.LED:
        var radius = parseFloat(data.getAttribute('Radius'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var onColor = data.getAttribute('OnColor');
        var offColor = data.getAttribute('OffColor');
        var borderColor = data.getAttribute('BorderColor');
        var pin = parseInt(data.getAttribute('Pin'));
        var htmlClasses = data.getAttribute('Classes');
        this.addLed(pin, 0, true, radius, 0, 0, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses);
        break;
      case TypesEnum.RGBLED:
        var radius = parseFloat(data.getAttribute('Radius'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var redPin = data.getAttribute('RedPin');
        var greenPin = data.getAttribute('GreenPin');
        var bluePin = data.getAttribute('BluePin');
        var htmlClasses = data.getAttribute('Classes');
        this.addRgbLed(redPin, greenPin, bluePin, [0, 0, 0], true, radius, 0, 0, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.PIR:
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var pin = parseInt(data.getAttribute('Pin'));
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
        console.log('addPir from xml')
        this.addPir(pin, state, true, width, height, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.SONAR:
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var echoPin = parseInt(data.getAttribute('EchoPin'));
        var triggerPin = parseInt(data.getAttribute('TriggerPin'));
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
        this.addSonar(echoPin, triggerPin, state, true, width, height, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.LCD:
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var htmlClasses = data.getAttribute('Classes');
        this.addLcd(true, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.SOUND:
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var pin = parseInt(data.getAttribute('Pin'));
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
        this.addSoundSensor(pin, state, true, width, height, offsetLeft, offsetTop, htmlClasses);
        break;
      case TypesEnum.LIGHT:
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var pin = parseInt(data.getAttribute('Pin'));
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
        this.addLightSensor(pin, state, true, width, height, offsetLeft, offsetTop, htmlClasses);
        break;
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
  addServo(pin=0, costume=CostumesEnum.PLAIN, angle=0, visible=true, x=0, y=0, width=100, height=50, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas servo_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SERVO));
    this.incrementNumberOf(TypesEnum.SERVO);
    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];

    if(id == 1){
      pin = 36;
    } else if (id == 2){
      pin = 37;
    } 

    let servo = new SocialRobotServo(this._eventBus, id, pin, costume, angle, visible, x, y, width, height, offsetLeft, offsetTop, htmlClasses);
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

    let led = new SocialRobotLed(this._eventBus, id, pin, state, visible, radius, x, y, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses);
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
  addRgbLed(redPin='A0', greenPin='A1', bluePin='A2', state=[0,0,0], visible=true, radius=10, x=0, y=0, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas rgbled_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.RGBLED));
    this.incrementNumberOf(TypesEnum.RGBLED);
    let id = this._numberOfComponentsOfType[TypesEnum.RGBLED];

    let rgbled = new SocialRobotRgbLed(this._eventBus, id, redPin, greenPin, bluePin, state, visible, radius, x, y, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(rgbled);

    this.renderer.initializeCanvas(this._robot, rgbled); 
  }

  /**
   * Remove the most recently created LED from the simulation container.
   */
  removeRgbLed(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.RGBLED));

    let id = this._numberOfComponentsOfType[TypesEnum.RGBLED];
    this.removeRobotComponentWithTypeAndId(TypesEnum.RGBLED, id);
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
  addPir(pin=0, state=0, visible=true, width=75, height=75, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas pir_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pir = new SocialRobotPir(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
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
  addSonar(echoPin=0, triggerPin=0, state=0, visible=true, width=100, height=58, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sonar_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let sonar = new SocialRobotSonar(this._eventBus, id, echoPin, triggerPin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar); // TODO
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
  addSoundSensor(pin=0, state=0, visible=true, width=100, height=42, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sound_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SOUND));
    this.incrementNumberOf(TypesEnum.SOUND);
    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];

    let soundSensor = new SocialRobotSoundSensor(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
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
  addLightSensor(pin=0, state=0, visible=true, width=100, height=45, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas light_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LIGHT));
    this.incrementNumberOf(TypesEnum.LIGHT);
    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];

    let lightSensor = new SocialRobotLightSensor(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
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