/*
 * This class is used as a datastructure to save the state of the simulated Dwenguino board.
*/

import ButtonMap from "./ButtonMap.js";

export default class BoardState {
    pins = new Array(33);
    pinMapping = {};
    lcdContent = null;
    // sonarDistance = -1; // now has to be fetched as values with getIOPinState(echoPin)
    

    constructor(){
        // Map pin numbers to simulated pin indexes
        for (let i = 0 ; i < 24 ; ++i){
            this.pinMapping[i + ""] = i;
        }
        // Map analog pin names to simulated pin indexes
        for (let i = 0 ; i < 8 ; ++i){
            this.pinMapping["A" + i] = 24 + i;
        }
        // Map switch names to corresponding switch numbers
        this.pinMapping["SW_N"] = 16;
        this.pinMapping["SW_E"] = 17;
        this.pinMapping["SW_S"] = 18;
        this.pinMapping["SW_W"] = 19;
        this.pinMapping["SW_C"] = 32;
        // Map BUZZER pin name to number
        this.pinMapping["BUZZER"] = 33;
        // Map backlight pin
        this.pinMapping["LCD_BACKLIGHT"] = 20;
        // Motor pin mappings: normally uses 2 pins but simulated by one 
        // since it cannot interfere with other connections since not exposed on external connector
        this.pinMapping["DC_MOTOR_1"] = 34;
        this.pinMapping["DC_MOTOR_2"] = 35;
        // Same for servo motors
        this.pinMapping["SERVO_MOTOR_1"] = 36;
        this.pinMapping["SERVO_MOTOR_2"] = 37;
        // Same for leds, only save the index of the first LED, rest is after
        for (let i = 0 ; i < 8 ; ++i){
            this.pinMapping["LED" + i] = 38 + i;
        }
        
        this.pinMapping["LED13"] = 13;
        this.resetBoard();
    }

    resetBoard(){
        this.lcdContent = new Array(2);
        this.lcdContent[0] = "";
        this.lcdContent[1] = "";

        for (let i = 0 ; i < 24 ; ++i){
            this.pins[this.pinMapping[i + ""]] = 0;
        }

        for (let i = 0 ; i < 8 ; ++i){
            this.pins[this.pinMapping["A" + i]] = 0;
        }

        this.pins[this.pinMapping["LCD_BACKLIGHT"]] = 0;
        // Set no frequency playing on BUZZER
        this.pins[this.pinMapping["BUZZER"]] = 0;
        
        //Set servo angles to 0 and DC speeds to 0
        this.pins[this.pinMapping["DC_MOTOR_1"]] = 0;
        this.pins[this.pinMapping["DC_MOTOR_2"]] = 0;
        this.pins[this.pinMapping["SERVO_MOTOR_1"]] = 0;
        this.pins[this.pinMapping["SERVO_MOTOR_2"]] = 0;
        // Turn leds off
        for (let i = 0 ; i < 8 ; ++i){
            this.pins[this.pinMapping["LED0"] + i] = 0;
        }
        // Turn led 13 off
        this.pins[this.pinMapping["LED13"]] = 0;
        // Set buttons to default on state
        this.pins[this.pinMapping["SW_N"]] = 1;
        this.pins[this.pinMapping["SW_E"]] = 1;
        this.pins[this.pinMapping["SW_S"]] = 1;
        this.pins[this.pinMapping["SW_W"]] = 1;
        this.pins[this.pinMapping["SW_C"]] = 1;
        //this.sonarDistance = -1;
    }

    setTonePlaying(tone){
        this.setTonePlayingOnPin(tone, "BUZZER");
    }

    getTonePlaying(){
        return this.getTonePlayingOnPin("BUZZER");
    }

    setTonePlayingOnPin(tone, pinName){
        this.pins[this.pinMapping[pinName]] = tone;
    }

    getTonePlayingOnPin(pinName){
        return this.pins[this.pinMapping[pinName]];
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
        if (status == 1 || status == 0){
            this.pins[this.pinMapping["LCD_BACKLIGHT"]] = status;
        } else {
            throw new Error("Invalid status");
        }
    }

    getBackLightStatus(){
        return this.pins[this.pinMapping["LCD_BACKLIGHT"]];
    }

    setServoAngle(servoNr, angle){
        this.pins[this.pinMapping["SERVO_MOTOR_" + servoNr]] = angle;
        console.log('setServoAngle', this.pins[this.pinMapping["SERVO_MOTOR_" + servoNr]]);
    }

    getServoAngle(servoNr){
        return this.pins[this.pinMapping["SERVO_MOTOR_" + servoNr]];
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
        this.pins[this.pinMapping["SERVO_MOTOR_" + motorNr]] = speed;
    }

    getMotorSpeed(motorNr){
        if (motorNr >2 || motorNr < 1){
            throw Error("No motor with this number")
        }
        return this.pins[this.pinMapping["SERVO_MOTOR_" + motorNr]];
    }

    setLedState(index, state){
        if (index == 8){
            this.pins[this.pinMapping["LED13"]] = state; 
        } else {
            this.pins[this.pinMapping["LED" + index]] = state;
        }
    }

    getLedState(index){
        if (index == 8){
            return this.pins[this.pinMapping["LED13"]]; 
        } else {
            return this.pins[this.pinMapping["LED" + index]];
        }
    }

    setButtonState(index, state){
        let switchName = ButtonMap.mapIndexToButtonPinName(index);
        this.pins[this.pinMapping[switchName]] = state
    }

    getButtonState(index){
        let switchName = ButtonMap.mapIndexToButtonPinName(index);
        return this.pins[this.pinMapping[switchName]];
    }

    setSonarDistance(trigPin, echoPin, dist){
        this.setIoPinState(trigPin, dist);
        this.setIoPinState(echoPin, dist);
        //this.sonarDistance = dist;
    }

    getSonarDistance(trigPin, echoPin){
        return this.getIoPinState(echoPin);
    }

    setIoPinState(pinName, state){
        // Convert pin name to string
        let index = pinName + "";
        this.pins[this.pinMapping[index]] = state;
    }

    getIoPinState(pinName){
        // Convert pin name to string
        let index = pinName + "";
        return this.pins[this.pinMapping[index]];
    }

    setAnalogIoPinState(pinName, value){
        if (!pinName.startsWith("A")){
            throw new Error("Not a valid analog pin name!")
        }
        this.setIoPinState(pinName, value);
    }

    getAnalogIoPinState(pinName){
        if (!pinName.startsWith("A")){
            throw new Error("Not a valid analog pin name!")
        }
        return this.getIoPinState(pinName);
    }

}