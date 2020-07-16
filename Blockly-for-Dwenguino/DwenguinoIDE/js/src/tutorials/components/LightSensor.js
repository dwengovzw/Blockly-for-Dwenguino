import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { LightSensor }

class LightSensor extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'light sensor';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.LIGHT;
    }

    static getDescription(){
        return '';
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }
    
}