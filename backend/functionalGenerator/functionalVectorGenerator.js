import RandomSimulationEnvironment from "./randomSimulationEnvironment.js"
import FunctionalSimulationRunner from "./functionalSimulationRunner.js";

export default class FunctionalDataGenerator{
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