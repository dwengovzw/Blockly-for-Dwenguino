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

    static getDescription(){
        return DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['buzzerDescription']);
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return ['frequency'];
    }

}