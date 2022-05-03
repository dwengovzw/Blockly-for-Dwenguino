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
        super.insertHtml("rgbLedOptions");
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




    /*createComponentOptionsModalDialog(headerTitle){
        this.removeDialog();
    
        $('#db_body').append('<div id="componentOptionsModal" class="modal fade" role="dialog"></div>');
        $('#componentOptionsModal').append('<div id="componentOptionsModalDialog" class="modal-dialog"></div>');
    
        $('#componentOptionsModalDialog').append('<div id="componentOptionsModalContent" class="modal-content"></div>');
    
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalHeader" class="modal-header"></div>');
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalBody" class="modal-body container"></div>');
        $('#componentOptionsModalContent').append('<div id="componentOptionsModalFooter" class="modal-footer"></div>');
    
        $('#componentOptionsModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#componentOptionsModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');

        this.createPinOptionsInModalDialog();
    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsRedPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsRedPin').append('<div class="col-md-auto">'+'Red pin'+'</div>');
        $('#componentOptionsRedPin').append('<div id="redPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsGreenPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsGreenPin').append('<div class="col-md-auto">'+'Green pin'+'</div>');
        $('#componentOptionsGreenPin').append('<div id="greenPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsBluePin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsBluePin').append('<div class="col-md-auto">'+'Blue pin'+'</div>');
        $('#componentOptionsBluePin').append('<div id="bluePin" class="col-md-10"></div>');
    
        let pins = this.getAllPossiblePins();
        for(let pin = 0; pin < pins.length; pin++){
            $('#redPin').append('<button type="button" id=redPin'+pins[pin]+' name='+pins[pin]+' class="col-md-auto ml-2 mb-2 redPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
            $('#greenPin').append('<button type="button" id=greenPin'+pins[pin]+ ' name='+pins[pin]+' class="col-md-auto ml-2 mb-2 greenPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
            $('#bluePin').append('<button type="button" id=bluePin'+pins[pin]+ ' name='+pins[pin]+ ' class="col-md-auto ml-2 mb-2 bluePinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
        }

        for(let p = 0; p < pins.length; p++){
            if(this.getRedPin() == pins[p]){
                $('#redPin' + pins[p]).addClass('option_button_selected');
                $('#greenPin' + pins[p]).addClass('option_button_disabled');
                $('#greenPin' + pins[p]).prop('disabled', true);
                $('#bluePin' + pins[p]).addClass('option_button_disabled');
                $('#bluePin' + pins[p]).prop('disabled', true);
            }

            if(this.getGreenPin() == pins[p]){
                $('#greenPin' + pins[p]).addClass('option_button_selected');
                $('#redPin' + pins[p]).addClass('option_button_disabled');
                $('#redPin' + pins[p]).prop('disabled', true);
                $('#bluePin' + pins[p]).addClass('option_button_disabled');
                $('#bluePin' + pins[p]).prop('disabled', true);
            }

            if(this.getBluePin() == pins[p]){
                $('#bluePin' + pins[p]).addClass('option_button_selected');
                $('#redPin' + pins[p]).addClass('option_button_disabled');
                $('#redPin' + pins[p]).prop('disabled', true);
                $('#greenPin' + pins[p]).addClass('option_button_disabled');
                $('#greenPin' + pins[p]).prop('disabled', true);
            }

            let redPinButton = document.getElementById('redPin'+pins[p]);
            let greenPinButton = document.getElementById('greenPin' + pins[p]);
            let bluePinButton = document.getElementById('bluePin' + pins[p]);

            redPinButton.addEventListener('click', () => { 
                let newPin = redPinButton.name;
                this.setRedPin(newPin);
                $('.redPinButton').removeClass('option_button_selected');
                redPinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);

                $('.greenPinButton').removeClass('option_button_disabled');
                $('.greenPinButton').prop('disabled', false);
                $('#greenPin' + newPin).addClass('option_button_disabled');
                $('#greenPin' + newPin).prop('disabled', true);

                $('.bluePinButton').removeClass('option_button_disabled');
                $('.bluePinButton').prop('disabled', false);
                $('#bluePin' + newPin).addClass('option_button_disabled');
                $('#bluePin' + newPin).prop('disabled', true);
            });

            greenPinButton.addEventListener('click', () => { 
                let newPin = greenPinButton.name;
                this.setGreenPin(newPin);
                $('.greenPinButton').removeClass('option_button_selected');
                greenPinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);

                $('.redPinButton').removeClass('option_button_disabled');
                $('.redPinButton').prop('disabled', false);
                $('#redPin' + newPin).addClass('option_button_disabled');
                $('#redPin' + newPin).prop('disabled', true);

                $('.bluePinButton').removeClass('option_button_disabled');
                $('.bluePinButton').prop('disabled', false);
                $('#bluePin' + newPin).addClass('option_button_disabled');
                $('#bluePin' + newPin).prop('disabled', true);
            });

            bluePinButton.addEventListener('click', () => { 
                let newPin = redPinButton.name;
                this.setBluePin(newPin);
                $('.bluePinButton').removeClass('option_button_selected');
                bluePinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);

                $('.redPinButton').removeClass('option_button_disabled');
                $('.redPinButton').prop('disabled', false);
                $('#redPin' + newPin).addClass('option_button_disabled');
                $('#redPin' + newPin).prop('disabled', true);

                $('.greenPinButton').removeClass('option_button_disabled');
                $('.greenPinButton').prop('disabled', false);
                $('#greenPin' + newPin).addClass('option_button_disabled');
                $('#greenPin' + newPin).prop('disabled', true);
            });
        }
    }*/

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