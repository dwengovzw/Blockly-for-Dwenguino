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

}