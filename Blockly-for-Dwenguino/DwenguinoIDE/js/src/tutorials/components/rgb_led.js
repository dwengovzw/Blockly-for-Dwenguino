import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { RgbLed }

class RgbLed extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'rgbled';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.RGBLED;
    }

    static getDescription(){
        return MSG.simulator['rgbledDescription'];
    }

    static getInputPins(){
        return [];
    }

    static getOutputPins(){
        return [];
    }
}