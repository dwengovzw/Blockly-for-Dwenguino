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
    this.clearRobot();
    //this.initSimulationState();
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
    this.robotComponentsFactory = new RobotComponentsFactory(this.robot, this.scenarioUtils, this.logger);

    

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

    // Load robot components from local storage if they are present
    //this.checkLocalStorage();

    // Setup the components menu
    this.simulationComponentsMenu.setupEnvironment(this);

    this.initSimulation(containerIdSelector);
    

    this.renderer.render(this.robot);
    

    var self = this;
    $("#sim_stop").click(function () {
      let timer = setTimeout(() => {
        self.resetSocialRobot();
        self.renderer.render(self.robot);
      }, 500);
    });


    this.setBackground();

    this.initScenarioOptions();

    this.setSensorOptions();

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
   * @param boardState The state of the Dwenguino board. It has the following structure:
   * {
     lcdContent: new Array(2),
     buzzer: {
       osc: null,
       audiocontext: null,
       tonePlaying: 0
     },
     servoAngles: [0, 0],
     motorSpeeds: [0, 0],
     leds: [0,0,0,0,0,0,0,0,0],
     buttons: [1,1,1,1,1],
     sonarDistance: 50
   }
   * @return The updated Dwenguino board state.
   *
   */
  updateScenarioState(dwenguinoState) {
    super.updateScenarioState(dwenguinoState);

    for (var i = 0; i < dwenguinoState.leds.length; i++) {
      var ledCanvasId = 'sim_led_canvas' + (i + 1);
      if (this.robot[ledCanvasId] !== undefined) {
        this.robot[ledCanvasId].state = dwenguinoState.leds[i];
      }
    }

    for (var i = 0; i < dwenguinoState.servoAngles.length; i++) {
      var servoCanvasId = 'sim_servo_canvas' + (i + 1);
      if (this.robot[servoCanvasId] !== undefined) {
        if (this.robot[servoCanvasId].angle != dwenguinoState.servoAngles[i]) {
          this.robot[servoCanvasId].prevAngle = this.robot[servoCanvasId].angle;
          this.robot[servoCanvasId].angle = dwenguinoState.servoAngles[i];
        }
      }
    }

    
    this.robot.lcdstate[0] = dwenguinoState.getLcdContent(0);
    this.robot.lcdstate[1] = dwenguinoState.getLcdContent(1);

    // Also update the input state based on the current events
    dwenguinoState.buttons = this.robotComponentsFactory.getInputState().buttons;
    dwenguinoState.sonarDistance = this.robotComponentsFactory.getInputState().sonarDistance;
    //!!! for now we assume the pir sensor is connected to io pin 
    dwenguinoState.ioPins[0] = this.robotComponentsFactory.getInputState().pir;

  };

  /* @brief updates the simulation display
   * This function updates the simulation display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   *
   */
  updateScenarioDisplay(dwenguinoState) {
    super.updateScenarioDisplay(dwenguinoState);
    this.renderer.render(this.robot);
  };

  /* @brief Initializes the social robot state.
   * 
   */
  initSocialRobot(containerIdSelector) {
    this.robot = {
      numberOf: {},
      imgServo: './DwenguinoIDE/img/socialrobot/servo_movement.png',
      imgPir: './DwenguinoIDE/img/socialrobot/pir.png',
      imgPirOn: './DwenguinoIDE/img/socialrobot/pir_on.png',
      imgSonar: './DwenguinoIDE/img/board/sonar.png',
      imgRobot: 'url("./DwenguinoIDE/img/socialrobot/robot1.png")',
      imgR: './DwenguinoIDE/img/socialrobot/robot1.png',
      imgEye: './img/socialrobot/eye.svg',
      imgRightHand: './DwenguinoIDE/img/socialrobot/righthand.png',
      imgLeftHand: './DwenguinoIDE/img/socialrobot/lefthand.png'
    };

    this.robot.lcdstate = new Array(2);

    for (const [type, t] of Object.entries(TypesEnum)) {
      this.robot.numberOf[t] = 0;
    }
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
    for (var i = 1; i <= this.robot.numberOf[TypesEnum.SERVO]; i++) {
      var servoCanvasId = 'sim_servo_canvas' + i;
      this.robot[servoCanvasId].x = 0;
      this.robot[servoCanvasId].y = 30;
      this.robot[servoCanvasId].angle = 0;
      this.robot[servoCanvasId].prevAngle = 0;
    }

    for (var i = 1; i <= this.robot.numberOf[TypesEnum.LED]; i++) {
      var ledCanvasId = 'sim_led_canvas' + i;
      this.robot[ledCanvasId].x = 0;
      this.robot[ledCanvasId].y = 0;
      this.robot[ledCanvasId].state = 0;
    }

    for (var i = 1; i <= this.robot.numberOf[TypesEnum.PIR]; i++) {
      var pirCanvasId = 'sim_pir_canvas' + i;
      this.robot[pirCanvasId].state = 0;
    }

    // Reset of the board is handled by the simulation runner.
    /*if (this.robot.numberOf[TypesEnum.LCD] != 0) {
      DwenguinoSimulation.clearLcd();
    }*/
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
    this.renderer.render(this.robot);
  };

  /**
   * Change the object distance of the sonar sensor in the simulation container
   */
  changeSonarDistance(value, id) {
    var sliderValue = 'slider' + id + '_value';
    document.getElementById(sliderValue).innerHTML = value + ' cm';
    DwenguinoSimulation.board.sonarDistance = value;
  };

  /**
   * Returns the led id of the Dwenguino board based on the id of the canvas.
   */
  getLedId(i) {
    var id = 0;
    if (i < 9) {
      id = i - 1;
    } else {
      id = 13;
    }
    return id;
  }

  /**
   * Changes the color of led canvas i to the given color.
   */
  setLedColor(i, color) {
    var ledCanvasId = 'sim_led_canvas' + i;
    this.robot[ledCanvasId].onColor = color;
  }

  /**
   * Change the state of ith servo canvas to the specified state.
   */
  setServoState(i, state) {
    var servoCanvasId = 'sim_servo_canvas' + i;
    this.robot[servoCanvasId].state = state;

    switch (state) {
      case StatesEnum.PLAIN:
        this.renderer.clearCanvas(servoCanvasId);
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        this.robot[servoCanvasId].image.src = this.robot.imgServo;
        this.robot[servoCanvasId].width = 100;
        this.robot[servoCanvasId].height = 50;
        this.renderer.initializeCanvas(servoCanvasId, this.robot);
        break;
      case StatesEnum.EYE:
        this.renderer.clearCanvas(servoCanvasId);
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        this.robot[servoCanvasId].image.src = '';
        this.robot[servoCanvasId].width = 35;
        this.robot[servoCanvasId].height = 35;
        this.renderer.initializeCanvas(servoCanvasId, this.robot);
        break;
      case StatesEnum.RIGHTHAND:
        this.renderer.clearCanvas(servoCanvasId);
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        this.robot[servoCanvasId].image.src = this.robot.imgRightHand;
        this.robot[servoCanvasId].width = 64;
        this.robot[servoCanvasId].height = 149;
        document.getElementById(servoCanvasId).classList.add('hand_canvas');
        this.renderer.initializeCanvas(servoCanvasId, this.robot);
        break;
      case StatesEnum.LEFTHAND:
        this.renderer.clearCanvas(servoCanvasId);
        document.getElementById(servoCanvasId).classList.remove('hand_canvas');
        this.robot[servoCanvasId].image.src = this.robot.imgLeftHand;
        this.robot[servoCanvasId].width = 64;
        this.robot[servoCanvasId].height = 149;
        document.getElementById(servoCanvasId).classList.add('hand_canvas');
        this.renderer.initializeCanvas(servoCanvasId, this.robot);
        break;
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
    for (const [type, t] of Object.entries(TypesEnum)) {
      for (var i = 1; i <= this.robot.numberOf[t]; i++) {
        data = data.concat("<Item ");
        data = data.concat(" Type='", t, "'");
        let simId = '#sim_' + t + i;
        data = data.concat(" Id='", simId, "'");
        let canvasId = 'sim_' + t + '_canvas' + i;
        data = data.concat(" CanvasId='", canvasId, "'");
        let leftOffset = 0;
        if ($(simId).attr('data-x')) {
          leftOffset = parseFloat(this.robot[canvasId].offset['left']) + parseFloat($(simId).attr('data-x'));
        } else {
          leftOffset = parseFloat(this.robot[canvasId].offset['left']);
        }

        let topOffset = 0;
        if ($(simId).attr('data-y')) {
          topOffset = parseFloat(this.robot[canvasId].offset['top']) + parseFloat($(simId).attr('data-y'));
        } else {
          topOffset = parseFloat(this.robot[canvasId].offset['top']);
        }

        data = data.concat(" OffsetLeft='", leftOffset, "'");
        data = data.concat(" OffsetTop='", topOffset, "'");

        if (t === TypesEnum.LED) {
          data = data.concat(" OnColor='", this.robot[canvasId].onColor, "'");
        } else if (t === TypesEnum.SERVO) {
          data = data.concat(" State='", this.robot[canvasId].state, "'");
          data = data.concat(" Width='", this.robot[canvasId].width, "'");
          data = data.concat(" Height='", this.robot[canvasId].height, "'");
          data = data.concat(" Image='", this.robot[canvasId].image.src, "'");
          data = data.concat(" Classes='", document.getElementById(canvasId).className, "'");
        } 
        data = data.concat('></Item>');
      }
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
      var type = xmlChild.getAttribute('Type');
      var offsetLeft = parseFloat(xmlChild.getAttribute('OffsetLeft'));
      var offsetTop = parseFloat(xmlChild.getAttribute('OffsetTop'));

      switch (type) {
        case TypesEnum.SERVO:
          var width = parseFloat(xmlChild.getAttribute('Width'));
          var height = parseFloat(xmlChild.getAttribute('Height'));
          var image = xmlChild.getAttribute('Image');
          var state = xmlChild.getAttribute('State');
          var classes = xmlChild.getAttribute('Classes');
          this.robotComponentsFactory.addServo(true, offsetLeft, offsetTop, state, width, height, image, classes);
          break;
        case TypesEnum.LED:
          var onColor = xmlChild.getAttribute('OnColor');
          this.robotComponentsFactory.addLed(true, offsetLeft, offsetTop, onColor);
          break;
        case TypesEnum.PIR:
          this.robotComponentsFactory.addPir(true, offsetLeft, offsetTop);
          break;
        case TypesEnum.SONAR:
          this.robotComponentsFactory.addSonar(true, offsetLeft, offsetTop);
          break;
        case TypesEnum.LCD:
          this.robotComponentsFactory.addLcd(true, offsetLeft, offsetTop);
          break;
      }
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