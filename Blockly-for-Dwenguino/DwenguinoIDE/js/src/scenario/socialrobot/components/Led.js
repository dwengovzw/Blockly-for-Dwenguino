import { RobotComponent } from './RobotComponent.js'
import { TypesEnum } from '../RobotComponentsFactory.js';

export { Led }

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
        data = data.concat(" State='", this.getState(), "'");
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