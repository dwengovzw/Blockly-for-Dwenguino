import SimulationCanvasRenderer from "./SimulationCanvasRenderer.js"
import { StatesEnum } from "./DwenguinoScenarioUtils.js"
import { EVENT_NAMES } from "../../logging/EventNames.js"

import { RobotComponent } from "./components/RobotComponent.js"
import { Servo } from "./components/Servo.js"
import { Led } from "./components/Led.js"
import { Lcd } from "./components/Lcd.js"
import { Sonar } from "./components/Sonar.js"
import { Pir } from "./components/Pir.js"

export { TypesEnum, RobotComponentsFactory }


/**
 * The supported robot component types
 */
const TypesEnum = {
  SERVO: 'servo',
  LED: 'led',
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd'
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
  constructor(_robot, scenarioUtils, logger) {
    this.logger = logger;
    this._robot = _robot;
    this._numberOfComponentsOfType = {};
    //this.robot = robot;
    this.scenarioUtils = scenarioUtils;
    this.renderer = new SimulationCanvasRenderer();

    for (const [type, t] of Object.entries(TypesEnum)) {
      this._numberOfComponentsOfType[t] = 0;
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
        var state = parseInt(data.getAttribute('State'));
        var htmlClasses = data.getAttribute('Classes');
        this.addLed(pin, state, true, radius, 0, 0, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses);
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
    }
  }

  /**
    * Add a new servo to the simulation container.
    */
  addServo(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SERVO));
    this.incrementNumberOf(TypesEnum.SERVO);
    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];

    let pin = 0;
    if(id == 1){
      pin = 36;
    } else if (id == 2){
      pin = 37;
    } else {
      pin = 0;
    }

    let servo = new Servo(id, pin);
    this._robot.push(servo);

    this.renderer.initializeCanvas(this._robot, servo); 
    this.scenarioUtils.contextMenuServo();
  }

  addServo(pin, costume, angle, visible, x, y, width, height, offsetLeft, offsetTop, htmlClasses){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SERVO));
    this.incrementNumberOf(TypesEnum.SERVO);
    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];

    if(id == 1){
      pin = 36;
    } else if (id == 2){
      pin = 37;
    } else {
      pin = 0;
    }

    let servo = new Servo(id, pin, costume, angle, visible, x, y, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(servo);

    this.renderer.initializeCanvas(this._robot, servo); 
    this.scenarioUtils.contextMenuServo();
  }

  /**
   * Remove the most recent created servo from the simulation container.
   */
  removeServo(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.removeRobotComponent, TypesEnum.SERVO));

    let id = this._numberOfComponentsOfType[TypesEnum.SERVO];
    this.removeRobotComponentWithTypeAndId(TypesEnum.SERVO, id);
  }

  /**
   * Add a new LED to the simulation container.
   */
  addLed(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LED));
    this.incrementNumberOf(TypesEnum.LED);
    let id = this._numberOfComponentsOfType[TypesEnum.LED];

    let led = new Led(id);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
    this.scenarioUtils.contextMenuLed();
  }
  
  addLed(pin, state, visible, radius, x, y, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses) {
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LED));
    this.incrementNumberOf(TypesEnum.LED);
    let id = this._numberOfComponentsOfType[TypesEnum.LED];

    let led = new Led(id, pin, state, true, radius, x, y, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses);
    this._robot.push(led);

    this.renderer.initializeCanvas(this._robot, led); 
    this.scenarioUtils.contextMenuLed();
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
  addPir(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pir = new Pir(id);
    this._robot.push(pir);

    this.renderer.initializeCanvas(this._robot, pir);
  }

  addPir(pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.PIR));
    this.incrementNumberOf(TypesEnum.PIR);
    let id = this._numberOfComponentsOfType[TypesEnum.PIR];

    let pir = new Pir(id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses);
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
  addSonar(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let sonar = new Sonar(id);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar); // TODO
  }

  addSonar(echoPin, triggerPin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));
    this.incrementNumberOf(TypesEnum.SONAR);
    let id = this._numberOfComponentsOfType[TypesEnum.SONAR];

    let sonar = new Sonar(id, echoPin, triggerPin, state, true, width, height, offsetLeft, offsetTop, htmlClasses);
    this._robot.push(sonar);

    this.renderer.initializeCanvas(this._robot, sonar); // TODO
  }
  // addSonar(draw = true, offsetLeft = 5, offsetTop = 5) {
  //   this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.SONAR));

  //   this.incrementNumberOf(TypesEnum.SONAR);
  //   var id = this.robot.numberOf[TypesEnum.SONAR];
  //   var sonarCanvasId = 'sim_sonar_canvas' + id;

  //   this.robot[sonarCanvasId] = {};
  //   this.robot[sonarCanvasId].width = 100;
  //   this.robot[sonarCanvasId].height = 58;
  //   this.robot[sonarCanvasId].offset = { 'left': offsetLeft, 'top': offsetTop };
  //   this.robot[sonarCanvasId].image = new Image();
  //   this.robot[sonarCanvasId].image.src = this.robot.imgSonar;

  //   var classes = 'sim_canvas sonar_canvas';
  //   this.addHtml(TypesEnum.SONAR, id, offsetTop, offsetLeft, classes);

  //   this.renderer.initializeCanvas(sonarCanvasId, this.robot);
  //   if (draw) {
  //     $('#sim_sonar' + id).css('visibility', 'visible');
  //   } else {
  //     $('#sim_sonar' + id).css('visibility', 'hidden');
  //   }

  //   var sliderId = 'slider' + id;
  //   var sliderLabel = 'slider' + id + '_label';
  //   var sliderValue = 'slider' + id + '_value';
  //   var sonarSliderId = 'sonar_slider' + id;
  //   if (!document.getElementById(sonarSliderId)) {
  //     console.log('make slider');
  //     $('#sensor_options').append("<div id='" + sliderLabel + "' class='sensor_options_label' alt='Slider label'>" + MSG.sonarSliderLabel + " " + id + "</div>");
  //     $('#sensor_options').append("<div id='" + sliderValue + "' class='' alt='Slider value'>100 cm</div>");
  //     $('#sensor_options').append("<div id='" + sliderId + "' class='sonar_slider slidecontainer' alt='Load'></div>");
  //     $('#' + sliderId).append("<input type='range' min='0' max='200' value='100' class='slider' id='" + sonarSliderId + "'></input>");

  //     var self = this;
  //     var slider = document.getElementById(sonarSliderId);
  //     slider.oninput = function () {
  //       var id = this.id.replace(/^\D+/g, '');
  //       self.changeSonarDistance(this.value, id);
  //     };
  //   }
  // }

  // /**
  //  * Remove the most recent created SONAR sensor from the simulation container.
  //  */
  // changeSonarDistance(value, id) {
  //   var sliderValue = 'slider' + id + '_value';
  //   document.getElementById(sliderValue).innerHTML = value + ' cm';
  //   // TODO: Remove this. the board state should be updated in the updateScenarioState function when it is called!
  //   this.inputState.sonarDistance = value;
  // }

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
  addLcd(){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LCD));
    this.incrementNumberOf(TypesEnum.LCD);
    let id = this._numberOfComponentsOfType[TypesEnum.LCD];

    let lcd = new Lcd(id);
    this._robot.push(lcd);
  }

  addLcd(visible, offsetLeft, offsetTop, htmlClasses){
    this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.addRobotComponent, TypesEnum.LCD));
    this.incrementNumberOf(TypesEnum.LCD);
    let id = this._numberOfComponentsOfType[TypesEnum.LCD];

    let lcd = new Lcd(id, visible, offsetLeft, offsetTop, htmlClasses);
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
   * Returns the led id of the Dwenguino board based on the id of the canvas.
   */
  // getLedId(i) {
  //   var id = 0;
  //   if (i < 9) {
  //     id = i - 1;
  //   } else {
  //     id = 13;
  //   }
  //   return id;
  // }

  // addPirEventHandler(pirButtonId, pirCanvasId) {
  //   var self = this;
  //   console.log(pirButtonId);
  //   $("#" + pirButtonId).on('mousedown', function () {
  //     if (document.getElementById(pirButtonId).className === "pir_button") {
  //       document.getElementById(pirButtonId).className = "pir_button pir_button_pushed";
  //       self.robot[pirCanvasId].image.src = self.robot.imgPirOn;
  //       self.robot[pirCanvasId].state = 1;
  //       self.inputState.pir = 1;
  //     }
  //   });

  //   $("#" + pirButtonId).on('mouseup', function () {
  //     if (document.getElementById(pirButtonId).className === "pir_button pir_button_pushed") {
  //       document.getElementById(pirButtonId).className = "pir_button";
  //       self.robot[pirCanvasId].image.src = self.robot.imgPir;
  //       self.robot[pirCanvasId].state = 0;
  //       self.inputState.pir = 0;
  //     }
  //   });
  // }


  incrementNumberOf(type) {
    //this.robot.numberOf[type] += 1;
    this._numberOfComponentsOfType[type] += 1;
  }

  decrementNumberOf(type) {
    //this.robot.numberOf[type] -= 1;
    this._numberOfComponentsOfType[type] -= 1;
  }

}