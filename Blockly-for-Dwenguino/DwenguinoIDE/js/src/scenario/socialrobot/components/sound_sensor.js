import { RobotComponent } from './robot_component.js'
import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js';
import { Button } from '../../utilities/button.js';


export { SocialRobotSoundSensor }

/**
 * @extends RobotComponent
 */
class SocialRobotSoundSensor extends RobotComponent{
    constructor(eventBus, id, digitalPin, analogPin, state, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        super(eventBus, htmlClasses);
        this._id = id;
        this._type = TypesEnum.SOUND;
        this._width = width;
        this._height = height;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._image = new Image();
        this._image.src = `${settings.basepath}DwenguinoIDE/img/socialrobot/sound_sensor.png`;
        this._digitalPin = digitalPin;
        this._analogPin = analogPin;
        this._state = state;
        this._stateUpdated = false;
        this._canvasId = 'sim_sound_canvas' + this._id;
        this._button = null;

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'sound sensor';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',[this.getType()]) + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");
    
        let label = DwenguinoBlocklyLanguageSettings.translate(['soundButtonLabel']) + " " + this.getId();
        let id = '' + this.getType() + this.getId();
        
        this._button = new Button(id, 'sensor_options', label);
        
        var self = this;
        this._button.getButtonElement().onclick = function (){
            self._button.update();

            if (self._button.isActive()) {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/sound_sensor.png`);
                self.setState(1);
                self._stateUpdated = true;
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            } else {
                self.setImage(`${settings.basepath}DwenguinoIDE/img/socialrobot/sound_sensor.png`);
                self.setState(0);
                self._stateUpdated = true; 
                self._eventBus.dispatchEvent(EventsEnum.SAVE);
            }
        }

        let simSoundSensor = document.getElementById('sim_'+this.getType() + this.getId());

        simSoundSensor.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(DwenguinoBlocklyLanguageSettings.translate(['soundOptions']));
            this.showDialog();
        });
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();

        this.getButton().remove();
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_sound' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_sound' + this.getId()).css('visibility', 'hidden');
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

        data = data.concat(" DigitalPin='", this.getDigitalPin(), "'");
        data = data.concat(" AnalogPin='", this.getAnalogPin(), "'");
        data = data.concat(" State='", this.getState(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this._button.reset();
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
    
        $('#componentOptionsModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#componentOptionsModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');

        this.createPinOptionsInModalDialog();

    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsPin" class="ui-widget row mb-4">');
        $('#componentOptionsPin').append('<div class="col-md-2">'+DwenguinoBlocklyLanguageSettings.translate(['digitalPin'])+'</div>');
        $('#componentOptionsPin').append('<div id="pin" class="col-md-8"></div>');

        let pins = this.getAllPossiblePins();
        for(let pin = 0; pin < pins.length; pin++){
            $('#pin').append('<button type="button" id=pin'+pins[pin]+' name='+pins[pin]+' class="col-md-auto ml-2 mb-2 pinButton option_button_enabled">'+pins[pin]+'</button>');
            if(this.getDigitalPin() == pins[pin]){
                $('#pin' + pins[pin]).addClass('option_button_selected');
            }

            let pinButton = document.getElementById('pin'+pins[pin]);

            pinButton.addEventListener('click', () => { 
                let newPin = pinButton.name;
                this.setDigitalPin(newPin);
                $('.pinButton').removeClass('option_button_selected');
                pinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);
            });
        }
    }

    getAllPossiblePins(){
        return ["SOUND_1", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7"];
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
    
    setDigitalPin(digitalPin){
        this._digitalPin = digitalPin;
    }

    getDigitalPin(){
        return this._digitalPin;
    }

    setAnalogPin(analogPin){
        this._analogPin = analogPin;
    }

    getAnalogPin(){
        return this._analogPin;
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