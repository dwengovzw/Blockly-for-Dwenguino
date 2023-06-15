import SimulationControlsController from "./simulation_controls_controller.js";
import DwenguinoSimulationScenarioSocialRobot from "../scenario/socialrobot/dwenguino_simulation_scenario_social_robot.js";
import DwenguinoSimulationScenarioRidingRobot from "../scenario/ridingrobot/dwenguino_simulation_scenario_riding_robot.js";
import DwenguinoSimulationScenarioRidingRobotWithWall from "../scenario/ridingrobot/dwenguino_simulation_scenario_riding_robot_with_wall.js";
import DwenguinoSimulationScenarioSpyrograph from "../scenario/spyrograph/dwenguino_simulation_scenario_spyrograph.js"
import DwenguinoSimulationScenarioPlotter from "../scenario/plotter/dwenguino_simulation_scenario_plotter.js";
import DwenguinoSimulationScenarioConveyor from "../scenario/conveyor/dwenguino_simulation_scenario_conveyor.js";
import SCENARIO from "../../../../../backend/models/saved_state.model"

class DwenguinoSimulation {
    logger = null;
    workspace = null;
    scenarios = null;

    constructor(logger, workspace) {
        this.scenarios = {
            "spyrograph": new DwenguinoSimulationScenarioSpyrograph(logger, "spyrograph"),
            "moving": new DwenguinoSimulationScenarioRidingRobot(logger, "moving"),
            "wall": new DwenguinoSimulationScenarioRidingRobotWithWall(logger, "wall"),
            "socialrobot": new DwenguinoSimulationScenarioSocialRobot(logger, "socialrobot"),
            "conveyor": new DwenguinoSimulationScenarioConveyor(logger, "conveyor"),
        };
        this.logger = logger;
        this.workspace = workspace;
        this.simControlsController = new SimulationControlsController(this.logger, this.workspace, this.scenarios);
    }

    open() {
        // Do nothing for now, once crated always created
    }
    stop() {
        this.simControlsController.handleSimulationStop();
    }

    getCurrentScenario(){
        return this.simControlsController.getCurrentScenario();
    }

    setCurrentScenario(scenarioName){
        this.simControlsController.setCurrentScenario(scenarioName);
    }

    addStateHasChangedListener(listener){
        this.simControlsController.addStateHasChangedListener(listener);
        // For of loop here breaks webpack
        for (let key of Object.keys(this.scenarios)){
            this.scenarios[key].addStateHasChangedListener(listener);
        }
    }
}

export default DwenguinoSimulation;