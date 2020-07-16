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

}