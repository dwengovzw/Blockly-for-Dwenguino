import { DwenguinoComponent, DwenguinoComponentTypesEnum } from './DwenguinoComponent.js';

export { Led }

class Led extends DwenguinoComponent{
    constructor(){
        super();
    }

    toString(){
        return 'led';
    }

    static getType(){
        return DwenguinoComponentTypesEnum.LED;
    }

}