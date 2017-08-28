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
  baseSpeedDelay: 16,
  debuggingView: false,
  scenarios: {
    "moving": new DwenguinoSimulationScenarioRidingRobot(),
    "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(),
    //"spyrograph": new DwenguinoSimulationScenarioSpyrograph() /*, "moving", "wall", "spyrograph"*/
  },
  currentScenario: null,
  scenarioView: "moving",
  simulationViewContainerId: "#db_robot_pane",
  debugger: {
    debuggerjs: null,
    code: "",
    blocks: {
      lastBlocks: [null, null],
      lastColours: [-1, -1],
      blockMapping: {}
    }
  },
  /*
  * Initializes the environment when loading page
  */
  setupEnvironment: function() {
    this.currentScenario = this.scenarios[this.scenarioView];
    DwenguinoSimulation.initDwenguinoSimulation();
  },

  translateSimulatorInterface: function(){
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

    $.each(Object.keys(DwenguinoSimulation.scenarios), function(index, value){
      $('#sim_scenario_' + value).text(MSG.simulator['scenario_' + value]);
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
  },

  /*
  * inits the right actions to handle the simulation view
  */
  initDwenguinoSimulation: function() {
    //Add scenarios to the dropdown
    $("#sim_scenario").empty();
    $.each(Object.keys(DwenguinoSimulation.scenarios), function(index, value){
      var newOpt = $("<option></option>").attr("id", "sim_scenario_" + value).attr("value", value).text(value);
      $("#sim_scenario").append(newOpt);
    });

    //Translate the interface.
    DwenguinoSimulation.translateSimulatorInterface();

    //Init the current scenario view
    DwenguinoSimulation.currentScenario.initSimulationDisplay(DwenguinoSimulation.simulationViewContainerId);

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
      DwenguinoSimulation.currentScenario = DwenguinoSimulation.scenarios[DwenguinoSimulation.scenarioView];
      DwenguinoSimulation.currentScenario.initSimulationDisplay(DwenguinoSimulation.simulationViewContainerId);

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
    };
    $("a[href$='#db_code_pane']").click(function(e){
      toggleSimulatorPaneView(this, [$("a[href$='#db_robot_pane']")], e);
    });

    $("a[href$='#db_robot_pane']").click(function(e){
      toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']")], e);
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


  },

  /* -------------------------------------------------------------------------
  * Functions for handling the simulator controls
  ----------------------------------------------------------------------------*/
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
    //TODO: restart the timed update loop

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

    var filename = 'DwenguinoSimulation';
    DwenguinoSimulation.debugger.debuggerjs.load(DwenguinoSimulation.debugger.code, filename);

    // Performs a single step to start the debugging process, hihglights the setup loop block.
    DwenguinoSimulation.debugger.debuggerjs.machine.step();
    DwenguinoSimulation.updateBlocklyColour();
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

    // Get current line
    var code = DwenguinoSimulation.debugger.code.split("\n")[line] === undefined ? '' : DwenguinoSimulation.debugger.code.split("\n")[line];

    // Update the scenario View
    DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);

    // check if current line is not a sleep
    if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
      setTimeout(DwenguinoSimulation.step, DwenguinoSimulation.speedDelay);
    } else {
      // sleep
      var delayTime = Number(DwenguinoSimulation.debugger.code.split("\n")[line].replace(/\D+/g, ''));
      DwenguinoSimulation.delayStepsTaken = 0;
      DwenguinoSimulation.delayStepsToTake = Math.floor(delayTime/DwenguinoSimulation.baseSpeedDelay);
      DwenguinoSimulation.delayRemainingAfterSteps = delayTime % DwenguinoSimulation.baseSpeedDelay;
      DwenguinoSimulation.performDelayLoop(DwenguinoSimulation.step);
    }
    DwenguinoSimulation.checkForEnd();
  },
  /*
   *  This function iterates until the delay has passed
   */
  performDelayLoop: function(returnCallback){
    // Here we want the simulation to keep running but not let the board state update.
    // To do so we execute the updateScenario() function of the current scenario delay/speedDelay times
    // with an interval of speedDelay.
    if (DwenguinoSimulation.delayStepsTaken < DwenguinoSimulation.delayStepsToTake){
      // Update the scenario View
      DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);
      DwenguinoSimulation.delayStepsTaken++;
      setTimeout(function(){
        DwenguinoSimulation.performDelayLoop(returnCallback);
      }, DwenguinoSimulation.speedDelay);
    } else {
      setTimeout(returnCallback, DwenguinoSimulation.delayRemainingAfterSteps);
    }
  },

  /*
  * Lets the simulator run one step
  */
  oneStep: function() {
    // let driving robot update 1 frame
    // Update the scenario View
    DwenguinoSimulation.board = DwenguinoSimulation.currentScenario.updateScenario(DwenguinoSimulation.board);

    // Get current line
    var line = DwenguinoSimulation.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    var code = DwenguinoSimulation.debugger.code.split("\n")[line] === undefined ? '' : DwenguinoSimulation.debugger.code.split("\n")[line];

    DwenguinoSimulation.debugger.debuggerjs.machine.step();
    DwenguinoSimulation.updateBlocklyColour();
    DwenguinoSimulation.handleScope();
    DwenguinoSimulation.checkForEnd();

    // check if current line is not a sleep
    if (code.trim().startsWith("DwenguinoSimulation.sleep")) {
      // sleep
      var delayTime = Number(DwenguinoSimulation.debugger.code.split("\n")[line].replace(/\D+/g, ''));
      DwenguinoSimulation.delayStepsTaken = 0;
      DwenguinoSimulation.delayStepsToTake = Math.floor(delayTime/DwenguinoSimulation.baseSpeedDelay);
      DwenguinoSimulation.delayRemainingAfterSteps = delayTime % DwenguinoSimulation.baseSpeedDelay;
      DwenguinoSimulation.performDelayLoop(function(){/*Do nothing after delay loop*/});
    }


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
    //Reset the Dwenguino board display
    DwenguinoSimulation.resetDwenguino();
    DwenguinoSimulation.currentScenario.initSimulationDisplay(DwenguinoSimulation.simulationViewContainerId);
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
      if (speed < -255) {
        speed = -255;
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
      document.getElementById('sonar_input').value = DwenguinoSimulation.board.sonarDistance;
      return this.board.sonarDistance;
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
