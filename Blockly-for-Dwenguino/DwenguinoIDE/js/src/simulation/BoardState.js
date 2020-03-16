/*
 * This class is used as a datastructure to save the state of the simulated Dwenguino board.
*/

export default class BoardState {
    lcdContent = null;
    backlight = null;
    buzzer = null;
    servoAngles = null;
    motorSpeeds =  null;
    leds = null;
    buttons = null;
    sonarDistance = -1;
    ioPins = null;

    constructor(){
        this.reset();
        try {
            this.buzzer.audiocontext = new(window.AudioContext || window.webkitAudioContext)();
            // Create a new oscillator to play a specific tone and set the type to sin
            this.boardState.buzzer.osc = this.boardState.buzzer.audiocontext.createOscillator(); // instantiate an oscillator
            this.boardState.buzzer.osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }
    }

    reset(){
        this.lcdContent = new Array(2);
        this.backlight = false;
        this.lcdContent[0] = "";
        this.lcdContent[1] = "";
        this.buzzer = {
            osc: null,
            audiocontext: null,
            tonePlaying: 0
        };
        this.servoAngles = [0, 0];
        this.motorSpeeds = [0, 0];
        this.leds = [0,0,0,0,0,0,0,0,0];
        this.buttons = [1,1,1,1,1];
        this.sonarDistance = -1;
        this.ioPins = new Array(30);
        for (let i = 0 ; i < 30 ; ++i){
            this.ioPins[i] = 0;
        }
    }

}