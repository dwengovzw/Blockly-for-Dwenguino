import BoardState from "./BoardState.js";
import SimulationSandbox from "./SimulationSandbox.js";
import SimulationController from "../scenario/DwenguinoBoardSimulation.js";
import BaseSimulationRunner from "./BaseSimulationRunner.js"

export default class SimulationRunner extends BaseSimulationRunner{
    logger = null;
    workspace = null;
    //simulationController = null;

    simulationViewContainerId = "db_simulator_panes";

    constructor(logger, workspace) {
        super();
        this.logger = logger;
        this.workspace = workspace;
    }

    /**
    * Resets the dwenguino (drawing) to its initial state (remove text, no sound etc)
    */
    resetDwenguino() {
        super.resetDwenguino();
        // reset colours
        if (this.debugger.blocks.lastColours[0] !== -1) {
            this.debugger.blocks.lastBlocks[0].setColour(this.debugger.blocks.lastColours[0]);
        }
        this.debugger.blocks.lastColours = [-1, -1];
        this.debugger.blocks.lastBlocks = [null, null];
        

    }

    initScenario(){
        // reset scenario state
        this.currentScenario.initSimulationState();
        this.currentScenario.initSimulationDisplay(this.simulationViewContainerId);
        this.currentScenario.updateScenario(this.board);
    }


    /*
    * initialize the debugging environment
    */
    initDebugger() {
        let code = Blockly.JavaScript.workspaceToCode(this.workspace);
        super.initDebugger(code)
        this.mapBlocksToCode();
        this.updateBlocklyColour();
    }

    /*
    * While the simulation is running, this function keeps being called with "speeddelay" timeouts in between
    */
    step(once = false) {
        super.step(once);
        // highlight the current block
        this.updateBlocklyColour();
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