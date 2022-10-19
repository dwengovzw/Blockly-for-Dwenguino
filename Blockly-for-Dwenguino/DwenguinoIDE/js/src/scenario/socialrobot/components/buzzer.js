import { TypesEnum } from '../robot_components_factory.js';
import { EventsEnum } from '../scenario_event.js'
import { RobotComponent } from './robot_component.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotBuzzer }

class SocialRobotBuzzer extends RobotComponent {
    static pinNames = {
        digitalPin: "digitalPin"
    }
    constructor(){
        super();
        BindMethods(this);
        this._image = new Image();
        this._imageUrl = `${settings.basepath}DwenguinoIDE/img/socialrobot/buzzer.png`;
        super.setImage(this._imageUrl);
        this.tone = 0;
        this.prevTone = 0;
        this.audiocontext = null;
        this.audioStarted = false;
        this.killAudio = false;
    }

    initAudioContext(){
        try {
            this.audiocontext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }
    }

    initComponent(eventBus, id, pins, state, visible, radius, offsetLeft, offsetTop, htmlClasses){
        super.initComponent(eventBus, htmlClasses, id, TypesEnum.BUZZER, "buzzer", pins, state, visible, radius, radius, offsetLeft, offsetTop, this._imageUrl, "sim_buzzer_canvas" + id);
        this.initAudioContext();
    }

    initComponentFromXml(eventBus, id, xml) {
        super.initComponentFromXml(eventBus,
            this._imageUrl,
            id,
            xml);
        this.initAudioContext();
    }

    insertHtml(){
        super.insertHtml("buzzerOptions");
    }

    getAllPossiblePins() {
        return ["BUZZER"];
    }
    setRadius(radius) {
        this._radius = radius;
    }

    getRadius(){
        return this._radius;
    }

    setOffset(offset) {
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    getTone(){
        return this.tone;
    }

    setTone(tone){
        this.tone = tone;
        this.updateAudio();
    }

    reset(){
        super.reset();
        this.setTone(0);
    }

    updateAudio(){
        // if the audio oscillator was not initialized
        if (!this.osc){
            this.osc = this.audiocontext.createOscillator();
            this.osc.connect(this.audiocontext.destination);
        }
        // stop tone when freq = 0
        if (this.tone == 0 && this.osc){
            if (this.audioStarted){
                this.osc.stop();
                this.osc.disconnect(this.audiocontext.destination);
                this.osc = null;
                this.audioStarted = false;
                this.prevTone = 0
            }
        }
        // When tone changed, stop current tone and play new one
        else if (this.tone != this.prevTone && this.osc){
            this.prevTone = this.tone;
            if (this.audioStarted){
                this.osc.stop()
                this.osc.disconnect(this.audiocontext.destination);
                this.osc = null;
            }
            this.osc = this.audiocontext.createOscillator();
            this.osc.connect(this.audiocontext.destination);
            this.osc.frequency.value = this.tone;
            this.osc.start(this.audiocontext.currentTime);
            this.audioStarted = true;
        }
    }

    killComponentAudio(){
        this.setTone(0);
    }
}