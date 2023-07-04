import { RobotComponent } from "./robot_component.js";
import { Button } from '../../utilities/button.js';
import { EventsEnum } from '../scenario_event.js';
import BindMethods from "../../../utils/bindmethods.js"

export { BinaryInputRobotComponent };

class BinaryInputRobotComponent extends RobotComponent {
    constructor(activeValue = 1, inactiveValue = 0, simulation_container=null){
        super(simulation_container);
        BindMethods(this);
        this.activeValue = activeValue;
        this.inactiveValue = inactiveValue;
    }

    initComponent(type, buttonInputLabelTranslationKey, optionsMenuTranslationKey, componentName, activeImage, inactiveImage, componentCanvasClass, eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        this.createInputButton(type, id, buttonInputLabelTranslationKey);
        this._optionsMenuTranslationKey = optionsMenuTranslationKey;
        this._activeImageUrl = activeImage;
        this._inactiveImageUrl = inactiveImage;
        super.initComponent(eventBus, htmlClasses, id, type, componentName, pins, this.inactiveValue, visible, width, height, offsetLeft, offsetTop, inactiveImage, componentCanvasClass + id);
    }

    initComponentFromXml(eventBus, type, buttonInputLabelTranslationKey, optionsMenuTranslationKey, activeImage, inactiveImage, id, xml){
        this.createInputButton(type, id, buttonInputLabelTranslationKey);
        this._optionsMenuTranslationKey = optionsMenuTranslationKey;
        this._activeImageUrl = activeImage;
        this._inactiveImageUrl = inactiveImage;
        super.initComponentFromXml(eventBus, inactiveImage, id, xml);
    }
    
    createInputButton(type, id, translation_key){
        let label = DwenguinoBlocklyLanguageSettings.translate(translation_key) + " " + id;
        let buttonId = '' + type + id;
        this._button = new Button(buttonId, 'sensor_options', label);
    }

    insertHtml(){
        let self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage(self._activeImageUrl);
                self.setState(self.activeValue);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage(self._inactiveImageUrl);
                self.setState(self.inactiveValue);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }

        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate([this._optionsMenuTranslationKey]));
    }

    removeHtml(){
        super.removeHtml()
        this.getButton().remove();
    }

    reset(){
        this.setImage(this._inactiveImageUrl);
        this.setState(this.inactiveValue);
        this._button.reset();
    }

    getButton(){
        return this._button;
    }
}