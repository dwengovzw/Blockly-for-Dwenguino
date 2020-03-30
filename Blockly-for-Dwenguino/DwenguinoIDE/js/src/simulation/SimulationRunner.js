import BoardState from "./BoardState.js";
import SimulationSandbox from "./SimulationSandbox.js";
import SimulationController from "../scenario/DwenguinoBoardSimulation.js";

export default class SimulationRunner {
    board = null;
    debugger = null;
    simulationSandbox = null;
    logger = null;
    workspace = null;
    scenarios = null;
    currentScenario = null;
    //simulationController = null;

    speedDelay = 16;
    baseSpeedDelay = 16;
    isSimulationRunning = false;
    isSimulationPaused = false;

    simulationViewContainerId = "db_simulator_panes";

    constructor(logger, workspace) {
        this.board = new BoardState();
        this.simulationSandbox = new SimulationSandbox(this.board);
        this.logger = logger;
        this.workspace = workspace;
        this.initDebuggerState();
    }

    setCurrentScenario(scenario){
        this.currentScenario = scenario;
        this.resetDwenguino();
    }

    /**
     * This function initializes the debugger state to prepare it for step by step execution.
     */
    initDebuggerState() {
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


    /**
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

        // Reset the board state
        this.board.resetBoard();
        // reset scenario state
        this.currentScenario.initSimulationState();
        this.currentScenario.initSimulationDisplay(this.simulationViewContainerId);
        this.currentScenario.updateScenario(this.board);


        

    }


    /*
    * initialize the debugging environment
    */
    initDebugger() {
        // initialize simulation
        this.resetDwenguino();


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

        this.debugger.debuggerjs.machine.on('error', function (err) {
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
    step(once = false) {
        if (this.isSimulationPaused) {
            return;
        }

        // make sure the SimulationController updates the state of the buttons on the board
        //this.simulationController.updateSimulationState(this.board);

        // Read the next line and execute it. The sandbox environment will update the board state
        var line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
        this.debugger.debuggerjs.machine.step();

        // highlight the current block
        this.updateBlocklyColour();

        // Get current line
        var code = this.debugger.code.split("\n")[line] === undefined ? '' : this.debugger.code.split("\n")[line];

        // Update the scenario View
        // TODO: Do not reassign board, make sure updateScenario just changes the state of board
        this.currentScenario.updateScenario(this.board);

        // check if current line is not a sleep
        if (!code.trim().startsWith("DwenguinoSimulation.sleep")) {
            if (!once){
                setTimeout(this.step.bind(this), this.speedDelay);
            } else {
                this.isSimulationPaused = true;
            }
            
        } else {
            // sleep
            var delayTime = Number(this.debugger.code.split("\n")[line].replace(/\D+/g, ''));
            this.delayStepsTaken = 0;
            this.delayStepsToTake = Math.floor(delayTime / this.baseSpeedDelay);
            this.delayRemainingAfterSteps = delayTime % this.baseSpeedDelay;
            this.performDelayLoop(once);
        }
        //this.simulationController.updateSimulationDisplay(this.board);
        this.checkForEnd();
    }


    /*
   *  This function iterates until the delay has passed
   */
    performDelayLoop(once) {
        // Here we want the simulation to keep running but not let the board state update.
        // To do so we execute the updateScenario() function of the current scenario delay/speedDelay times
        // with an interval of speedDelay.
        if (this.delayStepsTaken < this.delayStepsToTake) {
            // Update the scenario View
            // TODO: Do not reassign board, make sure updateScenario just changes the state of board
            this.currentScenario.updateScenario(this.board);
            //this.simulationController.updateSimulationDisplay(this.board);     // Update the simulator view
            this.delayStepsTaken++;
            setTimeout(() => {
                this.performDelayLoop(once);
            }, this.speedDelay);
        } else {
            if (!once) { 
                setTimeout(()=> { this.step() }, this.delayRemainingAfterSteps);
            } else {
                this.isSimulationPaused = true;
            }
        }
    }

    /*
    * Displays the values of the variables during the simulation
    */
    handleScope() {
        var scope = this.debugger.debuggerjs.machine.getCurrentStackFrame().scope;
        for (var i in scope) {
            var item = scope[i];
            var value = this.debugger.debuggerjs.machine.$runner.gen.stackFrame.evalInScope(item.name);
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


}