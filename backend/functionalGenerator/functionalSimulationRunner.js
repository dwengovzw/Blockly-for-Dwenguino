import BaseSimulationRunner from "./BaseSimulationRunner.js";

export default class FunctionalSimulationRunner extends BaseSimulationRunner{

    generatedSteps = 0;
    stateLoggingInterval = 1300;
    timeIntervalMultiplier = 47;
    code = "";
    constructor(){
        super();
    }

    /**
     * this function generates a functional vector for a program. 
     *
     * @param {String} code The code to generate a functional vector for
     * @param {Number} steps The number of times the program state should be logged during the run
     * @param {Number} inits The number of times the program is restarted 
     * 
     * @returns {Array} groupedVector The functional vector for the program. Its total length is equal to steps * inits
     */
    generateSimulatedData(code, steps, inits){

        if (code == "" || code == null ){
            return [];
        }

        let totalStateVector = [];

        for (let i = 0 ; i < inits ; i++){
            // Initialize new random simulation state.
            this.currentScenario.initSimulationState(this.board);
            this.generatedSteps = 0;
            this.initDebugger(code);

            this.code = code.split("\n");

            while (this.generatedSteps < steps){
                totalStateVector = this.generateStep(steps, totalStateVector);
            }
        }
        let groupedVector = [];
        if (totalStateVector.length == 0){
            return totalStateVector;
        }
        // groupedVector = totalStateVector; // If not grouping: set this line and remove the following two for loops.
        for (let i = 0 ; i < totalStateVector[0].length ; i++){
            for (let j = 0 ; j < totalStateVector.length ; j++){
                groupedVector.push(totalStateVector[j][i]);
            }
        }
        return groupedVector;
    }

    generateStep(steps, totalStateVector){

        let line = this.debugger.debuggerjs.machine.getCurrentLoc().start.line - 1;
        this.debugger.debuggerjs.machine.step();
    
    
        // Get current line
        let code = this.code[line];
    
        if (code == undefined){
            code = "";
        }
    
        // check if current line is not a sleep
        if (code.trim().startsWith("DwenguinoSimulation.sleep")) {
          // sleep
          let delayTime = Number(this.debugger.code.split("\n")[line].replace(/\D+/g, ''));
          let delayStepsTaken = 0;
          let delayStepsToTake = delayTime*100; //Math.floor(Math.log(delayTime) * DwenguinoSimulation.timeIntervalMultiplier);
          for (delayStepsTaken = 0 ; delayStepsTaken < delayStepsToTake && this.generatedSteps < steps ; delayStepsTaken++){
            this.currentScenario.updateScenario(this.board);
            this.generatedSteps++;
            if (this.generatedSteps % this.stateLoggingInterval == 0){
                var currentState = this.getCurrentStateVector();
                totalStateVector.push(currentState);
                //totalStateVector = totalStateVector.concat(currentState);
            }
          }
        }else{
            // Update the scenario View
            this.currentScenario.updateScenario(this.board);
            this.generatedSteps++;
            if (this.generatedSteps % this.stateLoggingInterval == 0){
                var currentState = this.getCurrentStateVector();
                totalStateVector.push(currentState);
                //totalStateVector = totalStateVector.concat(currentState);
            }
        }
        this.checkForEnd();
        return totalStateVector;
    };

    generateStringHistogram(text){
        let histogram = [];
        let letterMapping =
        {'0': 0,
         '1': 1,
         '2': 2,
         '3': 3,
         '4': 4,
         '5': 5,
         '6': 6,
         '7': 7,
         '8': 8,
         '9': 9,
         'e': 10,
         'n': 11,
         'a': 12,
         't': 13,
         'i': 13,
         'o': 14,
         'd': 14,
         's': 15,
         'l': 15,
         'g': 15,
         'v': 15,
         'h': 15,
         'k': 16,
         'm': 16,
         'u': 16,
         'b': 16,
         'p': 16,
         'w': 16,
         'j': 16,
         'z': 17,
         'c': 17,
         'f': 17,
         'x': 17,
         'y': 17,
         'q': 17,
         };

        for (let i = 0 ; i  < 18 ; i++){
            histogram[i] = 0;
        }
        let textLower = text.toLowerCase();
        for (let i = 0 ; i < textLower.length ; i++){
            let letter = textLower.charAt(i);
            if (letter in letterMapping){
                histogram[letterMapping[letter]]++;
            }

        }
        return histogram;
        /*for (var i = 0 ; i < 256 ; i++){
            histogram[i] = 0;
        }
        var textLower = text.toLowerCase();
        for (var i = 0 ; i < textLower.length ; i++){
            var letterCode = textLower.charCodeAt(i);
            if (letterCode < histogram.length){
                histogram[letterCode]++;
            }
        }
        var reducedHistogram = [];
        // Add numbers
        for (var i = 48 ; i < 58 ; i++){
            reducedHistogram.push(histogram[i]);
        }
        // Add lowercase letters
        for (var i = 97 ; i < 126 ; i++){
            reducedHistogram.push(histogram[i]);
        }
        return reducedHistogram;*/
  };


  getCurrentStateVector(){
     var stateVector = [];
     stateVector.push(Math.ceil(this.board.buzzer.tonePlaying/100)/10);
     // Limit values to valid range and go from continuous to cathegorical.
     for (var i = 0 ; i < 2 ; i++){
        stateVector.push(Math.floor(Math.min(Math.max(this.board.servoAngles[i], 0), 180)/18)/10);
        stateVector.push(Math.floor(Math.max(Math.min(this.board.motorSpeeds[i], 255), -255)/25)/10);
     }
     for (var i = 0 ; i < this.board.leds.length ; i++){
        stateVector.push(this.board.leds[i]);
     }
     // Button state is generated so directly related to the rest of the board state.
     /*
     for (var i = 0 ; i < DwenguinoSimulation.board.buttons.length ; i++){
        stateVector.push(DwenguinoSimulation.board.buttons[i]);
     }*/

    var line1Hist = this.generateStringHistogram(this.board.lcdContent[0]);
    var line2Hist = this.generateStringHistogram(this.board.lcdContent[1]);
    for (var i = 0 ; i < line1Hist.length ; i++){
        stateVector.push((line1Hist[i] + line2Hist[i])/16); // Normalize (max 16x the same char on screen)
    }
    // merge state into one value
    //state = 0;
    let state = stateVector;
    /*for (var i = 0 ; i < stateVector.length ; i++){
        state += stateVector[i];
    }*/
    return state;

  };
}