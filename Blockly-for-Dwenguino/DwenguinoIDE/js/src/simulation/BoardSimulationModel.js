export default class BoardSimulationModel{
    scenarios = null;
    scenarioView = null;
    currentScenario = null;
    speedDelay = 16;
    baseSpeedDelay = 16;
    isSimulationRunning = false;
    isSimulationPaused = false;
    debuggingView = false;
    
    constructor(){
        this.initScenarioState();
        this.scenarioView = "moving";
        this.currentScenario = this.scenarios[this.scenarioView];

    }

    /**
     *  This function initializes the different simulation scenario's. 
     *  New scenario's should implement the DwenguinoSimulationScenario interface
     *  and an instance should be added here.
     */
    initScenarioState(){
        this.scenarios = {
            "moving": new DwenguinoSimulationScenarioRidingRobot(),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(),
            //"spyrograph": new DwenguinoSimulationScenarioSpyrograph() /*, "moving", "wall", "spyrograph"*/
          };
    }


    
}