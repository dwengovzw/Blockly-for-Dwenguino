import { RobotComponent } from './RobotComponent.js'
import { TypesEnum } from '../RobotComponentsFactory.js'
import { EventsEnum } from '../ScenarioEvent.js'

export { Sonar }

class Sonar extends RobotComponent{
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
        this._sliderId = 'slider' + this._id;
        this._sliderLabelId = 'slider' + this._id + '_label';
        this._sliderValueId = 'slider' + this._id + '_value';
        this._sliderRangeId = 'slider' + this._id + '_range';

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

        if (!document.getElementById(this.getSliderRangeId())) {
            //console.log('make slider');
            $('#sensor_options').append("<div id='" + this.getSliderLabelId() + "' class='sensor_options_label' alt='Slider label'>" + MSG.sonarSliderLabel + " " + this.getId() + "</div>");
            $('#sensor_options').append("<div id='" + this.getSliderValueId() + "' class='' alt='Slider value'>100 cm</div>");
            $('#sensor_options').append("<div id='" + this.getSliderId() + "' class='sonar_slider slidecontainer' alt='Load'></div>");
            $('#' + this.getSliderId()).append("<input type='range' min='0' max='200' value='100' class='slider' id='" + this.getSliderRangeId() + "'></input>");
      
            var self = this;
            var slider = document.getElementById(this.getSliderRangeId());
            slider.oninput = function () {
              // let id = this.id.replace(/^\D+/g, '');
              let id = self.getId();
              self.changeSonarDistance(this.value, id); // TODO
            };
        }
    }

    changeSonarDistance(value, id) {
        var sliderValue = 'slider' + id + '_value';
        document.getElementById(sliderValue).innerHTML = value + ' cm';
        // TODO: Remove this. the board state should be updated in the updateScenarioState function when it is called!
        // this.inputState.sonarDistance = value;
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