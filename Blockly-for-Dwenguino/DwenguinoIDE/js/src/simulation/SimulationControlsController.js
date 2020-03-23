import SimulationRunner from "./SimulationRunner.js"
import DwenguinoSimulationRobotComponentsMenu from "../scenario/socialrobot/DwenguinoSimulationRobotComponentsMenu.js"

export default class SimulationControlsController {
    simulationRunner = null;
    scenarioView = "moving";
    scenarios = null;

    logger = null;

    constructor(logger, workspace, scenarios) {
        this.logger = logger;
        this.scenarios = scenarios;


        // Create a new runner for the environment
        this.simulationRunner = new SimulationRunner(this.logger, workspace);
        this.simulationRunner.setCurrentScenario(this.scenarios[this.scenarioView]);
        
        // Init the ui controls for the debugger and simulator
        // Has to be done before the simlationRunner is initialized
        this.initSimulationControlsUI(scenarios); 

        
    }

    initSimulationControlsUI(scenarios) {
        $("#db_simulator_menu").empty();

       // Add the simulator controls menu as first child of the db_infopane
        $('#db_infopane').prepend('<div id="db_simulator_menu"></div>');
        $('#db_simulator_menu').append('<div id="sim_menu"></div>');

        $('#sim_menu').append('<div id="sim_start" class="sim_item"></div>');
        $('#sim_menu').append('<div id="sim_pause" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_stop" class="sim_item_disabled"></div>');
        $('#sim_menu').append('<div id="sim_step" class="sim_item"></div>');

        $('#sim_menu').append('<div id="sim_scenarioTag" ></div>');

        
        $.each(Object.keys(this.scenarios), (index, value) => {
            var newOpt = $("<input></input>").attr("type", "radio").attr("class", "sim_scenario_radio").attr("name", "scenario_type").attr("id", "sim_scenario_" + value).attr("value", value);
            console.log(value);
            console.log(this.scenarioView);
            if (value == this.scenarioView) {
                newOpt.attr("checked", "checked");
            }
            var image = $("<img></img>").attr("class", "scenario_image").attr("src", "DwenguinoIDE/img/scenarios/scenario_" + value + ".png");

            $("#sim_menu").append(newOpt);
            $("#sim_menu").append(image);
        });

        this.initSimulationPane();
        this.translateSimulatorInterface();

        // change speed of simulation
        $("#sim_speed").on('change', () => {
            this.setSpeed();
        });



        // Ugly hack..
        let self = this;
        $("input[name=scenario_type]:radio").change(function () {
            console.log($(this).val());
            self.scenarioView = $(this).val();
            self.initSimulationPane();
            self.translateSimulatorInterface();
            self.simulationRunner.setCurrentScenario(self.scenarios[self.scenarioView]);
            self.logger.recordEvent(self.logger.createEvent("changedScenario", this.scenarioView));

        });

        // start/stop/pause
        $("#sim_start").click(() => {
            this.setButtonsStart();
            // start
            if (!this.simulationRunner.isSimulationRunning && !this.simulationRunner.isSimulationPaused) {
                this.simulationRunner.isSimulationRunning = true;
                this.startSimulation();
                this.logger.recordEvent(this.logger.createEvent("simStart", ""));
                // resume
            } else if (!this.simulationRunner.isSimulationRunning) {
                this.logger.recordEvent(this.logger.createEvent("simResume", ""));
                this.simulationRunner.isSimulationPaused = false;
                this.simulationRunner.isSimulationRunning = true;
                this.resumeSimulation();
            }
        });

        $("#sim_pause").click(() => {
            this.logger.recordEvent(this.logger.createEvent("simPause", ""));
            this.simulationRunner.isSimulationRunning = false;
            this.simulationRunner.isSimulationPaused = true;
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
            if (!this.simulationRunner.isSimulationPaused && !this.simulationRunner.isSimulationRunning) {
                this.startStepSimulation();
                this.simulationRunner.isSimulationPaused = true;
                // step n
            } else if (!this.simulationRunner.isSimulationRunning) {
                this.simulationRunner.isSimulationPaused = false;
                this.simulationRunner.step(true);
                this.isSimulationPaused = true;
            }
        });

        var toggleSimulatorPaneView = (currentPane, otherPanes, e) => {
            $.each(otherPanes, function (index, pane) {
                let $content = $(pane.attr("href"));
                pane.removeClass("active");
                $content.hide();
            });


            $(currentPane).addClass("active");
            $(currentPane.hash).show();

            e.preventDefault();
        };

        $("a[href$='#db_code_pane']").click(function (e) {
            toggleSimulatorPaneView(this, [$("a[href$='#db_robot_pane']")], e);
        });

        $("a[href$='#db_robot_pane']").click(function (e) {
            toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']")], e);
        });

        $("ul.tabs").each(function () {
            // For each set of tabs, we want to keep track of
            // which tab is active and its associated content
            var $active, $content, $links = $(this).find('a');

            // If the location.hash matches one of the links, use that as the active tab.
            // If no match is found, use the first link as the initial active tab.
            $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
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


    translateSimulatorInterface() {
        // translation
        document.getElementById('sim_start').innerHTML = "<span class='glyphicon glyphicon-play' alt='" + MSG.simulator['start'] + "'></span>";
        document.getElementById('sim_stop').innerHTML = "<span class='glyphicon glyphicon-stop' alt='" + MSG.simulator['stop'] + "'></span>";
        document.getElementById('sim_pause').innerHTML = "<span class='glyphicon glyphicon-pause' alt='" + MSG.simulator['pause'] + "'></span>";
        document.getElementById('sim_step').innerHTML = "<span class='glyphicon glyphicon-step-forward' alt='" + MSG.simulator['step'] + "'></span>";
        document.getElementById('sim_scenarioTag').textContent = MSG.simulator['scenario'] + ":";

    }

    /**
     * This function initializes the simulation pane according to the selected scenario.
     * Each time a different scenario is selected, this function will update the simulation pane.
     */
    initSimulationPane() {
        // Reset custom changes from the social robot scenario
        $('#db_simulator_top_pane').css('height', '45%');
        $('#db_simulator_bottom_pane').css('height', '55%');

        //$('#db_simulator_pane').children().remove();

        // Code to load riding robot simulation pane is now in the initSimulationDisplay function
        // of the SimulationController class
        switch (this.scenarioView) {
            case "moving":
                //this.simulationRunner.initDwenguino();
                //this.loadRidingRobotSimulationPane();
                break;
            case "wall":
                //this.simulationRunner.initDwenguino();
                //this.loadRidingRobotSimulationPane();
                break;
            case "socialrobot":
                this.loadSocialRobotSimulationPane();
                break;
            case "default":
                //this.simulationRunner.initDwenguino();
                //this.loadRidingRobotSimulationPane();
                break;
        }
    }

    /**
     * This function only loads the elements in the simulation pane that 
     * are used by the Social Robot scenario.
     */
    loadSocialRobotSimulationPane() {
        console.log("load social robot simulation pane");
        // Load the robot components menu
        $('#db_simulator_pane').append('<div id="robot_components_menu" class="scrolling-wrapper-flexbox"></div>');
        DwenguinoSimulationRobotComponentsMenu.setupEnvironment(this.scenarios['socialrobot'], this.simulationViewContainerId);
    }



    /*
    * Starts the simulation for the current code
    */
    startSimulation() {
        this.startDebuggingView();
        this.simulationRunner.initDebugger();
        // run debugger
        this.simulationRunner.step();
    }

    /*
    * Starts the simulation for the current code with 1 step
    */
    startStepSimulation() {
        this.startDebuggingView();
        this.simulationRunner.initDebugger();
        // run debugger
        this.simulationRunner.step(true);
    }

    /*
    * Stops the simulation and resets the view
    */
    stopSimulation() {
        this.stopDebuggingView();
        this.simulationRunner.resetDwenguino();
    }

    /*
    * resumes a simulation that was paused
    */
    resumeSimulation() {
        // restart driving robot
        //TODO: restart the timed update loop

        this.simulationRunner.step();
    }

    handleSimulationStop() {
        this.logger.recordEvent(this.logger.createEvent("simStop", ""));
        this.simulationRunner.isSimulationRunning = false;
        this.simulationRunner.isSimulationPaused = false;
        this.setButtonsStop();
        this.stopSimulation();
    }



    /*
   * Adjust css when simulation is started
   */
    setButtonsStart() {
        // enable pauze and stop
        document.getElementById('sim_pause').className = "sim_item";
        document.getElementById('sim_stop').className = "sim_item";
        // disable start and step
        document.getElementById('sim_start').className = "sim_item_disabled";
        document.getElementById('sim_step').className = "sim_item_disabled";
    }

    /*
    * Adjust css when simulation is paused
    */
    setButtonsPause() {
        // enable start, stop and step
        document.getElementById('sim_start').className = "sim_item";
        document.getElementById('sim_step').className = "sim_item";
        document.getElementById('sim_stop').className = "sim_item";
        // disable pause
        document.getElementById('sim_pause').className = "sim_item_disabled";
    }

    /*
    * Adjust css when simulation is stopped
    */
    setButtonsStop() {
        // enable start, stop and step
        document.getElementById('sim_start').className = "sim_item";
        document.getElementById('sim_step').className = "sim_item";
        // disable pause
        document.getElementById('sim_stop').className = "sim_item_disabled";
        document.getElementById('sim_pause').className = "sim_item_disabled";
    }

    /*
    * Adjust css when simulation is run step by step
    */
    setButtonsStep() {
        // enable start, stop and step
        document.getElementById('sim_start').className = "sim_item";
        document.getElementById('sim_step').className = "sim_item";
        document.getElementById('sim_stop').className = "sim_item";
        // disable pause
        document.getElementById('sim_pause').className = "sim_item_disabled";
    }

    /*
    * Adjusts the view during simulation
    * disables the programming and makes the simulation pane biggger
    */
    startDebuggingView() {
        if (document.getElementsByClassName("alertDebug").length !== 0) {
            document.getElementsByClassName("alertDebug")[0].remove();
        }
        var alertMessage = '<div class ="alertDebug">' + MSG.simulator['alertDebug'] + '</div>';
        $('#db_body').append(alertMessage);
        document.getElementsByClassName('alertDebug')[0].style.width = document.getElementById("blocklyDiv").style.width;
        document.getElementById('blocklyDiv').style.opacity = "0.5";
        //document.getElementById('blocklyDiv').style.pointerEvents = "none";
    }
    /*
    * Returns to normal view when debugging is finished
    */
    stopDebuggingView() {
        document.getElementById('blocklyDiv').style.opacity = "1";
        document.getElementById('blocklyDiv').style.pointerEvents = "auto";
        if (document.getElementsByClassName("alertDebug").length !== 0) {
            document.getElementsByClassName("alertDebug")[0].remove();
        }
    }

    /*
    * updates the speed of the simulation
    */
    setSpeed() {
        var e = document.getElementById("sim_speed");
        var option = e.options[e.selectedIndex].value;

        this.logger.recordEvent(this.logger.createEvent("setSpeed", option));

        switch (option) {
            case "veryslow":
                this.simulationRunner.speedDelay = 600;
                break;
            case "slow":
                this.simulationRunner.speedDelay = 300;
                break;
            case "medium":
                this.simulationRunner.speedDelay = 150;
                break;
            case "fast":
                this.simulationRunner.speedDelay = 75;
                break;
            case "veryfast":
                this.simulationRunner.speedDelay = 32;
                break;
            case "realtime":
                this.simulationRunner.speedDelay = 16;
        }
    }


}