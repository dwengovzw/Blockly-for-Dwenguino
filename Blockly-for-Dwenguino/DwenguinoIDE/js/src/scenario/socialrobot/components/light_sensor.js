import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Slider } from '../../utilities/slider.js';
import { RobotComponent } from './robot_component.js';

export { SocialRobotLightSensor }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotLightSensor extends RobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }

    constructor(){
        super();
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let label = DwenguinoBlocklyLanguageSettings.translate(['lightSensorSliderLabel']) + " " + id;
        this.initSlider(label, id, 0, 4095, 0);
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.LIGHT, "light sensor", pins, state, visible, width, height, offsetLeft, offsetTop, `${settings.basepath}DwenguinoIDE/img/socialrobot/light_sensor.png`, 'sim_light_canvas' + id);
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['lightSensorSliderLabel']) + " " + id;
        this.initSlider(label, id, 0, 4095, 0);
        super.initComponentFromXml(eventBus, `${settings.basepath}DwenguinoIDE/img/socialrobot/light_sensor.png`, id, xml);
    }

    initSlider(label, id, min, max, start){
        let sliderId = '' + TypesEnum.LIGHT + id;
        this._slider = new Slider(sliderId, 'sensor_options', min, max, start, label, '' , '', 'light_sensor_slider');

        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let id = self.getId();
            self.changeLightSensorValue(this.value, id);
            self._slider.updateValueLabel(this.value);
        }
    }

    insertHtml(){
        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let id = self.getId();
            self.changeLightSensorValue(this.value, id);
            self._slider.updateValueLabel(this.value);
        }
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(['lightOptions']))
    }

    changeLightSensorValue(value) {
        this.setState(value);
    }

    removeHtml(){
        super.removeHtml();
        this.getSlider().remove();
    }

    getAllPossiblePins(){
        return ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
    }

    getSlider(){
        return this._slider;
    }
}