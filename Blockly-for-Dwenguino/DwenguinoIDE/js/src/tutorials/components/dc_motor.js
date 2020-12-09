import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { DCMotor }

class DCMotor extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'DC Motor';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.DCMOTOR;
    }

    static getDescription(){
        return MSG.simulator['DCMotorDescription'];
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return ['speed'];
    }
}