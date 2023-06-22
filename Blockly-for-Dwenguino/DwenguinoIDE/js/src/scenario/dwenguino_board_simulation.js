import ButtonMap from "../simulation/button_map.js"
import DwenguinoSimulationScenario from "./dwenguino_simulation_scenario.js"

/**
 * This class implements the DwenguinoSimulationScenario
 * 
 * @extends DwenguinoSimulationScenario
 */
class DwenguinoBoardSimulation extends DwenguinoSimulationScenario{
    inputsState = null;
    muted = true;
    prevFreq = 0;
    boardDisplayWidth = "80%";
    componentsTopOffset = "0%";
    rightSimComponentsPosition = "auto";
    sonarDistance = 0;
    sonarInputChanged = false;
    sonarFieldBeingEdited = false;
    wasMuted = true;

    constructor(logger){
        super(logger);
        this.inputsState = {
            buttons: [1, 1, 1, 1, 1],
            reset: 1,
        }
    }

    resetScenario(){
        this.hideSonar();
        this.inputsState = {
            buttons: [1, 1, 1, 1, 1],
            reset: 1,
        }
         // Set the board text on the screen
         for (var row = 0 ; row < 2 ; ++row){
            // write new text to lcd screen and replace spaces with &nbsp;
            $("#sim_lcd_row" + row).text("");
        }
        $("#sim_lcds").removeClass("on");
        this.muteClickHandler(true);
        if (this.osc){
            this.osc.stop();
            this.osc.disconnect(this.audiocontext.destination);
            this.osc = null;
        }
        // Set leds to right value
        for (var i = 0; i < 8; i++) {
            let classValue = "sim_light sim_light_off";
            let ledElement = document.getElementById('sim_light_' + i);
            if (ledElement){
                ledElement.className = classValue;
            }
            
        }
          // Set led 13 to right value
          let ledElement = document.getElementById('sim_light_13')
          if (ledElement){
            ledElement.className = "sim_light sim_light_off";
          }
        
    }

    setBoardDisplayWidthWidth(width){
        this.boardDisplayWidth = width;
    }

    setComponentsTopOffset(offset){
        this.componentsTopOffset = offset;
    }

    setComponentsRightPosition(position){
        this.rightSimComponentsPosition = position;
    }

    

    initSimulationState(boardState){
        this.updateScenarioState(boardState);
    }

    initSimulationDisplay(containerId){

        //db_simulator_top_pane
        $(`#${containerId}`).append('<div id="db_simulator_pane"></div>');

        $('#db_simulator_pane').append('<div id="debug"></div>');
        $('#db_simulator_pane').append('<div id="sim_components"></div>');

        let containerHack = $("<div>").css(
            {"position": "absolute", "display": "inline-block", "width": this.boardDisplayWidth, "max-width": "30vw", "right": 0}
            );
        let containerHackDummy = $("<div>").attr("id", "dummy").css({"margin-top": "70%"});
        let boardContainer =$("<div>").attr("id", "sim_board"); //.css({"position": "absolute", "right": 0, "bottom": 0, "left": 0});
        containerHack.append(containerHackDummy);
        containerHack.append(boardContainer);

        $('#db_simulator_pane').append(containerHack);  
        $('#db_simulator_pane').append('<span id="db_simulator_mute"></span>');
        $('#db_simulator_mute').attr("class", "fas fa-volume-mute")

        let sonar = $('<div id="sim_sonar" class="sim_sonar"></div>');
        let sonarDist = $('<div id="sim_sonar_distance" class="sim_sonar_distance"></div>');
        let sonarInput = $('<div id="sim_sonar_input"></div>').text("Sonar " + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['distance']) + ":");
        let setButton = $('<button id="set_sonar_value"></button>').text("OK");

        $('#sim_components').append(sonar);
        $('#sim_components').append(sonarDist);
        $('#sim_components').append(sonarInput);
        $('#sim_components').append(setButton);
        $('#sim_components').css({"margin-top": this.componentsTopOffset, "right": this.rightSimComponentsPosition});

        
        $('#sim_sonar_input').append('<input type="text" id="sonar_input" size="3" name="sim_sonar_input" onkeypress="return event.charCode >= 48 && event.charCode <= 57">&nbsp;cm');


        $("#sonar_input").on('keyup', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                this.sonarInputChanged = true;
                let value = $("#sonar_input").val();
                this.sonarDistance = parseInt(value.trim());
            }
        });

        $("#sonar_input").change((e) => {
            this.sonarInputChanged = true;
            let value = $("#sonar_input").val();
            this.sonarDistance = parseInt(value.trim());
        });

        $('#set_sonar_value').click((e) => {
            let value = $("#sonar_input").val();
            this.sonarDistance = parseInt(value.trim());
        });

        $("#sonar_input").focus(() => {
            this.sonarFieldBeingEdited = true;
        });

        $("#sonar_input").focusout(() => {
            this.sonarFieldBeingEdited = false;
        });

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
            if(self.getIsSimulationRunning()){
                self.inputsState.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 0;
            }
        });

        $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mouseup', function() {
            if(self.getIsSimulationRunning()){
                self.inputsState.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 1;
            }
        });

        $('#db_simulator_mute').on("click", () => {
            this.muteClickHandler();
        });
    
    }

    muteClickHandler(setMute = false) {
        if (this.audiocontext == null){
            this.initAudioContext();
        }
        if (this.muted && !setMute){
            this.muted = false;
            $('#db_simulator_mute').removeClass();
            $('#db_simulator_mute').attr("class", "fas fa-volume-up")
        }else{
            this.muted = true;
            $('#db_simulator_mute').removeClass();
            $('#db_simulator_mute').attr("class", "fas fa-volume-mute")
        }
    }

    showSonar(){
        $("#sim_sonar").show();
        $("#sim_sonar_distance").show();
        $("#sim_sonar_input").show();
        $("#set_sonar_value").show();
    }

    hideSonar(){
        $("#sim_sonar").hide();
        $("#sim_sonar_distance").hide();
        $("#sim_sonar_input").hide();
        $("#set_sonar_value").hide();
    }


    updateScenarioState(board){
       // board.reset = this.inputsState.reset;
       for (let i = 0 ; i < this.inputsState.buttons.length ; ++i){
           board.setButtonState(i, this.inputsState.buttons[i])
       }
       if (this.sonarInputChanged){
           board.setSonarDistance(11, 12, this.sonarDistance);
           this.sonarInputChanged = false;
       }
       this.sonarDistance = board.getSonarDistance(11, 12);

    }

    updateScenario(dwenguinoState){
        this.updateScenarioState(dwenguinoState);
        this.updateScenarioDisplay(dwenguinoState);
    }

    updateScenarioDisplay(board){
        // Show the sonar value
        var distance = board.getSonarDistance(11, 12);
        if (distance <= -1){
            this.hideSonar();
        } else {
            this.showSonar();
            var sim_sonar  = document.getElementById('sonar_input');
            
            if(typeof(sim_sonar) != 'undefined' && sim_sonar != null){
                // Only change value when not being edited
                if (!this.sonarFieldBeingEdited){
                    sim_sonar.value = distance;
                }
            } else {
                console.log('Sonar input element is undefined');
            }
        }
    
           // Play audio on the buzzer
           if(this.audiocontext){
            if ((this.muted || board.getTonePlaying() == 0) && this.osc){
                this.osc.stop()
                this.wasMuted = true;
            } else if (!this.muted){
                // If the buzzer is playing and the frequency has changed then stop the buzzer
                if(this.prevFreq !== 0 && this.prevFreq !== board.getTonePlaying() && this.osc){
                    this.osc.stop();
                    this.osc.disconnect(this.audiocontext.destination);
                    this.osc = null;
                }
                // If a new frequency needs to start playing
                if(board.getTonePlaying() !== this.prevFreq || this.wasMuted || !this.osc){
                    this.osc = this.audiocontext.createOscillator();
                    this.osc.frequency.value = board.getTonePlaying();
                    this.osc.start(this.audiocontext.currentTime);
                    this.osc.connect(this.audiocontext.destination);
                    this.prevFreq = board.getTonePlaying();
                }
                this.wasMuted = false;
            }
        }
    
        // Update the button view
        for (let i = 0 ; i < 5 ; i++){
            if (board.getButtonState(i) === 0){
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button sim_button_pushed";
            }else{
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button";    
            }
        }
        
    
        // Turn lcd backlight on or off.
        if (board.getBackLightStatus() == 1){
            $("#sim_lcds").addClass("on");
        }else{
            $("#sim_lcds").removeClass("on");
        }
        
        // Set the board text on the screen
        for (var row = 0 ; row < 2 ; ++row){
            // write new text to lcd screen and replace spaces with &nbsp;
            $("#sim_lcd_row" + row).text(board.getLcdContent(row));
            if(document.getElementById('sim_lcd_row' + row) !== null){
                document.getElementById('sim_lcd_row' + row).innerHTML =
                document.getElementById('sim_lcd_row' + row).innerHTML.replace(/ /g, '&numsp;');
            }
        }
        // repaint
        var element = document.getElementById("sim_lcds");
        if(element !== null){
          element.style.display = 'none';
          element.offsetHeight;
          element.style.display = 'block';
          let lcdElement = $(".sim_lcd");
          let boardElement = $("#sim_board")
          let boardElementWidth = boardElement.width();
          let fontSize = boardElementWidth/16*1.14;
          lcdElement.css({"font-size": fontSize});
        }
        
    
        // Set leds to right value
        for (var i = 0; i < 8; i++) {
            let classValue = "";
            if (board.getLedState(i) === 0){
                classValue = "sim_light sim_light_off";
            }else{
                classValue = "sim_light sim_light_on";
            }
            document.getElementById('sim_light_' + i).className = classValue;
        }
          // Set led 13 to right value
        if (board.getLedState(8) === 0){
            document.getElementById('sim_light_13').className = "sim_light sim_light_off";
        } else{
            document.getElementById('sim_light_13').className = "sim_light sim_light_on";
        }
    }
     
}

export default DwenguinoBoardSimulation;