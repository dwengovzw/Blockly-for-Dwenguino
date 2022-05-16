import { TypesEnum } from '../robot_components_factory.js'
import { EventsEnum } from '../scenario_event.js'
import BindMethods from "../../../utils/bindmethods.js"
import { RobotComponent } from './robot_component.js'

export { SocialRobotServo, CostumesEnum}

const CostumesEnum = {
    PLAIN: 'plain', 
    PLAIN_ROTATE_90: 'plainrotate90',
    EYE: 'eye', 
    //MOUTH: 'mouth',
    RIGHTHAND: 'righthand',
    LEFTHAND: 'lefthand'
  };
Object.freeze(CostumesEnum);

/**
 * @extends RobotComponent
 */
class SocialRobotServo extends RobotComponent{
    static pinNames = {
        digitalPin: "digitalPin"
    }

    constructor(){
        super();
        BindMethods(this);

        this._images = {
            foreground: new Image(),
            background: new Image()
        }
        this._costumeImageSources = {
            foreground: {},
            background: {}
        };
        this._costumeImageSources.foreground[CostumesEnum.PLAIN] = `${settings.basepath}DwenguinoIDE/img/socialrobot/servo_head_centered.png`;
        this._costumeImageSources.foreground[CostumesEnum.PLAIN_ROTATE_90] = `${settings.basepath}DwenguinoIDE/img/socialrobot/servo_head_centered.png`;
        this._costumeImageSources.foreground[CostumesEnum.EYE] = `${settings.basepath}DwenguinoIDE/img/socialrobot/eye1_forground.svg`;
        this._costumeImageSources.foreground[CostumesEnum.LEFTHAND] = `${settings.basepath}DwenguinoIDE/img/socialrobot/lefthand.png`;
        this._costumeImageSources.foreground[CostumesEnum.RIGHTHAND] = `${settings.basepath}DwenguinoIDE/img/socialrobot/righthand.png`;

        this._costumeImageSources.background[CostumesEnum.PLAIN] = `${settings.basepath}DwenguinoIDE/img/socialrobot/servo_background_centered.png`;
        this._costumeImageSources.background[CostumesEnum.PLAIN_ROTATE_90] = `${settings.basepath}DwenguinoIDE/img/socialrobot/servo_background_centered.png`;
        this._costumeImageSources.background[CostumesEnum.EYE] = `${settings.basepath}DwenguinoIDE/img/socialrobot/eye1_background.svg`;
        this._costumeImageSources.background[CostumesEnum.LEFTHAND] = this._costumeImageSources.foreground[CostumesEnum.LEFTHAND];
        this._costumeImageSources.background[CostumesEnum.RIGHTHAND] = this._costumeImageSources.foreground[CostumesEnum.RIGHTHAND];

        this._backgroundColor = '#206499';
        this._prevAngle = 0;

        this._x = 0;
        this._y = 30;
    }

    initComponent(eventBus, id, pins, costume, angle, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.SERVO, "servo", pins, {}, visible, width, height, offsetLeft, offsetTop, this._costumeImageSources.background[CostumesEnum.PLAIN], 'sim_servo_canvas' + id);
        this._costume = costume;
        this._angle = angle;
        this._prevAngle = angle;
        this._x = 0;
        this._y = 30;
        this._images.background.src = this._costumeImageSources.background[costume];
        this._images.foreground.src = this._costumeImageSources.foreground[costume];
    }

    initComponentFromXml(eventBus, id, xml){
        super.initComponentFromXml(eventBus,
            this._images.background.src,
            id,
            xml);
        this._angle = Number(xml.getAttribute("Angle"));
        this._prevAngle = Number(xml.getAttribute("PrevAngle"));
        this._costume = xml.getAttribute("Costume");
        this._x = Number(xml.getAttribute("X"));
        this._y = Number(xml.getAttribute("Y"));
        this._images.background.src = this._costumeImageSources.background[this.getCostume()];
        this._images.foreground.src = this._costumeImageSources.foreground[this.getCostume()];
        
    }


    insertHtml(){
        super.insertHtml(DwenguinoBlocklyLanguageSettings.translate(["servoOptions"]));
    }

    toXml(){
        let additionalAttributes = "";
        additionalAttributes = additionalAttributes.concat(" Angle='", this.getAngle(), "'");
        additionalAttributes = additionalAttributes.concat(" PrevAngle='", this.getPrevAngle(), "'");
        additionalAttributes = additionalAttributes.concat(" Costume='", this.getCostume(), "'");
        additionalAttributes = additionalAttributes.concat(" X='", this.getX(), "'");
        additionalAttributes = additionalAttributes.concat(" Y='", this.getY(), "'");

        return super.toXml(additionalAttributes);
    }

    reset(){
        super.reset();
        this.setAngle(0);
        this.setPrevAngle(0);
    }

    createComponentOptionsModalDialog(headerTitle){
        super.createComponentOptionsModalDialog(headerTitle);
        this.createCostumeOptionsDialog();

    }

    getAllPossiblePins(){
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 40, 41, "SERVO_1", "SERVO_2", "SERVO_3", "SERVO_4", "SERVO_5", "SERVO_6"];
    }

    createCostumeOptionsDialog(){
        $('#componentOptionsModalBody').append('<div id="componentOptionsCostume" class="ui-widget row mb-4">');
        $('#componentOptionsCostume').append('<div class="col-md-2">'+ DwenguinoBlocklyLanguageSettings.translate(['servoCostume']) +'</div>');
        $('#componentOptionsCostume').append('<div id="costume" class="col-md-10"></div>');

        let costumeIcons = { 
            'plain' : `${settings.basepath}DwenguinoIDE/img/socialrobot/servo.png`,
            'plainrotate90' : `${settings.basepath}DwenguinoIDE/img/socialrobot/servo_rotated_90.png`,
            'eye' : `${settings.basepath}DwenguinoIDE/img/socialrobot/eye.png`,
            //'mouth' : './DwenguinoIDE/img/socialrobot/mouth.png',
            'righthand' : `${settings.basepath}DwenguinoIDE/img/socialrobot/righthand_icon.png`,
            'lefthand' : `${settings.basepath}DwenguinoIDE/img/socialrobot/lefthand_icon.png`
        }

        $('#costume').append('<div id="costume_inner" class="row"></div>');
        for (const [type, t] of Object.entries(CostumesEnum)) {
            $('#costume_inner').append('<div id=costume'+t+' name='+t+' class="col-lg-3 col-md-2 col-sm-3 col-xs-4 ml-2 mb-2 costumeButton"></div>');
            if(this.getCostume() == t){
                $('#costume'+t).addClass('active');
            }

            $('#costume'+t).append('<img src="' + costumeIcons[t] +'" class="img-fluid">');

            let costumeButton = document.getElementById('costume'+t);
            costumeButton.addEventListener('click', () => {
                $('#costume'+t).addClass('active');
                let previousCostume = this.getCostume();
                $('#costume'+previousCostume).removeClass('active');

                this._eventBus.dispatchEvent(EventsEnum.CLEARCANVAS, this.getCanvasId());
                let newCostume = costumeButton.getAttribute("name");
                switch (newCostume) {
                    case CostumesEnum.PLAIN:
                        this.setHtmlClasses('sim_canvas servo_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(100);
                        this.setHeight(50);
                        this.setX(0);
                        this.setY(0);
                        break;
                    case CostumesEnum.PLAIN_ROTATE_90:
                        this.setHtmlClasses('sim_canvas servo_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(100);
                        this.setHeight(50);
                        this.setX(0);
                        this.setY(30);
                        break;
                    case CostumesEnum.EYE:
                        this.setHtmlClasses('servo_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(35);
                        this.setHeight(35);
                        this.setX(0);
                        this.setY(0);
                        break;
                    case CostumesEnum.RIGHTHAND:
                        this.setHtmlClasses('servo_canvas hand_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(86);
                        this.setHeight(149);
                        this.setX(0);
                        this.setY(30);
                        break;
                    case CostumesEnum.LEFTHAND:
                        this.setHtmlClasses('servo_canvas hand_canvas');
                        this.setCostume(newCostume);
                        this.setWidth(86);
                        this.setHeight(149);
                        this.setX(0);
                        this.setY(30);
                        break;
                    }

                document.getElementById(this.getCanvasId()).className = "";
                document.getElementById(this.getCanvasId()).className = this.getHtmlClasses();

                this._eventBus.dispatchEvent(EventsEnum.INITIALIZECANVAS, this);
                this._eventBus.dispatchEvent(EventsEnum.SAVE);
            });
        }
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

    /*getType() {
        return super.getType();
    }*/

    /**
     * 
     * @param {string} index foreground or background
     * @param {string} image image url
     */
    setImage(index, image){
        this._images[index].src = image;
    }

    getImage(index){
        return this._images[index];
    }

    setBackgroundColor(backgroundColor){
        this._backgroundColor = backgroundColor;
    }

    getBackgroundColor(){
        return this._backgroundColor;
    }


    setCostume(costume){
        this._costume = costume;
        this._images.background.src = this._costumeImageSources.background[costume];
        this._images.foreground.src = this._costumeImageSources.foreground[costume];
    }

    getServoBackground(){
        return this._images.background;
    }

    getServoBackgroundRotated(){
        return this._images.background;
    }

    getCostume(){
        return this._costume;
    }

    getCanvasId(){
        return this._canvasId;
    }
}