import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { TouchSensor }

class TouchSensor extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'touch sensor';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.TOUCH;
    }

    static getDescription(){
        return DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['touchDescription']);
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }
}