import { TypesEnum } from '../robot_components_factory.js'
import { EventsEnum } from '../scenario_event.js'
import BindMethods from "../../../utils/bindmethods.js"
import { BaseSocialRobotServo, CostumesEnum } from "./base_servo.js"

export { SocialRobotServo}


/**
 * @extends BaseSocialRobotServo
 */
class SocialRobotServo extends BaseSocialRobotServo{
    static pinNames = BaseSocialRobotServo.pinNames;

    constructor(){
        super();
        BindMethods(this);
        this._angle = 0;
        this._prevAngle = 0;
    }

    initComponent(eventBus, id, pins, costume, angle, visible, width, height, offsetLeft, offsetTop, htmlClasses, type = TypesEnum.SERVO, canvasId = 'sim_servo_canvas' + id){
        super.initComponent(eventBus, id, pins, costume, visible, width, height, offsetLeft, offsetTop, htmlClasses, type, canvasId)
        this._angle = angle;
        this._prevAngle = angle;
    }

    initComponentFromXml(eventBus, id, xml){
        super.initComponentFromXml(eventBus, id, xml);
        this._angle = Number(xml.getAttribute("Angle"));
        this._prevAngle = Number(xml.getAttribute("PrevAngle"));
    }


    toXml(additionalAttributes = ""){
        additionalAttributes = additionalAttributes.concat(" Angle='", this.getAngle(), "'");
        additionalAttributes = additionalAttributes.concat(" PrevAngle='", this.getPrevAngle(), "'");

        return super.toXml(additionalAttributes);
    }

    reset(){
        super.reset();
        this.setAngle(0);
        this.setPrevAngle(0);
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

}
    

