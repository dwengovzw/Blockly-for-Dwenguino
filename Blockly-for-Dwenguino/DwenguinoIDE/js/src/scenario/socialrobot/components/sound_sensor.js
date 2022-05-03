import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { RobotComponent } from  './robot_component.js'
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';
import BindMethods from "../../../utils/bindmethods.js"


export { SocialRobotSoundSensor }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotSoundSensor extends RobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }
    constructor(){
        super();  
        BindMethods(this);
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let label = DwenguinoBlocklyLanguageSettings.translate(['soundButtonLabel']) + " " + id;
        let buttonId = '' + TypesEnum.SOUND + id;
        this._button = new Button(buttonId, 'sensor_options', label);
        
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.SOUND, 'sound sensor', pins, state, visible, width, height, offsetLeft, offsetTop, `${settings.basepath}DwenguinoIDE/img/socialrobot/sound_sensor.png`, 'sim_sound_canvas' + id);
        
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['soundButtonLabel']) + " " + id;
        let buttonId = '' + TypesEnum.SOUND + id;
        this._button = new Button(buttonId, 'sensor_options', label);
        
        super.initComponentFromXml(eventBus, `${settings.basepath}DwenguinoIDE/img/socialrobot/sound_sensor.png`, id, xml);
    }

    insertHtml(){
        var self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage(self._image.src);
                self.setState(1);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage(self._image.src);
                self.setState(0);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(['soundOptions']));
    }

    removeHtml(){
        super.removeHtml();
        this.getButton().remove();
    }

    reset(){
        super.reset();
        this._button.reset();
    }

    getAllPossiblePins(){
        return ["SOUND_1", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"];
    }

    getButton(){
        return this._button;
    }
}