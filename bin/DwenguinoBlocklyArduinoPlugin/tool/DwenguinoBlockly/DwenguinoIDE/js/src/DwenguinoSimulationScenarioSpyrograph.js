/*
 * This Object is the abstraction of the spyrograph simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 */
function DwenguinoSimulationScenarioSpyrograph(){
  if (!(this instanceof DwenguinoSimulationScenarioSpyrograph)){
    return new DwenguinoSimulationScenarioSpyrograph();
  }
  //call super prototype
  DwenguinoSimulationScenario.call(this);

}

/* @brief Initializes the simulator robot.
 * This resets the simulation state.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioSpyrograph.prototype.initSimulationState = function(containerIdSelector){
   // init superclass
   DwenguinoSimulationScenario.prototype.initSimulationState.call(this);

   if (!this.matterContainer){
     this.initSimulationDisplay();
   }

   var Engine = Matter.Engine,
   Render = Matter.Render,
   Runner = Matter.Runner,
   Composites = Matter.Composites,
   Common = Matter.Common,
   MouseConstraint = Matter.MouseConstraint,
   Mouse = Matter.Mouse,
   Vector = Matter.Vector,
   Vertices = Matter.Vertices,
   World = Matter.World,
   Composite = Matter.Composite,
   Constraint = Matter.Constraint,
   Bodies = Matter.Bodies,
   Body = Matter.Body;

   if (this.engine){
     World.clear(this.engine.world);
     Engine.clear(this.engine);
   }

   // create engine
   var engine = Engine.create()
   var world = engine.world;
   this.engine = engine;

   //set gravity to zero
   engine.world.gravity.y = 0;

   // create renderer
   var render = Render.create({
     element: document.getElementById("sim_container"),
     engine: engine,
     options: {
       width: Math.min(this.containerWidth, 800),
       height: Math.min(this.containerHeight, 600),
       showAngleIndicator: true
     }
   });

   Render.run(render);

   // create runner
   var runner = Runner.create();
   Runner.run(runner, engine);

   var spyrographGroup = Body.nextGroup(true);
   var spyrograph = Composite.create({label: "spyrograph"});


   // Create the rigid body elements the spyrograph is made up of.
   var rect1 = Bodies.rectangle(250, 300, 400, 20, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});

   var rect2 = Bodies.rectangle(250, 300, 20, 400, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});

   var rect3 = Bodies.rectangle(350, 100, 200, 20, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});

   var rect4 = Bodies.rectangle(450, 175, 20, 250, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});

   var motor1 = Bodies.circle(25, 300, 25, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});
   var motor2 = Bodies.circle(250, 525, 25, {friction: 0, density: 1, collisionFilter: {group: spyrographGroup}});
   this.motor1 = motor1;
   this.motor2 = motor2;

   // Create constraints on rigid objects
   var hinge1 = Constraint.create({
     bodyA: rect1,
     pointA: {
       x: 250 - rect1.position.x,
       y: 300 - rect1.position.y
     },
     bodyB: rect2,
     pointB:{
       x: 250 - rect2.position.x,
       y: 300 - rect2.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var hinge2 = Constraint.create({
     bodyA: rect2,
     pointA: {
       x: 250 - rect2.position.x,
       y: 100 - rect2.position.y
     },
     bodyB: rect3,
     pointB:{
       x: 250 - rect3.position.x,
       y: 100 - rect3.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var hinge3 = Constraint.create({
     bodyA: rect3,
     pointA: {
       x: 450 - rect3.position.x,
       y: 100 - rect3.position.y
     },
     bodyB: rect4,
     pointB:{
       x: 450 - rect4.position.x,
       y: 100 - rect4.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var hinge4 = Constraint.create({
     bodyA: rect4,
     pointA: {
       x: 450 - rect4.position.x,
       y: 300 - rect4.position.y
     },
     bodyB: rect1,
     pointB:{
       x: 450 - rect1.position.x,
       y: 300 - rect1.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var hinge5 = Constraint.create({
     bodyA: rect1,
     pointA: {
       x: 50 - rect1.position.x,
       y: 300 - rect1.position.y
     },
     bodyB: motor1,
     pointB:{
       x: 25,
       y: 0
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var hinge6 = Constraint.create({
     bodyA: rect2,
     pointA: {
       x: 250 - rect2.position.x,
       y: 500 - rect2.position.y
     },
     bodyB: motor2,
     pointB:{
       x: 0,
       y: -25
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var axel1 = Constraint.create({
     bodyA: motor1,
     pointB: {
       x: motor1.position.x,
       y: motor1.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   var axel2 = Constraint.create({
     bodyA: motor2,
     pointB: {
       x: motor2.position.x,
       y: motor2.position.y
     },
     stiffness: 1,
     length: 0,
     render: {
       lineWidth: 0
     },
     friction: 0
   });

   // Add the rigid bodies and constraints to a composite body
   Composite.addBody(spyrograph, rect1);
   Composite.addBody(spyrograph, rect2);
   Composite.addBody(spyrograph, rect3);
   Composite.addBody(spyrograph, rect4);
   Composite.addBody(spyrograph, motor1);
   Composite.addBody(spyrograph, motor2);
   Composite.addConstraint(spyrograph, hinge1);
   Composite.addConstraint(spyrograph, hinge2);
   Composite.addConstraint(spyrograph, hinge3);
   Composite.addConstraint(spyrograph, hinge4);
   Composite.addConstraint(spyrograph, hinge5);
   Composite.addConstraint(spyrograph, hinge6);
   Composite.addConstraint(spyrograph, axel1);
   Composite.addConstraint(spyrograph, axel2);

   var bodies = Composite.allBodies(spyrograph);
   for (var i = 0 ; i < bodies.length ; i++){
     this.removePartFriction(bodies[i]);
   }

   // Add the composite body to the world
   World.add(world, spyrograph);

   // fit the render viewport to the scene
   Render.lookAt(render, {
     min: {
       x: 0,
       y: 0
     },
     max: {
       x: 800,
       y: 600
     }
   });


 }
DwenguinoSimulationScenarioSpyrograph.prototype.removePartFriction = function(part){
  part.friction = 0;
  part.mass = 0.0001;
  part.inertia = 0.0001;
  part.density = 0.0001;
  //part.inverseMass = part.inverseInertia = Infinity;
  part.frictionAir = 0;
}


/* @brief Initializes the simulator robot display.
 * This function puts all the nececary visuals inside the container with the id containerId.
 * Additionally, it sets up the state of the simulated robot.
 * The function also resets the internal state of the simulation so the display is initialized from its original position.
 *
 * @param containerIdSelector The jquery selector of the conainer to put the robot display.
 *
 */
DwenguinoSimulationScenarioSpyrograph.prototype.initSimulationDisplay = function(containerIdSelector){
  // init superclass
   DwenguinoSimulationScenario.prototype.initSimulationDisplay.call(this);

   //Init the display elements
   var container = $(containerIdSelector);
   this.matterContainer = $("<div>").attr("id", "sim_container");


   //Add resize listerner to the conainer and update width and height accordingly
   var self = this;
   new ResizeSensor(this.matterContainer, function() {
      console.log('myelement has been resized');
      self.containerWidth = this.matterContainer.width();
      self.containerHeight = this.matterContainer.height();
  });

  // Append to container
  container.empty();
  container.append(this.matterContainer);

  // set container layout props
  $("#sim_container")
   .css("position", "relative")
   .css("width", "100%")
   .css("height", "100%")
   .css("box-sizing", "border-box");

   // Save width and height
   this.containerWidth = this.matterContainer.width();
   this.containerHeight = this.matterContainer.height();


  this.initSimulationState();

};

/* @brief updates the simulation state and display
 * This function updates the simulation state and display using the supplied board state.
 *
 * @param boardState The state of the Dwenguino board.
 * @return The updated Dwenguino board state.
 *
 */
DwenguinoSimulationScenarioSpyrograph.prototype.updateScenario = function(dwenguinoState){
  DwenguinoSimulationScenario.prototype.updateScenario.call(this, dwenguinoState);
  Matter.Body.setAngularVelocity(this.motor1, dwenguinoState.motorSpeeds[0]/500);
  Matter.Body.setAngularVelocity(this.motor2, dwenguinoState.motorSpeeds[1]/500);
  return dwenguinoState;
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
DwenguinoSimulationScenarioSpyrograph.prototype.updateScenarioState = function(dwenguinoState){
  DwenguinoSimulationScenario.prototype.updateScenarioState.call(this, dwenguinoState);
  // empty, not used
};

/* @brief updates the simulation display
 * This function updates the simulation display using the supplied board state.
 *
 * @param boardState The state of the Dwenguino board.
 *
 */
DwenguinoSimulationScenarioSpyrograph.prototype.updateScenarioDisplay = function(dwenguinoState){
  DwenguinoSimulationScenario.prototype.updateScenarioDisplay.call(this, dwenguinoState);
  // empty, not used
};
