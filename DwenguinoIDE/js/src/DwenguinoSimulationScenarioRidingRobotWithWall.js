/*
 * This Object is the abstraction of the riding robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 */
function DwenguinoSimulationScenarioRidingRobotWithWall(){
  if (!(this instanceof DwenguinoSimulationScenarioRidingRobotWithWall)){
    return new DwenguinoSimulationScenarioRidingRobotWithWall();
  }
  //call super prototype
  DwenguinoSimulationScenarioRidingRobot.call(this);
  //init robot state
  this.initSimulationState();

}

/* @brief Initializes the simulator robot.
 * This resets the simulation state.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioRidingRobotWithWall.prototype.initSimulationState = function(containerIdSelector){
  // init superclass
   DwenguinoSimulationScenarioRidingRobot.prototype.initSimulationState.call(this, containerIdSelector);
 }

/* @brief Initializes the simulator robot display.
 * This function puts all the nececary visuals inside the container with the id containerId.
 * Additionally, it sets up the state of the simulated robot.
 * The function also resets the internal state of the simulation so the display is initialized from its original position.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioRidingRobotWithWall.prototype.initSimulationDisplay = function(containerIdSelector){
  // init superclass
   DwenguinoSimulationScenarioRidingRobot.prototype.initSimulationDisplay.call(this, containerIdSelector);

   // Add a border to the container
   $("#sim_container")
    .css("border", "solid")
    .css("border-width", "3px")
    .css("border-color", "black")
    .css("max-width", "80%")
    .css("max-height", "80%")
    .css("top", "10%")
    .css("left", "10%")
    .css("right", "10%")
    .css("bottom", "10%");

    // Save the new container dimensions
    this.containerWidth = $("#sim_container").width();
    this.containerHeight = $("#sim_container").height();

};

/* @brief updates the simulation state and display
 * This function updates the simulation state and display using the supplied board state.
 *
 * @param boardState The state of the Dwenguino board.
 * @return The updated Dwenguino board state.
 *
 */
DwenguinoSimulationScenarioRidingRobotWithWall.prototype.updateScenario = function(dwenguinoState){
  return DwenguinoSimulationScenarioRidingRobot.prototype.updateScenario.call(this, dwenguinoState);
;
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
DwenguinoSimulationScenarioRidingRobotWithWall.prototype.updateScenarioState = function(dwenguinoState){
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
    angle += ((speed2 - speed1) / 30)%360;
  }

  x += distance * Math.cos(Math.PI / 180 * angle);
  y += distance * Math.sin(Math.PI / 180 * angle);

  // move to other side of frame if out of frame
  if (x > this.containerWidth - this.robot.image.width){
    x = this.containerWidth - this.robot.image.width;
  }else if (x < 0){
    x = 0;
  }
  if (y > this.containerHeight - this.robot.image.height){
    y = this.containerHeight - this.robot.image.height;
  } else if (y < 0) {
    y = 0;
  }

  // Calulate distance to wall
  //calculate distance between front of car and wall

  var xMiddle = x;
  var yMiddle = y;

  var xFront = xMiddle + (this.robot.image.width/2) * Math.cos(Math.PI / 180 * angle);
  var yFront = yMiddle + (this.robot.image.width/2) * Math.sin(Math.PI / 180 * angle);

  // coordinates of line
  lineX = 0;
  lineY = 0;
  var angle = ((this.robot.position.angle % 360)+360)%360;
  if (angle <= 180) {
    lineY = this.containerHeight;
  }
  if (angle <= 90 || angle >= 270) {
    lineX = this.containerWidth;
  }
  angle = this.robot.position.angle;

  var distanceX = Math.cos(Math.PI / 180 * angle) !== 0? (lineX-xFront)/(Math.cos(Math.PI / 180 * angle)) : this.containerWidth*2;
  var distanceY = Math.sin(Math.PI / 180 * angle) !== 0? (lineY-yFront)/(Math.sin(Math.PI / 180 * angle)) : this.containerHeight*2;

  dwenguinoState.sonarDistance = parseInt(distanceX < distanceY? distanceX/2 : distanceY/2);

  console.log(dwenguinoState.sonarDistance);

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
DwenguinoSimulationScenarioRidingRobotWithWall.prototype.updateScenarioDisplay = function(dwenguinoState){
  DwenguinoSimulationScenarioRidingRobot.prototype.updateScenarioDisplay.call(this, dwenguinoState);

  /*var robot = this.robot;
  var $robot = $('#sim_animation');

  // Update field size
  this.containerWidth = $("#sim_container").width();
  this.containerHeight = $("#sim_container").height();

  $robot
  .css('top', this.robot.position.y + 'px')
  .css('left', this.robot.position.x + 'px')
  .css('transform', 'rotate(' + this.robot.position.angle + 'deg)');*/
};
