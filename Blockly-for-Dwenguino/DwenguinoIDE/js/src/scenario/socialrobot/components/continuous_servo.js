import { TypesEnum } from '../robot_components_factory.js'
import { EventsEnum } from '../scenario_event.js'
import BindMethods from "../../../utils/bindmethods.js"
import { BaseSocialRobotServo, CostumesEnum } from "./base_servo.js"
import { SocialRobotServo } from "./servo.js"

export { SocialRobotContinuousServo}


/**
 * @extends SocialRobotServo
 */
class SocialRobotContinuousServo extends SocialRobotServo{
    static pinNames = SocialRobotServo.pinNames;
    constructor(){
        super();
        BindMethods(this);

        // Change default background costume
        this._costumeImageSources.background[CostumesEnum.PLAIN] = `${settings.basepath}DwenguinoIDE/img/socialrobot/continuous_servo_background_centered.png`;
        this._costumeImageSources.background[CostumesEnum.PLAIN_ROTATE_90] = `${settings.basepath}DwenguinoIDE/img/socialrobot/continuous_servo_background_centered.png`;
        this._costumeIcons['plain'] = `${settings.basepath}DwenguinoIDE/img/socialrobot/continuous_servo.png`;
        this._costumeIcons['plainrotate90'] = `${settings.basepath}DwenguinoIDE/img/socialrobot/continuous_servo_rotated_90.png`;

        this._speed = 0;
        this._prevSpeed = 0;
        this._maxAbsoluteSpeed = 255;
        this._speedMultiplier = 10;
    }

    initComponent(eventBus, id, pins, costume, speed, visible, width, height, offsetLeft, offsetTop, htmlClasses){
        super.initComponent(eventBus, id, pins, costume, 0, visible, width, height, offsetLeft, offsetTop, htmlClasses, TypesEnum.CONTINUOUSSERVO, 'sim_continuous_servo_canvas' + id)
        this._speed = speed;
        this._prevSpeed = speed;
    }

    initComponentFromXml(eventBus, id, xml){
        super.initComponentFromXml(eventBus, id, xml);
        this._speed = Number(xml.getAttribute("Speed"));
        this._prevSpeed = Number(xml.getAttribute("PrevSpeed"));
    }

    toXml(additionalAttributes = ""){
        additionalAttributes = additionalAttributes.concat(" Speed='", this.getSpeed(), "'");
        additionalAttributes = additionalAttributes.concat(" PrevSpeed='", this.getPrevSpeed(), "'");

        return super.toXml(additionalAttributes);
    }

    reset(){
        super.reset();
        this.setSpeed(0);
        this.setPrevSpeed(0);
    }

    rotateToNextAngle(){
        let angleDelta = this.getSpeed()/this._maxAbsoluteSpeed*this._speedMultiplier;
        this.setPrevAngle(this.getAngle());
        this.setAngle((this.getPrevAngle() + angleDelta)%360);
        console.log(this._angle);
    }

    setSpeed(speed){
        this._speed = speed;
    }

    getSpeed(){
        return this._speed;
    }

    setPrevSpeed(prevSpeed){
        this._prevSpeed = prevSpeed;
    }

    getPrevSpeed(){
        return this._prevSpeed;
    }
}