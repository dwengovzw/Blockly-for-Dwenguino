/*
 * This Object is the abstraction of the riding robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 */
function DwenguinoSimulationScenarioRidingRobot(){
  if (!(this instanceof DwenguinoSimulationScenarioRidingRobot)){
    return new DwenguinoSimulationScenarioRidingRobot();
  }
  //call super prototype
  DwenguinoSimulationScenario.call(this);
  //init robot state
  this.initSimulationState();

}

/* @brief Initializes the simulator robot.
 * This resets the simulation state.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioRidingRobot.prototype.initSimulationState = function(containerIdSelector){
  // init superclass
   DwenguinoSimulationScenario.prototype.initSimulationState.call(this);
   //init robot state
   this.robot = {
     image: {
       width: 50,
       height: 40
     },
     start: {
       x: 100,
       y: 100,
       angle: 0
     },
     position: {
       x: 100,
       y: 100,
       angle: 0
     },
     collision: [{
       type: 'circle',
       radius: 25
     }]
   };
   this.containerWidth = 0;
   this.containerHeight = 0;

 }

/* @brief Initializes the simulator robot display.
 * This function puts all the nececary visuals inside the container with the id containerId.
 * Additionally, it sets up the state of the simulated robot.
 * The function also resets the internal state of the simulation so the display is initialized from its original position.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioRidingRobot.prototype.initSimulationDisplay = function(containerIdSelector){
  // init superclass
   DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

   // Reset the simulation state
   this.initSimulationState();

   //Init the display elements
   var container = $(containerIdSelector);
   var simulationContainer = $("<div>").attr("id", "sim_container");

   //Add resize listerner to the conainer and update width and height accordingly
   var self = this;
   new ResizeSensor(simulationContainer, function() {
      console.log('myelement has been resized');
      self.containerWidth = simulationContainer.width();
      self.containerHeight = simulationContainer.height();
  });

   var animationSprite = $("<div>").attr("id", "sim_animation");


   simulationContainer.append(animationSprite);
   container.empty();
   container.append(simulationContainer);

   // Set new element styles
   $(containerIdSelector).css("position", "relative")

   $("#sim_container")
    .css("position", "relative")
    .css("width", "100%")
    .css("height", "100%")
    .css("box-sizing", "border-box");

   $("#sim_animation")
    .css("width", this.robot.image.width + "px")
    .css("height", this.robot.image.height + "px")
    .css("maring-left", "-25px")
    .css("maring-right", "-20px")
    .css("position", "absolute")
    .css("background-image", "url('DwenguinoIDE/img/board/robot.png')")
    .css("background-size", "100%")
    .css('top', this.robot.position.y + 'px')
    .css('left', this.robot.position.x + 'px');

    //Save the dimensions of the container
    this.containerWidth = simulationContainer.width();
    this.containerHeight = simulationContainer.height();
};

/* @brief updates the simulation state and display
 * This function updates the simulation state and display using the supplied board state.
 *
 * @param boardState The state of the Dwenguino board.
 * @return The updated Dwenguino board state.
 *
 */
DwenguinoSimulationScenarioRidingRobot.prototype.updateScenario = function(dwenguinoState){
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
DwenguinoSimulationScenarioRidingRobot.prototype.updateScenarioState = function(dwenguinoState){
  DwenguinoSimulationScenario.prototype.updateScenarioState.call(this, dwenguinoState);
  var speed1 = dwenguinoState.motorSpeeds[0];
  var speed2 = dwenguinoState.motorSpeeds[1];


  // Save the current state of the robot into local variables.
  var x = this.robot.position.x;
  var y = this.robot.position.y;
  var angle = this.robot.position.angle;

  // decide on angle (in deg) and distance (in px) based on 2 motor speeds
  var distance = (speed1 + speed2) / 100;

  if (speed1 !== speed2) {
    angle += (speed2 - speed1) / 30;
  }

  x += distance * Math.cos(Math.PI / 180 * angle);
  y += distance * Math.sin(Math.PI / 180 * angle);

  // move to other side of frame if out of frame
  if (x > this.containerWidth){
    x = 0;
  }else if (x < 0){
    x = this.containerWidth;
  }
  if (y > this.containerHeight){
    y = 0;
  } else if (y < 0) {
    y = this.containerHeight;
  }
  this.robot.position = {
    x: x,
    y: y,
    angle: angle
  };

  return dwenguinoState;
};

/* @brief updates the simulation display
 * This function updates the simulation display using the supplied board state.
 *
 * @param boardState The state of the Dwenguino board.
 *
 */
DwenguinoSimulationScenarioRidingRobot.prototype.updateScenarioDisplay = function(dwenguinoState){
  DwenguinoSimulationScenario.prototype.updateScenarioDisplay.call(this, dwenguinoState);

  var robot = this.robot;
  var $robot = $('#sim_animation');

  // Update field size
  this.containerWidth = $("#sim_container").width();
  this.containerHeight = $("#sim_container").height();

  $robot
  .css('top', this.robot.position.y + 'px')
  .css('left', this.robot.position.x + 'px')
  .css('transform', 'rotate(' + this.robot.position.angle + 'deg)');
};
