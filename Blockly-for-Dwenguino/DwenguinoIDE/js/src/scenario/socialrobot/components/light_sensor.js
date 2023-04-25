import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Slider } from '../../utilities/slider.js';
import BindMethods from "../../../utils/bindmethods.js"
import { BinaryInputRobotComponent } from './binary_input_robot_component.js';

export { SocialRobotLightSensor }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotLightSensor extends BinaryInputRobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }

    constructor(simulation_container=null){
        super(1, 0, simulation_container);
        BindMethods(this);
        this._activeImageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/light_sensor.png`;
        this._inactiveImageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/light_sensor.png`;
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        super.initComponent(TypesEnum.LIGHT,
            ['lightSensorButtonLabel'],
            ['lightSensorOptionsLabel'],
            "light_sensor",
            this._activeImageUrl,
            this._inactiveImageUrl,
            'sim_light_canvas' + id,
            eventBus,
            id,
            pins,
            state,
            visible,
            width,
            height,
            offsetLeft,
            offsetTop,
            htmlClasses)
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['lightSensorSliderLabel']) + " " + id;
        super.initComponentFromXml(eventBus,
            TypesEnum.LIGHT,
            ['lightSensorButtonLabel'],
            ['lightSensorOptionsLabel'],
            this._activeImageUrl,
            this._inactiveImageUrl,
            id, 
            xml)
    }


    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }


}