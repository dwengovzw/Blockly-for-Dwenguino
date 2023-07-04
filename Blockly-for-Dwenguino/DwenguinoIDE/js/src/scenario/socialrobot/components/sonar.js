import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js'
import { EventsEnum } from '../scenario_event.js'
import { Slider } from '../../utilities/slider.js'
import { RobotComponent } from './robot_component.js'
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotSonar }

/**
 * @extends RobotComponent
 */
class SocialRobotSonar extends RobotComponent{
    static pinNames = {
        triggerPin: "triggerPin",
        echoPin: "echoPin"
    }
    constructor(simulation_container=null){
        super(simulation_container);
        BindMethods(this);
    }

    initComponent(eventBus, id, pins, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        let label = DwenguinoBlocklyLanguageSettings.translate(['sonarSliderLabel']) + " " + id;
        let sliderId = '' + TypesEnum.SONAR + id;
        this._slider = new Slider(sliderId, 'sensor_options', 0, 200, 0, label, '' , ' cm', 'sonar_slider');

        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let myid = self.getId();
            self.changeSonarDistance(this.value, myid);
            self._slider.updateValueLabel(this.value);
        }
        
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.SONAR, 'sonar', pins, state, visible, width, height, offsetLeft, offsetTop, `${settings.basepath}DwenguinoIDE/img/board/sonar.png`, 'sim_sonar_canvas' + id);
        
    }

    initComponentFromXml(eventBus, id, xml){
        let label = DwenguinoBlocklyLanguageSettings.translate(['sonarSliderLabel']) + " " + id;
        let sliderId = '' + TypesEnum.SONAR + id;
        this._slider = new Slider(sliderId, 'sensor_options', 0, 200, 0, label, '' , ' cm', 'sonar_slider');

        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let myid = self.getId();
            self.changeSonarDistance(this.value, myid);
            self._slider.updateValueLabel(this.value);
        }

        super.initComponentFromXml(eventBus, `${settings.basepath}DwenguinoIDE/img/board/sonar.png`, id, xml);
    }


    insertHtml(){
        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let id = self.getId();
            self.changeSonarDistance(this.value, id);
            self._slider.updateValueLabel(this.value);
        }
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(['sonarOptions']));
    }

    changeSonarDistance(value) {
        this.setState(value);
    }

    removeHtml(){
        super.removeHtml();
        this.getSlider().remove();
    }

    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "SONAR_1_TRIG", "SONAR_1_ECHO", "SONAR_2_TRIG", "SONAR_2_ECHO", "SONAR_3_TRIG", "SONAR_3_ECHO"];
    }

    getSlider(){
        return this._slider;
    }

    reset() {
        super.reset();
        this.getSlider().reset();
    }
}