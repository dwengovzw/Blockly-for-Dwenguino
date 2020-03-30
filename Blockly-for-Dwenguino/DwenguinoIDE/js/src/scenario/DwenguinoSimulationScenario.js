/*
 * This Object is the abstraction of a simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 * This class has a dependency on the translation files in the /msg folder
 * This class has a dependency on the JQuery library
 */

export default class DwenguinoSimulationScenario {

    logger = null;
    constructor(logger){
        this.logger = logger;
        console.log("Constructor");
    }

    /* @brief Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param containerIdSelector The jquery selector of the conainer to put the robot display.
    *
    */
    initSimulationState(){
        console.log("initSimulationState");

    }

    /* @brief Initializes the simulator robot display.
    * This function puts all the nececary visuals inside the container with the id containerId.
    * Additionally, it sets up the state of the simulated robot.
    *
    * @param containerId The id of the conainer to put the robot display.
    *
    */
    initSimulationDisplay(containerId){
        // Clear the container
        $(`#${containerId}`).empty();
    }


    /* @brief updates the simulation state and display
    * This function updates the simulation state and display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenario(dwenguinoState){
    }

    /* @brief updates the simulation state
    * This function updates the simulation state using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioState(dwenguinoState){
    }

    /* @brief updates the simulation display
    * This function updates the simulation display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioDisplay(dwenguinoState){
    }
}