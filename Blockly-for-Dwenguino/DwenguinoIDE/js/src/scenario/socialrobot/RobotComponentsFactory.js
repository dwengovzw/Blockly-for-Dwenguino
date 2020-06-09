import SimulationCanvasRenderer from "./SimulationCanvasRenderer.js"
import { EVENT_NAMES } from "../../logging/EventNames.js"

import { RobotComponent } from "./components/RobotComponent.js"
import { Servo, CostumesEnum } from "./components/Servo.js"
import { Led } from "./components/Led.js"
import { Lcd } from "./components/Lcd.js"
import { Sonar } from "./components/Sonar.js"
import { Pir } from "./components/Pir.js"
import { SoundSensor } from "./components/SoundSensor.js"
import { LightSensor } from "./components/LightSensor.js"

export { TypesEnum, RobotComponentsFactory }


/**
 * The supported robot component types
 */
const TypesEnum = {
  SERVO: 'servo',
  LED: 'led',
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  SOUND: 'sound',
  LIGHT: 'light',
};
Object.freeze(TypesEnum);

/**
 * This factory produces robot components for the given robot
 * @param {SocialRobot} robot 
 */
class RobotComponentsFactory {
  logger = null;
  inputState = {
    pir: 0,
    buttons: [1, 1, 1, 1, 1],
    sonarDistance: -1
  }
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

  getRobot(){
    return this._robot;
  }

  resetSocialRobot(){
    for(var i = 0; i < this._robot.length; i++){
      this._robot[i].reset();
    }
  }

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
      }
    }
  }

  getInputState(){
    return this.inputState;
  }

  getRobotComponentWithTypeAndId(type, id){
    for(let i = 0; i < this._robot.length; i++){
      if(this._robot[i].getType() == type && this._robot[i].getId() == id){
        return this._robot[i];
      }
    }
  }

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
  
  addRobotComponent(type) {
    switch (type) {
      case TypesEnum.SERVO:
        this.addServo();
        break;
      case TypesEnum.LED:
        this.addLed();
        break;
      case TypesEnum.PIR:
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

  removeRobotComponent(type) {
    switch (type) {
      case TypesEnum.SERVO:
        this.removeServo();
        break;
      case TypesEnum.LED:
        this.removeLed();
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
      case TypesEnum.PIR:
        var width = parseFloat(data.getAttribute('Width'));
        var height = parseFloat(data.getAttribute('Height'));
        var offsetLeft = parseFloat(data.getAttribute('OffsetLeft'));
        var offsetTop = parseFloat(data.getAttribute('OffsetTop'));
        var pin = parseInt(data.getAttribute('Pin'));
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
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
    * Add a new servo to the simulation container.
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

    let servo = new Servo(this._eventBus, id, pin, costume, angle, visible, x, y, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(servo);

    this.renderer.initializeCanvas(this._robot, servo); 
  }

  /**
   * Remove the most recent created servo from the simulation container.
   */
  removeServo(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SERVO));

    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SERVO, id);
  }


  addLed(pin=0, state=0, visible=true, radius=10, x=0, y=0, offsetLeft=5, offsetTop=5, onColor='yellow', offColor='gray', borderColor='black', htmlClasses='sim_canvas led_canvas') {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LED));
    this.incrementNumberOf(TypesEnum.LED);
    let id = this._numberOfComponentsOfType[TypesEnum.LED];

    let led = new Led(this._eventBus, id, pin, state, visible, radius, x, y, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
  }

  /**
   * Remove the most recent created LED from the simulation container.
   */
  removeLed(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LED));

    let id = this._numberOfComponentsOfType[TypesEnum.LED];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LED, id);
  }

  /**
   * Add a new PIR sensor to the simulation container.
   */
  addPir(pin=0, state=0, visible=true, width=50, height=50, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas pir_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pir = new Pir(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(pir);

    this.renderer.initializeCanvas(this._robot, pir); 
  }

  /**
   * Remove the most recent created PIR sensor from the simulation container.
   */
  removePir(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.PIR));

    let id = this._numberOfComponentsOfType[TypesEnum.PIR];
    this.removeRobotComponentWithTypeAndId(TypesEnum.PIR, id);
  }

  /**
   * Add a new SONAR sensor to the simulation container.
   */
  addSonar(echoPin=0, triggerPin=0, state=100, visible=true, width=100, height=58, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sonar_canvas'){

    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let sonar = new Sonar(this._eventBus, id, echoPin, triggerPin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar); // TODO
  }
  
  /**
   * Remove the most recent created SONAR sensor from the simulation container.
   */
  removeSonar(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SONAR));

    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SONAR, id);
  }

  /**
   * Add a new decoration component to the simulation container.
   */
  addLcd(visible=true, offsetLeft=5, offsetTop=5, htmlClasses=''){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LCD));
    this.incrementNumberOf(TypesEnum.LCD);
    let id = this._numberOfComponentsOfType[TypesEnum.LCD];

    let lcd = new Lcd(this._eventBus, id, visible, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(lcd);
  }
  

  /**
  * Remove the most recent created decoration element from the simulation container.
  */
  removeLcd(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypsEnum.Lcd));
    
    let id = this._numberOfComponentsOfType[TypsEnum.LCD];
    this.removeRobotComponentWithTypeAndId(TypsEnum.LCD, id);
  }


  /**
   * Add a new Sound sensor to the simulation container.
   */
  addSoundSensor(pin=0, state=0, visible=true, width=100, height=54, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas sound_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SOUND));
    this.incrementNumberOf(TypesEnum.SOUND);
    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];

    let soundSensor = new SoundSensor(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(soundSensor);

    this.renderer.initializeCanvas(this._robot, soundSensor); 
  }

  /**
   * Remove the most recent created Sound sensor from the simulation container.
   */
  removeSoundSensor(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SOUND));

    let id = this._numberOfComponentsOfType[TypesEnum.SOUND];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SOUND, id);
  }

    /**
   * Add a new Light sensor to the simulation container.
   */
  addLightSensor(pin=0, state=0, visible=true, width=30, height=30, offsetLeft=5, offsetTop=5, htmlClasses='sim_canvas light_canvas'){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LIGHT));
    this.incrementNumberOf(TypesEnum.LIGHT);
    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];

    let lightSensor = new LightSensor(this._eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(lightSensor);

    this.renderer.initializeCanvas(this._robot, lightSensor); 
  }

  /**
   * Remove the most recent created Light sensor from the simulation container.
   */
  removeLightSensor(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.LIGHT));

    let id = this._numberOfComponentsOfType[TypesEnum.LIGHT];
    this.removeRobotComponentWithTypeAndId(TypesEnum.LIGHT, id);
  }

  incrementNumberOf(type) {
    //this.robot.numberOf[type] += 1;
    this._numberOfComponentsOfType[type] += 1;
  }

  decrementNumberOf(type) {
    //this.robot.numberOf[type] -= 1;
    this._numberOfComponentsOfType[type] -= 1;
  }

}