import ButtonMap from "./ButtonMap.js"

export default class BoardSimulation {
    simulationViewContainerId = "#db_robot_pane";
    boardSimulationModel = null;
    board = null;
    logger = null;
    simulationRunner = null;

    constructor(boardSimulationModel, board, logger, simulationRunner){
        this.boardSimulationModel = boardSimulationModel;
        this.board = board;
        this.logger = logger;
        this.simulationRunner = simulationRunner;
    }

    /*
    * inits the right actions to handle the simulation view
    */
   initDwenguinoSimulation() {
        // make sure we are not loading the menu twice
        $('#db_simulator_top_pane').children().remove();

        $('#db_simulator_top_pane').append('<div id="db_simulator_menu"></div>');
        $('#db_simulator_top_pane').append('<div id="db_simulator_pane"></div>');
        $('#db_simulator_menu').append('<div id="sim_menu"></div>');

        $('#sim_menu').append('<div id="sim_start" class="sim_item"></div>');
        $('#sim_menu').append('<div id="sim_pause" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_stop" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_step" class="sim_item"></div>');

        $('#db_simulator_menu').append('<div id="sim_menu_next_line" class="sim_menu_next_line"></div>');
        $('#sim_menu_next_line').append('<div id="sim_scenarioTag"></div>');
        $('#sim_menu_next_line').append('<div id="sim_scenario"></div>');

        //Add scenarios to the dropdown
        $("#sim_scenario").empty();
        $.each(Object.keys(this.boardSimulationModel.scenarios), (index, value) => {
            var container = $("<div></div>").attr("class", "scenario_radio_container");
            var newOpt = $("<input></input>").attr("type", "radio").attr("name", "scenario_type").attr("id", "sim_scenario_" + value).attr("value", value);
            console.log(value);
            console.log(this.boardSimulationModel.scenarioView);
            if (value == this.boardSimulationModel.scenarioView){
                newOpt.attr("checked", "checked");
            }
            var image = $("<img></img>").attr("class", "scenario_image").attr("src", "DwenguinoIDE/img/scenarios/scenario_" + value + ".png");
            container.append(newOpt);
            container.append(image);
            $("#sim_scenario").append(container);
        });

        //Init the simulator pane view
        this.initSimulationPane();

        //Translate the interface.
        this.translateSimulatorInterface();

        //Init the current scenario view
        this.boardSimulationModel.currentScenario.initSimulationDisplay(this.simulationViewContainerId);

        //Init the simulation canvas element
        document.getElementById('sim_canvas');

        // start/stop/pause
        $("#sim_start").click(() => {
            this.setButtonsStart();
            // start
            if (!this.boardSimulationModel.isSimulationRunning && !this.boardSimulationModel.isSimulationPaused) {
                this.boardSimulationModel.isSimulationRunning = true;
                this.startSimulation();
                this.logger.recordEvent(this.logger.createEvent("simStart", ""));
            // resume
            } else if (!this.isSimulationRunning) {
                this.logger.recordEvent(this.logger.createEvent("simResume", ""));
                this.isSimulationPaused = false;
                this.isSimulationRunning = true;
                this.resumeSimulation();
            }
        });

        $("#sim_pause").click(() => {
            this.logger.recordEvent(this.logger.createEvent("simPause", ""));
            this.isSimulationRunning = false;
            this.isSimulationPaused = true;
            this.setButtonsPause();
        });

        $("#sim_stop").click(() => {
            this.logger.recordEvent(this.logger.createEvent("simStopButtonClicked", ""));
            this.handleSimulationStop();
        });

        $("#sim_step").click(() => {
            this.setButtonsStep();
            this.logger.recordEvent(this.logger.createEvent("simStep", ""));
            // step 1
            if (!this.isSimulationPaused && !this.isSimulationRunning) {
                this.startStepSimulation();
                this.isSimulationPaused = true;
            // step n
            } else if (!this.isSimulationRunning) {
                this.isSimulationPaused = false;
                this.oneStep();
                this.isSimulationPaused = true;
            }
        });

        // change speed of simulation
        $("#sim_speed").on('change', () => {
            this.setSpeed();
        });

        // Ugly hack..
        let self = this;
        $("input[name=scenario_type]:radio").change(function(){
            console.log($(this).val());
            self.scenarioView = $(this).val();
            self.initSimulationPane();
            self.translateSimulatorInterface();

            self.currentScenario = self.scenarios[self.scenarioView];
            self.currentScenario.initSimulationDisplay(self.simulationViewContainerId);
            self.logger.recordEvent(self.logger.createEvent("changedScenario", this.scenarioView));

        });

        var toggleSimulatorPaneView = (currentPane, otherPanes, e) => {
            $.each(otherPanes, function(index, pane){
            let $content = $(pane.attr("href"));
            pane.removeClass("active");
            $content.hide();
            });


            $(currentPane).addClass("active");
            $(currentPane.hash).show();

            e.preventDefault();
        };

        $("a[href$='#db_code_pane']").click(function(e){
            toggleSimulatorPaneView(this, [$("a[href$='#db_robot_pane']")], e);
        });

        $("a[href$='#db_robot_pane']").click(function(e){
            toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']")], e);
        });

        $("ul.tabs").each(function(){
            // For each set of tabs, we want to keep track of
            // which tab is active and its associated content
            var $active, $content, $links = $(this).find('a');

            // If the location.hash matches one of the links, use that as the active tab.
            // If no match is found, use the first link as the initial active tab.
            $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
            $active.addClass('active');

            $content = $($active[0].hash);

            // Hide the remaining content
            $links.not($active).each(function () {
            $(this.hash).hide();
            });
        });

        //Select the scenario view by default.
        $("a[href$='#db_robot_pane']").trigger("click");


    }

    /**
     * This function initializes the simulation pane according to the selected scenario.
     * Each time a different scenario is selected, this function will update the simulation pane.
     */
    initSimulationPane() {
        // Reset custom changes from the social robot scenario
        $('#db_simulator_top_pane').css('height', '50%');
        $('#db_simulator_bottom_pane').css('height', '50%');

        $('#db_simulator_pane').children().remove();

        var option = this.scenarioView;

        switch (option) {
        case "moving":
            this.loadRidingRobotSimulationPane();
            break;
        case "wall":
            this.loadRidingRobotSimulationPane();
            break;
        case "socialrobot":
            this.loadSocialRobotSimulationPane();
            break;
        case "default":
            this.loadRidingRobotSimulationPane();
            break;
        }  
    }

    /**
     * This function only loads the elements in the simulation pane that 
     * are used by the Social Robot scenario.
     */
    loadSocialRobotSimulationPane(){
        console.log("load social robot simulation pane");
        // Load the robot components menu
        $('#db_simulator_pane').append('<div id="robot_components_menu" class="scrolling-wrapper-flexbox"></div>');
        DwenguinoSimulationRobotComponentsMenu.setupEnvironment(this.scenarios['socialrobot'],this.simulationViewContainerId);
    }

    /**
     * This function only loads the elements in the simulation pane that 
     * are used by all Riding Robot scenarios.
     */
    loadDwenguinoSimulationPane(){
        $('#db_simulator_pane').append('<div id="debug"></div>');
        $('#db_simulator_pane').append('<div id="sim_components"></div>');
        $('#db_simulator_pane').append('<div id="sim_board"></div>');

        $('#sim_components').append('<div id="sim_sonar" class="sim_sonar"></div>');
        $('#sim_components').append('<div id="sim_sonar_distance" class="sim_sonar_distance"></div>');
        $('#sim_components').append('<div id="sim_sonar_input"></div>');

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
            self.board.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 0;
            self.updateSimulatorView();
        });

        $("#sim_button_N, #sim_button_E, #sim_button_C, #sim_button_S, #sim_button_W").on('mouseup', function() {
            self.board.buttons[ButtonMap.mapButtonIdToIndex(this.id)] = 1;
            self.updateSimulatorView();
        });
    }


    updateSimulatorView(){

        // Change the visuals of the pir sensor
        // TODO: Figure out how to update the pir sensor visuals

        // Show the sonar value
        var distance = Math.round(this.board.sonarDistance);
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
        if (this.board.buttons.audiocontext){
            if (this.board.buzzer.tonePlaying === 0) {
                this.board.buzzer.osc.stop();
            } else {
                // start tone
                this.board.buzzer.osc.frequency.value = this.board.buzzer.tonePlaying; // Hz
                this.board.buzzer.osc.connect(this.board.buzzer.audiocontext.destination); // connect it to the destination
                this.board.buzzer.osc.start(); // start the oscillator
            }
        }

        // Update the button view
        for (let i = 0 ; i < this.board.buttons.length ; i++){
            if (this.board.buttons[i] === 0){
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button sim_button_pushed";
            }else{
                document.getElementById(ButtonMap.mapIndexToButtonId(i)).className = "sim_button";    
            }
        }


        // Turn lcd backlight on or off.
        if (this.board.backlight){
            $("#sim_lcds").addClass("on");
        }else{
            $("#sim_lcds").removeClass("on");
        }

        // Set the board text on the screen
        for (var row = 0 ; row < 2 ; ++row){
            // write new text to lcd screen and replace spaces with &nbsp;
            $("#sim_lcd_row" + row).text(this.board.lcdContent[row]);
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
            if (this.board.leds[i] === 0){
                classValue = "sim_light sim_light_off";
            }else{
                classValue = "sim_light sim_light_on";
            }
            document.getElementById('sim_light_' + i).className = classValue;
            }
            // Set led 13 to right value
        if (this.board.leds[8] === 0){
            document.getElementById('sim_light_13').className = "sim_light sim_light_off";
        }else{
            document.getElementById('sim_light_13').className = "sim_light sim_light_on";
        }

    }

    translateSimulatorInterface(){
        // translation
        document.getElementById('sim_start').innerHTML = "<span class='glyphicon glyphicon-play' alt='" + MSG.simulator['start'] + "'></span>";
        document.getElementById('sim_stop').innerHTML = "<span class='glyphicon glyphicon-stop' alt='" + MSG.simulator['stop'] + "'></span>";
        document.getElementById('sim_pause').innerHTML = "<span class='glyphicon glyphicon-pause' alt='" + MSG.simulator['pause'] + "'></span>";
        document.getElementById('sim_step').innerHTML = "<span class='glyphicon glyphicon-step-forward' alt='" + MSG.simulator['step'] + "'></span>";    
        document.getElementById('sim_scenarioTag').textContent = MSG.simulator['scenario'];
        var option = this.boardSimulationModel.scenarioView;
    
        switch (option) {
          case "moving":
            this.translateSimComponents();
            break;
          case "wall":
            this.translateSimComponents();
            break;
          case "socialrobot":
            break;
          case "default":
            this.translateSimComponents();
            break;
        }
    }

    translateSimComponents() {
        document.getElementById('sim_sonar_distance').textContent = "Sonar " + MSG.simulator['distance'] + ":";
        document.getElementById('sonar_input').value = this.boardSimulationModel.board.sonarDistance;
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

    getScenarioView(){
        return this.scenarioView;
    }
}