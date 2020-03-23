import ButtonMap from "./ButtonMap.js"

export default class SimulationController{
    inputsState = null;
    audiocontext = null;
    osc = null;
    audioStarted = false;
    constructor(){
        this.inputsState = {
            buttons: [1, 1, 1, 1, 1],
            reset: 1,
        }
    }

    initSimulationState(){
        try {
            this.audiocontext = new(window.AudioContext || window.webkitAudioContext)();
            // Create a new oscillator to play a specific tone and set the type to sin
            this.osc = this.audiocontext.createOscillator(); // instantiate an oscillator
            this.osc.type = 'sine'; // this is the default - also square, sawtooth, triangle
        } catch (e) {
            console.log('Web Audio API is not supported in this browser');
        }
    }

    initSimulationDisplay(){


        $('#db_simulator_top_pane').append('<div id="db_simulator_pane"></div>');

        $('#db_simulator_pane').append('<div id="debug"></div>');
        $('#db_simulator_pane').append('<div id="sim_components"></div>');
        $('#db_simulator_pane').append('<div id="sim_board"></div>');  

        let sonar = $('<div id="sim_sonar" class="sim_sonar"></div>').text("Sonar " + MSG.simulator['distance'] + ":");
        let sonarDist = $('<div id="sim_sonar_distance" class="sim_sonar_distance"></div>');
        let sonarInput = $('<div id="sim_sonar_input"></div>').text("Sonar " + MSG.simulator['distance'] + ":");

        $('#sim_components').append(sonar);
        $('#sim_components').append(sonarDist);
        $('#sim_components').append(sonarInput);
        
        $('#sim_sonar_input').append('<input type="text" id="sonar_input" name="sim_sonar_input" onkeypress="return event.charCode >= 48 && event.charCode <= 57">&nbsp;cm');

        $('#sim_board').append('<div class="sim_light sim_light_off" id ="sim_light_13"></div>');
        $('#sim_board').append('<div id="sim_lcds"></div>');
        $('#sim_board').append('<div id="sim_lights"></div>');
        $('#sim_board').append('<div id="sim_buttons"></div>');
        $('#sim_board').append('<div id="sim_button_reset" class="sim_button"></div>');

        $('#sim_lcds').append('<div class="sim_lcd" id="sim_lcd_row0"></div>');
        $('#sim_lcds').append('<div class="sim_lcd" id="sim_lcd_row1"></div>');

        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_7"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_6"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_5"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_4"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_3"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_2"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_1"></div>');
        $('#sim_lights').append('<div class="sim_light sim_light_off" id ="sim_light_0"></div>');

        $('#sim_buttons').append('<div id="sim_buttons_top"></div>');
        $('#sim_buttons').append('<div id="sim_buttons_middle"></div>');
        $('#sim_buttons').append('<div id="sim_buttons_bottom"></div>');

        $('#sim_buttons_top').append('<div id="sim_button_N" class="sim_button"></div>');

        $('#sim_buttons_middle').append('<div id="sim_button_W" class="sim_button"></div>');
        $('#sim_buttons_middle').append('<div id="sim_button_C" class="sim_button"></div>');
        $('#sim_buttons_middle').append('<div id="sim_button_E" class="sim_button"></div>');

        $('#sim_buttons_bottom').append('<div id="sim_button_S" class="sim_button"></div>');

        this.hideSonar();

        let self = this;
        // push buttons
        $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mousedown', function() {
            self.inputsState.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 0;
        });

        $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mouseup', function() {
            self.inputsState.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 1;
        });
    
    }

    showSonar(){
        $("#sim_sonar").show();
        $("#sim_sonar_distance").show();
        $("#sim_sonar_input").show();
    }

    hideSonar(){
        $("#sim_sonar").hide();
        $("#sim_sonar_distance").hide();
        $("#sim_sonar_input").hide();
    }


    updateSimulationState(board){
        board.reset = this.inputsState.reset;
        board.buttons = this.inputsState.buttons;
        return board;
    }

    updateSimulationDisplay(board){

        // Change the visuals of the pir sensor
        // TODO: Figure out how to update the pir sensor visuals
    
        // Show the sonar value
        var distance = Math.round(board.sonarDistance);
        if (distance <= -1){
            this.hideSonar();
        } else {
            this.showSonar();
            var sim_sonar  = document.getElementById('sonar_input');
            
            if(typeof(sim_sonar) != 'undefined' && sim_sonar != null){
                sim_sonar.value = distance;
            } else {
                console.log('Sonar input element is undefined');
            }
        }
        
    
        // Play audio on the buzzer
        if (this.audiocontext){
            if (board.buzzer.tonePlaying === 0 && this.audioStarted) {
                //this.osc.stop();
                console.log("stop");
                this.audioStarted = false;
            } else if ( !this.audioStarted ) {
                // start tone
                this.osc.frequency.value = board.buzzer.tonePlaying; // Hz
                this.osc.connect(this.audiocontext.destination); // connect it to the destination
                //this.osc.start(); // start the oscillator
                console.log("start");
                this.audioStarted = true;
            }
        }
    
        // Update the button view
        for (let i = 0 ; i < board.buttons.length ; i++){
            if (board.buttons[i] === 0){
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button sim_button_pushed";
            }else{
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button";    
            }
        }
        
    
        // Turn lcd backlight on or off.
        if (board.backlight){
            $("#sim_lcds").addClass("on");
        }else{
            $("#sim_lcds").removeClass("on");
        }
        
        // Set the board text on the screen
        for (var row = 0 ; row < 2 ; ++row){
            // write new text to lcd screen and replace spaces with &nbsp;
            $("#sim_lcd_row" + row).text(board.lcdContent[row]);
            if(document.getElementById('sim_lcd_row' + row) !== null){
                document.getElementById('sim_lcd_row' + row).innerHTML =
                document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&nbsp;');
            }
        }
        // repaint
        var element = document.getElementById("sim_lcds");
        if(element !== null){
          element.style.display = 'none';
          element.offsetHeight;
          element.style.display = 'block';
        }
         
    
        // Set leds to right value
        for (var i = 0; i < 8; i++) {
            let classValue = "";
            if (board.leds[i] === 0){
                classValue = "sim_light sim_light_off";
            }else{
                classValue = "sim_light sim_light_on";
            }
            document.getElementById('sim_light_' + i).className = classValue;
          }
          // Set led 13 to right value
        if (board.leds[8] === 0){
            document.getElementById('sim_light_13').className = "sim_light sim_light_off";
        }else{
            document.getElementById('sim_light_13').className = "sim_light sim_light_on";
        }
    
      }

}