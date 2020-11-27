import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/servo.js';

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

export default Plain;