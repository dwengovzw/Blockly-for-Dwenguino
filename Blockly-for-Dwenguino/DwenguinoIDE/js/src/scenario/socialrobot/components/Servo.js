import { RobotComponent } from './RobotComponent.js'
import { TypesEnum } from './../RobotComponentsFactory.js'
import { EventsEnum } from './../ScenarioEvent.js'

export { SocialRobotServo as SocialRobotServo, CostumesEnum}

const CostumesEnum = {
    PLAIN: 'plain', 
    EYE: 'eye', 
    MOUTH: 'mouth',
    RIGHTHAND: 'righthand',
    LEFTHAND: 'lefthand'
  };
Object.freeze(CostumesEnum);

class SocialRobotServo extends RobotComponent{
    constructor(eventBus, id, pin, costume, angle, visible, x, y, width, height, offsetLeft, offsetTop, htmlClasses){
        super(eventBus, htmlClasses);

        this._id = id;
        this._type = TypesEnum.SERVO;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._angle = angle;
        this._prevAngle = 0;
        this._image = [new Image(), new Image()];

        switch (costume) {
            case CostumesEnum.PLAIN:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/servo_movement.png';
                break;
            case CostumesEnum.EYE:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/eye1_background.svg';
                this._image[1].src = './DwenguinoIDE/img/socialrobot/eye1_forground.svg';
                break;
            case CostumesEnum.RIGHTHAND:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/righthand.png';
                break;
            case CostumesEnum.LEFTHAND:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/lefthand.png';              
                break;
          }
        
        this._backgroundColor = '#206499';
        this._pin = pin;
        this._costume = costume;
        this._canvasId = 'sim_servo_canvas' + this._id; 
        
        this.insertHtml();
        this.toggleVisibility(visible);
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
    
        let simServo = document.getElementById('sim_'+this.getType() + this.getId());

        simServo.addEventListener('dblclick', () => { 
            this.createComponentOptionsModalDialog(MSG.servoOptions);
            this.showDialog();
        });
    
    }

    removeHtml(){
        $('#sim_' + this.getType() + this.getId()).remove();
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
        this.createCostumeOptionsDialog();

    }

    createPinOptionsInModalDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsPin" class="ui-widget row mb-4">');
        $('#componentOptionsPin').append('<div class="col-md-2">'+'Pin'+'</div>');
        $('#componentOptionsPin').append('<div id="pin" class="col-md-10"></div>');

        let pins = this.getAllPossibleServoPins();
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

        if(this.getId() == 1){
            $('.pinButton').prop('disabled', true);
            $('.pinButton').addClass('option_button_disabled');
            $('#pin36.pinButton').prop('disabled', false);
            $('#pin36.pinButton').removeClass('option_button_disabled');
            $('#pin36.pinButton').addClass('option_button_selected');
        } else if(this.getId() == 2){
            $('.pinButton').prop('disabled', true);
            $('.pinButton').addClass('option_button_disabled');
            $('#pin37.pinButton').prop('disabled', false);
            $('#pin37.pinButton').removeClass('option_button_disabled');
            $('#pin37.pinButton').addClass('option_button_selected');
        } else {
            $('.pinButton').removeClass('option_button_disabled');
            $('#pin36.pinButton').prop('disabled', true);
            $('#pin37.pinButton').prop('disabled', true);
            $('#pin36.pinButton').addClass('option_button_disabled');
            $('#pin37.pinButton').addClass('option_button_disabled');
        }
    }

    getAllPossibleServoPins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 36, 37];
    }

    createCostumeOptionsDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsCostume" class="ui-widget row mb-4">');
        $('#componentOptionsCostume').append('<div class="col-md-2">'+ MSG.servoCostume +'</div>');
        $('#componentOptionsCostume').append('<div id="costume" class="col-md-10"></div>');

        let costumeIcons = { 
            'plain' : './DwenguinoIDE/img/socialrobot/servo.png',
            'eye' : './DwenguinoIDE/img/socialrobot/eye.png',
            'mouth' : './DwenguinoIDE/img/socialrobot/mouth.png',
            'righthand' : './DwenguinoIDE/img/socialrobot/righthand_icon.png',
            'lefthand' : './DwenguinoIDE/img/socialrobot/lefthand_icon.png'
    }
        for (const [type, t] of Object.entries(CostumesEnum)) {
            console.log(t);
            $('#costume').append('<div id="costume_inner" class="row"></div>');
            $('#costume_inner').append('<div id=costume'+t+' name='+t+' class="col-lg-3 col-md-2 col-sm-3 col-xs-4 ml-2 mb-2 costumeButton"></div>');
            $('#costume'+t).append('<img src="' + costumeIcons[t] +'" class="img-responsive">');

            let costumeButton = document.getElementById('costume'+t);
            costumeButton.addEventListener('click', () => {

                this._eventBus.dispatchEvent(EventsEnum.CLEARCANVAS, this.getCanvasId());
                let newCostume = costumeButton.getAttribute("name");
                switch (newCostume) {
                    case CostumesEnum.PLAIN:
                        this.setHtmlClasses('sim_canvas servo_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(100);
                        this.setHeight(50);
                        break;
                    case CostumesEnum.EYE:
                        this.setHtmlClasses('servo_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(35);
                        this.setHeight(35);
                        break;
                    case CostumesEnum.RIGHTHAND:
                        this.setHtmlClasses('servo_canvas hand_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(64);
                        this.setHeight(149);
                        break;
                    case CostumesEnum.LEFTHAND:
                        this.setHtmlClasses('servo_canvas hand_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(64);
                        this.setHeight(149);
                        break;
                    }

                document.getElementById(this.getCanvasId()).className = "";
                document.getElementById(this.getCanvasId()).className = this.getHtmlClasses();

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

    setImage(index, image){
        this._image[index].src = image;
    }

    getImage(index){
        return this._image[index];
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
            case CostumesEnum.PLAIN:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/servo_movement.png';
                break;
            case CostumesEnum.EYE:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/eye1_background.svg';
                this._image[1].src = './DwenguinoIDE/img/socialrobot/eye1_forground.svg';
                break;
            case CostumesEnum.RIGHTHAND:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/righthand.png';
                break;
            case CostumesEnum.LEFTHAND:
                this._image[0].src = './DwenguinoIDE/img/socialrobot/lefthand.png';           
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