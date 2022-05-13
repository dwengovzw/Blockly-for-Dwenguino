import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { RobotComponent } from './robot_component.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotRgbLed }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotRgbLed extends RobotComponent{
    static pinNames = {
        redPin: "redPin",
        greenPin: "greenPin",
        bluePin: "bluePin"
    }

    constructor(){
        super();
        BindMethods(this);

        this._state = [0, 0, 0];
        this._foregroundImageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/rgb_led_top.svg`;
        this._backgroundImageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/rgb_led_background.svg`
        this._ledImage = new Image();
        this._ledImage.src = this._foregroundImageUrl;
        this._ledBackgroundImage = new Image();
        this._ledBackgroundImage.src = this._backgroundImageUrl;
    }

    initComponent(eventBus, id, pins, state, visible, radius, offsetLeft, offsetTop, htmlClasses) {
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.RGBLED, "RGB LED", pins, state, visible, radius, radius, offsetLeft, offsetTop, this._backgroundImageUrl, "sim_rgbled_canvas" + id)
        this._radius = radius;
    }

    initComponentFromXml(eventBus, id, xml) {
        super.initComponentFromXml(eventBus,
            this._backgroundImageUrl,
            id,
            xml);
            this._radius = Number(xml.getAttribute('Radius'));
        this.setPin(xml.getAttribute('RedPin'), SocialRobotRgbLed.pinNames.redPin);
        this.setPin(xml.getAttribute('GreenPin'), SocialRobotRgbLed.pinNames.greenPin);
        this.setPin(xml.getAttribute('BluePin'), SocialRobotRgbLed.pinNames.bluePin);
    }

    insertHtml(){
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(["rgbLedOptions"]));
    }



    toXml() {
        let additionalAttributes = '';
        
        additionalAttributes = additionalAttributes.concat(" Radius='", this.getRadius().toString(), "'");
        additionalAttributes = additionalAttributes.concat(" RedPin='", this.getPin(SocialRobotRgbLed.pinNames.redPin), "'");
        additionalAttributes = additionalAttributes.concat(" GreenPin='", this.getPin(SocialRobotRgbLed.pinNames.greenPin), "'");
        additionalAttributes = additionalAttributes.concat(" BluePin='", this.getPin(SocialRobotRgbLed.pinNames.bluePin), "'");

        return super.toXml(additionalAttributes);
    }

    reset() {
        this.setState([0,0,0]);
        super.reset();
    }

    getAllPossiblePins() {
        return ['3', '5', '6', '11', '14', '15', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 
        "RGB_1_R", "RGB_1_G", "RGB_1_B", "RGB_2_R", "RGB_2_G", "RGB_2_B", "RGB_3_R", "RGB_3_G", "RGB_3_B"];
    }

    setRadius(radius) {
        this._radius = radius;
    }

    getRadius() {
        return this._radius;
    }
  
    setState(state) {
        this._state = state;
    }

    getState() {
        if (this._state === 0){
            return [0, 0, 0];
        }
        return this._state;
    }

    getCanvasId() {
        return this._canvasId;
    }

    getLedBackground() {
        return this._ledBackgroundImage;
    }

    getLedSvg() {
        return this._ledImage;
    }
}