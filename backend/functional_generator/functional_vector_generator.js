import RandomSimulationEnvironment from "./random_simulation_environment.js"
import FunctionalSimulationRunner from "./functional_simulation_runner.js";

class FunctionalDataGenerator{
    simulationRunner = null;
    randomSimulationScenario = null;
    _numberOfCodeStepsToSimulate = 3900000;
    constructor(){
        this.simulationRunner = new FunctionalSimulationRunner();
        this.randomSimulationScenario = new RandomSimulationEnvironment();
        this.simulationRunner.setCurrentScenario(this.randomSimulationScenario);
    }

    generateFunctionalVector(code){
        let fVector = this.simulationRunner.generateSimulatedData(code, this._numberOfCodeStepsToSimulate, 1);
        return fVector;
    }
}

export default FunctionalDataGenerator;