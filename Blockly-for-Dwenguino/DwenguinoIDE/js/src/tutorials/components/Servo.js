import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { Servo }

class Servo extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'Servo';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.SERVO;
    }

    static getDescription(){
        return MSG.simulator['servoDescription'];
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return ['angle'];
    }
}