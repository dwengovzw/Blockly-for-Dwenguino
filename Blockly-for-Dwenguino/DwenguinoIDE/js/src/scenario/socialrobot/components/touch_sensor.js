import { RobotComponent } from './robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';

export { SocialRobotTouchSensor }

/**
 * @extends RobotComponent
 */
class SocialRobotTouchSensor extends RobotComponent{
    constructor(eventBus, id, pin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.TOUCH;
        this._width = width;
        this._height = height;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._image = new Image();
        this._image.src = './DwenguinoIDE/img/socialrobot/touch_sensor.svg';
        this._pin = pin;
        this._state = state;
        this._stateUpdated = false;
        this._canvasId = 'sim_touch_canvas' + this._id;
        this._button = null;

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'touch sensor';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + MSG.simulator[this.getType()] + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");
    
        let label = MSG.pirButtonLabel + " " + this.getId();
        let id = '' + this.getType() + this.getId();
        this._button = new Button(id, 'sensor_options', label);
        
        var self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage('./DwenguinoIDE/img/socialrobot/touch_sensor_on.svg');
                self.setState(1);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage('./DwenguinoIDE/img/socialrobot/touch_sensor.svg');
                self.setState(0);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }

        let simTouchSensor = document.getElementById('sim_'+this.getType() + this.getId());

        simTouchSensor.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog("");
            this.showDialog();
        });
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();
        this.getButton().remove();
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_touch' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_touch' + this.getId()).css('visibility', 'hidden');
        }
    }

    toXml(){
        let data = '';
        
        data = data.concat("<Item ");
        data = data.concat(" Type='", this.getType(), "'");
        data = data.concat(" Id='", this.getId(), "'");
        data = data.concat(" Width='", this.getWidth(), "'");
        data = data.concat(" Height='", this.getHeight(), "'");

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

        data = data.concat(" Pin='", this.getPin(), "'");
        data = data.concat(" State='", this.getState(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }
    reset(){
        this.setState(0);
        this._stateUpdated = false;
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

    getId(){
        return this._id;
    }

    getType(){
        return this._type;
    }

    setWidth(width){
        this._width = width;
    }

    getWidth(){
        return this._width;
    }

    setHeight(height){
        this._height = height;
    }

    getHeight(){
        return this._height;
    }

    setOffset(offset){
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    setImage(image){
        this._image.src = image;
    }

    getImage(){
        return this._image;
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

    isStateUpdated(){
        return this._stateUpdated;
    }

    getCanvasId(){
        return this._canvasId;
    }

    getButton(){
        return this._button;
    }
}