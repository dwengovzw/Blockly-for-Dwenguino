import { AbstractRobotComponent } from './abstract_robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js'
import { RobotComponent } from './robot_component.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotLed, ColorsEnum }

let ColorsEnum = {
    red: 'red', 
    yellow: 'yellow', 
    blue: 'blue',
    green: '#72f542',
    orange: '#FF5733',
    white: '0xffffff',
  };

/**
 * @extends RobotComponent
 */
class SocialRobotLed extends RobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }

    constructor(simulation_container=null){
        super(simulation_container);
        BindMethods(this);
        this._imageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/led.png`;
        this._borderColor = "#000000";  // Default border color = black
    }

    initComponent(onColor, offColor, eventBus, id, pins, state, visible, radius, offsetLeft, offsetTop, htmlClasses) {
        this._onColor = onColor;
        this._offColor = offColor;
        this._radius = radius;
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.LED, "led", pins, state, visible, radius, radius, offsetLeft, offsetTop, this._imageUrl, "sim_led_canvas" + id);
        
    }

    initComponentFromXml(eventBus, id, xml) {
        this._onColor = xml.getAttribute('OnColor');
        this._offColor = xml.getAttribute('OffColor');
        this._radius = Number(xml.getAttribute('Radius'));
        this._borderColor = xml.getAttribute('BorderColor');
        super.initComponentFromXml(eventBus,
            this._imageUrl,
            id,
            xml);
    }


    insertHtml() {
        super.insertHtml("ledOptions");
    }

    toXml() {
        let additionalAttributes = '';
        
        additionalAttributes = additionalAttributes.concat(" Radius='", this.getRadius().toString(), "'");
        additionalAttributes = additionalAttributes.concat(" OnColor='", this.getOnColor(), "'");
        additionalAttributes = additionalAttributes.concat(" OffColor='", this.getOffColor(), "'");
        additionalAttributes = additionalAttributes.concat(" BorderColor='", this.getBorderColor(), "'");

        return super.toXml(additionalAttributes);
    }



    createComponentOptionsModalDialog(headerTitle) {
        super.createComponentOptionsModalDialog(headerTitle);
        this.createColorOptionsDialog();

    }


    getAllPossiblePins() {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, "LED0", "LED1", "LED2", "LED3", "LED4", "LED5", "LED6", "LED7", "LED13"];
    }

    createColorOptionsDialog() {
        $('#componentOptionsModalBody').append('<div id="componentOptionsColor" class="ui-widget row mb-4">');
        $('#componentOptionsColor').append('<div class="col-md-2">'+ DwenguinoBlocklyLanguageSettings.translate(["colorOptions"]) +'</div>');
        $('#componentOptionsColor').append('<div id="color" class="col-md-10"></div>');

        for (const [type, t] of Object.entries(ColorsEnum)) {
            $('#color').append('<button type="button" id=color'+t+' name='+type+' class="col-md-1 ml-2 mb-2 colorButton"></buttons>');
            let colorButton = document.getElementById('color'+t);
            colorButton.classList.add(type);
            if(this.getOnColor() == type){
                colorButton.classList.add('colorButton_selected');
            }

            colorButton.addEventListener('click', () => {
                this._eventBus.dispatchEvent(EventsEnum.CLEARCANVAS, this.getCanvasId());
                let newColor = colorButton.getAttribute("name");
                this.setOnColor(newColor);
                let allColorButtons = $('.colorButton');
                allColorButtons.removeClass('colorButton_selected');
                colorButton.classList.add('colorButton_selected');
                this._eventBus.dispatchEvent(EventsEnum.INITIALIZECANVAS, this);
                this._eventBus.dispatchEvent(EventsEnum.SAVE);
            });
        }
    }

    
    setRadius(radius) {
        this._radius = radius;
    }

    getRadius(){
        return this._radius;
    }

    setOffset(offset) {
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }
    setOnColor(onColor) {
        this._onColor = onColor;
    }

    getOnColor() {
        return this._onColor;
    }

    setOffColor(offColor) {
        this._offColor = offColor;
    }

    getOffColor() {
        return this._offColor;
    }

    setBorderColor(borderColor) {
        this._borderColor = borderColor;
    }

    getBorderColor() {
        return this._borderColor;
    }
}