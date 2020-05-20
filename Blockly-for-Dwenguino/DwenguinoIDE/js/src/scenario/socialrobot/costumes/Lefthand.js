import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/Servo.js';
export { Lefthand}

class Lefthand extends Costume{
    constructor(){
        super(CostumesEnum.LEFTHAND);
    }

    toString(){
        let str = '';
        str = str.concat(this.getType(), ' ');
        return str;
    }
}