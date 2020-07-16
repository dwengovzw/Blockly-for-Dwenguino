import BoardState from '../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/simulation/BoardState.js'
import SimulationSandbox from '../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/simulation/SimulationSandbox.js'
import Machine from '../debugjs/lib/machine.js';
import Debugger from '../debugjs/lib/debugger.js';

/**
 * NOTICE! This is a copy of the file in the frontend. It should be the same file.
 * However, because of issues with the EMS syntax I cannot import it in a proper way in both
 * node as the browser.
 */

export default class BaseSimulationRunner{
    board = null;
    debugger = null;
    simulationSandbox = null;
    currentScenario = null;
    speedDelay = 16;
    baseSpeedDelay = 16;
    isSimulationRunning = false;
    isSimulationPaused = false;
    constructor(){
        this.board = new BoardState();
        this.simulationSandbox = new SimulationSandbox(this.board);
        this.initDebuggerState();
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

    setCurrentScenario(scenario){
        this.currentScenario = scenario;
        this.simulationSandbox.setCurrentScenario(this.currentScenario);
        this.resetDwenguino();
    }

    initScenario(){
        // reset scenario state
        this.currentScenario.initSimulationState(this.board);
        this.currentScenario.initSimulationDisplay("");
        this.currentScenario.updateScenario(this.board);
    }

    /**
    * Resets the dwenguino (drawing) to its initial state (remove text, no sound etc)
    */
   resetDwenguino() {
        // delete debugger
        this.debugger.debuggerjs = null;
        this.debugger.code = "";
        this.debugger.blocks.blockMapping = {};

        // Reset the board state
        this.board.resetBoard();
        
        this.initScenario();
    }

    /*
    * initialize the debugging environment 
    * This is different in the frontend.
    */
   createDebugger(options = {}) {
    return new Debugger(new Machine(options.sandbox, options));
   }

   initDebugger(code) {
        // initialize simulation
        this.resetDwenguino();
        // get code
        this.debugger.code = code;
        // create debugger
        this.debugger.debuggerjs = this.createDebugger({
            //iframeParentElement: document.getElementById('debug'),
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
        
    }

    /*
    * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
    */
   step(once = false) {
        if (this.isSimulationPaused) {
            return;
        }

        // Read the next line and execute it. The sandbox environment will update the board state
        var line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
        this.debugger.debuggerjs.machine.step();


        // Get current line
        var code = this.debugger.code.split("\n")[line] === undefined ? '' : this.debugger.code.split("\n")[line];

        // Update the scenario View
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

}