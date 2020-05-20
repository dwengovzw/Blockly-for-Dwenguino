import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/Servo.js';
export { Righthand}

class Righthand extends Costume{
    constructor(){
        super(CostumesEnum.RIGHTHAND);
    }

    toString(){
        let str = '';
        str = str.concat(this.getType(), ' ');
        return str;
    }
}