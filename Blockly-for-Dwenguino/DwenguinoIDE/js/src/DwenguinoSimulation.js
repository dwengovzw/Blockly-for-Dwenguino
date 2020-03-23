import BoardState from "./simulation/BoardState.js";
import SimulationRunner from "./simulation/SimulationRunner.js";
import BoardSimulation from "./simulation/BoardSimulation.js";
import SimulationControlsController from "./simulation/SimulationControlsController.js";
import SimulationController from "./simulation/SimulationController.js";
import DwenguinoSimulationScenarioSocialRobot from "./scenario/socialrobot/DwenguinoSimulationScenarioSocialRobot.js"

export default class DwenguinoSimulation{
    logger = null;
    workspace = null;
    scenarios = null;
    
    constructor(logger, workspace){
        this.scenarios = {
            "moving": new DwenguinoSimulationScenarioRidingRobot(),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(),
            //"spyrograph": new DwenguinoSimulationScenarioSpyrograph() /*, "moving", "wall", "spyrograph"*/
        };
        this.logger = logger;
        this.workspace = workspace;
        this.simControlsController = new SimulationControlsController(this.logger, this.workspace, this.scenarios);
        //this.open();
        
    }

    open(){
        // Do nothing for now, once crated always created
    }
    stop(){
        this.simControlsController.handleSimulationStop();
    }
}