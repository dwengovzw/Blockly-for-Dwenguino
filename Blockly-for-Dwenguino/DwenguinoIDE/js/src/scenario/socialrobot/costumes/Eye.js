import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/Servo.js';
export { Eye}

class Eye extends Costume{
    constructor(){
        super(CostumesEnum.EYE);
    }

    toString(){
        let str = '';
        str = str.concat(this.getType(), ' ');
        return str;
    }
}