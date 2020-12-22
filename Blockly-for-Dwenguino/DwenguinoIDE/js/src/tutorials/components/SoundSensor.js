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
        return MSG.simulator['sonarDescription'];
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }
}