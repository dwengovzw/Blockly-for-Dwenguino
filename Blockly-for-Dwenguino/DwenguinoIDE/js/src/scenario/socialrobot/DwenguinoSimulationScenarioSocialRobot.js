
/*
 * This Object is the abstraction of the social robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 *
 */
function DwenguinoSimulationScenarioSocialRobot(){
    if (!(this instanceof DwenguinoSimulationScenarioSocialRobot)){
      return new DwenguinoSimulationScenarioSocialRobot();
    }

    DwenguinoSimulationScenario.call(this);

    this.initSimulationState();
  }
  
  /* @brief Initializes the simulator robot.
   * This resets the simulation state.
   *
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationState = function(containerIdSelector){
    // init superclass
    DwenguinoSimulationScenario.prototype.initSimulationState.call(this);

    this.renderer = new SimulationCanvasRenderer();

    this.scenarioUtils = new DwenguinoScenarioUtils(this);

    //Init robot state
    this.initSocialRobot();
    this.robotComponentsFactory = new RobotComponentsFactory(this.robot, this.scenarioUtils);

    this.setSensorOptions();
    this.setBackground();

    this.scenarioUtils.contextMenuBackground();

    // Load robot components from local storage if they are present
    this.checkLocalStorage();
    
   }
  
  /* @brief Initializes the simulator social robot display.
   * @param containerIdSelector The jquery selector of the conainer to put the robot display.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulationDisplay = function(containerIdSelector){
    // init superclass
    DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

    this.renderer.render(this.robot);

    var self = this;
    $("#sim_stop").click(function() {
      let timer = setTimeout(() => {
        self.resetSocialRobot();
        self.renderer.render(self.robot);
      }, 500);
    });

    this.initScenarioOptions();
  }

  DwenguinoSimulationScenarioSocialRobot.prototype.initScenarioOptions = function(){
    var self = this;

    var scenarioOptions = $("<div>").attr("id", "scenario_options");
    $('#sim_container').append(scenarioOptions);
    scenarioOptions.append("<div id='load_scenario' class='glyphicon glyphicon-cloud-upload' alt='Load'></div>");
    scenarioOptions.append("<div id='save_scenario' class='glyphicon glyphicon-cloud-download' alt='Save'></div>");

    $("#load_scenario").click(function(){
      self.scenarioUtils.loadScenario();
    });

    $("#save_scenario").click(function(){
      var data = self.loadToXml();
      self.scenarioUtils.saveScenario(data);
    });

  }

  DwenguinoSimulationScenarioSocialRobot.prototype.initSimulation = function(containerIdSelector) {
    
    console.log("init simulation display");

    // Make the bottom pane larger
    $('#db_simulator_top_pane').css('height', '35%');
    $('#db_simulator_bottom_pane').css('height', '65%');

    // Load the simulation container
    var container = $(containerIdSelector);
    var simulationContainer = $("<div>").attr("id", "sim_container");

    // Add resize listerner to the conainer and update width and height accordingly
    var self = this;
    new ResizeSensor(simulationContainer, function() {
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
    });

    container.empty();
    container.append(simulationContainer);

    // TODO implemnt change of background image
    // var backgroundCanvasId = 'sim_background';
    // this.robot[backgroundCanvasId] = {};
    // this.robot[backgroundCanvasId].offset = {'left': 0, 'top': 0};
    // this.robot[backgroundCanvasId].image = new Image();
    // this.robot[backgroundCanvasId].image.src = this.robot.imgRobot;

    // Reset the simulation state
    this.initSimulationState();

  }

  
  /* @brief updates the simulation state and display
   * This function updates the simulation state and display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   * @return The updated Dwenguino board state.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenario = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenario.call(this, dwenguinoState);
    var newScenarioState = this.updateScenarioState(dwenguinoState);
    this.updateScenarioDisplay(dwenguinoState);
    return newScenarioState;
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
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenarioState = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenarioState.call(this, dwenguinoState);

    for(var i = 0; i < dwenguinoState.leds.length; i++){
      var ledCanvasId = 'sim_led_canvas' + (i+1);
      if(this.robot[ledCanvasId] !== undefined){
        this.robot[ledCanvasId].state = dwenguinoState.leds[i];
      }
    }

    for(var i = 0; i < dwenguinoState.servoAngles.length; i++){
      var servoCanvasId = 'sim_servo_canvas' + (i+1);
      if(this.robot[servoCanvasId] !== undefined){
        if(this.robot[servoCanvasId].angle != dwenguinoState.servoAngles[i]){
          this.robot[servoCanvasId].prevAngle = this.robot[servoCanvasId].angle;
          this.robot[servoCanvasId].angle = dwenguinoState.servoAngles[i];
        }   
      }
    }

    return dwenguinoState;
  };
  
  /* @brief updates the simulation display
   * This function updates the simulation display using the supplied board state.
   *
   * @param boardState The state of the Dwenguino board.
   *
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.updateScenarioDisplay = function(dwenguinoState){
    DwenguinoSimulationScenario.prototype.updateScenarioDisplay.call(this, dwenguinoState);
    this.renderer.render(this.robot);
  };

  /* @brief Initializes the social robot state.
   * 
   */
  DwenguinoSimulationScenarioSocialRobot.prototype.initSocialRobot = function(containerIdSelector){
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
    
    for (const [type, t] of Object.entries(TypesEnum)) {
      this.robot.numberOf[t] = 0;
    }
 };

 DwenguinoSimulationScenarioSocialRobot.prototype.setSensorOptions = function(){
  if(!document.getElementById('sensor_options')){
    var sensorOptions = $("<div>").attr("id", "sensor_options");
    $('#sim_container').append(sensorOptions);
  }
 }

 DwenguinoSimulationScenarioSocialRobot.prototype.setBackground = function(){
   console.log('set background');
   $('#sim_container').append("<div id='sim_background' class='sim_element'></div>");
    $('#sim_background').append("<div id='sim_background_img'></div>");
    var sensorOptionswidth = $('#sensor_options').width();
    var parentWidth = $('#sim_background').width() - sensorOptionswidth;
    var width = $('#sim_background_img').width();
    var offSet = ( parentWidth - width ) / 2;
    $('#sim_background_img').css('top', 0 + 'px');
    $('#sim_background_img').css('margin-left', offSet + 'px'); 
 };

 /**
  * Resets the robot components of the simulation container to their initial state. This function doesn't
  * remove the components from the container or move them around, but merely puts them in their initial off state.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.resetSocialRobot = function(containerIdSelector){
    for(var i = 1; i <= this.robot.numberOf[TypesEnum.SERVO]; i++){
      var servoCanvasId = 'sim_servo_canvas' + i;
      this.robot[servoCanvasId].x = 0;
      this.robot[servoCanvasId].y = 30;
      this.robot[servoCanvasId].angle = 0;
      this.robot[servoCanvasId].prevAngle = 0;
    }

    for(var i = 1; i <= this.robot.numberOf[TypesEnum.LED]; i++){
      var ledCanvasId = 'sim_led_canvas' + i;
      this.robot[ledCanvasId].x = 0;
      this.robot[ledCanvasId].y = 0;
      this.robot[ledCanvasId].state = 0;
    }

    for(var i = 1; i <= this.robot.numberOf[TypesEnum.PIR]; i++){
      var pirCanvasId = 'sim_pir_canvas' + i;
      this.robot[pirCanvasId].state = 0;
    }

    if(this.robot.numberOf[TypesEnum.LCD] != 0){
      DwenguinoSimulation.clearLcd();
    }
 };

 /**
  * Add a robot component of the specified type to the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.addRobotComponent = function(type){
   this.robotComponentsFactory.addRobotComponent(type);
 };

 /**
  * Remove the lastly created robot component of the specified type from the simulation container.
  */
 DwenguinoSimulationScenarioSocialRobot.prototype.removeRobotComponent = function(type){
   this.robotComponentsFactory.removeRobotComponent(type);
   this.renderer.render(this.robot);
 };

/**
 * Change the object distance of the sonar sensor in the simulation container
 */
DwenguinoSimulationScenarioSocialRobot.prototype.changeSonarDistance = function(value, id){
  var sliderValue = 'slider' + id + '_value';
  document.getElementById(sliderValue).innerHTML = value + ' cm';
  DwenguinoSimulation.board.sonarDistance = value;
};

/**
 * Returns the led id of the Dwenguino board based on the id of the canvas.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.getLedId = function(i){
  var id = 0;
  if(i < 9){
    id = i-1;
  } else {
    id = 13;
  }
  return id;
}

/**
 * Changes the color of led canvas i to the given color.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.setLedColor = function(i, color){
  var ledCanvasId = 'sim_led_canvas' + i;
  this.robot[ledCanvasId].onColor = color;
}

/**
 * Change the state of ith servo canvas to the specified state.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.setServoState = function(i, state){
  var servoCanvasId = 'sim_servo_canvas' + i;
  this.robot[servoCanvasId].state = state;

  switch(state){
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
 * Checks if the scenario was saved in the local storage. If this is the 
 * case, the saved components are loaded into the simulation container.
 * This function will be called when the social robot scenario is added to the list of scenarios.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.checkLocalStorage = function(){
  this.setSensorOptions();

  console.log('sim container', $('#sim_container'));
  
  if (window.localStorage) {
    var localStorage = window.localStorage;

    if(localStorage.getItem('socialRobotScenario')){

      for (const [type, t] of Object.entries(TypesEnum)) {
        var elements = localStorage.getItem(t);
        if(elements != null){
          elements = elements.split('+').map(e => e.split(','));
          for(var i = 0; i < elements.length-1; i++){
            switch(t) {
              case TypesEnum.SERVO:
                this.robotComponentsFactory.addServo(false,elements[i][2], elements[i][3], elements[i][4], parseFloat(elements[i][5]), parseFloat(elements[i][6]), elements[i][7], elements[i][8]);
                break;
              case TypesEnum.LED:
                this.robotComponentsFactory.addLed(false,elements[i][2], elements[i][3], elements[i][4]);
                break;
              case TypesEnum.PIR:
                this.robotComponentsFactory.addPir(false,elements[i][2], elements[i][3]);
                break;
              case TypesEnum.SONAR:
                this.robotComponentsFactory.addSonar(false, elements[i][2], elements[i][3]);
                break;
              case TypesEnum.LCD:
                this.robotComponentsFactory.addLcd(false, elements[i][2], elements[i][3]);
                break;
            }
            DwenguinoSimulationRobotComponentsMenu.changeValue(t,1); 
          }
        }
      }
    }
  }
}

/**
 * Displays the robot components that were instantiated from the local storage. 
 * Additionally it triggers saveRobotComponents to periodically save the current scenario
 * state in the local storage.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadRobotComponents = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    if(localStorage.getItem('socialRobotScenario')){
      for (const [type, t] of Object.entries(TypesEnum)) {
        for(var i = 1; i <= self.robot.numberOf[t]; i++){
          $('#sim_' + t + i ).css('visibility', 'visible');
        }
      }

      this.saveRobotComponents();

    } else {
      // from now save current state
      this.saveRobotComponents();
    }
  }
}

/**
 * Periodically saves the current robot components to the local storage,
 * so that when the page gets refreshed they can be reloaded.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.saveRobotComponents = function(){
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var self = this;

    try {

      // Set the interval and autosave every second
      setInterval(function() {
        localStorage.setItem('socialRobotScenario', 'saved');
        for (const [type, t] of Object.entries(TypesEnum)) {
          var saveState = '';
          
          for(var i = 1; i <= self.robot.numberOf[t]; i++){
            var simId = '#sim_' + t + i;
            var canvasId = 'sim_' + t + '_canvas' + i;
            var leftOffset = 0;
            if($(simId).attr('data-x')){
              leftOffset = parseFloat(self.robot[canvasId].offset['left']) + parseFloat($(simId).attr('data-x'));
            } else {
              leftOffset = parseFloat(self.robot[canvasId].offset['left']);
            }

            var topOffset = 0;
            if($(simId).attr('data-y')){
              topOffset = parseFloat(self.robot[canvasId].offset['top']) + parseFloat($(simId).attr('data-y'));
            } else {
              topOffset = parseFloat(self.robot[canvasId].offset['top']);
            }

            if(t === TypesEnum.LED){
              var onColor = self.robot[canvasId].onColor;
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset,",",onColor, "+");  
            } else if(t === TypesEnum.SERVO) {
              var width = parseFloat(self.robot[canvasId].width);
              var height = parseFloat(self.robot[canvasId].height);
              var image = self.robot[canvasId].image.src;
              var state = self.robot[canvasId].state;
              var classes = document.getElementById(canvasId).className;
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset, ",", state, ",", width, ",", height, ",", image, ",", classes, "+");
            } else {
              saveState = saveState.concat("sim_" + t,i,",", "sim_"+ t + "_canvas",i,",",leftOffset,",",topOffset, "+");
            }         
          }
          localStorage.setItem(t, saveState);
        }
      }, 1000);

    } catch (e) {

      if (e == QUOTA_EXCEEDED_ERR) {
        alert('Quota exceeded!');
      }
    }

  } else {
    console.log("No local storage");
  }
}

/*********************
 *  XML HANDLING     *
 ********************/

/**
 * Writes the current scenario state to an Xml document and return it.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadToXml = function(){
  var data = '<xml xmlns="http://www.w3.org/1999/xhtml">';
  if (window.localStorage) {
    var localStorage = window.localStorage;
    var canvasId = '';
    if(localStorage.getItem('socialRobotScenario')){

      for (const [type, t] of Object.entries(TypesEnum)) {
        var elements = localStorage.getItem(t);
        elements = elements.split('+').map(e => e.split(','));
        for(var i = 0; i < elements.length-1; i++){
          canvasId = elements[i][1];
          data = data.concat("<Item ");
          data = data.concat(" Type='", t, "'");
          data = data.concat(" Id='",elements[i][0], "'");
          data = data.concat(" CanvasId='",elements[i][1], "'");
          data = data.concat(" OffsetLeft='",elements[i][2], "'");
          data = data.concat(" OffsetTop='",elements[i][3], "'");
          if(t === TypesEnum.SERVO){
            data = data.concat(" State='", elements[i][4], "'");
            data = data.concat(" Width='", elements[i][5], "'");
            data = data.concat(" Height='", elements[i][6], "'"); 
            data = data.concat(" Image='", elements[i][7], "'");
            data = data.concat(" Classes='", elements[i][8], "'");
          }
          if(t === TypesEnum.LED){
            data = data.concat(" OnColor='",elements[i][4], "'");
          }
          data = data.concat('></Item>');
        }
      }
    }
  }
  data = data.concat('</xml>');
  return data;
}

/**
 * Loads the current xml document and adds the specified robot components
 * to the simulation container. It immediately displays the components on the screen.
 */
DwenguinoSimulationScenarioSocialRobot.prototype.loadFromXml = function(){
  this.initSocialRobot();
  var container = document.getElementById("sim_container");
  var elements = container.getElementsByClassName("sim_element");
  DwenguinoSimulationRobotComponentsMenu.resetButtons();

  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }

  this.setSensorOptions();
  this.setBackground();

  var data = this.scenarioUtils.textToDom(this.xml);

  var childCount = data.childNodes.length;
  for (var i = 0; i < childCount; i++) {
    var xmlChild = data.childNodes[i];
    var type = xmlChild.getAttribute('Type');
    var offsetLeft = parseFloat(xmlChild.getAttribute('OffsetLeft'));
    var offsetTop = parseFloat(xmlChild.getAttribute('OffsetTop'));

    switch(type) {
      case TypesEnum.SERVO:
        var width = parseFloat(xmlChild.getAttribute('Width'));
        var height = parseFloat(xmlChild.getAttribute('Height'));
        var image = xmlChild.getAttribute('Image');
        var state = xmlChild.getAttribute('State');
        var classes = xmlChild.getAttribute('Classes');
        this.robotComponentsFactory.addServo(true,offsetLeft, offsetTop, state, width, height, image, classes);
        break;
      case TypesEnum.LED:
        var onColor = xmlChild.getAttribute('OnColor');
        this.robotComponentsFactory.addLed(true,offsetLeft, offsetTop, onColor);
        break;
      case TypesEnum.PIR:
        this.robotComponentsFactory.addPir(true,offsetLeft, offsetTop);
        break;
      case TypesEnum.SONAR:
        this.robotComponentsFactory.addSonar(true, offsetLeft, offsetTop);
        break;
    }
    DwenguinoSimulationRobotComponentsMenu.changeValue(type,1);
  }
}