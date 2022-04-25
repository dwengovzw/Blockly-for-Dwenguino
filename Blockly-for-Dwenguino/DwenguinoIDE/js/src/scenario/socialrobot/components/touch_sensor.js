import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';
import { RobotComponent } from  './robot_component.js'

export { SocialRobotTouchSensor }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotTouchSensor extends RobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }
    constructor(){
        super();
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let label = DwenguinoBlocklyLanguageSettings.translate(['touchButtonLabel']) + " " + id;
        let buttonId = '' + TypesEnum.TOUCH + id;
        this._button = new Button(buttonId, 'sensor_options', label);
        
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.TOUCH, "touch sensor", pins, state, visible, width, height, offsetLeft, offsetTop, `${settings.basepath}DwenguinoIDE/img/socialrobot/touch_sensor.svg`, 'sim_touch_canvas' + id);
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['touchButtonLabel']) + " " + id;
        let buttonId = '' + TypesEnum.TOUCH + id;
        this._button = new Button(buttonId, 'sensor_options', label);

        super.initComponentFromXml(eventBus, `${settings.basepath}DwenguinoIDE/img/socialrobot/touch_sensor.svg`, id, xml);
    }


    insertHtml(){
        var self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/touch_sensor_on.svg`);
                self.setState(1);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/touch_sensor.svg`);
                self.setState(0);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(['touchOptions']));
    }

    removeHtml(){
        super.removeHtml()
        this.getButton().remove();
    }

    reset(){
        super.reset();
        this._button.reset();
    }

    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }

    getButton(){
        return this._button;
    }
}