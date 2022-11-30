import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';
import { RobotComponent } from './robot_component.js';
import { BinaryInputRobotComponent } from './binary_input_robot_component.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotPir }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotPir extends BinaryInputRobotComponent{

    static pinNames = {
        digitalPin: "digitalPin"
    }
    constructor(){ 
        super();
        BindMethods(this);
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let activeImage = `${settings.basepath}DwenguinoIDE/img/socialrobot/pir_on.png`;
        let inactiveImage = `${settings.basepath}DwenguinoIDE/img/socialrobot/pir_off.png`;
        
        super.initComponent(TypesEnum.PIR, 
            ['simulator', 'pir'], 
            ['pirOptions'], 
            "pir", 
            activeImage, 
            inactiveImage, 
            'sim_pir_canvas', 
            eventBus, 
            id, 
            pins, 
            state, 
            visible, 
            width,
            height, 
            offsetLeft, 
            offsetTop, 
            htmlClasses);
    }

    initComponentFromXml(eventBus, id, xml){
        let activeImage = `${settings.basepath}DwenguinoIDE/img/socialrobot/pir_on.png`;
        let inactiveImage = `${settings.basepath}DwenguinoIDE/img/socialrobot/pir_off.png`;
        super.initComponentFromXml(eventBus,
            TypesEnum.PIR,
            ['simulator', 'pir'], 
            ['pirOptions'],
            activeImage,
            inactiveImage,
            id,
            xml);
    }

    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }

}