import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { Buzzer }

class Buzzer extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'buzzer';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.BUZZER;
    }

}