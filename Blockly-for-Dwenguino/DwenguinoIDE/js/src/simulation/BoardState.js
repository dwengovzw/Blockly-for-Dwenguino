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
    ioPins = null;          // Value 0 or 1
    analogIoPins = null;    // Value from 0 to 1023

    constructor(){
        this.resetBoard();
        
    }

    resetBoard(){
        this.lcdContent = new Array(2);
        this.backlight = false;
        this.lcdContent[0] = "";
        this.lcdContent[1] = "";
        this.buzzer = {
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
        this.analogIoPins = new Array(10);
        for (let i = 0 ; i < 10 ; ++i){
            this.analogIoPins[i] = 0;
        }
    }

    setLcdContent(line, text){
        let textForLine = text;
        if (line < 0 || line > 1){
            return; // Not on the screen
        }
        if (text.length > 16){
            // Drop part of text if too long
            textForLine = text.substr(0, 16);
        }
        this.lcdContent[line] = textForLine;
    }

    getLcdContent(line){
        if (line < 0 || line > 1){
            throw new Error("This is not a valid line number");
        }
        return this.lcdContent[line];
    }

    setBacklight(status){
        if (typeof status != 'boolean'){
            throw Error("status parameter can only be of type boolean");
        }
        this.backlight = status;
    }

    getBackLightStatus(){
        return this.backlight;
    }

    setServoAngle(servoNr, angle){
        this.servoAngles[servoNr] = angle;
    }

    getServoAngle(servoNr){
        return this.servoAngles[servoNr];
    }

    setMotorSpeed(motorNr, speed){
        if (motorNr >2 || motorNr < 1){
            throw Error("No motor with this number")
        }
        let motorSpeed = speed;
        if (speed < 0){
            motorspeed = 0;
        }
        if (speed > 255){
            motorspeed = 255;
        }
        this.motorSpeeds[motorNr] = speed;
    }

    getMotorSpeed(motorNr){
        if (motorNr >2 || motorNr < 1){
            throw Error("No motor with this number")
        }
        return this.motorSpeeds[motorNr];
    }

    setLedState(index, state){
        this.leds[index] = state;
    }

    getLedState(index){
        return this.leds[index];
    }

    setButtonState(index, state){
        this.buttons[index] = state;
    }

    getButtonState(index){
        return this.buttons[index];
    }

    setSonarDistance(dist){
        this.sonarDistance = dist;
    }

    getSonarDistance(){
        return this.sonarDistance;
    }

    setIoPinState(index, state){
        this.ioPins[index] = state;
    }

    getIoPinState(index){
        return this.ioPins[index];
    }

    setAnalogIoPinState(index, value){
        this.analogIoPins[index] = value;
    }

    getAnalogIoPinState(index){
        return this.analogIoPins[index];
    }

}