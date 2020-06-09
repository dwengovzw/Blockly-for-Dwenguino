import { RobotComponent } from './RobotComponent.js'
import { TypesEnum } from '../RobotComponentsFactory.js';
import { EventsEnum } from './../ScenarioEvent.js'

export { Led, ColorsEnum }

const ColorsEnum = {
    red: 'red', 
    yellow: 'yellow', 
    blue: 'blue',
    green: '#72f542'
  };
Object.freeze(ColorsEnum);

class Led extends RobotComponent{
    constructor(eventBus, id, pin, state, visible, radius, x, y, offsetLeft, offsetTop, onColor, offColor, borderColor, htmlClasses){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.LED;
        this._radius = radius;
        this._x = x;
        this._y = y;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._onColor = onColor;
        this._offColor = offColor;
        this._borderColor = borderColor;
        this._pin = pin;
        this._state = state;
        this._canvasId = 'sim_led_canvas' + this._id; 

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'led';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + MSG.simulator[this.getType()] + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");

        let simLed = document.getElementById('sim_'+this.getType() + this.getId());

        simLed.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(MSG.ledOptions);
            this.showDialog();
        });
    }

    removeHtml(){
        $('#sim_' + this.toString() + this.getId()).remove();
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

        data = data.concat(" OnColor='", this.getOnColor(), "'");
        data = data.concat(" OffColor='", this.getOffColor(), "'");
        data = data.concat(" BorderColor='", this.getBorderColor(), "'");
        data = data.concat(" Pin='", this.getPin(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this.setX(0);
        this.setY(0);
        this.setState(0);
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
    
        $('#componentOptionsModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
        $('#componentOptionsModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');

        this.createPinOptionsInModalDialog();
        this.createColorOptionsDialog();

    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsPin" class="ui-widget row mb-4">');
        $('#componentOptionsPin').append('<div class="col-md-2">'+'Pin'+'</div>');
        $('#componentOptionsPin').append('<div id="pin" class="col-md-10"></div>');

        let pins = this.getAllPossiblePins();
        for(let pin = 0; pin < pins.length; pin++){
            $('#pin').append('<button type="button" id=pin'+pins[pin]+' name='+pins[pin]+' class="col-md-1 ml-2 mb-2 pinButton option_button_enabled">'+pins[pin]+'</button>');
            if(this.getPin() == pins[pin]){
                $('#pin' + pins[pin]).addClass('option_button_selected');
            }

            let pinButton = document.getElementById('pin'+pins[pin]);

            pinButton.addEventListener('click', () => { 
                let newPin = pinButton.name;
                this.setPin(newPin);
                $('.pinButton').removeClass('option_button_selected');
                pinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);
            });
        }

    }

    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }

    createColorOptionsDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsColor" class="ui-widget row mb-4">');
        $('#componentOptionsColor').append('<div class="col-md-2">'+'Color'+'</div>');
        $('#componentOptionsColor').append('<div id="color" class="col-md-10"></div>');

        for (const [type, t] of Object.entries(ColorsEnum)) {
            console.log(t);
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
                $('.colorButton').removeClass('colorButton_selected');
                colorButton.classList.add('colorButton_selected');
                this._eventBus.dispatchEvent(EventsEnum.INITIALIZECANVAS, this);
                this._eventBus.dispatchEvent(EventsEnum.SAVE);
            });
        }
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
    setOnColor(onColor){
        this._onColor = onColor;
    }

    getOnColor(){
        return this._onColor;
    }

    setOffColor(offColor){
        this._offColor = offColor;
    }

    getOffColor(){
        return this._offColor;
    }

    setBorderColor(borderColor){
        this._borderColor = borderColor;
    }

    getBorderColor(){
        return this._borderColor;
    }

    setPin(pin){
        this._pin = pin;
    }

    getPin(){
        return this._pin;
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
}