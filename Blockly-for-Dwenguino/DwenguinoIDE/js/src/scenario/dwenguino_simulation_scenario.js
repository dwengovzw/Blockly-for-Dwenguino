/**
 * This class is the abstraction of a simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 * This class has a dependency on the translation files in the /msg folder
 * This class has a dependency on the JQuery library
 */
class DwenguinoSimulationScenario {

    isSimulationRunning = false;
    logger = null;

    audiocontext = null;
    osc = null;

    constructor(logger) {
        this.logger = logger;
    }

    /**
    * Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param {BoardState} boardState - The state of the Dwenguino board.
    *
    */
    initSimulationState(boardState) {
        console.log("initSimulationState");
    }

    /** 
    * Initializes the simulator robot display.
    * This function puts all the nececary visuals inside the container with the id containerId.
    * Additionally, it sets up the state of the simulated robot.
    *
    * @param {string} containerId - The id of the conainer to put the robot display.
    *
    */
    initSimulationDisplay(containerId) {
        // Clear the container
        $(`#${containerId}`).empty();
    }


    /** 
    * This function updates the simulation state and display using the supplied board state.
    *
    * @param {BoardState} boardState - The state of the Dwenguino board.
    *
    */
    updateScenario(dwenguinoState) {
    }

    /**
    * This function updates the simulation state using the supplied board state.
    *
    * @param {BoardState} boardState - The state of the Dwenguino board.
    *
    */
    updateScenarioState(dwenguinoState) {
    }

    /**
    * This function updates the simulation display using the supplied board state.
    *
    * @param {BoardState} boardState - The state of the Dwenguino board.
    *
    */
    updateScenarioDisplay(dwenguinoState) {
    }

    setIsSimulationRunning(isSimulationRunning){
        this.isSimulationRunning = isSimulationRunning;
    }

    getIsSimulationRunning() {
        return this.isSimulationRunning;
    }

    /**
     * Resets the internal state of the scenario. 
     * f.e. reset the social robot components to their original position or move the drawing robot arms to their start posistion.
     */
    resetScenario(){

    }

}

export default DwenguinoSimulationScenario;