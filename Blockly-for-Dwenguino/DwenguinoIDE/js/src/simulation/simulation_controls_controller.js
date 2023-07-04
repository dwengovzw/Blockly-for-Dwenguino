import SimulationRunner from "./simulation_runner.js"
import DwenguinoSimulationRobotComponentsMenu from "./dwenguino_simulation.js"
import { EVENT_NAMES } from "../logging/event_names.js"
import DwenguinoBlockly from "../dwenguino_blockly.js"

class SimulationControlsController {
    simulationRunner = null;
    scenarioView = "spyrograph";
    scenarios = null;

    logger = null;

    stateChangedListeners = [];

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

    addStateHasChangedListener(listener){
        this.stateChangedListeners.push(listener);
    }

    fireStateChangedEvent(){
        for (let listener of this.stateChangedListeners){
            listener();
        }
    }

    getCurrentScenario(){
        return this.simulationRunner.getCurrentScenario();
    }

    setCurrentScenario(scenarioName){
        this.scenarioView = scenarioName;
        this.translateSimulatorInterface();

        this.handleSimulationStop();
        this.simulationRunner.setCurrentScenario(this.scenarios[scenarioName]);
        let data = { 
            "scenario": scenarioName
        }
        this.updateProgrammingBlocks();
        this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.changedScenario, data));
        this.setCurrentScenarioActiveButton(scenarioName)
        this.fireStateChangedEvent();
    }

    setCurrentScenarioActiveButton(scenarioName){
        $(".sim_scenario_btn").removeClass("active");
        $("#scenario_label_" + scenarioName).addClass("active");
        $(".sim_scenario_radio").removeAttr("checked");
        $("#sim_scenario_" + scenarioName).attr("checked", "checked")
    }

    initSimulationControlsUI(scenarios) {
        $("#db_simulator_menu").empty();

       // Add the simulator controls menu as first child of the db_infopane
        $('#db_infopane').prepend('<div id="db_simulator_menu"></div>');
        $('#db_simulator_menu').append('<div id="sim_menu"></div>');

        $('#sim_menu').append('<div id="sim_menu_buttons"></div>');
        $('#sim_menu_buttons').append('<div id="sim_start" class="sim_item"></div>');
        $('#sim_menu_buttons').append('<div id="sim_pause" class="sim_item_disabled"></div>');
        $('#sim_menu_buttons').append('<div id="sim_stop" class="sim_item_disabled"></div>');
        $('#sim_menu_buttons').append('<div id="sim_step" class="sim_item"></div>');


        $('#sim_menu').append('<div id="sim_scenarios" class="btn-group btn-group-toggle" data-toggle="buttons"></div>');
        $('#sim_scenarios').append('<div id="sim_scenarioTag" ></div>');
        $.each(Object.keys(this.scenarios), (index, value) => {
            let scenarioItem = '<div id="scenario_item_' + value + '" class="sim_scenario_item"></div>';
            let label = '<label id="scenario_label_' + value + '" class="btn sim_scenario_btn"></label>';
            let radioButton = '<input id="sim_scenario_' + value + '"' + 
                'type="radio" ' +
                'name="scenario_type" ' +
                'class="sim_scenario_radio" '+
                'value="'+ value +'" ' +
                'autocomplete="off">' +
                `<img src="${settings.basepath}DwenguinoIDE/img/scenarios/scenario_` + value + '.png" class="scenario_image">';
            
            
            $('#sim_scenarios').append(scenarioItem);
            $('#scenario_item_' + value).append(label);
            $('#scenario_label_' + value).append(radioButton);
            if (value == this.scenarioView){
                $('#sim_scenario_' + value).attr("checked", "checked");
                $('#scenario_label_' + value).attr("class", "btn sim_scenario_btn active");
            }
        });

        //this.updateProgrammingBlocks();
        this.translateSimulatorInterface();

        // change speed of simulation
        $("#sim_speed").on('change', () => {
            this.setSpeed();
        });

        // Ugly hack..
        let self = this;
        $("input[name=scenario_type]:radio").on("change", (event) => {
            self.setCurrentScenario($(event.currentTarget).val());
        });

        

        // start/stop/pause
        $("#sim_start").on("click", () => {
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var xmlCode = Blockly.Xml.domToText(xml);

            // Get javascript and python for current code
            let javascriptCode = "";
            let pythonCode = "";
            try {
                javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                javascriptCode = "invalid code";
            }
            try {
                pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                pythonCode = "invalid code";
            }
            let data = {
                xmlCode: xmlCode,
                javascriptCode: javascriptCode,
                pythonCode: pythonCode
            }

            this.setButtonsStart();
            // start
            if (!this.simulationRunner.isSimulationRunning && !this.simulationRunner.isSimulationPaused) {
                this.simulationRunner.setIsSimulationRunning(true);
                this.startSimulation();
                this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simStart, data));
                // resume
            } else if (!this.simulationRunner.isSimulationRunning) {
                this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simResume, data));
                this.simulationRunner.setIsSimulationPaused(false);
                this.simulationRunner.setIsSimulationRunning(true);
                this.resumeSimulation();
            }
        });

        $("#sim_pause").click(() => {
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var xmlCode = Blockly.Xml.domToText(xml);

            // Get javascript and python for current code
            let javascriptCode = "";
            let pythonCode = "";
            try {
                javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                javascriptCode = "invalid code";
            }
            try {
                pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                pythonCode = "invalid code";
            }
            let data = {
                xmlCode: xmlCode,
                javascriptCode: javascriptCode,
                pythonCode: pythonCode
            }

            this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simPause, data));
            this.simulationRunner.setIsSimulationRunning(false);
            this.simulationRunner.setIsSimulationPaused(true);
            this.setButtonsPause();
        });

        $("#sim_stop").click(() => {
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var xmlCode = Blockly.Xml.domToText(xml);

            // Get javascript and python for current code
            let javascriptCode = "";
            let pythonCode = "";
            try {
                javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                javascriptCode = "invalid code";
            }
            try {
                pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                pythonCode = "invalid code";
            }
            let data = {
                xmlCode: xmlCode,
                javascriptCode: javascriptCode,
                pythonCode: pythonCode
            }

            this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simStopButtonClicked, data));
            this.handleSimulationStop();
        });

        $("#sim_step").click(() => {
            var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
            var xmlCode = Blockly.Xml.domToText(xml);

            // Get javascript and python for current code
            let javascriptCode = "";
            let pythonCode = "";
            try {
                javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                javascriptCode = "invalid code";
            }
            try {
                pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
            } catch (error){
                pythonCode = "invalid code";
            }
            let data = {
                xmlCode: xmlCode,
                javascriptCode: javascriptCode,
                pythonCode: pythonCode
            }

            this.setButtonsStep();
            this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simStep, data));
            
            // step 1
            if (!this.simulationRunner.isSimulationPaused && !this.simulationRunner.isSimulationRunning) {
                this.simulationRunner.setIsDebugging(true);
                this.startStepSimulation();
                this.simulationRunner.setIsSimulationPaused(true);
                this.simulationRunner.setIsDebugging(false);
                // step n
            } else if (!this.simulationRunner.isSimulationRunning) {
                this.simulationRunner.setIsDebugging(true);
                this.simulationRunner.setIsSimulationPaused(false);
                this.simulationRunner.step(true);
                this.simulationRunner.setIsSimulationPaused(true);
                this.simulationRunner.setIsDebugging(false);
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

        $("a[href$='#db_code_pane']").on("click", (e) => {
            toggleSimulatorPaneView(this, [$("a[href$='#db_robot_pane']")], e);
        });

        $("a[href$='#db_robot_pane']").on("click", (e) => {
            toggleSimulatorPaneView(this, [$("a[href$='#db_code_pane']")], e);
        });


        //Select the scenario view by default.
        $("a[href$='#db_robot_pane']").trigger("click");



    }

    /**
     * Update the programming blocks displayed in the simulator based on the actual selected scenario. 
     * The blocks configuration is loaded from a .xml file.
     */
    updateProgrammingBlocks() {
        /*fetch(DwenguinoBlockly.basepath + "/DwenguinoIDE/levels/" + this.scenarioView + ".xml")
        .then(response => response.text())
        .then((data) => {
            let xml_data = `<xml id="toolbox">${data}</xml>`
            DwenguinoBlockly.workspace.updateToolbox(xml_data);
            DwenguinoBlockly.doTranslation()
        })*/
        // This code is weird but it is required for the translation to work.
        $("#toolbox").load(DwenguinoBlockly.basepath + "/DwenguinoIDE/levels/" + this.scenarioView + ".xml", function(){
            DwenguinoBlockly.doTranslation();
            DwenguinoBlockly.workspace.updateToolbox(document.getElementById("toolbox"));
        })
    }


    translateSimulatorInterface() {
        // translation
        document.getElementById('sim_start').innerHTML = "<span class='fas fa-play' alt='" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['start']) + "'></span>";
        document.getElementById('sim_stop').innerHTML = "<span class='fas fa-stop' alt='" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['stop']) + "'></span>";
        document.getElementById('sim_pause').innerHTML = "<span class='fas fa-pause' alt='" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['pause']) + "'></span>";
        document.getElementById('sim_step').innerHTML = "<span class='fas fa-step-forward' alt='" + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['step']) + "'></span>";
        document.getElementById('sim_scenarioTag').textContent = DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['scenario']) + ":";

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
        // might need:
        //this.simulationRunner.resetDebugger();
        this.simulationRunner.resetDwenguino();
        this.simulationRunner.resetScenario();
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
        var xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        var xmlCode = Blockly.Xml.domToText(xml);

        // Get javascript and python for current code
        let javascriptCode = "";
        let pythonCode = "";
        try {
            javascriptCode = Blockly.JavaScript.workspaceToCode(DwenguinoBlockly.workspace);
        } catch (error){
            javascriptCode = "invalid code";
        }
        try {
            pythonCode = Blockly.Python.workspaceToCode(DwenguinoBlockly.workspace);
        } catch (error){
            pythonCode = "invalid code";
        }
        let data = {
            xmlCode: xmlCode,
            javascriptCode: javascriptCode,
            pythonCode: pythonCode
        }

        this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.simStop, data));
        this.simulationRunner.setIsSimulationRunning(false);
        this.simulationRunner.setIsSimulationPaused(false);
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
        var alertMessage = '<div class ="alertDebug">' + DwenguinoBlocklyLanguageSettings.translateFrom('simulator',['alertDebug']) + '</div>';
        $('#db_body').append(alertMessage);
        document.getElementsByClassName('alertDebug')[0].style.width = document.getElementById("blocklyDiv").style.width;

        let codeViewCheckbox = document.querySelector('input[id="code_checkbox"]');
        if (codeViewCheckbox.checked) {
            document.getElementById("blocklyDiv").style.visibility = 'hidden';
            document.getElementById('db_code_pane').style.visibility = 'visible';
        } else {
            document.getElementById("blocklyDiv").style.visibility = 'visible';
            document.getElementById('blocklyDiv').style.opacity = "0.5";
            document.getElementById('db_code_pane').style.visibility = 'hidden';
        }
        document.getElementById('db_code_pane').style.opacity = "0.5";
        document.getElementById('blocklyDiv').style.opacity = "0.5";
        //document.getElementById('blocklyDiv').style.pointerEvents = "none";
    }
    /*
    * Returns to normal view when debugging is finished
    */
    stopDebuggingView() {
        let codeViewCheckbox = document.querySelector('input[id="code_checkbox"]');
        if (codeViewCheckbox.checked) {
            document.getElementById("blocklyDiv").style.visibility = 'hidden';
            document.getElementById('db_code_pane').style.visibility = 'visible';

        } else {
            document.getElementById("blocklyDiv").style.visibility = 'visible';
            document.getElementById('db_code_pane').style.visibility = 'hidden';
        }
        document.getElementById('db_code_pane').style.opacity = "1";
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

        this.logger.recordEvent(this.logger.createEvent(EVENT_NAMES.setSpeed, "", "", "", option));

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

export default SimulationControlsController;