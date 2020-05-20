import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/Servo.js';
export { Plain}

class Plain extends Costume{
    constructor(){
        super(CostumesEnum.PLAIN);
    }

    toString(){
        let str = '';
        str = str.concat(this.getType(), ' ');
        return str;
    }
}