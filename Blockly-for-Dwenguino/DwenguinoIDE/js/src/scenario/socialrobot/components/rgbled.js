import { RobotComponent } from './robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js'

export { SocialRobotRgbLed }
/**
 * @extends RobotComponent
 */
class SocialRobotRgbLed extends RobotComponent{
    constructor(eventBus, id, redPin, greenPin, bluePin, state, visible, radius, x, y, offsetLeft, offsetTop, htmlClasses){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.RGBLED;
        this._radius = radius;
        this._x = x;
        this._y = y;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._offColor = 'gray';
        this._redPin = redPin;
        this._greenPin = greenPin;
        this._bluePin = bluePin;
        this._state = state;
        this._canvasId = 'sim_rgbled_canvas' + this._id; 
        this._ledSvg = new Image();
        this._ledSvg.src = './DwenguinoIDE/img/socialrobot/rgb_led_top.svg';
        this._ledBackground = new Image();
        this._ledBackground.src = './DwenguinoIDE/img/socialrobot/rgb_led_background.svg';
        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'RGB LED';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + MSG.simulator[this.getType()] + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");

        let simLed = document.getElementById('sim_'+this.getType() + this.getId());

        simLed.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(MSG.rgbLedOptions);
            this.showDialog();
        });
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();
    }

    toXml(){
        let data = '';
        
        data = data.concat("<Item ");
        data = data.concat(" Type='", this.getType(), "'");
        data = data.concat(" Id='", this.getId(), "'");
        data = data.concat(" Radius='", this.getRadius(), "'");

        let simId = '#sim_' + this.getType() + this.getId();
        if ($(simId).attr('data-x')) {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']) + parseFloat($(simId).attr('data-x')), "'");
        } else {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']), "'");
        }
        if ($(simId).attr('data-y')) {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']) + parseFloat($(simId).attr('data-y')), "'");
        } else {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']), "'");
        }

        data = data.concat(" RedPin='", this.getRedPin(), "'");
        data = data.concat(" GreenPin='", this.getGreenPin(), "'");
        data = data.concat(" BluePin='", this.getBluePin(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this.setX(0);
        this.setY(0);
        this.setState([0,0,0]);
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_led' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_led' + this.getId()).css('visibility', 'hidden');
        }
    }

    showDialog(){
        $("#componentOptionsModal").modal('show');
    }
    
    removeDialog(){
        $('div').remove('#componentOptionsModal');
        $('.modal-backdrop').remove();
    }

    createComponentOptionsModalDialog(headerTitle){
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
        $('#componentOptionsRedPin').append('<div class="col-md-2">'+'Red pin'+'</div>');
        $('#componentOptionsRedPin').append('<div id="redPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsGreenPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsGreenPin').append('<div class="col-md-2">'+'Green pin'+'</div>');
        $('#componentOptionsGreenPin').append('<div id="greenPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsBluePin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsBluePin').append('<div class="col-md-2">'+'Blue pin'+'</div>');
        $('#componentOptionsBluePin').append('<div id="bluePin" class="col-md-10"></div>');
    
        let pins = this.getAllPossiblePins();
        for(let pin = 0; pin < pins.length; pin++){
            $('#redPin').append('<button type="button" id=redPin'+pins[pin]+' name='+pins[pin]+' class="col-md-1 ml-2 mb-2 redPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
            $('#greenPin').append('<button type="button" id=greenPin'+pins[pin]+ ' name='+pins[pin]+' class="col-md-1 ml-2 mb-2 greenPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
            $('#bluePin').append('<button type="button" id=bluePin'+pins[pin]+ ' name='+pins[pin]+ ' class="col-md-1 ml-2 mb-2 bluePinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
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
    }

    getAllPossiblePins(){
        return ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'];
    }

    getId(){
        return this._id;
    }

    getType(){
        return this._type;
    }

    setRadius(radius){
        this._radius = radius;
    }

    getRadius(){
        return this._radius;
    }

    setX(x){
        this._x = x;
    }

    getX(){
        return this._x;
    }

    setY(y){
        this._y = y;
    }

    getY(){
        return this._y;
    }

    setOffset(offset){
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    setRedPin(redPin){
        this._redPin = redPin;
    }
    
    getRedPin() {
        return this._redPin;
    }

    setGreenPin(greenPin){
        this._greenPin = greenPin;
    }

    getGreenPin() {
        return this._greenPin;
    }

    setBluePin(bluePin){
        this._bluePin = bluePin;
    }

    getBluePin(){
        return this._bluePin;
    }

    setState(state){
        this._state = state;
    }

    getState(){
        return this._state;
    }

    getCanvasId(){
        return this._canvasId;
    }

    getLedSvg(){
        return this._ledSvg;
    }

    getLedBackground(){
        return this._ledBackground;
    }
}