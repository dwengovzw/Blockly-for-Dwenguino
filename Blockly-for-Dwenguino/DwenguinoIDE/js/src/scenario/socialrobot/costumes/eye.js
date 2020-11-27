import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/servo.js';

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

export default Eye;