import DwenguinoSimulationRobotComponentsMenu from "./DwenguinoSimulationRobotComponentsMenu.js"
import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"
import SimulationCanvasRenderer from "./SimulationCanvasRenderer.js"
import { TypesEnum, RobotComponentsFactory } from "./RobotComponentsFactory.js"
import DwenguinoSimulationRobotComponents from "./DwenguinoSimulationRobotComponents.js"
import {DwenguinoScenarioUtils} from "./DwenguinoScenarioUtils.js"
import { EventsEnum } from "./ScenarioEvent.js"
import {EventBus} from "./EventBus.js"
import { CostumesEnum } from "./components/Servo.js"

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

    // Event listener for saving the robot scenario to local storage
    this._eventBus = new EventBus();
    this._eventBus.registerEvent(EventsEnum.SAVE);
    this._eventBus.addEventListener(EventsEnum.SAVE, ()=>{ this.saveRobot()});

    this.simulationRobotComponents = new DwenguinoSimulationRobotComponents(this, this._eventBus);
    this.simulationComponentsMenu = new DwenguinoSimulationRobotComponentsMenu(this._eventBus);
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

    this.scenarioUtils = new DwenguinoScenarioUtils(this, this._eventBus);

    this.robotComponentsFactory = new RobotComponentsFactory(this.scenarioUtils, this.logger, this._eventBus);

    this._eventBus.registerEvent(EventsEnum.CLEARCANVAS);
    this._eventBus.addEventListener(EventsEnum.CLEARCANVAS, (canvasId)=>{ this.renderer.clearCanvas(canvasId)});

    this._eventBus.registerEvent(EventsEnum.INITIALIZECANVAS);
    this._eventBus.addEventListener(EventsEnum.INITIALIZECANVAS, (component)=>{ this.renderer.initializeCanvas(this.robotComponentsFactory.getRobot(), component)});


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
    

    //this.renderer.render(this.robotComponentFactory.getRobot());
    
    var self = this;
    $("#sim_stop").click(function () {
      let timer = setTimeout(() => {
        self.resetSocialRobot();
        self.renderer.render(self.robotComponentsFactory.getRobot());
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
    scenarioOptions.append("<div id='switch_background' class='glyphicon glyphicon-refresh'></div>")

    $("#load_scenario").click(function () {
      self.scenarioUtils.loadScenario();
    });

    $("#save_scenario").click(function () {
      var data = self.loadToXml();
      self.scenarioUtils.saveScenario(data);
    });

    let switchBackground = document.getElementById('switch_background');
    switchBackground.addEventListener('click', () => {
      this.switchBackground();
    });
  }

  initSimulation(containerIdSelector) {

    console.log("init simulation display");

    let container = $(`#${containerIdSelector}`);

    // Make the bottom pane larger
    $('#db_simulator_top_pane').css('height', '25%');
    $('#db_simulator_bottom_pane').css('height', '75%');

    // Load the simulation container
    var simulationContainer = $("<div>").attr("id", "sim_container").attr("style", "margin: auto");

    // Add resize listerner to the conainer and update width and height accordingly
    var self = this;
    new ResizeSensor(simulationContainer, function () {
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    container.append(simulationContainer);
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
    this.robotComponentsFactory.updateScenarioState(dwenguinoState);
  };

  /* @brief updates the simulation display
   * This function updates the simulation display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   *
   */
  updateScenarioDisplay(dwenguinoState) {
    super.updateScenarioDisplay(dwenguinoState);
    this.renderer.render(this.robotComponentsFactory.getRobot());
  };

  setSensorOptions() {
    if (!document.getElementById('sensor_options')) {
      var sensorOptions = $("<div>").attr("id", "sensor_options");
      $('#sim_container').append(sensorOptions);
    }
  }

  setBackground() {
    console.log('set background');
    $('#sim_container').append("<div id='sim_background' class='sim_element row'></div>");
    $('#sim_background').append("<div id='sim_background_img' class='background1'></div>");
    this._background = 1;
    var sensorOptionswidth = $('#sensor_options').width();
    var parentWidth = $('#sim_background').width() - sensorOptionswidth;
    var width = $('#sim_background_img').width();
    var offSet = (parentWidth - width) / 2;
    $('#sim_background_img').css('top', 0 + 'px');
    $('#sim_background_img').css('margin-left', offSet + 'px');

  };

  switchBackground() {
    if (this._background < 3){
      this._background += 1;
    } else {
      this._background = 1;
    }

    document.getElementById('sim_background_img').className = "";
    document.getElementById('sim_background_img').className = 'background' + this._background;
    this._eventBus.dispatchEvent(EventsEnum.SAVE);
  }

  backgroundToXml() {
    let data = '';
        
    data = data.concat("<Item ");
    data = data.concat(" Type='", "background", "'");
    data = data.concat(" Class='", document.getElementById('sim_background_img').className, "'");
    data = data.concat(" Id='", this._background, "'");
    data = data.concat("></Item>");
    return data;
  }

  /**
   * Resets the robot components of the simulation container to their initial state. This function doesn't
   * remove the components from the container or move them around, but merely puts them in their initial off state.
   */
  resetSocialRobot(containerIdSelector) {
    this.robotComponentsFactory.resetSocialRobot();
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
    this.renderer.render(this.robotComponentsFactory.getRobot());
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
    data = data.concat(this.backgroundToXml());

    let robot = this.robotComponentsFactory.getRobot();

    for(var i = 0; i < robot.length; i++){
      data = data.concat(robot[i].toXml());
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
      if(type !== 'background'){
        this.robotComponentsFactory.addRobotComponentFromXml(xmlChild);
        this.simulationComponentsMenu.changeValue(type, 1);
      } else {
        this._background = parseInt(xmlChild.getAttribute('Id'));
        document.getElementById('sim_background_img').className = xmlChild.getAttribute('Class');
      }
    }
  }

    /**********************
   *  LOCAL STORAGE     *
   **********************/

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