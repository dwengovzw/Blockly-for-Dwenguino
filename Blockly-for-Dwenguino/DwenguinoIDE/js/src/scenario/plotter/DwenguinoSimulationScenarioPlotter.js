import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"
import DwenguinoBoardSimulation from "../DwenguinoBoardSimulation.js";
import PlotterConstants from "./PlotterConstants.js"

export default class DwenguinoSimulationScenarioPlotter extends DwenguinoSimulationScenario {

    stepperMotorPins = [33, 34]; //Internal representation of the pins on which the stepper motor values are located.
    penPositionPins = [36, 37];
    colorPin = 35;
    dwenguinoBoardSimulation = null;
    constructor(logger) {
        super(logger);
        this.dwenguinoBoardSimulation = new DwenguinoBoardSimulation(logger);
        //this.initSimulationState(null);
    }

    /* @brief Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param containerIdSelector The jquery selector of the conainer to put the robot display.
    *
    */
    initSimulationState(boardState) {
        super.initSimulationState(boardState);

        /* Changes to settings -> change values in the following funtions
        * DwenguinoSimulationScenarioDrawingRobot.js
        *    getPosition, getLength, getCurrentLength
        * DwenguinoSimulation.js
        *    stepMotorRotate
        */
        this.motor = {
            image: {
                radius: PlotterConstants.motorRadius,
            },
            position: {
                xL: 20,
                xR: 20 + PlotterConstants.motorDistance,
                y: 20
            },
            settings: {
                nrOfSteps: PlotterConstants.nrOfSteps,
                currentSteps: [0, 0],
            }
        };

        this.wireLengths = [300, 200];
        this.startWireLengths = this.wireLengths;

        this.stylus = {
            image: {
                radius: 5,
                // color: "#000"
            },
            position: {
                x: (this.motor.position.xR - this.motor.position.xL) / 2 + this.motor.position.xL,
                y: 80
            },
            prevPosition: {
                x: 0,
                y: 0
            },
            drawing: {
                radius: 2,
                drawingColor: "#000",
                selectedColor: "#000",
                boardColor: "#000",
                liftStylus: false,
                // angles: [],
                // colors: []
            }
        };


        this.paper = {
            height: (this.motor.position.xR - this.motor.position.xL) / Math.sqrt(2), // height = width * sqrt(2) -> aspect ractio of a3
            width: this.motor.position.xR - this.motor.position.xL,
            position: {
                x: this.motor.position.xL,
                y: 40
            }
        };

        this.containerWidth = 0;
        this.containerHeight = 0;

        // Calculate the correct stylus point based on the current wire lengths 
        this.caclulateStylusPoint();

        if (boardState){
            // Set the initial number of steps in the boardstate based on the starlength of the wires
            boardState.setIoPinState(this.stepperMotorPins[0], this.wireLengths[0]/(2*Math.PI*PlotterConstants.motorRadius/PlotterConstants.nrOfSteps));
            boardState.setIoPinState(this.stepperMotorPins[1], this.wireLengths[1]/(2*Math.PI*PlotterConstants.motorRadius/PlotterConstants.nrOfSteps));
            // Set the initial pen posistion
            boardState.setIoPinState(this.penPositionPins[0], this.stylus.position.x - this.motor.position.xL);
            boardState.setIoPinState(this.penPositionPins[1], this.stylus.position.y - this.motor.position.y);
        }
        

    }

    /* @brief Initializes the simulator robot display.
    * This function puts all the nececary visuals inside the container with the id containerId.
    * Additionally, it sets up the state of the simulated robot.
    *
    * @param containerId The id of the conainer to put the robot display.
    *
    */
    initSimulationDisplay(containerId) {
        super.initSimulationDisplay(containerId);
        // Reset the simulation state
        this.initSimulationState(null);

        //Init the display elements
        // Create the bottom and top pane and init the Board simulation into the top pane
        let db_simulator_panes = $(`#${containerId}`);

        let top_pane = $("<div>").attr("id", "db_simulator_top_pane");
        let bottom_pane = $("<div>").attr("id", "db_simulator_bottom_pane");//.attr("class", "resize-sensor");
        db_simulator_panes.append(top_pane).append(bottom_pane);

        // init board simulation
        this.dwenguinoBoardSimulation.initSimulationState(null);
        this.dwenguinoBoardSimulation.initSimulationDisplay("db_simulator_top_pane");

        //Add canvas
        bottom_pane.append($("<canvas>").attr("id", "sim_canvas").attr("class", "canvas"));
        //Add canvas for drawing
        bottom_pane.append($("<canvas>").attr("id", "sim_canvas_drawing").attr("class", "canvas"));
        //Add canvas for grid
        bottom_pane.append($("<canvas>").attr("id", "sim_canvas_grid").attr("class", "canvas"));
        //Add div for grid
        bottom_pane.append($("<div>").attr("id", "sim_grid"));

        //Add ul for simulation settings
        var settings = $("<ul>").attr("id", "sim_settings");
        //simulation settings
        //  grid checkbox
        var item = $('<li>').attr("class", "sim_setting");
        $('<input />', { type: 'checkbox', id: 'cb_grid', value: "grid" }).prop('checked', true).appendTo(item);
        $('<label />', { 'for': 'cb_grid', id: 'txt_grid', text: MSG.drawingrobotgrid }).appendTo(item);
        settings.append(item);
        //  color picker
        var item = $('<li>').attr("class", "sim_setting");
        if ($("#colorpicker") !== undefined) {
            this.stylus.drawing.drawingColor = $("#colorpicker").val();
            // this.stylus.drawing.selectedColor = $("#colorpicker").val();
        }
        $('<input />', { type: 'color', id: 'colorpicker', name: "colorpicker", value: this.stylus.drawing.drawingColor }).appendTo(item);
        $('<label />', { 'for': 'colorpicker', id: 'txt_colorpicker', text: MSG.colorpicker }).appendTo(item);
        settings.append(item);
        //  save image button
        var item = $('<li>').attr("class", "sim_setting");
        $('<button />', { type: 'button', id: 'btn_saveImage', text: MSG.drawingrobotSaveImage }).appendTo(item);
        settings.append(item);


        bottom_pane.append(settings);

        //select canvas
        var canvas = $('#sim_canvas')[0];
        var canvas_drawing = $('#sim_canvas_drawing')[0];
        var canvas_grid = $('#sim_canvas_grid')[0];

        $(".canvas")
            .css("position", "absolute")
            .css("top", "O")
            .css("left", "O");

        $("#sim_settings")
            .css("position", "absolute")
            .css("right", "20px")
            .css("top", "0px")
            .css("list-style", "none");


        $("#sim_grid")
            .css("position", "absolute")
            .css("left", this.paper.position.x)
            .css("top", this.paper.position.y)
            .css("width", this.paper.width)
            .css("height", this.paper.height);

        $(".sim_setting").css("vertical-align", "middle");
        //Save the dimensions of the container
        this.containerWidth = bottom_pane.width();
        this.containerHeight = bottom_pane.height();

        canvas.width = this.containerWidth;
        canvas.height = this.containerHeight;
        canvas_drawing.width = this.containerWidth;
        canvas_drawing.height = this.containerHeight;
        canvas_grid.width = this.containerWidth;
        canvas_grid.height = this.containerHeight;


        this.drawGrid();

        $('#cb_grid').click(function () {
            $("#svg_grid").toggle(this.checked);
            $("#sim_canvas_grid").toggle(this.checked);
        });

        $('#btn_saveImage').click(function () {
            var canvas = $('#sim_canvas_drawing')[0];
            var MIME_TYPE = "image/png";
            var image = canvas.toDataURL(MIME_TYPE);

            var dlLink = document.createElement('a');
            dlLink.download = MSG.drawingrobotDrawing;
            dlLink.href = image;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        });


        this.redraw();
    }


    /* @brief updates the simulation state and display
    * This function updates the simulation state and display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenario(dwenguinoState) {
        super.updateScenarioState(dwenguinoState);
        var newScenarioState = this.updateScenarioState(dwenguinoState);
        this.updateScenarioDisplay(dwenguinoState);
    }

    /* @brief updates the simulation state
    * This function updates the simulation state using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioState(dwenguinoState) {
        super.updateScenarioState(dwenguinoState);

        // Update if the stylus is up or down
        this.updateServoAngle(dwenguinoState.getIoPinState(38));

        this.updateColor(dwenguinoState.getIoPinState(this.colorPin), $("#colorpicker").val());

        var stepL = dwenguinoState.getIoPinState(this.stepperMotorPins[0]);
        var stepR = dwenguinoState.getIoPinState(this.stepperMotorPins[1]);

        this.updateLengths([stepL, stepR]);
        this.caclulateStylusPoint();
        // Save the position in the board state so simulationsandbox can access it for converting from steps to x, y.
        // The coords are shifted so the left top motor = 0, 0
        dwenguinoState.setIoPinState(this.penPositionPins[0], this.stylus.position.x - this.motor.position.xL);
        dwenguinoState.setIoPinState(this.penPositionPins[1], this.stylus.position.y - this.motor.position.y);
    }

    updateLengths(newStepperPositions) {
        let wireLengths = newStepperPositions.map((elem, index) => {
            let newLength = elem * (2 * Math.PI * this.motor.image.radius / this.motor.settings.nrOfSteps);
            return newLength >= 0 ? newLength : 0;
        });
        this.wireLengths = wireLengths;
    }

    /**
     * Convert from coordinates to wire lengths
     * @param {*} coordinates 
     */
    calculateWireLengths(coordinates){
        let l1 = 0;
    }

    caclulateStylusPoint() {
        let a = this.wireLengths[0];
        let b = this.wireLengths[1];
        let dx = this.motor.position.xR - this.motor.position.xL;
        let x = (a ** 2 - b ** 2 + dx ** 2) / (2 * dx);
        // if this is not the case the wires should break or the motors should stall.
        if (a + b >= dx) {
            this.stylus.position.x = this.motor.position.xL + x;
            this.stylus.position.y = this.motor.position.y + Math.sqrt(a ** 2 - x ** 2);
        }
    }



    /* @brief updates the simulation display
    * This function updates the simulation display using the supplied board state.
    *
    * @param boardState The state of the Dwenguino board.
    *
    */
    updateScenarioDisplay(dwenguinoState) {
        super.updateScenarioDisplay(dwenguinoState);
        this.redraw();
    }

    redraw() {
        let canvas = $('#sim_canvas')[0];
        let ctx = canvas.getContext('2d');

        let canvas_drawing = $('#sim_canvas_drawing')[0];
        let ctx_drawing = canvas_drawing.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //draw lines
        ctx.beginPath();
        ctx.strokeStyle = "#848484";
        ctx.moveTo(this.motor.position.xL, this.motor.position.y);
        ctx.lineTo(this.stylus.position.x, this.stylus.position.y);
        ctx.moveTo(this.motor.position.xR, this.motor.position.y);
        ctx.lineTo(this.stylus.position.x, this.stylus.position.y);
        ctx.stroke();

        //draw stylus
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.stylus.drawing.drawingColor;
        ctx.arc(this.stylus.position.x, this.stylus.position.y, this.stylus.image.radius, 0, 2 * Math.PI);
        ctx.fill();

        //draw motorL
        ctx.beginPath();
        ctx.fillStyle = "#848484";
        ctx.arc(this.motor.position.xL, this.motor.position.y, this.motor.image.radius, 0, 2 * Math.PI);
        ctx.fill();

        //draw motorL
        ctx.beginPath();
        ctx.fillStyle = "#848484";
        ctx.arc(this.motor.position.xR, this.motor.position.y, this.motor.image.radius, 0, 2 * Math.PI);
        ctx.fill();

        //draw drawing
        if (!this.stylus.drawing.liftStylus) { //only draw if the sylus is not lifted
            ctx_drawing.beginPath();
            ctx_drawing.fillStyle = this.stylus.drawing.drawingColor;
            ctx_drawing.arc(this.stylus.position.x, this.stylus.position.y, this.stylus.drawing.radius, 0, 2 * Math.PI);
            ctx_drawing.fill();
        }
    }

    drawGrid() {
        let x = this.paper.position.x;
        let y = this.paper.position.y;
        let canvas = $('#sim_canvas_grid')[0];
        let ctx = canvas.getContext('2d');
        ctx.font = "10px Arial";
        // ctx.fillStyle = "#000";
        ctx.fillText("0", x, y);
        ctx.fillText("100", x + 100, y);
        ctx.fillText("200", x + 200, y);
        ctx.fillText("300", x + 300, y);

        ctx.fillText("300", x - 15, y + 100);
        ctx.fillText("200", x - 15, y + 200);
        ctx.fillText("100", x - 15, y + 300);


        var data = '\
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" id="svg_grid">\
          <defs>\
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">\
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>\
            </pattern>\
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">\
              <rect width="100" height="100" fill="url(#smallGrid)"/>\
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>\
            </pattern>\
          </defs>\
          <rect width="100%" height="100%" fill="url(#grid)" />\
        </svg>';

        $("#sim_grid").append(data);

    }


    updateServoAngle(angle) {
        if (angle === 90) {
            this.stylus.drawing.liftStylus = true;
        }
        if (angle === 0) {
            this.stylus.drawing.liftStylus = false;
        }
    }

    checkServoAngle(angle, state) {
        if (angle === 90 && state.stylus.drawing.liftStylus) {
            return false;
        } else if (angle === 0 && !state.stylus.drawing.liftStylus) {
            return false;
        } else {
            return true;
        }
    }

    updateColor(c1, c2) {
        // Color block used
        if (c1 !== this.stylus.drawing.boardColor) {
            this.stylus.drawing.drawingColor = c1;
            this.stylus.drawing.boardColor = c1;
        }

        // Colorpicker used
        if (c2 !== this.stylus.drawing.selectedColor) {
            this.stylus.drawing.drawingColor = c2;
            this.stylus.drawing.selectedColor = c2;
        }
    }

}