import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { SoundSensor }

class SoundSensor extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'sound';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.SOUND;
    }

    static getDescription(){
        return DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['sonarDescription']);
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }
}