import SimulationControlsController from "./simulation_controls_controller.js";
import DwenguinoSimulationScenarioSocialRobot from "../scenario/socialrobot/dwenguino_simulation_scenario_social_robot.js";
import DwenguinoSimulationScenarioRidingRobot from "../scenario/ridingrobot/dwenguino_simulation_scenario_riding_robot.js";
import DwenguinoSimulationScenarioRidingRobotWithWall from "../scenario/ridingrobot/dwenguino_simulation_scenario_riding_robot_with_wall.js";
import DwenguinoSimulationScenarioSpyrograph from "../scenario/spyrograph/dwenguino_simulation_scenario_spyrograph.js"
import DwenguinoSimulationScenarioPlotter from "../scenario/plotter/dwenguino_simulation_scenario_plotter.js";

class DwenguinoSimulation{
    logger = null;
    workspace = null;
    scenarios = null;
    
    constructor(logger, workspace){
        this.scenarios = {
            "spyrograph": new DwenguinoSimulationScenarioSpyrograph(logger),
            "moving": new DwenguinoSimulationScenarioRidingRobot(logger),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(logger),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(logger),
            "plotter": new DwenguinoSimulationScenarioPlotter(logger)
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

export default DwenguinoSimulation;