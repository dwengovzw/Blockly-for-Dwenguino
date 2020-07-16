import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"
import DwenguinoBoardSimulation from "../DwenguinoBoardSimulation.js";

/*
 * This class is the abstraction of the riding robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 */


export default class DwenguinoSimulationScenarioRidingRobot extends DwenguinoSimulationScenario {

    dwenguinoBoardSimulation = null;
    constructor(logger) {
        super(logger);
        this.dwenguinoBoardSimulation = new DwenguinoBoardSimulation(logger);
        this.initSimulationState(null);
    }

    /* @brief Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param containerIdSelector The jquery selector of the conainer to put the robot display.
    *
    */
    initSimulationState(boardState) {
        // init superclass
        super.initSimulationState(boardState);
        //init robot statecontainerIdSelector
        this.robot = {
            image: {
                width: 65,
                height: 83
            },
            start: {
                x: 100,
                y: 100,
                angle: 0
            },
            position: {
                x: 100,
                y: 100,
                angle: 0
            },
            collision: [{
                type: 'circle',
                radius: 25
            }]
        };
        this.containerWidth = 0;
        this.containerHeight = 0;

    }


    /* @brief Initializes the simulator robot display.
     * This function puts all the nececary visuals inside the container with the id containerId.
     * Additionally, it sets up the state of the simulated robot.
     * The function also resets the internal state of the simulation so the display is initialized from its original position.
     *
     * @param containerIdSelector The jquery selector of the conainer to put the robot display.
     *
     */
    initSimulationDisplay(containerId) {
        // init superclass
        super.initSimulationDisplay(containerId);


        // Create the bottom and top pane and init the Board simulation into the top pane
        let db_simulator_panes = $(`#${containerId}`);

        let top_pane = $("<div>").attr("id", "db_simulator_top_pane");
        let bottom_pane = $("<div>").attr("id", "db_simulator_bottom_pane");//.attr("class", "resize-sensor");

        let tab_pane = $("<div>").attr("id", "db_simulator_tab_selection");
        let tabs = $("<ul>").attr("class", "tabs");
        //tabs.append('<li id="robot_pane_tab"><a href="#db_robot_pane" class="active">Robot</a></li><li><a href="#db_code_pane">Code</a></li>');
        tab_pane.append(tabs);
        bottom_pane.append(tab_pane);


        let robot_pane = $("<div>").attr("id", "db_robot_pane"); //.attr("class", "resize-sensor");
        let sim_container = $("<div>").attr("id", "sim_container");
        let sim_animation = $("<div>").attr("id", "sim_animation");
        //sim_animation.append('<canvas id="sim_canvas"></canvas>');
        sim_container.append(sim_animation);
        robot_pane.append(sim_container);
        bottom_pane.append(robot_pane);


        /*let code_pane = $("<div>").attr("id", "db_code_pane");
        code_pane.append('<pre id="content_arduino" class="content"></pre>');
        bottom_pane.append(code_pane);*/

        db_simulator_panes.append(top_pane).append(bottom_pane);

        // init board simulation
        this.dwenguinoBoardSimulation.initSimulationState(null);
        this.dwenguinoBoardSimulation.initSimulationDisplay("db_simulator_top_pane");


        //Init the display elements
        var container = $("#db_robot_pane");

        //Add resize listerner to the conainer and update width and height accordingly
        var self = this;
        new ResizeSensor(sim_container, function () {
            console.log('myelement has been resized');
            self.containerWidth = sim_container.width();
            self.containerHeight = sim_container.height();
        });

        var animationSprite = $("<div>").attr("id", "sim_animation");


        sim_container.append(animationSprite);
        container.append(sim_container);


        $("#db_simulator_bottom_pane")
            .css("display", "flex")
            .css("flex-direction", "column");

        $("#db_simulator_tab_selection")
            .css("height", "30px");

        $("#db_robot_pane")
            .css("flex: 1");

        $("#sim_container")
            .css("position", "relative")
            .css("width", "80%")
            .css("height", "80%")
            .css("box-sizing", "border-box");

        $("#sim_animation")
            .css("width", this.robot.image.width + "px")
            .css("height", this.robot.image.height + "px")
            .css("maring-left", "-25px")
            .css("maring-right", "-20px")
            .css("position", "absolute")
            .css("background-image", "url('DwenguinoIDE/img/board/robot.png')")
            .css("background-size", "100%")
            .css('top', this.robot.position.y + 'px')
            .css('left', this.robot.position.x + 'px');

        
    }


    /* @brief updates the simulation state and display
     * This function updates the simulation state and display using the supplied board state.
     *
     * @param boardState The state of the Dwenguino board.
     * @return The updated Dwenguino board state.
     *
     */
    updateScenario(dwenguinoState) {
        super.updateScenario(dwenguinoState);
        this.updateScenarioState(dwenguinoState);
        this.updateScenarioDisplay(dwenguinoState);
        this.dwenguinoBoardSimulation.updateScenario(dwenguinoState);
    }

    /* @brief updates the simulation state
     * This function updates the simulation state using the supplied board state.
     *
     * @param boardState The state of the Dwenguino board. It has the following structure:
     * {
       lcdContent: new Array(2),
       buzzer: {
         osc: null,
         audiocontext: null,
         tonePlaying: 0
       },
       servoAngles: [0, 0],
       motorSpeeds: [0, 0],
       leds: [0,0,0,0,0,0,0,0,0],
       buttons: [1,1,1,1,1],
       sonarDistance: 50
     }
     * @return The updated Dwenguino board state.
     *
     */
    updateScenarioState(dwenguinoState) {
        super.updateScenarioState(dwenguinoState);

        // update the state of the board simulation
        this.dwenguinoBoardSimulation.updateScenarioState(dwenguinoState);

        //Save the current dimensions of the container
        this.containerWidth = $("#sim_container").width();
        this.containerHeight = $("#sim_container").height();

        // update the state of this simulation

        var speed1 = dwenguinoState.getMotorSpeed(1);
        var speed2 = dwenguinoState.getMotorSpeed(2);


        // Save the current state of the robot into local variables.
        var x = this.robot.position.x;
        var y = this.robot.position.y;
        var angle = this.robot.position.angle;

        // decide on angle (in deg) and distance (in px) based on 2 motor speeds
        var distance = (speed1 + speed2) / 100;

        if (speed1 !== speed2) {
            angle += (speed2 - speed1) / 30;
        }

        x += distance * Math.cos(Math.PI / 180 * angle);
        y += distance * Math.sin(Math.PI / 180 * angle);

        // move to other side of frame if out of frame
        if (x > this.containerWidth) {
            x = 0;
        } else if (x < 0) {
            x = this.containerWidth;
        }
        if (y > this.containerHeight) {
            y = 0;
        } else if (y < 0) {
            y = this.containerHeight;
        }
        this.robot.position = {
            x: x,
            y: y,
            angle: angle
        };
    }

    /* @brief updates the simulation display
     * This function updates the simulation display using the supplied board state.
     *
     * @param boardState The state of the Dwenguino board.
     *
     */
    updateScenarioDisplay(dwenguinoState) {
        super.updateScenarioDisplay(dwenguinoState);

        // update the display of the dwenguino board simulation
        this.dwenguinoBoardSimulation.updateScenarioDisplay(dwenguinoState);

        // update the state of this scenario

        var robot = this.robot;
        var $robot = $('#sim_animation');

        // Update field size
        this.containerWidth = $("#sim_container").width();
        this.containerHeight = $("#sim_container").height();

        $robot
            .css('top', this.robot.position.y + 'px')
            .css('left', this.robot.position.x + 'px')
            .css('transform', 'rotate(' + this.robot.position.angle + 'deg)');
    }


}