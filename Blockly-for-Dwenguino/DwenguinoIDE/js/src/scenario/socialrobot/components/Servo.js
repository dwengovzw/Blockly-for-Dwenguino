import { RobotComponent } from './RobotComponent.js'
import { StatesEnum, DwenguinoScenarioUtils } from './../DwenguinoScenarioUtils.js'
import { TypesEnum } from './../RobotComponentsFactory.js'

export { Servo }

class Servo extends RobotComponent{
    constructor(id, pin, costume = StatesEnum.PLAIN, angle = 0, visible = true, x = 0, y = 0, width = 100, height = 50, offsetLeft = 5, offsetTop = 5, htmlClasses = 'sim_canvas servo_canvas'){
        super(htmlClasses);

        this._id = id;
        this._type = TypesEnum.SERVO;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._angle = angle;
        this._prevAngle = 0;
        this._image = new Image();

        switch (costume) {
            case StatesEnum.PLAIN:
                this._image.src = './DwenguinoIDE/img/socialrobot/servo_movement.png';
                break;
            case StatesEnum.EYE:
                this._image.src = '';
                break;
            case StatesEnum.RIGHTHAND:
                this._image.src = './DwenguinoIDE/img/socialrobot/righthand.png';
                break;
            case StatesEnum.LEFTHAND:
                this._image.src = './DwenguinoIDE/img/socialrobot/lefthand.png';              
                break;
          }
        
        this._backgroundColor = '#206499';
        this._pin = pin;
        this._costume = costume;
        this._canvasId = 'sim_servo_canvas' + this._id; 
        
        this.insertHtml();
        this.toggleVisibility(visible);
        console.log(this.toString());
    }

    toString(){
        let str = '';
        str = str.concat(this.getType(), ' ');
        str = str.concat(this.getId(), ' ');
        str = str.concat('Angle ', this.getAngle(), ' ');
        str = str.concat('Costume ', this.getCostume(), ' ');
        str = str.concat('Pin ', this.getPin(), ' ');
        str = str.concat('CanvasId ', this.getCanvasId(), ' ');
        return str;
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

    toggleVisibility(visible){
        if (visible) {
            $('#sim_servo' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_servo' + this.getId()).css('visibility', 'hidden');
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

        data = data.concat(" Angle='", this.getAngle(), "'");
        data = data.concat(" PrevAngle='", this.getPrevAngle(), "'");

        data = data.concat(" Pin='", parseInt(this.getPin()), "'");
        data = data.concat(" Costume='", this.getCostume(), "'");
        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this.setX(0);
        this.setY(30);
        this.setAngle(0);
        this.setPrevAngle(0);
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

    getHeight(height){
        return this._height;
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

    setAngle(angle){
        this._angle = angle;
    }

    getAngle(){
        return this._angle;
    }

    setPrevAngle(prevAngle){
        this._prevAngle = prevAngle;
    }

    getPrevAngle(){
        return this._prevAngle;
    }

    setImage(image){
        this._image.src = image;
    }

    getImage(){
        return this._image;
    }

    setBackgroundColor(backgroundColor){
        this._backgroundColor = backgroundColor;
    }

    getBackgroundColor(){
        return this._backgroundColor;
    }

    setPin(pin){
        this._pin = pin;
    }

    getPin(){
        return this._pin;
    }

    setCostume(costume){
        this._costume = costume;

        switch (costume) {
            case StatesEnum.PLAIN:
                this._image.src = './DwenguinoIDE/img/socialrobot/servo_movement.png';
                break;
            case StatesEnum.EYE:
                this._image.src = '';
                break;
            case StatesEnum.RIGHTHAND:
                this._image.src = './DwenguinoIDE/img/socialrobot/righthand.png';
                break;
            case StatesEnum.LEFTHAND:
                this._image.src = './DwenguinoIDE/img/socialrobot/lefthand.png';              
                break;
        }
    }

    getCostume(){
        return this._costume;
    }

    getCanvasId(){
        return this._canvasId;
    }
}