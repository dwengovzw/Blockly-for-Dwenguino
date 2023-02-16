import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';
import { RobotComponent } from './robot_component.js';
import { BinaryInputRobotComponent } from './binary_input_robot_component.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotButton }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotButton extends BinaryInputRobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }
    constructor(){
        super(0, 1);
        BindMethods(this);
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let activeImage = `${settings.basepath}DwenguinoIDE/img/board/button_pushed.png`;
        let inactiveImage = `${settings.basepath}DwenguinoIDE/img/board/button.png`;
        
        super.initComponent(TypesEnum.BUTTON, 
            ['simulator', 'button'], 
            ['buttonOptions'], 
            "button", 
            activeImage, 
            inactiveImage, 
            'sim_button_canvas', 
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
        let activeImage = `${settings.basepath}DwenguinoIDE/img/board/button_pushed.png`;
        let inactiveImage = `${settings.basepath}DwenguinoIDE/img/board/button.png`;
        super.initComponentFromXml(eventBus,
            TypesEnum.BUTTON,
            ['simulator', 'button'], 
            ['buttonOptions'],
            activeImage,
            inactiveImage,
            id,
            xml);
    }


    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, "SW_N", "SW_E", "SW_S", "SW_W", "SW_C"];
    }

    reset(){
        super.reset();
    }

}