import BoardState from "./simulation/BoardState.js";
import SimulationSandbox from "./simulation/SimulationSandbox.js";
import ButtonMap from "./simulation/ButtonMap.js"

export default class DwenguinoSimulation {
    board = null;
    isSimulationRunning = false;
    isSimulationPaused = false;
    speedDelay = 16;
    baseSpeedDelay = 16;
    debuggingView = false;
    scenarios = null;
    currentScenario = null;
    scenarioView = "moving";
    simulationViewContainerId = "#db_robot_pane";
    debugger = null;
    logger = null;
    workspace = null;
    simulationSandbox = null;
    constructor(logger, workspace){
        this.board = new BoardState();
        this.initScenarioState();
        this.initDebuggerState();
        this.logger = logger;
        this.workspace = workspace;
        this.simulationSandbox = new SimulationSandbox(this.board);
    }

    initScenarioState(){
        this.scenarios = {
            "moving": new DwenguinoSimulationScenarioRidingRobot(),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(),
            //"spyrograph": new DwenguinoSimulationScenarioSpyrograph() /*, "moving", "wall", "spyrograph"*/
          };
    }

    initDebuggerState(){
        this.debugger = {
            debuggerjs: null,
            code: "",
            blocks: {
              lastBlocks: [null, null],
              lastColours: [-1, -1],
              blockMapping: {}
            }
          };
    }

    /*
    * Initializes the environment when loading page
    */
    setupEnvironment() {
        this.currentScenario = this.scenarios[this.scenarioView];
        this.initDwenguinoSimulation();
    }

    translateSimulatorInterface(){
        // translation
        document.getElementById('sim_start').innerHTML = "<span class='glyphicon glyphicon-play' alt='" + MSG.simulator['start'] + "'></span>";
        document.getElementById('sim_stop').innerHTML = "<span class='glyphicon glyphicon-stop' alt='" + MSG.simulator['stop'] + "'></span>";
        document.getElementById('sim_pause').innerHTML = "<span class='glyphicon glyphicon-pause' alt='" + MSG.simulator['pause'] + "'></span>";
        document.getElementById('sim_step').innerHTML = "<span class='glyphicon glyphicon-step-forward' alt='" + MSG.simulator['step'] + "'></span>";    
        document.getElementById('sim_scenarioTag').textContent = MSG.simulator['scenario'];
        var option = this.scenarioView;
    
        switch (option) {
          case "moving":
            this.translateSimComponents();
            break;
          case "wall":
            this.translateSimComponents();
            break;
          case "socialrobot":
            break;
          case "default":
            this.translateSimComponents();
            break;
        }
    }

    translateSimComponents() {
        document.getElementById('sim_sonar_distance').textContent = "Sonar " + MSG.simulator['distance'] + ":";
        document.getElementById('sonar_input').value = this.board.sonarDistance;
    }

    /*
    * inits the right actions to handle the simulation view
    */
    initDwenguinoSimulation() {
        // make sure we are not loading the menu twice
        $('#db_simulator_top_pane').children().remove();

        $('#db_simulator_top_pane').append('<div id="db_simulator_menu"></div>');
        $('#db_simulator_top_pane').append('<div id="db_simulator_pane"></div>');
        $('#db_simulator_menu').append('<div id="sim_menu"></div>');

        $('#sim_menu').append('<div id="sim_start" class="sim_item"></div>');
        $('#sim_menu').append('<div id="sim_pause" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_stop" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_step" class="sim_item"></div>');

        $('#db_simulator_menu').append('<div id="sim_menu_next_line" class="sim_menu_next_line"></div>');
        $('#sim_menu_next_line').append('<div id="sim_scenarioTag"></div>');
        $('#sim_menu_next_line').append('<div id="sim_scenario"></div>');

        //Add scenarios to the dropdown
        $("#sim_scenario").empty();
        $.each(Object.keys(this.scenarios), (index, value) => {
            var container = $("<div></div>").attr("class", "scenario_radio_container");
            var newOpt = $("<input></input>").attr("type", "radio").attr("name", "scenario_type").attr("id", "sim_scenario_" + value).attr("value", value);
            console.log(value);
            console.log(this.scenarioView);
            if (value == this.scenarioView){
            newOpt.attr("checked", "checked");
            }
            var image = $("<img></img>").attr("class", "scenario_image").attr("src", "DwenguinoIDE/img/scenarios/scenario_" + value + ".png");
            container.append(newOpt);
            container.append(image);
            $("#sim_scenario").append(container);
        });

        //Init the simulator pane view
        this.initSimulationPane();

        //Translate the interface.
        this.translateSimulatorInterface();

        //Init the current scenario view
        this.currentScenario.initSimulationDisplay(this.simulationViewContainerId);

        //Init the simulation canvas element
        document.getElementById('sim_canvas');

        // start/stop/pause
        $("#sim_start").click(() => {
            this.setButtonsStart();
            // start
            if (!this.isSimulationRunning && !this.isSimulationPaused) {
                this.isSimulationRunning = true;
                this.startSimulation();
                this.logger.recordEvent(this.logger.createEvent("simStart", ""));
            // resume
            } else if (!this.isSimulationRunning) {
                this.logger.recordEvent(this.logger.createEvent("simResume", ""));
                this.isSimulationPaused = false;
                this.isSimulationRunning = true;
                this.resumeSimulation();
            }
        });

        $("#sim_pause").click(() => {
            this.logger.recordEvent(this.logger.createEvent("simPause", ""));
            this.isSimulationRunning = false;
            this.isSimulationPaused = true;
            this.setButtonsPause();
        });

        $("#sim_stop").click(() => {
            this.logger.recordEvent(this.logger.createEvent("simStopButtonClicked", ""));
            this.handleSimulationStop();
        });

        $("#sim_step").click(() => {
            this.setButtonsStep();
            this.logger.recordEvent(this.logger.createEvent("simStep", ""));
            // step 1
            if (!this.isSimulationPaused && !this.isSimulationRunning) {
                this.startStepSimulation();
                this.isSimulationPaused = true;
            // step n
            } else if (!this.isSimulationRunning) {
                this.isSimulationPaused = false;
                this.oneStep();
                this.isSimulationPaused = true;
            }
        });

        // change speed of simulation
        $("#sim_speed").on('change', () => {
            this.setSpeed();
        });

        // Ugly hack..
        let self = this;
        $("input[name=scenario_type]:radio").change(function(){
            console.log($(this).val());
            self.scenarioView = $(this).val();
            self.initSimulationPane();
            self.translateSimulatorInterface();

            self.currentScenario = self.scenarios[self.scenarioView];
            self.currentScenario.initSimulationDisplay(self.simulationViewContainerId);
            self.logger.recordEvent(self.logger.createEvent("changedScenario", this.scenarioView));

        });

        var toggleSimulatorPaneView = (currentPane, otherPanes, e) => {
            $.each(otherPanes, function(index, pane){
            let $content = $(pane.attr("href"));
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

        //Select the scenario view by default.
        $("a[href$='#db_robot_pane']").trigger("click");


    }

    /**
   * This function initializes the simulation pane according to the selected scenario.
   * Each time a different scenario is selected, this function will update the simulation pane.
   */
  initSimulationPane() {
    // Reset custom changes from the social robot scenario
    $('#db_simulator_top_pane').css('height', '50%');
    $('#db_simulator_bottom_pane').css('height', '50%');

    $('#db_simulator_pane').children().remove();

    var option = this.scenarioView;

    switch (option) {
      case "moving":
        this.loadRidingRobotSimulationPane();
        break;
      case "wall":
        this.loadRidingRobotSimulationPane();
        break;
      case "socialrobot":
        this.loadSocialRobotSimulationPane();
        break;
      case "default":
        this.loadRidingRobotSimulationPane();
        break;
    }  
  }

  /**
   * This function only loads the elements in the simulation pane that 
   * are used by the Social Robot scenario.
   */
  loadSocialRobotSimulationPane(){
    console.log("load social robot simulation pane");
    // Load the robot components menu
    $('#db_simulator_pane').append('<div id="robot_components_menu" class="scrolling-wrapper-flexbox"></div>');
    DwenguinoSimulationRobotComponentsMenu.setupEnvironment(this.scenarios['socialrobot'],this.simulationViewContainerId);
  }

  /**
   * This function only loads the elements in the simulation pane that 
   * are used by all Riding Robot scenarios.
   */
  loadRidingRobotSimulationPane(){
    $('#db_simulator_pane').append('<div id="debug"></div>');
    $('#db_simulator_pane').append('<div id="sim_components"></div>');
    $('#db_simulator_pane').append('<div id="sim_board"></div>');

    $('#sim_components').append('<div id="sim_sonar" class="sim_sonar"></div>');
    $('#sim_components').append('<div id="sim_sonar_distance" class="sim_sonar_distance"></div>');
    $('#sim_components').append('<div id="sim_sonar_input"></div>');

    $('#sim_sonar_input').append('<input type="text" id="sonar_input" name="sim_sonar_input" onkeypress="return event.charCode >= 48 && event.charCode <= 57">&nbsp;cm');

    $('#sim_board').append('<div class="sim_light sim_light_off" id ="sim_light_13"></div>');
    $('#sim_board').append('<div id="sim_lcds"></div>');
    $('#sim_board').append('<div id="sim_lights"></div>');
    $('#sim_board').append('<div id="sim_buttons"></div>');
    $('#sim_board').append('<div id="sim_button_reset" class="sim_button"></div>');

    $('#sim_lcds').append('<div class="sim_lcd" id="sim_lcd_row0"></div>');
    $('#sim_lcds').append('<div class="sim_lcd" id="sim_lcd_row1"></div>');

    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_7"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_6"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_5"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_4"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_3"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_2"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_1"></div>');
    $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_0"></div>');

    $('#sim_buttons').append('<div id="sim_buttons_top"></div>');
    $('#sim_buttons').append('<div id="sim_buttons_middle"></div>');
    $('#sim_buttons').append('<div id="sim_buttons_bottom"></div>');

    $('#sim_buttons_top').append('<div id="sim_button_N" class="sim_button"></div>');

    $('#sim_buttons_middle').append('<div id="sim_button_W" class="sim_button"></div>');
    $('#sim_buttons_middle').append('<div id="sim_button_C" class="sim_button"></div>');
    $('#sim_buttons_middle').append('<div id="sim_button_E" class="sim_button"></div>');

    $('#sim_buttons_bottom').append('<div id="sim_button_S" class="sim_button"></div>');

    this.hideSonar();

    let self = this;
    // push buttons
    $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mousedown', function() {
        self.board.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 0;
        self.updateSimulatorView();
    });

    $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mouseup', function() {
        self.board.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 1;
        self.updateSimulatorView();
    });
  }

   /*
  * Simulator event handlers
  */

    handleSimulationStop(){
        this.logger.recordEvent(this.logger.createEvent("simStop", ""));
        this.isSimulationRunning = false;
        this.isSimulationPaused = false;
        this.setButtonsStop();
        this.stopSimulation();
        this.board.reset();         // Reset the board state to defaults for the next run
        this.updateSimulatorView(); // Update the simulator view so the default values are shown
  }

  showSonar(){
    $("#sim_sonar").show();
    $("#sim_sonar_distance").show();
    $("#sim_sonar_input").show();
  }

  hideSonar(){
    $("#sim_sonar").hide();
    $("#sim_sonar_distance").hide();
    $("#sim_sonar_input").hide();
  }


 

/* -------------------------------------------------------------------------
* Functions for handling the simulator controls
----------------------------------------------------------------------------*/
    /*
    * Starts the simulation for the current code
    */
    startSimulation() {
        this.startDebuggingView();
        this.initDebugger();
        // run debugger
        this.step();
    }

    /*
    * Starts the simulation for the current code with 1 step
    */
    startStepSimulation() {
        this.startDebuggingView();
        this.initDebugger();
        // run debugger
        this.oneStep();
    }

    /*
    * Stops the simulation and resets the view
    */
    stopSimulation() {
        this.stopDebuggingView();
        this.resetDwenguino();
    }

    /*
    * resumes a simulation that was paused
    */
    resumeSimulation() {
    // restart driving robot
    //TODO: restart the timed update loop

        this.step();
    }

    /*
    * initialize the debugging environment
    */
    initDebugger() {
        // initialize simulation
        this.initDwenguino();

        // get code
        this.debugger.code = Blockly.JavaScript.workspaceToCode(this.workspace);
        this.mapBlocksToCode();


        // create debugger
        this.debugger.debuggerjs = debugjs.createDebugger({
            iframeParentElement: document.getElementById('debug'),
            // declare context that should be available in debugger
            sandbox: {
                DwenguinoSimulation: this.simulationSandbox
            }
        });

        this.debugger.debuggerjs.machine.on('error', function(err) {
            console.log(err);
            console.error(err.message);
        });

        var filename = 'DwenguinoSimulation';
        this.debugger.debuggerjs.load(this.debugger.code, filename);

        // Performs a single step to start the debugging process, hihglights the setup loop block.
        this.debugger.debuggerjs.machine.step();
        this.updateBlocklyColour();
    }

    /*
    * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
    */
    step() {
        if (!this.isSimulationRunning) {
            return;
        }

        var line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
        this.debugger.debuggerjs.machine.step();

        // highlight the current block
        this.updateBlocklyColour();
        //his.handleScope();

        // Get current line
        var code = this.debugger.code.split("\n")[line] === undefined ? '' : this.debugger.code.split("\n")[line];

        // Update the scenario View
        // TODO: Do not reassign board, make sure updateScenario just changes the state of board
        this.board = this.currentScenario.updateScenario(this.board);

        // check if current line is not a sleep
        if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
            setTimeout(this.step.bind(this), this.speedDelay);
        } else {
            // sleep
            var delayTime = Number(this.debugger.code.split("\n")[line].replace(/\D+/g, ''));
            this.delayStepsTaken = 0;
            this.delayStepsToTake = Math.floor(delayTime/this.baseSpeedDelay);
            this.delayRemainingAfterSteps = delayTime % this.baseSpeedDelay;
            this.performDelayLoop();
        }
        this.updateSimulatorView();
        this.checkForEnd();
    }

    /*
    *  This function iterates until the delay has passed
    */
    performDelayLoop(){
        // Here we want the simulation to keep running but not let the board state update.
        // To do so we execute the updateScenario() function of the current scenario delay/speedDelay times
        // with an interval of speedDelay.
        if (this.delayStepsTaken < this.delayStepsToTake){
            // Update the scenario View
            // TODO: Do not reassign board, make sure updateScenario just changes the state of board
            this.board = this.currentScenario.updateScenario(this.board);
            this.updateSimulatorView();     // Update the simulator view
            this.delayStepsTaken++;
            setTimeout(() => {
                this.performDelayLoop();
            }, this.speedDelay);
        } else {
            setTimeout(() => { this.step() }, this.delayRemainingAfterSteps);
        }
    }

    /*
  * Lets the simulator run one step
  */
  oneStep() {
    // let driving robot update 1 frame
    // Update the scenario View
    // TODO: Do not reassign board, make sure updateScenario just changes the state of board
    this.board = this.currentScenario.updateScenario(this.board);

    // Get current line
    var line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    var code = this.debugger.code.split("\n")[line] === undefined ? '' : this.debugger.code.split("\n")[line];

    this.debugger.debuggerjs.machine.step();
    this.updateBlocklyColour();
    //this.handleScope();
    this.checkForEnd();

    // check if current line is not a sleep
    if (code.trim().startsWith("DwenguinoSimulation.sleep")) {
      // sleep
      var delayTime = Number(this.debugger.code.split("\n")[line].replace(/\D+/g, ''));
      this.delayStepsTaken = 0;
      this.delayStepsToTake = Math.floor(delayTime/this.baseSpeedDelay);
      this.delayRemainingAfterSteps = delayTime % this.baseSpeedDelay;
      this.performDelayLoop(function(){/*Do nothing after delay loop*/});
    }
  }

    /*
    * Displays the values of the variables during the simulation
    */
    handleScope() {
        var scope = this.debugger.debuggerjs.machine.getCurrentStackFrame().scope;
        //document.getElementById('sim_scope').innerHTML = "";
        for (var i in scope) {
            var item = scope[i];
            var value = this.debugger.debuggerjs.machine.$runner.gen.stackFrame.evalInScope(item.name);
            //document.getElementById('sim_scope').innerHTML = document.getElementById('sim_scope').innerHTML + item.name + " = " + value + "<br>";
        }
    }

    /*
    * Checks if the simulation has been interrupted
    */
    checkForEnd() {
        if ((this.isSimulationRunning || this.isSimulationPaused) &&
        this.debugger.debuggerjs.machine.halted) {
            this.isSimulationRunning = false;
            this.isSimulationPaused = false;
        }
    }

    /*
  * maps line numbers to blocks
  */
  mapBlocksToCode() {
    var setup_block = this.workspace.getAllBlocks()[0];

    var line = 0;
    var lines = this.debugger.code.split("\n");
    var loopBlocks = [];

    // update variables in while loop when searching for a match between block and line
    let updateBlocks = () => {
      // special structure for loop blocks -> look at children
      if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0] &&
      (lines[line].trim().startsWith("for") || lines[line].trim().startsWith("while") ||
      lines[line].trim().startsWith("if"))) {
        loopBlocks.push(block);
        this.debugger.blocks.blockMapping[line] = block;
        block = block.getInputTargetBlock('DO') || block.getInputTargetBlock('DO0');
      } else if (lines[line].trim() === Blockly.JavaScript.blockToCode(block).split('\n')[0]) {
        this.debugger.blocks.blockMapping[line] = block;
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
        this.debugger.blocks.blockMapping[line] = setup_block;
      line++;
    }

    // look at blocks after while
    block = setup_block.getInputTargetBlock('LOOP');
    while (block !== null && line < lines.length) {
      updateBlocks();
    }
  }

    /*
  * Changes the color of the blocks at each iteration of the simulator
  * The block that was previously executed is highlighted (=blue)
  */
 updateBlocklyColour() {
    var highlight_colour = 210;

    var line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
    if (this.debugger.code !== "" && typeof this.debugger.blocks.blockMapping[line] !== 'undefined') {
      // reset old block
      if (this.debugger.blocks.lastBlocks[0] !== null) {
        this.debugger.blocks.lastBlocks[0].setColour(this.debugger.blocks.lastColours[0]);
      }

      this.debugger.blocks.lastBlocks[0] = this.debugger.blocks.lastBlocks[1];
      this.debugger.blocks.lastColours[0] = this.debugger.blocks.lastColours[1];

      // highlight current block
      this.debugger.blocks.lastBlocks[1] = this.debugger.blocks.blockMapping[line];
      this.debugger.blocks.lastColours[1] = this.debugger.blocks.blockMapping[line].getColour();

      if (this.debugger.blocks.lastBlocks[0] !== null) {
        this.debugger.blocks.lastBlocks[0].setColour(highlight_colour);
      }
    }
  }

   /*
  * updates the speed of the simulation
  */
 setSpeed() {
    var e = document.getElementById("sim_speed");
    var option = e.options[e.selectedIndex].value;

    this.logger.recordEvent(this.logger.createEvent("setSpeed", option));

    switch (option) {
      case "veryslow":
        this.speedDelay = 600;
      break;
      case "slow":
        this.speedDelay = 300;
      break;
      case "medium":
        this.speedDelay = 150;
      break;
      case "fast":
        this.speedDelay = 75;
      break;
      case "veryfast":
        this.speedDelay = 32;
      break;
      case "realtime":
        this.speedDelay = 16;
    }
  }

   /*
   * Makes the simulation ready (draw the board)
   */
  initDwenguino() {
    //Reset the Dwenguino board display
    this.resetDwenguino();
    this.currentScenario.initSimulationDisplay(this.simulationViewContainerId);
  }

    /*
  * Resets the dwenguino (drawing) to its initial state (remove text, no sound etc)
  */
 resetDwenguino() {
    // delete debugger
    this.debugger.debuggerjs = null;
    this.debugger.code = "";
    this.debugger.blocks.blockMapping = {};

    // reset colours
    if (this.debugger.blocks.lastColours[0] !== -1) {
      this.debugger.blocks.lastBlocks[0].setColour(this.debugger.blocks.lastColours[0]);
    }
    this.debugger.blocks.lastColours = [-1, -1];
    this.debugger.blocks.lastBlocks = [null, null];

    var option = this.scenarioView;

    switch (option) {
      case "moving":
        this.resetBoard();
        break;
      case "wall":
        this.resetBoard();
        break;
      case "socialrobot":
        break;
      case "default":
        this.resetBoard();
        break;
    }
  }

  resetBoard(){
    this.board.reset();
    this.updateSimulatorView();
  }

  updateSimulatorView(){

    // Change the visuals of the pir sensor
    // TODO: Figure out how to update the pir sensor visuals

    // Show the sonar value
    var distance = Math.round(this.board.sonarDistance);
    if (distance <= -1){
        this.hideSonar();
    } else {
        this.showSonar();
        var sim_sonar  = document.getElementById('sonar_input');
        
        if(typeof(sim_sonar) != 'undefined' && sim_sonar != null){
            sim_sonar.value = distance;
        } else {
            console.log('Sonar input element is undefined');
        }
    }
    

    // Play audio on the buzzer
    if (this.board.buttons.audiocontext){
        if (this.board.buzzer.tonePlaying === 0) {
            this.board.buzzer.osc.stop();
        } else {
            // start tone
            this.board.buzzer.osc.frequency.value = this.board.buzzer.tonePlaying; // Hz
            this.board.buzzer.osc.connect(this.board.buzzer.audiocontext.destination); // connect it to the destination
            this.board.buzzer.osc.start(); // start the oscillator
        }
    }

    // Update the button view
    for (let i = 0 ; i < this.board.buttons.length ; i++){
        if (this.board.buttons[i] === 0){
            document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button sim_button_pushed";
        }else{
            document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button";    
        }
    }
    

    // Turn lcd backlight on or off.
    if (this.board.backlight){
        $("#sim_lcds").addClass("on");
    }else{
        $("#sim_lcds").removeClass("on");
    }
    
    // Set the board text on the screen
    for (var row = 0 ; row < 2 ; ++row){
        // write new text to lcd screen and replace spaces with &nbsp;
        $("#sim_lcd_row" + row).text(this.board.lcdContent[row]);
        if(document.getElementById('sim_lcd_row' + row) !== null){
            document.getElementById('sim_lcd_row' + row).innerHTML =
            document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
        }
    }
    // repaint
    var element = document.getElementById("sim_lcds");
    if(element !== null){
      element.style.display = 'none';
      element.offsetHeight;
      element.style.display = 'block';
    }
     

    // Set leds to right value
    for (var i = 0; i < 8; i++) {
        let classValue = "";
        if (this.board.leds[i] === 0){
            classValue = "sim_light sim_light_off";
        }else{
            classValue = "sim_light sim_light_on";
        }
        document.getElementById('sim_light_' + i).className = classValue;
      }
      // Set led 13 to right value
    if (this.board.leds[8] === 0){
        document.getElementById('sim_light_13').className = "sim_light sim_light_off";
    }else{
        document.getElementById('sim_light_13').className = "sim_light sim_light_on";
    }

  }


  //TODO: Remove this function!!!!

  /**
   * Returns the state of PIR sensor if it was added to the scenario. Otherwise it returns a low signal by default.
   * Displays the pin number that is used by the PIR sensor as output.
   * @param {int} trigPin 
   */
  pir(trigPin) {
    var sim_pir = document.getElementById('rc_pir_value');
    if (typeof(sim_pir) != 'undefined' && sim_pir != null) {
        sim_pir.innerHTML = ' Pin ' + trigPin;
    }
    var sim_canvas = document.getElementById('sim_pir_canvas1');
    if(typeof(sim_canvas) != 'undefined' && sim_canvas != null){
      return this.scenarios['socialrobot'].robot.sim_pir_canvas1.state;
    } else {
      return 0;
    }
  }

  /*
  * Adjust css when simulation is started
  */
  setButtonsStart() {
    // enable pauze and stop
    document.getElementById('sim_pause').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable start and step
    document.getElementById('sim_start').className = "sim_item_disabled";
    document.getElementById('sim_step').className = "sim_item_disabled";
  }

  /*
  * Adjust css when simulation is paused
  */
  setButtonsPause() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable pause
    document.getElementById('sim_pause').className = "sim_item_disabled";
  }

  /*
  * Adjust css when simulation is stopped
  */
  setButtonsStop() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    // disable pause
    document.getElementById('sim_stop').className = "sim_item_disabled";
    document.getElementById('sim_pause').className = "sim_item_disabled";
  }

  /*
  * Adjust css when simulation is run step by step
  */
  setButtonsStep() {
    // enable start, stop and step
    document.getElementById('sim_start').className = "sim_item";
    document.getElementById('sim_step').className = "sim_item";
    document.getElementById('sim_stop').className = "sim_item";
    // disable pause
    document.getElementById('sim_pause').className = "sim_item_disabled";
  }
  /*
  * Adjusts the view during simulation
  * disables the programming and makes the simulation pane biggger
  */
  startDebuggingView() {
    if (document.getElementsByClassName("alertDebug").length !== 0) {
      document.getElementsByClassName("alertDebug")[0].remove();
    }
    var alertMessage = '<div class ="alertDebug">' + MSG.simulator['alertDebug'] + '</div>';
    $('#db_body').append(alertMessage);
    document.getElementsByClassName('alertDebug')[0].style.width = document.getElementById("blocklyDiv").style.width;
    document.getElementById('blocklyDiv').style.opacity = "0.5";
    //document.getElementById('blocklyDiv').style.pointerEvents = "none";
  }
  /*
  * Returns to normal view when debugging is finished
  */
  stopDebuggingView() {
    document.getElementById('blocklyDiv').style.opacity = "1";
    document.getElementById('blocklyDiv').style.pointerEvents = "auto";
    if (document.getElementsByClassName("alertDebug").length !== 0) {
      document.getElementsByClassName("alertDebug")[0].remove();
    }
  }

}


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