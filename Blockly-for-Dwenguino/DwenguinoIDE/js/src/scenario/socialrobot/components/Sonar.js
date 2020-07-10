import { RobotComponent } from './RobotComponent.js'
import { TypesEnum } from '../RobotComponentsFactory.js'
import { EventsEnum } from '../ScenarioEvent.js'
import { Slider } from '../../utilities/Slider.js'

export { SocialRobotSonar as SocialRobotSonar }

class SocialRobotSonar extends RobotComponent{
    constructor(eventBus, id, echoPin = 0, triggerPin = 0, state = 100, visible = true, width = 100, height = 58, offsetLeft = 5, offsetTop = 5, htmlClasses = 'sim_canvas sonar_canvas'){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.SONAR;
        this._width = width;
        this._height = height;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._image = new Image();
        this._image.src = './DwenguinoIDE/img/board/sonar.png';
        this._echoPin = echoPin;
        this._triggerPin = triggerPin;
        this._state = state;
        this._stateUpdated = false;

        this._canvasId = 'sim_sonar_canvas' + this._id;

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'sonar';
    }

    insertHtml(){
        $('#sim_container').append("<div id='sim_" + this.getType() + this.getId() + "' class='sim_element sim_element_" + this.getType() + " draggable'><div><span class='grippy'></span>" + MSG.simulator[this.getType()] + " " + this.getId() + "</div></div>");
        $('#sim_' + this.getType() + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_' + this.getType() + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_' + this.getType() + this.getId()).append("<canvas id='" + this.getCanvasId() + "' class='" + this.getHtmlClasses() + "'></canvas>");

        let label = MSG.sonarSliderLabel + " " + this.getId();
        this._slider = new Slider(this.getId(), 'sensor_options', 0, 200, 100, label, '' , ' cm', 'sonar_slider');

        var self = this;
        let sliderElement = this._slider.getSliderElement();
        sliderElement.oninput = function() {
            let id = self.getId();
            self.changeSonarDistance(this.value, id);
            self._slider.updateValueLabel(this.value);
        }

        let simSonar = document.getElementById('sim_'+this.getType() + this.getId());

        simSonar.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(MSG.sonarOptions);
            this.showDialog();
        });
    }

    changeSonarDistance(value) {
        this.setState(value);
        this._stateUpdated = true;
        this._eventBus.dispatchEvent(EventsEnum.SAVE);
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();

        $('#' + this.getSliderLabelId()).remove();
        $('#' + this.getSliderValueId()).remove();
        $('#' + this.getSliderId()).remove();
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

        data = data.concat(" EchoPin='", this.getEchoPin(), "'");
        data = data.concat(" TriggerPin='", this.getTriggerPin(), "'");
        data = data.concat(" State='", this.getState(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_sonar' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_sonar' + this.getId()).css('visibility', 'hidden');
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
    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsTriggerPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsTriggerPin').append('<div class="col-md-2">'+'Trigger pin'+'</div>');
        $('#componentOptionsTriggerPin').append('<div id="triggerPin" class="col-md-10"></div>');
        $('#componentOptionsModalBody').append('<div id="componentOptionsEchoPin" class="ui-widget row mb-4"></div>');
        $('#componentOptionsEchoPin').append('<div class="col-md-2">'+'Echo pin'+'</div>');
        $('#componentOptionsEchoPin').append('<div id="echoPin" class="col-md-10"></div>');
    
        let pins = this.getAllPossiblePins();
        for(let pin = 0; pin < pins.length; pin++){
            $('#triggerPin').append('<button type="button" id=triggerPin'+pins[pin]+' name='+pins[pin]+' class="col-md-1 ml-2 mb-2 triggerPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
            $('#echoPin').append('<button type="button" id=echoPin'+pins[pin]+ ' name='+pins[pin]+' class="col-md-1 ml-2 mb-2 echoPinButton pinButton option_button_enabled">'+pins[pin]+'</button>');
        }

        for(let p = 0; p < pins.length; p++){
            if(this.getTriggerPin() == pins[p]){
                $('#triggerPin' + pins[p]).addClass('option_button_selected');
                $('#echoPin' + pins[p]).addClass('option_button_disabled');
                $('#echoPin' + pins[p]).prop('disabled', true);
            }

            if(this.getEchoPin() == pins[p]){
                $('#echoPin' + pins[p]).addClass('option_button_selected');
                $('#triggerPin' + pins[p]).addClass('option_button_disabled');
                $('#triggerPin' + pins[p]).prop('disabled', true);
            }

            let triggerPinButton = document.getElementById('triggerPin'+pins[p]);
            let echoPinButton = document.getElementById('echoPin' + pins[p]);

            triggerPinButton.addEventListener('click', () => { 
                let newPin = triggerPinButton.name;
                this.setTriggerPin(newPin);
                $('.triggerPinButton').removeClass('option_button_selected');
                triggerPinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);

                $('.echoPinButton').removeClass('option_button_disabled');
                $('.echoPinButton').prop('disabled', false);
                $('#echoPin' + newPin).addClass('option_button_disabled');
                $('#echoPin' + newPin).prop('disabled', true);
            });

            echoPinButton.addEventListener('click', () => { 
                let newPin = echoPinButton.name;
                this.setEchoPin(newPin);
                $('.echoPinButton').removeClass('option_button_selected');
                echoPinButton.classList.add('option_button_selected');
                this._eventBus.dispatchEvent(EventsEnum.SAVE);

                $('.triggerPinButton').removeClass('option_button_disabled');
                $('.triggerPinButton').prop('disabled', false);
                $('#triggerPin' + newPin).addClass('option_button_disabled');
                $('#triggerPin' + newPin).prop('disabled', true);
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
    
    setEchoPin(pin){
        this._echoPin = pin;
    }

    getEchoPin(){
        return this._echoPin;
    }

    setTriggerPin(pin){
        this._triggerPin = pin;
    }

    getTriggerPin(){
        return this._triggerPin;
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

    getSliderId(){
        return this._sliderId;
    }

    getSliderLabelId(){
        return this._sliderLabelId;
    }
    
    getSliderValueId(){
        return this._sliderValueId;
    }

    getSliderRangeId(){
        return this._sliderRangeId;
    }

}