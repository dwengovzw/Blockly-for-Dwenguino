/* global MSG, debugjs, Blockly, DwenguinoBlockly */

var DwenguinoSimulation = {
  board: {
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
  },

  isSimulationRunning: false,
  isSimulationPaused: false,
  speedDelay: 16,
  debuggingView: false,
  scenarios: ["default", "moving", "wall", "spyrograph"],
  scenarioView: "spyrograph",

  debugger: {
    debuggerjs: null,
    code: "",
    blocks: {
      lastBlocks: [null, null],
      lastColours: [-1, -1],
      blockMapping: {}
    }
  },
  spyrograph:{
    motor1: null,
    motor2: null,
    engine: null
  },
  field: {
    width: 200,
    height: 200,
    wallOffset: 25
  },
  robot: {
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
  },
  /*
  Initializes the matterjs environment.
  */
  initMatterJsEnvironment: function(){
    var matterContainer = document.getElementById("db_matterjs_pane");

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

    if (DwenguinoSimulation.spyrograph.engine){
      World.clear(DwenguinoSimulation.spyrograph.engine.world);
      Engine.clear(DwenguinoSimulation.spyrograph.engine);
    }

    // create engine
    engine = Engine.create(), world = engine.world;
    DwenguinoSimulation.spyrograph.engine = engine;

    //set gravity to zero
    engine.world.gravity.y = 0;

    // create renderer
    var render = Render.create({
      element: matterContainer,
      engine: engine,
      options: {
        width: Math.min(matterContainer.offsetWidth, 800),
        height: Math.min(matterContainer.offsetHeight, 600),
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
    DwenguinoSimulation.spyrograph.motor1 = motor1;
    DwenguinoSimulation.spyrograph.motor2 = motor2;

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
      DwenguinoSimulation.removePartFriction(bodies[i]);
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


  },

  removePartFriction:function(part){
    part.friction = 0;
    part.mass = 0.0001;
    part.inertia = 0.0001;
    part.density = 0.0001;
    //part.inverseMass = part.inverseInertia = Infinity;
    part.frictionAir = 0;
  },

  /*
  * Initializes the environment when loading page
  */
  setupEnvironment: function() {
    DwenguinoSimulation.initDwenguinoSimulation();
  },

  /*
  * inits the right actions to handle the simulation view
  */
  initDwenguinoSimulation: function() {
    //Add scenarios to the dropdown
    $("sim_scenario").empty();
    $.each(DwenguinoSimulation.scenarios, function(index, value){
      $("sim_scenario").append($("<option>").attr("id", "sim_scenario_" + value).attr("value", value));
    });

    // translation
    document.getElementById('sim_start').textContent = MSG.simulator['start'];
    document.getElementById('sim_stop').textContent = MSG.simulator['stop'];
    document.getElementById('sim_pause').textContent = MSG.simulator['pause'];
    document.getElementById('sim_step').textContent = MSG.simulator['step'];
    document.getElementById('sim_speedTag').textContent = MSG.simulator['speed'] + ":";

    document.getElementById('sim_speed_verySlow').textContent = MSG.simulator['speedVerySlow'];
    document.getElementById('sim_speed_slow').textContent = MSG.simulator['speedSlow'];
    document.getElementById('sim_speed_medium').textContent = MSG.simulator['speedMedium'];
    document.getElementById('sim_speed_fast').textContent = MSG.simulator['speedFast'];
    document.getElementById('sim_speed_veryFast').textContent = MSG.simulator['speedVeryFast'];
    document.getElementById('sim_speed_realTime').textContent = MSG.simulator['speedRealTime'];

    document.getElementById('sim_scenarioTag').textContent = MSG.simulator['scenario'] + ":";

    $.each(DwenguinoSimulation.scenarios, function(index, value){
      document.getElementById('sim_scenario_' + value).textContent = MSG.simulator['scenario_' + value];
    });

    document.getElementById('sim_components_select').textContent = MSG.simulator['components'] + ":";
    document.getElementById('servo1').textContent = MSG.simulator['servo'] + " 1";
    document.getElementById('servo2').textContent = MSG.simulator['servo'] + " 2";
    document.getElementById('motor1').textContent = MSG.simulator['motor'] + " 1";
    document.getElementById('motor2').textContent = MSG.simulator['motor'] + " 2";
    document.getElementById('sim_scope_name').textContent = MSG.simulator['scope'] + ":";
    document.getElementById('sim_sonar_distance').textContent = "Sonar " + MSG.simulator['distance'] + ":";
    document.getElementById('sonar_input').value = DwenguinoSimulation.board.sonarDistance;

    $("a[href$='#db_robot_pane']").text(MSG.simulator['scenario']);
    $("a[href$='#db_code_pane']").text(MSG.simulator['code']);

    // start/stop/pause
    $("#sim_start").click(function() {
      DwenguinoSimulation.setButtonsStart();
      // start
      if (!DwenguinoSimulation.isSimulationRunning && !DwenguinoSimulation.isSimulationPaused) {
        DwenguinoSimulation.isSimulationRunning = true;
        DwenguinoSimulation.startSimulation();
        // resume
      } else if (!DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.isSimulationPaused = false;
        DwenguinoSimulation.isSimulationRunning = true;
        DwenguinoSimulation.resumeSimulation();
      }
    });

    $("#sim_pause").click(function() {
      DwenguinoSimulation.isSimulationRunning = false;
      DwenguinoSimulation.isSimulationPaused = true;
      DwenguinoSimulation.setButtonsPause();
    });

    $("#sim_stop").click(function() {
      DwenguinoSimulation.isSimulationRunning = false;
      DwenguinoSimulation.isSimulationPaused = false;
      DwenguinoSimulation.setButtonsStop();
      DwenguinoSimulation.stopSimulation();
    });

    $("#sim_step").click(function() {
      DwenguinoSimulation.setButtonsStep();
      // step 1
      if (!DwenguinoSimulation.isSimulationPaused && !DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.startStepSimulation();
        DwenguinoSimulation.isSimulationPaused = true;
        // step n
      } else if (!DwenguinoSimulation.isSimulationRunning) {
        DwenguinoSimulation.isSimulationPaused = false;
        DwenguinoSimulation.oneStep();
        DwenguinoSimulation.isSimulationPaused = true;
      }
    });

    // jquery to create select list with checkboxes that hide
    $("#sim_components_select").on('click', function() {
      if (!$("#sim_components_options").is(":visible")) {
        $("#sim_components_options").show();
      } else {
        $("#sim_components_options").hide();
      }
    });

    // enable show hide for dwenguino components
    $("#sim_servo1").hide();
    $("#servo1").on('change', function() {
      if (document.getElementById("servo1").checked) {
        $("#sim_servo1").show();
      } else {
        $("#sim_servo1").hide();
      }
    });

    $("#sim_servo2").hide();
    $("#servo2").on('change', function() {
      if (document.getElementById("servo2").checked) {
        $("#sim_servo2").show();
      } else {
        $("#sim_servo2").hide();
      }
    });

    $("#sim_motor1").hide();
    $("#motor1").on('change', function() {
      if (document.getElementById("motor1").checked) {
        $("#sim_motor1").show();
      } else {
        $("#sim_motor1").hide();
      }
    });

    $("#sim_motor2").hide();
    $("#motor2").on('change', function() {
      if (document.getElementById("motor2").checked) {
        $("#sim_motor2").show();
      } else {
        $("#sim_motor2").hide();
      }
    });

    $("#sim_sonar").hide();
    $("#sim_sonar_distance").hide();
    $("#sim_sonar_input").hide();
    $("#sonar").on('change', function() {
      if (document.getElementById("sonar").checked) {
        $("#sim_sonar").show();
        $("#sim_sonar_distance").show();
        $("#sim_sonar_input").show();
      } else {
        $("#sim_sonar").hide();
        $("#sim_sonar_distance").hide();
        $("#sim_sonar_input").hide();
      }
    });

    // push buttons
    $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('click', function() {
      if (document.getElementById(this.id).className === "sim_button") {
        document.getElementById(this.id).className = "sim_button sim_button_pushed";
        // update state of buttons
        switch(this.id) {
          case "#sim_button_N":
          DwenguinoSimulation.board.buttons[0] = 0;
          break;
          case "#sim_button_W":
          DwenguinoSimulation.board.buttons[1] = 0;
          break;
          case "#sim_button_C":
          DwenguinoSimulation.board.buttons[2] = 0;
          break;
          case "#sim_button_E":
          DwenguinoSimulation.board.buttons[3] = 0;
          break;
          case "#sim_button_S":
          DwenguinoSimulation.board.buttons[4] = 0;
        }
      } else {
        document.getElementById(this.id).className = "sim_button";
        // update state of buttons
        switch(this.id) {
          case "#sim_button_N":
          DwenguinoSimulation.board.buttons[0] = 1;
          break;
          case "#sim_button_W":
          DwenguinoSimulation.board.buttons[1] = 1;
          break;
          case "#sim_button_C":
          DwenguinoSimulation.board.buttons[2] = 1;
          break;
          case "#sim_button_E":
          DwenguinoSimulation.board.buttons[3] = 1;
          break;
          case "#sim_button_S":
          DwenguinoSimulation.board.buttons[4] = 1;
        }
      }
    });

    // change speed of simulation
    $("#sim_speed").on('change', function() {
      DwenguinoSimulation.setSpeed();
    });

    // change scenario view
    $("#sim_scenario").on('change', function() {
      var e = document.getElementById("sim_scenario");
      DwenguinoSimulation.scenarioView = e.options[e.selectedIndex].value;
      DwenguinoSimulation.changeScenarioView();
    });

    var toggleSimulatorPaneView = function(currentPane, otherPanes, e){
      $.each(otherPanes, function(index, pane){
        $content = $(pane.attr("href"));
        pane.removeClass("active");
        $content.hide();
      });


      $(currentPane).addClass("active");
      $(currentPane.hash).show();

      e.preventDefault();
    }

    $("a[href$='#db_code_pane']").click(function(e){
      toggleSimulatorPaneView(this, [$("a[href$='#db_robot_pane']"), $("a[href$='#db_matterjs_pane']")], e);
    });

    $("a[href$='#db_robot_pane']").click(function(e){
      toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']"), $("a[href$='#db_matterjs_pane']")], e);
    });

    $("a[href$='#db_matterjs_pane']").click(function(e){
      toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']"), $("a[href$='#db_robot_pane']")], e);
      DwenguinoSimulation.initMatterJsEnvironment();
    });

    $("ul.tabs").each(function(){
      // For each set of tabs, we want to keep track of
      // which tab is active and its associated content
      var $active, $content, $links = $(this).find('a');

      // If the location.hash matches one of the links, use that as the active tab.
      // If no match is found, use the first link as the initial active tab.
      $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
      $active.addClass('active');

      $content = $($active[0].hash);

      // Hide the remaining content
      $links.not($active).each(function () {
        $(this.hash).hide();
      });
    });

    DwenguinoSimulation.renderScenario();
  },

  /*
  * Starts the simulation for the current code
  */
  startSimulation: function() {
    DwenguinoSimulation.startDebuggingView();
    DwenguinoSimulation.initDebugger();
    // run debugger
    DwenguinoSimulation.step();
  },

  /*
  * Starts the simulation for the current code with 1 step
  */
  startStepSimulation: function() {
    DwenguinoSimulation.startDebuggingView();
    DwenguinoSimulation.initDebugger();
    // run debugger
    DwenguinoSimulation.oneStep();
  },

  /*
  * Stops the simulation and resets the view
  */
  stopSimulation: function() {
    DwenguinoSimulation.stopDebuggingView();
    DwenguinoSimulation.resetDwenguino();
  },

  /*
  * resumes a simulation that was paused
  */
  resumeSimulation: function() {
    // restart driving robot
    if (DwenguinoSimulation.scenarioView === "moving") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
    } else if (DwenguinoSimulation.scenarioView === "wall") {
      DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
    } else if (DwenguinoSimulation.scenarioView === "spyrograph"){
      DwenguinoSimulation.adjustSpyrograph(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1]);
    }

    DwenguinoSimulation.step();
  },

  /*
  * initialize the debugging environment
  */
  initDebugger: function() {
    // initialize simulation
    DwenguinoSimulation.initDwenguino();

    // get code
    DwenguinoSimulation.debugger.code = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
    DwenguinoSimulation.mapBlocksToCode();


    // create debugger
    DwenguinoSimulation.debugger.debuggerjs = debugjs.createDebugger({
      iframeParentElement: document.getElementById('debug'),
      // declare context that should be available in debugger
      sandbox: {
        DwenguinoSimulation: DwenguinoSimulation
      }
    });

    DwenguinoSimulation.debugger.debuggerjs.machine.on('error', function(err) {
      console.error(err.message);
    });

    var filename = 'simulation';
    DwenguinoSimulation.debugger.debuggerjs.load(DwenguinoSimulation.debugger.code, filename);

    var min = Math.min.apply(null, Object.keys(DwenguinoSimulation.debugger.blocks.blockMapping));
    var line = 0;
    while (line <= min) {
      DwenguinoSimulation.oneStep();
      line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line;
    }
  },

  /*
  * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
  */
  step: function() {
    if (!DwenguinoSimulation.isSimulationRunning) {
      return;
    }

    var line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    DwenguinoSimulation.debugger.debuggerjs.machine.step();

    // highlight the current block
    DwenguinoSimulation.updateBlocklyColour();
    DwenguinoSimulation.handleScope();

    // check if current line is not a sleep
    var code = DwenguinoSimulation.debugger.code.split("\n")[line] === undefined ? '' : DwenguinoSimulation.debugger.code.split("\n")[line];

    if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
      setTimeout(DwenguinoSimulation.step, DwenguinoSimulation.speedDelay);
    } else {
      // sleep
      setTimeout(DwenguinoSimulation.step,
        DwenguinoSimulation.speedDelay + (Number(DwenguinoSimulation.debugger.code.split("\n")[line].replace(/\D+/g, '')))/**DwenguinoSimulation.speedDelay/20*/);
      }
      DwenguinoSimulation.checkForEnd();
    },

    /*
    * Lets the simulator run one step
    */
    oneStep: function() {
      // let driving robot update 1 frame
      if (DwenguinoSimulation.scenarioView === "moving") {
        DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
      } else if (DwenguinoSimulation.scenarioView === "wall") {
        DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
      }

      DwenguinoSimulation.debugger.debuggerjs.machine.step();
      DwenguinoSimulation.updateBlocklyColour();
      DwenguinoSimulation.handleScope();
      DwenguinoSimulation.checkForEnd();
    },

    /*
    * Displays the values of the variables during the simulation
    */
    handleScope: function() {
      var scope = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentStackFrame().scope;
      document.getElementById('sim_scope').innerHTML = "";
      for (var i in scope) {
        var item = scope[i];
        var value = DwenguinoSimulation.debugger.debuggerjs.machine.$runner.gen.stackFrame.evalInScope(item.name);
        document.getElementById('sim_scope').innerHTML = document.getElementById('sim_scope').innerHTML + item.name + " = " + value + "<br>";
      }
    },

    /*
    * Checks if the simulation has been interrupted
    */
    checkForEnd: function() {
      if ((DwenguinoSimulation.isSimulationRunning || DwenguinoSimulation.isSimulationPaused) &&
      DwenguinoSimulation.debugger.debuggerjs.machine.halted) {
        DwenguinoSimulation.isSimulationRunning = false;
        DwenguinoSimulation.isSimulationPaused = false;
        //DwenguinoSimulation.setButtonsStep();
      }
    },

    /*
    * maps line numbers to blocks
    */
    mapBlocksToCode: function() {
      var setup_block = DwenguinoBlockly.workspace.getAllBlocks()[0];

      var line = 0;
      var lines = DwenguinoSimulation.debugger.code.split("\n");
      var loopBlocks = [];

      // update variables in while loop when searching for a match between block and line
      function updateBlocks() {
        // special structure for loop blocks -> look at children
        if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0] &&
        (lines[line].trim().startsWith("for") || lines[line].trim().startsWith("while") ||
        lines[line].trim().startsWith("if"))) {
          loopBlocks.push(block);
          DwenguinoSimulation.debugger.blocks.blockMapping[line] = block;
          block = block.getInputTargetBlock('DO') || block.getInputTargetBlock('DO0');
        } else if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0]) {
          DwenguinoSimulation.debugger.blocks.blockMapping[line] = block;
          block = block.getNextBlock();
        }
        // end of loop structure
        if (block === null && loopBlocks.length > 0) {
          var parentBlock = loopBlocks.pop();
          block = parentBlock.getNextBlock();
          line++;
        }
        line++;
      };

      // look at blocks before while
      var block = setup_block.getInputTargetBlock('SETUP');
      while (block !== null && line < lines.length) {
        updateBlocks();
      }

      while (loopBlocks.length > 0) {
        loopBlocks.pop();
        line++;
      }

      // look at while
      while (line < lines.length && lines[line] !== "while (true) {") {
        line++;
      }
      if (line < lines.length) {
        DwenguinoSimulation.debugger.blocks.blockMapping[line] = setup_block;
        line++;
      }

      // look at blocks after while
      block = setup_block.getInputTargetBlock('LOOP');
      while (block !== null && line < lines.length) {
        updateBlocks();
      }
    },

    /*
    * Changes the color of the blocks at each iteration of the simulator
    * The block that was previously executed is highlighted (=blue)
    */
    updateBlocklyColour: function() {
      var highlight_colour = 210;

      var line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
      if (DwenguinoSimulation.debugger.code !== "" && typeof DwenguinoSimulation.debugger.blocks.blockMapping[line] !== 'undefined') {
        // reset old block
        if (DwenguinoSimulation.debugger.blocks.lastBlocks[0] !== null) {
          DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(DwenguinoSimulation.debugger.blocks.lastColours[0]);
        }

        DwenguinoSimulation.debugger.blocks.lastBlocks[0] = DwenguinoSimulation.debugger.blocks.lastBlocks[1];
        DwenguinoSimulation.debugger.blocks.lastColours[0] = DwenguinoSimulation.debugger.blocks.lastColours[1];

        // highlight current block
        DwenguinoSimulation.debugger.blocks.lastBlocks[1] = DwenguinoSimulation.debugger.blocks.blockMapping[line];
        DwenguinoSimulation.debugger.blocks.lastColours[1] = DwenguinoSimulation.debugger.blocks.blockMapping[line].getColour();

        if (DwenguinoSimulation.debugger.blocks.lastBlocks[0] !== null) {
          DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(highlight_colour);
        }
      }
    },

    /*
    * updates the speed of the simulation
    */
    setSpeed: function() {
      var e = document.getElementById("sim_speed");
      var option = e.options[e.selectedIndex].value;

      switch (option) {
        case "veryslow":
        DwenguinoSimulation.speedDelay = 600;
        break;
        case "slow":
        DwenguinoSimulation.speedDelay = 300;
        break;
        case "medium":
        DwenguinoSimulation.speedDelay = 150;
        break;
        case "fast":
        DwenguinoSimulation.speedDelay = 75;
        break;
        case "veryfast":
        DwenguinoSimulation.speedDelay = 32;
        break;
        case "realtime":
        DwenguinoSimulation.speedDelay = 16;
      }
    },

    /*
    * Makes the simulation ready (draw the board)
    */
    initDwenguino: function() {
      DwenguinoSimulation.resetDwenguino();
    },

    /*
    * Resets the dwenguino (drawing) to its initial state (remove text, no sound etc)
    */
    resetDwenguino: function() {
      // delete debugger
      DwenguinoSimulation.debugger.debuggerjs = null;
      DwenguinoSimulation.debugger.code = "";
      DwenguinoSimulation.debugger.blocks.blockMapping = {};

      // reset colours
      if (DwenguinoSimulation.debugger.blocks.lastColours[0] !== -1) {
        DwenguinoSimulation.debugger.blocks.lastBlocks[0].setColour(DwenguinoSimulation.debugger.blocks.lastColours[0]);
      }
      DwenguinoSimulation.debugger.blocks.lastColours = [-1, -1];
      DwenguinoSimulation.debugger.blocks.lastBlocks = [null, null];

      // stop sound
      if (DwenguinoSimulation.board.buzzer.tonePlaying !== 0) {
        DwenguinoSimulation.noTone("BUZZER");
      }
      // clearn lcd
      DwenguinoSimulation.clearLcd();
      // turn all lights out
      DwenguinoSimulation.board.leds = [0,0,0,0,0,0,0,0,0];
      for (var i = 0; i < 8; i++) {
        document.getElementById('sim_light_' + i).className = "sim_light sim_light_off";
      }
      document.getElementById('sim_light_13').className = "sim_light sim_light_off";

      // reset servo
      DwenguinoSimulation.board.servoAngles = [0, 0];
      $("#sim_servo1_mov, #sim_servo2_mov").css("transform", "rotate(0deg)");

      // reset motors
      DwenguinoSimulation.board.motorSpeeds = [0, 0];
      $("#sim_motor1, #sim_motor2").css("transform", "rotate(0deg)");

      //reset buttons
      DwenguinoSimulation.board.buttons = [1,1,1,1,1];
      $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").removeClass().addClass('sim_button');

      // clear scope
      document.getElementById('sim_scope').innerHTML = "";

      // reset moving car
      //Object.assign(DwenguinoSimulation.robot.position, DwenguinoSimulation.robot.start);
      DwenguinoSimulation.robot.position = {
        x: DwenguinoSimulation.robot.start.x,
        y: DwenguinoSimulation.robot.start.y,
        angle: DwenguinoSimulation.robot.start.angle
      };
      DwenguinoSimulation.renderScenario();

      // Reset the spyrograph
      //DwenguinoSimulation.initMatterJsEnvironment();
      //Stop timeer
      //clearTimeout(DwenguinoSimulation.timeout);
    },

    /*
    * function called by the delay block to delay the simulation
    *  @param {int} delay: time in ms the simaultion should be paused
    */
    sleep: function(delay) {
      // sleep is regulated inside step funtion
    },

    /*
    * Makes the lcd display empty
    *
    */
    clearLcd: function() {
      // clear lcd by writing spaces to it
      for (var i = 0; i < 2; i++) {
        DwenguinoSimulation.board.lcdContent[i] = " ".repeat(16);
        DwenguinoSimulation.writeLcd(" ".repeat(16), i, 1);
      }
    },

    /*
    * Writes text to the lcd on the given row starting fro position column
    * @param {string} text: text to write
    * @param {int} row: 0 or 1 addresses the row
    * @param {int} column: 0-15: the start position on the given row
    */
    writeLcd: function(text, row, column) {
      // replace text in current content (if text is hello and then a is written this gives aello)
      text = DwenguinoSimulation.board.lcdContent[row].substr(0, column) +
      text.substring(0, 16 - column) +
      DwenguinoSimulation.board.lcdContent[row].substr(text.length + column, 16);
      DwenguinoSimulation.board.lcdContent[row] = text;

      // write new text to lcd screen and replace spaces with &nbsp;
      $("#sim_lcd_row" + row).text(text);
      document.getElementById('sim_lcd_row' + row).innerHTML =
      document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
      // repaint
      var element = document.getElementById("sim_lcds");
      element.style.display = 'none';
      element.offsetHeight;
      element.style.display = 'block';
    },

    /*
    * Write value 'HIGH' or 'LOW' to a pin, used to turn light on and off
    * @param {int} pinNumber: 13 or 32-39 adresses a light
    * @param {string} state: 'HIGH' to trun light on or 'LOW' to turn light off
    */
    digitalWrite: function(pinNumber, state) {
      // turns light on or off
      var pin = Number(pinNumber);
      if ((pin >= 32 && pin <= 39) || pin === 13) {
        if (pin >= 32 && pin <= 39) {
          pin -= 32;
        }
        if (state === 'HIGH' || state === "1") {
          pin=== 13? DwenguinoSimulation.board.leds[8] = 1 : DwenguinoSimulation.board.leds[pin] = 1;
          document.getElementById('sim_light_' + pin).className = "sim_light sim_light_on";
        } else {
          pin === 13? DwenguinoSimulation.board.leds[8] = 0 : DwenguinoSimulation.board.leds[pin] = 0;
          document.getElementById('sim_light_' + pin).className = "sim_light sim_light_off";
        }
      }
    },

    analogWrite: function(pinNumber, state) {

    },

    /*
    * Reads the value of the given pin, used to know the value of a button
    * @param {string} id of the button "SW_N","SW_W,SW_C","SW_E" or "SW_S"
    * @returns {int} 1 if not pressed, 0 if pressed
    */
    digitalRead: function(pin) {
      // read value from buttons
      if (pin.startsWith("SW_")) {
        return document.getElementById("sim_button_" + pin[3]).className === "sim_button" ? 1 : 0;
      }

      pin = Number(pin);
      if ((pin >= 32 && pin <= 39) || pin === 13) {
        if (pin >= 32 && pin <= 39) {
          pin -= 32;
        }
        return document.getElementById('sim_light_' + pin).className.includes("sim_light_on")? 1 : 0;
      }

      return 1;
    },

    analogRead: function(pin) {
      return 0;
    },

    /*
    * Changes the state of all eight lights
    * @param {String} bin "0b00000000" to turn all lights off, "0b11111111" to turn all lights on
    */
    setLeds: function(bin) {
      for (var i = 2; i < 10; i++) {
        DwenguinoSimulation.digitalWrite(i+30, bin[i]);
      }
    },

    /*
    * Turns the buzzer to a given frequancy
    * @param {string} id of the pin "BUZZER"
    * @param {int} frequency of the wanted sound
    */
    tone: function(pin, frequency) {
      if (pin !== "BUZZER") {
        return;
      }
      if (DwenguinoSimulation.board.buzzer.osc === null) {
        // initiate sound object
        try {
          DwenguinoSimulation.board.buzzer.audiocontext = new(window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          alert('Web Audio API is not supported in this browser');
        }
        //DwenguinoSimulation.board.sound.audiocontextBuzzer = new AudioContext();
      }
      if (DwenguinoSimulation.board.buzzer.tonePlaying !== 0 && DwenguinoSimulation.board.buzzer.tonePlaying !== frequency) {
        DwenguinoSimulation.board.buzzer.osc.stop();
      }
      if (DwenguinoSimulation.board.buzzer.tonePlaying !== frequency) {
        // a new oscilliator for each round
        DwenguinoSimulation.board.buzzer.osc = DwenguinoSimulation.board.buzzer.audiocontext.createOscillator(); // instantiate an oscillator
        DwenguinoSimulation.board.buzzer.osc.type = 'sine'; // this is the default - also square, sawtooth, triangle

        // start tone
        DwenguinoSimulation.board.buzzer.osc.frequency.value = frequency; // Hz
        DwenguinoSimulation.board.buzzer.osc.connect(DwenguinoSimulation.board.buzzer.audiocontext.destination); // connect it to the destination
        DwenguinoSimulation.board.buzzer.osc.start(); // start the oscillator

        DwenguinoSimulation.board.buzzer.tonePlaying = frequency;
      }
    },

    /*
    * Stops the buzzer
    * @param {string} id of the pin "BUZZER"
    */
    noTone: function(pin) {
      if (pin === "BUZZER") {
        // stop tone
        DwenguinoSimulation.board.buzzer.tonePlaying = 0;
        DwenguinoSimulation.board.buzzer.osc.stop();
      }
    },

    /*
    * Sets the servo to a given angle
    * @param {int} channel id of servo 1 or 2
    * @param {int} angle between 0 and 180
    */
    servo: function(channel, angle) {
      $("#sim_servo"+channel).show();
      document.getElementById("servo"+channel).checked = true;

      //set angle
      if (angle > 180) {
        angle = 180;
      }
      if (angle < 0) {
        angle = 0;
      }

      if (angle !== DwenguinoSimulation.board.servoAngles[channel - 1]) {
        DwenguinoSimulation.board.servoAngles[channel - 1] = angle;
        DwenguinoSimulation.servoRotate(channel, angle);
      }
    },

    /*
    * Renders the movement of the servo
    * @param {int} channel id of servo 1 or 2
    * @param {int} angle between 0 and 180
    */
    servoRotate: function(channel, angle) {
      var maxMovement = 10;
      if (angle !== DwenguinoSimulation.board.servoAngles[channel - 1]) {
        return;
      }
      var prevAngle = DwenguinoSimulation.getAngle($("#sim_servo" + channel + "_mov"));
      // set 10 degrees closer at a time to create rotate effect
      if (Math.abs(angle - prevAngle) > maxMovement) {
        var direction = ((angle - prevAngle) > 0) ? 1 : -1;
        $("#sim_servo" + channel + "_mov").css("transform", "rotate(" + (prevAngle + direction * maxMovement) + "deg)");
        setTimeout(function() {
          DwenguinoSimulation.servoRotate(channel, angle);
        }, 20);
      } else {
        $("#sim_servo" + channel + "_mov").css("transform", "rotate(" + angle + "deg)");
      }
    },

    /*
    * Help function to get the angle in degrees of a rotated html object
    * @param {obj} obj html object
    * @returns {int} degrees of rotation
    */
    getAngle: function(obj) {
      var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform") ||
      obj.css("-ms-transform") ||
      obj.css("-o-transform") ||
      obj.css("transform");
      if (matrix !== "none") {
        var values = matrix.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');
        var a = values[0];
        var b = values[1];
        return Math.round(Math.atan2(b, a) * (180 / Math.PI));
      }
      return 0;
    },

    /*
    * Turn a motor on at given speed
    * @param {int} channel id of motor 1 or 2
    * @param {int} speed between 0 and 255
    */
    startDcMotor: function(channel, speed) {
      $("#sim_motor"+channel).show();
      document.getElementById("motor"+channel).checked = true;

      //set angle
      if (speed > 255) {
        speed = 255;
      }
      if (speed < 0) {
        speed = 0;
      }

      // change view of motor
      if (speed === DwenguinoSimulation.board.motorSpeeds[channel - 1]) {
        return;
      }
      DwenguinoSimulation.board.motorSpeeds[channel - 1] = speed;
      DwenguinoSimulation.dcMotorRotate(channel, speed);

      // change view of driving robot
      var e = document.getElementById("sim_scenario");
      var option = e.options[e.selectedIndex].value;

      DwenguinoSimulation.field.width = $("#sim_container").width();
      DwenguinoSimulation.field.height = $("#sim_container").height();

      if (option === "moving") {
        DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], false);
      } else if (option === "wall") {
        DwenguinoSimulation.adjustMovingRobot(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1], true);
      }else if (option === "spyrograph"){
        DwenguinoSimulation.adjustSpyrograph(DwenguinoSimulation.board.motorSpeeds[0], DwenguinoSimulation.board.motorSpeeds[1]);
      }
    },

    /*
    * Renders the rotation of the motor
    * @param {int} channel id of motor 1 or 2
    * @param {int} speed between 0 and 255
    */
    dcMotorRotate: function(channel, speed) {
      var maxMovement = speed / 20 + 5;
      if (speed !== DwenguinoSimulation.board.motorSpeeds[channel - 1] && speed !== 0) {
        return;
      }
      var prevAngle = DwenguinoSimulation.getAngle($("#sim_motor" + channel));
      // rotate x degrees at a time based on speed
      $("#sim_motor" + channel).css("transform", "rotate(" + ((prevAngle + maxMovement) % 360) + "deg)");

      DwenguinoSimulation.timeout = setTimeout(function() {
        DwenguinoSimulation.dcMotorRotate(channel, speed);
      }, 20);
    },

    /*
     * Changes the position of the spyrograaf motors
     * int speed1: the speed of motor 1.
     * int speed2: the speed of motor 2.
     */

    adjustSpyrograph: function(speed1, speed2){
      Matter.Body.setAngularVelocity(DwenguinoSimulation.spyrograph.motor1, speed1/100);
      Matter.Body.setAngularVelocity(DwenguinoSimulation.spyrograph.motor2, speed2/100);

      DwenguinoSimulation.timeout = setTimeout(function() {
        DwenguinoSimulation.adjustSpyrograph(speed1, speed2);
      }, DwenguinoSimulation.speedDelay);
    },


    /*
    * Changes the position of the robot based on the speeds of the motors and the current position
    * int speed1: the speed of motor 1
    * int speed2: the speed of motor 2
    * boolean wall: true if the car is surrounded by a wall
    */
    adjustMovingRobot: function(speed1, speed2, wall) {
      if (!(speed1 === DwenguinoSimulation.board.motorSpeeds[0] && speed2 === DwenguinoSimulation.board.motorSpeeds[1] && (speed1 !== 0 || speed2 !== 0))
      || DwenguinoSimulation.isSimulationPaused) {
        return;
      }

      var x = DwenguinoSimulation.robot.position.x;
      var y = DwenguinoSimulation.robot.position.y;
      var angle = DwenguinoSimulation.robot.position.angle;
      var field = DwenguinoSimulation.field;

      // decide on angle (in deg) and distance (in px) based on 2 motor speeds
      var distance = (speed1 + speed2) / 100 + 0.5;

      if (speed1 !== speed2) {
        angle += (speed2 - speed1) / 30;
      }

      x += distance * Math.cos(Math.PI / 180 * angle);
      y += distance * Math.sin(Math.PI / 180 * angle);

      var offset = wall ? field.wallOffset : 25;

      // Stick to wall
      if (wall) {
        if (x > field.width - offset) x = field.width - offset;
        if (y > field.height - offset) y = field.height - offset;
        if (x < offset) x = offset;
        if (y < offset) y = offset;
      } else {
        // Teleport to other side
        if (x > field.width - offset) x = offset;
        if (y > field.height - offset) y = offset;
        if (x < offset) x = field.width - offset;
        if (y < offset) y = field.height - offset;
      }

      DwenguinoSimulation.robot.position = {
        x: x,
        y: y,
        angle: angle
      };

      DwenguinoSimulation.renderScenario();


      setTimeout(function() {
        DwenguinoSimulation.adjustMovingRobot(speed1, speed2, wall);
      }, DwenguinoSimulation.speedDelay);
    },

    /*
    * Returns the distance between the sonar and teh wall
    * @param {int} trigPin 11
    * @param {int} echoPin 12
    * @returns {int} distance in cm
    */
    sonar: function(trigPin, echoPin) {
      $("#sim_sonar").show();
      $("#sim_sonar_distance").show();
      $("#sim_sonar_input").show();
      document.getElementById("sonar").checked = true;

      // adjust sonar value based on wall
      var e = document.getElementById("sim_scenario");
      var option = e.options[e.selectedIndex].value;

      if (option === "wall") {
        // calculate distance between front of car and wall

        var xMiddle = DwenguinoSimulation.robot.position.x;
        var yMiddle = DwenguinoSimulation.robot.position.y;
        var angle = DwenguinoSimulation.robot.position.angle;

        var xFront = xMiddle + (DwenguinoSimulation.robot.image.width/2) * Math.cos(Math.PI / 180 * angle);
        var yFront = yMiddle + (DwenguinoSimulation.robot.image.width/2) * Math.sin(Math.PI / 180 * angle);

        // coordinates of line
        lineX = 0;
        lineY = 0;
        var angle = ((DwenguinoSimulation.robot.position.angle % 360)+360)%360;
        if (angle <= 180) {
          lineY = DwenguinoSimulation.field.height;
        }
        if (angle <= 90 || angle >= 270) {
          lineX = DwenguinoSimulation.field.width;
        }
        angle = DwenguinoSimulation.robot.position.angle;

        var distanceX = Math.cos(Math.PI / 180 * angle) !== 0? (lineX-xFront)/(Math.cos(Math.PI / 180 * angle)) : DwenguinoSimulation.field.width*2;
        var distanceY = Math.sin(Math.PI / 180 * angle) !== 0? (lineY-yFront)/(Math.sin(Math.PI / 180 * angle)) : DwenguinoSimulation.field.height*2;

        document.getElementById('sonar_input').value = parseInt(distanceX < distanceY? distanceX/2 : distanceY/2);
        return parseInt(distanceX < distanceY? distanceX/2 : distanceY/2);
      }

      return parseInt(document.getElementById('sonar_input').value);
    },

    /*
    * Renders the moving robot
    */
    renderScenario: function() {
      var robot = DwenguinoSimulation.robot;
      var $robot = $('#sim_animation');

      // Update field size
      DwenguinoSimulation.field.width = $("#sim_container").width();
      DwenguinoSimulation.field.height = $("#sim_container").height();

      $robot
      .css('top', robot.position.y + 'px')
      .css('left', robot.position.x + 'px')
      .css('transform', 'rotate(' + robot.position.angle + 'deg)');

    },

    /*
    * Adjust css when simulation is started
    */
    setButtonsStart: function() {
      // enable pauze and stop
      document.getElementById('sim_pause').className = "sim_item";
      document.getElementById('sim_stop').className = "sim_item";
      // disable start and step
      document.getElementById('sim_start').className = "sim_item disabled";
      document.getElementById('sim_step').className = "sim_item disabled";
    },

    /*
    * Adjust css when simulation is paused
    */
    setButtonsPause: function() {
      // enable start, stop and step
      document.getElementById('sim_start').className = "sim_item";
      document.getElementById('sim_step').className = "sim_item";
      document.getElementById('sim_stop').className = "sim_item";
      // disable pause
      document.getElementById('sim_pause').className = "sim_item disabled";
    },

    /*
    * Adjust css when simulation is stopped
    */
    setButtonsStop: function() {
      // enable start, stop and step
      document.getElementById('sim_start').className = "sim_item";
      document.getElementById('sim_step').className = "sim_item";
      // disable pause
      document.getElementById('sim_stop').className = "sim_item disabled";
      document.getElementById('sim_pause').className = "sim_item disabled";
    },

    /*
    * Adjust css when simulation is run step by step
    */
    setButtonsStep: function() {
      // enable start, stop and step
      document.getElementById('sim_start').className = "sim_item";
      document.getElementById('sim_step').className = "sim_item";
      document.getElementById('sim_stop').className = "sim_item";
      // disable pause
      document.getElementById('sim_pause').className = "sim_item disabled";
    },

    /*
    * Adjusts the view during simulation
    * disables the programming and makes the simulation pane biggger
    */
    startDebuggingView: function() {
      if (document.getElementsByClassName("alertDebug").length !== 0) {
        document.getElementsByClassName("alertDebug")[0].remove();
      }
      var alertMessage = '<div class ="alertDebug">' + MSG.simulator['alertDebug'] + '</div>';
      $('#db_body').append(alertMessage);
      document.getElementsByClassName('alertDebug')[0].style.width = document.getElementById("blocklyDiv").style.width;
      document.getElementById('blocklyDiv').style.opacity = "0.5";
      document.getElementById('blocklyDiv').style.pointerEvents = "none";
    },

    /*
    * Returns to normal view when debugging is finished
    */
    stopDebuggingView: function() {
      document.getElementById('blocklyDiv').style.opacity = "1";
      document.getElementById('blocklyDiv').style.pointerEvents = "auto";
      if (document.getElementsByClassName("alertDebug").length !== 0) {
        document.getElementsByClassName("alertDebug")[0].remove();
      }
    },

    changeScenarioView: function() {
      var option = DwenguinoSimulation.scenarioView;

      switch (option) {
        case "default":
        document.getElementById('db_code_pane').style.display = "inline";
        document.getElementById('db_robot_pane').style.display = "none";
        $("a[href$='#db_code_pane']").addClass('active');
        $("a[href$='#db_robot_pane']").removeClass('active');
        $("a[href$='#db_matterjs_pane']").removeClass('active');
        $("#robot_pane_tab").hide();
        break;
        case "moving":
        $("#robot_pane_tab").show();
        $("a[href$='#db_code_pane']").removeClass('active');
        $("a[href$='#db_matterjs_pane']").removeClass('active');
        $("a[href$='#db_robot_pane']").addClass('active');
        document.getElementById('db_code_pane').style.display = "none";
        document.getElementById('db_robot_pane').style.display = "inline-block";
        document.getElementById('db_robot_pane').style.width = "100%";
        document.getElementById('db_robot_pane').style.height = "100%";
        document.getElementById('sim_container').style.border = "none";
        document.getElementById('db_robot_pane').style.padding = "0";
        //document.getElementById('sim_container').style.height = "50%";
        //document.getElementById('sim_container').style.marginTop = "initial";
        //document.getElementById('sim_container').style.left = "initial";
        document.getElementById('sim_container').style.width = "100%";
        break;
        case "wall":
        $("#robot_pane_tab").show();
        $("a[href$='#db_code_pane']").removeClass('active');
        $("a[href$='#db_matterjs_pane']").removeClass('active');
        $("a[href$='#db_robot_pane']").addClass('active');
        document.getElementById('db_code_pane').style.display = "none";
        document.getElementById('db_robot_pane').style.display = "inline-block";
        document.getElementById('db_robot_pane').style.padding = "20px";
        document.getElementById('db_robot_pane').style.width = "100%";
        document.getElementById('db_robot_pane').style.height = "100%";
        document.getElementById('sim_container').style.border = "2px solid grey";
        document.getElementById('sim_container').style.display = "inline-block";
        document.getElementById('sim_container').style.boxSizing = "border-box";
      }
    }
  };

  // initialise js functions if version older than 2015
  if (!String.prototype.repeat) {
    String.prototype.repeat = function(num) {
      return new Array(num + 1).join(this);
    };
  }

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }


/*  $(document).ready(function() {
    DwenguinoSimulation.setupEnvironment();
  });*/
