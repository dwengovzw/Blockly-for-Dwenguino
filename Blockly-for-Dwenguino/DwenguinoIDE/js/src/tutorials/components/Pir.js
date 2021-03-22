import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { Pir }

class Pir extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'PIR sensor';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.PIR;
    }

    static getDescription(){
        return DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['pirDescription']);
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }

}