import DwenguinoSimulationScenario from '../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/DwenguinoSimulationScenario.js'

export default class RandomSimulationEnvironment extends DwenguinoSimulationScenario{
    tick = 0;
    constructor(){
        // We do not use a logger here since we are on the backend
        super(null);
        this.tick = 0;
    }

    /* @brief Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param containerIdSelector The jquery selector of the conainer to put the robot display.
    *
    */
   initSimulationState(boardState){
     super.initSimulationState(boardState);
   }

    /* @brief Initializes the simulator robot display.
    * This function puts all the nececary visuals inside the container with the id containerId.
    * Additionally, it sets up the state of the simulated robot.
    *
    * @param containerId The id of the conainer to put the robot display.
    *
    */
    initSimulationDisplay(containerId){
        // No container here so don't call super;
    }


    /* @brief updates the simulation state and display
    * This function updates the simulation state and display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenario(dwenguinoState){
        this.updateScenarioState(dwenguinoState);
        // No display so no update needed
    }

    /* @brief updates the simulation state
    * This function updates the simulation state using the supplied board state.
    * 
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioState(dwenguinoState){
        this.tick += 1;
        if (this.tick == 1000000){
          this.tick = 0;
        }
      
        var D = Math.sin(this.tick/(Math.PI*100)*50) * 250;
            
        if (isNaN(D)){
            dwenguinoState.setSonarDistance(11, 12, -1);
            //dwenguinoState.sonarDistance = -1;
        }else{
            dwenguinoState.setSonarDistance(11, 12, D);
            //dwenguinoState.sonarDistance = D;
        }
      
      
        // Generate random button presses
        // shift the sinus function in time with i*10 for each button
        for (var i = 0 ; i < 5 ; i++){
          var B = Math.sin(this.tick/(15*100) + i*10);
          if (B < 0){
            dwenguinoState.buttons[i] = 0;
          }else{
            dwenguinoState.buttons[i] = 1;
          }
        }

        // Generate random input values for digital input pins
        for (let i = 0 ; i < dwenguinoState.numberOfDigitalPins ; ++i){
            if (dwenguinoState.digitalIoMask == 0){
                var B = Math.sin(this.tick/(15*100) + i*3);
                if (B < 0){
                    dwenguinoState.ioPins[i] = 0;
                }else{
                    dwenguinoState.ioPins[i] = 1;
                }
            }
        }
        // Generate random input values for the analog pins
        for (let i = 0 ; i < dwenguinoState.numerOfAnalogPins ; ++i){
            if (dwenguinoState.analogIoMask == 0){
                var B = Math.sin(this.tick/(15*100) + i*9);
                dwenguinoState.analogIoPins[i] = B;
            }
        }
      
    }

    /* @brief updates the simulation display
    * This function updates the simulation display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioDisplay(dwenguinoState){
        // No display so no update
    }

}