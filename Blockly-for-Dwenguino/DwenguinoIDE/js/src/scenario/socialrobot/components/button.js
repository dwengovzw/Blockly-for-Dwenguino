import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';
import { RobotComponent } from './robot_component.js';

export { SocialRobotButton }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotButton extends RobotComponent{
    static pinNames = {
        ditigalPin: "digitalPin"
    }
    constructor(){
        super();
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let label = DwenguinoBlocklyLanguageSettings.translate(['simulator', 'button']) + " " + id;
        let buttonId = '' + TypesEnum.BUTTON + id;
        this._button = new Button(buttonId, 'sensor_options', label);
        
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.TOUCH, "touch sensor", pins, state, visible, width, height, offsetLeft, offsetTop, `${settings.basepath}DwenguinoIDE/img/socialrobot/button.svg`, 'sim_touch_canvas' + id);
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['simulator', 'button']) + " " + id;
        let buttonId = '' + TypesEnum.BUTTON + id;
        this._button = new Button(buttonId, 'sensor_options', label);

        super.initComponentFromXml(eventBus, `${settings.basepath}DwenguinoIDE/img/socialrobot/button.svg`, id, xml);
    }

    insertHtml(){
        var self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/button.svg`);
                self.setState(1);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/button_pushed.svg`);
                self.setState(0);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(['buttonOptions']));
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