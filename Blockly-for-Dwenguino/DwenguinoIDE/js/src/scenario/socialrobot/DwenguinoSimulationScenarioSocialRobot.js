import DwenguinoSimulationRobotComponentsMenu from "./DwenguinoSimulationRobotComponentsMenu.js"
import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"
import SimulationCanvasRenderer from "./SimulationCanvasRenderer.js"
import { TypesEnum, RobotComponentsFactory } from "./RobotComponentsFactory.js"
import DwenguinoSimulationRobotComponents from "./DwenguinoSimulationRobotComponents.js"
import {DwenguinoScenarioUtils, StatesEnum} from "./DwenguinoScenarioUtils.js"

/*
 * This Object is the abstraction of the social robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 *
 */
export default class DwenguinoSimulationScenarioSocialRobot extends DwenguinoSimulationScenario{
  simulationComponentsMenu = null;
  simulationRobotComponents = null;
  constructor(logger) {
    super(logger);
    this.simulationRobotComponents = new DwenguinoSimulationRobotComponents(this);
    this.simulationComponentsMenu = new DwenguinoSimulationRobotComponentsMenu();
    //this.clearRobot();

  }


  /* @brief Initializes the simulator robot.
   * This resets the simulation state.
   *
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  initSimulationState() {
    // init superclass
    super.initSimulationState();

    this.renderer = new SimulationCanvasRenderer();

    this.scenarioUtils = new DwenguinoScenarioUtils(this);

    //Init robot state
    this.initSocialRobot();
    this.robotComponentsFactory = new RobotComponentsFactory(this._robot, this.scenarioUtils, this.logger);

    this.scenarioUtils.contextMenuBackground();

  }

  /* @brief Initializes the simulator social robot display.
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  initSimulationDisplay(containerIdSelector) {
    // init superclass
    super.initSimulationDisplay();

    // Clear the container and create top and bottom panes

    var container = $(`#${containerIdSelector}`);
    container.empty();
    let top_pane = $("<div>").attr("id", "db_simulator_top_pane");
    let bottom_pane = $("<div>").attr("id", "db_simulator_bottom_pane");
    container.append(top_pane).append(bottom_pane);

    // Setup the components menu
    this.simulationComponentsMenu.setupEnvironment(this);

    this.initSimulation(containerIdSelector);
    

    this.renderer.render(this._robot);
    
    var self = this;
    $("#sim_stop").click(function () {
      let timer = setTimeout(() => {
        self.resetSocialRobot();
        self.renderer.render(self._robot);
      }, 500);
    });


    this.setBackground();

    this.initScenarioOptions();

    this.setSensorOptions();

    // Load robot components from local storage if they are present
    this.loadRobot();

  }

  initScenarioOptions() {
    var self = this;

    var scenarioOptions = $("<div>").attr("id", "scenario_options");
    $('#sim_container').append(scenarioOptions);
    scenarioOptions.append("<div id='load_scenario' class='glyphicon glyphicon-cloud-upload' alt='Load'></div>");
    scenarioOptions.append("<div id='save_scenario' class='glyphicon glyphicon-cloud-download' alt='Save'></div>");

    $("#load_scenario").click(function () {
      self.scenarioUtils.loadScenario();
    });

    $("#save_scenario").click(function () {
      var data = self.loadToXml();
      self.scenarioUtils.saveScenario(data);
    });

  }

  initSimulation(containerIdSelector) {

    console.log("init simulation display");

    let container = $(`#${containerIdSelector}`);

    // Make the bottom pane larger
    $('#db_simulator_top_pane').css('height', '35%');
    $('#db_simulator_bottom_pane').css('height', '65%');

    // Load the simulation container
    var simulationContainer = $("<div>").attr("id", "sim_container").attr("style", "margin: auto");

    // Add resize listerner to the conainer and update width and height accordingly
    var self = this;
    new ResizeSensor(simulationContainer, function () {
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    container.append(simulationContainer);

    // TODO implemnt change of background image
    // var backgroundCanvasId = 'sim_background';
    // this.robot[backgroundCanvasId] = {};
    // this.robot[backgroundCanvasId].offset = {'left': 0, 'top': 0};
    // this.robot[backgroundCanvasId].image = new Image();
    // this.robot[backgroundCanvasId].image.src = this.robot.imgRobot;

    // Reset the simulation state
   // this.initSimulationState();

  }


  /* @brief updates the simulation state and display
   * This function updates the simulation state and display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   * @return The updated Dwenguino board state.
   *
   */
  updateScenario(dwenguinoState) {
    super.updateScenario(dwenguinoState);
    this.updateScenarioState(dwenguinoState);
    this.updateScenarioDisplay(dwenguinoState);
  };

  /* @brief updates the simulation state
   * This function updates the simulation state using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board. 
   * @return The updated Dwenguino board state.
   *
   */
  updateScenarioState(dwenguinoState) {
    super.updateScenarioState(dwenguinoState);
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
      }
    }

  };

  /* @brief updates the simulation display
   * This function updates the simulation display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   *
   */
  updateScenarioDisplay(dwenguinoState) {
    super.updateScenarioDisplay(dwenguinoState);
    this.renderer.render(this._robot);
  };

  /* @brief Initializes the social robot state.
   * 
   */
  initSocialRobot(containerIdSelector) { 
    this._robot = [];
  };

  setSensorOptions() {
    if (!document.getElementById('sensor_options')) {
      var sensorOptions = $("<div>").attr("id", "sensor_options");
      $('#sim_container').append(sensorOptions);
    }
  }

  setBackground() {
    console.log('set background');
    $('#sim_container').append("<div id='sim_background' class='sim_element'></div>");
    $('#sim_background').append("<div id='sim_background_img'></div>");
    var sensorOptionswidth = $('#sensor_options').width();
    var parentWidth = $('#sim_background').width() - sensorOptionswidth;
    var width = $('#sim_background_img').width();
    var offSet = (parentWidth - width) / 2;
    $('#sim_background_img').css('top', 0 + 'px');
    $('#sim_background_img').css('margin-left', offSet + 'px');
  };

  /**
   * Resets the robot components of the simulation container to their initial state. This function doesn't
   * remove the components from the container or move them around, but merely puts them in their initial off state.
   */
  resetSocialRobot(containerIdSelector) {
    for(var i = 0; i < this._robot.length; i++){
      this._robot[i].reset();
    }
  };

  /**
   * Add a robot component of the specified type to the simulation container.
   */
  addRobotComponent(type) {
    this.robotComponentsFactory.addRobotComponent(type);
  };

  /**
   * Remove the lastly created robot component of the specified type from the simulation container.
   */
  removeRobotComponent(type) {
    this.robotComponentsFactory.removeRobotComponent(type);
    this.renderer.render(this._robot);
  };

  /**
   * Changes the color of led canvas i to the given color.
   */
  setLedColor(i, color) {
    let led = this.robotComponentsFactory.getRobotComponentWithTypeAndId(TypesEnum.LED, i);
    if(led !== undefined){
      led.setOnColor(color);
    }
  }

  /**
   * Change the state of ith servo canvas to the specified state.
   */
  setServoState(i, costume) {
    let servo = this.robotComponentsFactory.getRobotComponentWithTypeAndId(TypesEnum.SERVO, i);
    if(servo !== undefined){
      this.renderer.clearCanvas(servo.getCanvasId());

      switch (costume) {
        case StatesEnum.PLAIN:
          servo.setHtmlClasses('sim_servo servo_canvas');
          servo.setCostume(costume);
          servo.setWidth(100);
          servo.setHeight(50);
          break;
        case StatesEnum.EYE:
          servo.setHtmlClasses('servo_canvas');
          servo.setCostume(costume);
          servo.setWidth(35);
          servo.setHeight(35);
          break;
        case StatesEnum.RIGHTHAND:
          servo.setHtmlClasses('servo_canvas hand_canvas');
          servo.setCostume(costume);
          servo.setWidth(64);
          servo.setHeight(149);
          break;
        case StatesEnum.LEFTHAND:
          servo.setHtmlClasses('servo_canvas hand_canvas');
          servo.setCostume(costume);
          servo.setWidth(64);
          servo.setHeight(149);
          break;
      }

      document.getElementById(servo.getCanvasId()).className = "";
      document.getElementById(servo.getCanvasId()).className = servo.getHtmlClasses();
      this.renderer.initializeCanvas(this._robot, servo);
      this.saveRobot()
    }
  }

  /**********************
   *  LOCAL STORAGE     *
   **********************/

  /**
   * Periodically saves the current robot components to the local storage,
   * so that when the page gets refreshed they can be reloaded.
   */
  saveRobotComponents() {
    

      try {

        // Set the interval and autosave every second
        //setInterval(() => this.saveRobotComponents(), 1000);

      } catch (e) {

        if (e == QUOTA_EXCEEDED_ERR) {
          alert('Quota exceeded!');
        }
      }

    
  }

  /*********************
   *  XML HANDLING     *
   ********************/

  /**
   * Writes the current scenario state to an Xml document and return it.
   */
  loadToXml() {
    
    if (window.localStorage) {
      var localStorage = window.localStorage;
      var canvasId = '';
      if (localStorage.getItem('socialRobotScenario')) {
        return this.robotToXml();
      }
    }
    
  }

  /**
   * Convert the current robot config to xml format
   */
  robotToXml(){
    let data = '<xml xmlns="http://www.w3.org/1999/xhtml">';
    for(var i = 0; i < this._robot.length; i++){
      data = data.concat(this._robot[i].toXml());
    }
    data = data.concat('</xml>');
    return data;
  }

  /**
   * Converts an robot xml string into a robot on the screen
   * @param {the xml string to be converted} xml 
   */
  xmlToRobot(xml){
    var data = this.scenarioUtils.textToDom(xml);

    var childCount = data.childNodes.length;
    for (var i = 0; i < childCount; i++) {
      var xmlChild = data.childNodes[i];
      let type = xmlChild.getAttribute('Type');
      this.robotComponentsFactory.addRobotComponentFromXml(xmlChild);
      this.simulationComponentsMenu.changeValue(type, 1);
    }
  }

  /**
   * Converts the robot to xml and saves it into the local storage of the browser
   */
  saveRobot(permanent = false, uniqeIdentifier = ""){
    let storageKey = permanent ? "permanentDwenguinoSocialRobot" + uniqeIdentifier : "dwenguinoSocialRobot" + uniqeIdentifier;
    console.log("%c saving robot", "color: green");
    let localStorage = window.localStorage;
    if (localStorage) {
      let robotXml = this.robotToXml();
      localStorage.setItem(storageKey, robotXml)
    }
  }

  /**
   * Check the local storage if an item exists and load the xml
   */
  loadRobot(permanent = false, uniqeIdentifier = ""){
    let storageKey = permanent ? "permanentDwenguinoSocialRobot" + uniqeIdentifier : "dwenguinoSocialRobot" + uniqeIdentifier;
    console.log("%c loading robot", "color: green");
    let localStorage = window.localStorage;
    if (localStorage) {
      let robotXml = localStorage.getItem(storageKey);
      if (robotXml){
        this.xmlToRobot(robotXml);
      }
    }
  }

  /**
   * Removes the localstorage entry for the robot
   */
  clearRobot(uniqeIdentifier = ""){
    let storageKey = "dwenguinoSocialRobot" + uniqeIdentifier;
    console.log("%c clearing robot", "color: green");
    let localStorage = window.localStorage;
    if (localStorage) {
      localStorage.removeItem(storageKey);
    }
  }
}