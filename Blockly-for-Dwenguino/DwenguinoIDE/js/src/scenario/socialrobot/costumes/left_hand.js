import { Costume } from './Costume.js'
import { CostumesEnum } from '../components/servo.js';

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

export default Lefthand;