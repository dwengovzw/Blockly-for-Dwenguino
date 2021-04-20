import DwenguinoSimulationScenario from "../dwenguino_simulation_scenario.js"
import DwenguinoBoardSimulation from "../dwenguino_board_simulation.js";
import ConveyorDisplayHelper from "./conveyor_display_helper.js";

class DwenguinoSimulationScenarioConveyor extends DwenguinoSimulationScenario {

    amount = 5;
    ledOffColor = { r: 200, g: 200, b: 200 };

    startPositionY = 0;

    container = null;
    dwenguinoBoardSimulation = null;
    conveyorDisplayHelper = null;

    // default pin-distribution for sensors and buttons
    sensorPins = [0, 1, 2, 3, 4];
    buttonPins = [5, 6, 7, 8, 9];


    constructor(logger) {
        super(logger);
        this.dwenguinoBoardSimulation = new DwenguinoBoardSimulation(logger);

        let conveyorWidth = 310;    //height image conveyor belt
        let conveyorLenth = 440;    //height image conveyor belt
        let conveyorBorder = 30;     //border thickness conveyor belt

        let buttonPercentage = .6;
        let ledPercentage = .6;
        let sensorPercentage = .8;

        this.dimensions = {
            button: {
                width: (conveyorWidth - 10) * buttonPercentage / this.amount,
                height: (conveyorWidth - 10) * buttonPercentage / this.amount,
                spacing: (conveyorWidth - 10) * (1 - buttonPercentage) / (this.amount - 1),
            },
            led: {
                width: (conveyorWidth - 10) * ledPercentage / this.amount,
                height: (conveyorWidth - 10) * ledPercentage / this.amount,
                spacing: (conveyorWidth - 10) * (1 - ledPercentage) / (this.amount - 1),
            },
            sensor: {
                width: conveyorWidth * sensorPercentage / this.amount,
                height: conveyorWidth * sensorPercentage / this.amount,
                spacing: conveyorWidth * (1 - sensorPercentage) / (this.amount - 1),
            },
            conveyor: {
                width: conveyorWidth,
                length: conveyorLenth,
                border: conveyorBorder
            }
        }

        this.conveyorDisplayHelper = new ConveyorDisplayHelper(this.dimensions, this.amount, this.startPositionY, this.sensorPins, this.buttonPins);

        this.initSimulationState(null);
    }

    /**
    * Initializes the simulator robot.
    * This resets the simulation state.
    *
    * @param {BoardState} boardState - The current state of the Dwenguino simulation board.
    *
    */
    initSimulationState(boardState) {
        // init superclass
        super.initSimulationState(boardState);

        this.containerWidth = 0;
        this.containerHeight = 0;
        
        this.state = {
            buttons: new Array(this.amount),
            sensors: new Array(this.amount),
            leds: new Array(this.amount),
            conveyorOffsetY: this.startPositionY,
            orientation: 1
        }

        for (let i = 0; i < this.amount; i++) {
            this.state.buttons[i] = {
                pressed: false,
                pos: {
                    x: this.dimensions.button.width * i + this.dimensions.button.spacing * i,
                    y: 0
                }
            };
            this.state.leds[i] = {
                on: 0,
                r: 255,
                g: 255,
                b: 255,
                pos: {
                    x: this.dimensions.led.width * i + this.dimensions.led.spacing * i,
                    y: 0
                }
            };
            this.state.sensors[i] = {
                r: 0,
                g: 0,
                b: 0,
                pos: {
                    x: this.dimensions.sensor.width * i + this.dimensions.sensor.spacing * i,
                    y: 0
                }
            };
        }        
    }


    /**
     * Initializes the simulator robot display.
     * This function puts all the nececary visuals inside the container with the id containerId.
     * Additionally, it sets up the state of the simulated robot.
     * The function also resets the internal state of the simulation so the display is initialized from its original position.
     *
     * @param {string} containerId - The jquery selector of the conainer to put the robot display.
     *
     */
    initSimulationDisplay(containerId) {
        // init superclass
        super.initSimulationDisplay(containerId);
        this.container = $(`#${containerId}`);

        let leftContainer = $("<div>").attr("id", "left_container").css({
            "position": "absolute",
            "width": "60%",
            "top": 0,
            "bottom": 0,
            "left": 0
        });
        let rightContainer = $("<div>").attr("id", "right_container").css({
            "position": "absolute",
            "width": "40%",
            "max-width": "370px",
            "top": 0,
            "bottom": 0,
            "right": 0
        });
        this.container.append(leftContainer).append(rightContainer)

        let boardContainerId = "boardContainer";
        let boardContainer = $("<div>").attr("id", boardContainerId).css({
            "position": "absolute",
            "width": "90%",
            "height": "35%",
            "padding_right": "10px",
            "padding_left": "10px",
            "padding_top": "10px"
        });

        rightContainer.append(boardContainer);
        this.conveyorDisplayHelper.createModal(this.container, this.conveyorDisplayHelper.ModalType.CONVEYOR);
        this.conveyorDisplayHelper.initCanvas();
        this.conveyorDisplayHelper.createControlsMenu(rightContainer);
        this.conveyorDisplayHelper.createRobotDisplay(leftContainer, this.state.leds, this.state.buttons, this.state.sensors);
        this.conveyorDisplayHelper.drawCurrentImageOnCanvasses();
        this.conveyorDisplayHelper.createModal(this.container, this.conveyorDisplayHelper.ModalType.PIN);


        let self = this;
        for(let i = 0; i < this.amount; i++){
            $("#sim_button_" + i)
            .mouseup(function() {
                self.releaseButton(i);
            })
            .mousedown(function() {
                self.pressButton(i);
            });
        }

        // Shortcut for devs {
        document.onkeydown = function (e) {
            e = e || window.event;
            if(e.key == "w") {
                self.pressButton(0);
            } else if(e.key == "x") {
                self.pressButton(1);

            } else if(e.key == "c") {
                self.pressButton(2);

            } else if(e.key == "v") {
                self.pressButton(3);

            } else if(e.key == "b") {
                self.pressButton(4);

            }
        };

        document.onkeyup = function (e) {
            e = e || window.event;

            if(e.key == "w") {
                self.releaseButton(0);
            } else if(e.key == "x") {
                self.releaseButton(1);

            } else if(e.key == "c") {
                self.releaseButton(2);

            } else if(e.key == "v") {
                self.releaseButton(3);

            } else if(e.key == "b") {
                self.releaseButton(4);

            }
        };

        //}

        for(let i = 0; i < this.amount; i++) {
            $("#select_snr_" + i).change(function() {
                var data= $(this).val();  
                console.log("changed pin for sensor " + i + " to " + data)
                self.sensorPins[i] = data;
            });

            $("#select_btn_" + i).change(function() {
                var data= $(this).val();  
                console.log("changed pin for button " + i + " to " + data)
                self.buttonPins[i] = data;
            });
        }
        

        // init board simulation
        this.dwenguinoBoardSimulation.setBoardDisplayWidthWidth("80%");
        this.dwenguinoBoardSimulation.setComponentsRightPosition("-1000px");
        this.dwenguinoBoardSimulation.initSimulationState(null);
        this.dwenguinoBoardSimulation.initSimulationDisplay(boardContainerId);
        $("#sim_board").addClass("sim_board_column_placement");

        // Render on resize of container
        new ResizeSensor(self.container, function () {
            console.log('myelement has been resized');
            self.containerWidth = self.container.width();
            self.containerHeight = self.container.height();
        });
    }

    /**
     * Set the pressed property to true for the pressed button.
     * @param {Integer} nr - The index of the button that was pressed
     */
    pressButton(nr){
        this.state.buttons[nr].pressed = true;
    }

    /**
     * Set the pressed property to false for the released button.
     * @param {Integer} nr - The index of the button that was released
     */
    releaseButton(nr){
        this.state.buttons[nr].pressed = false;
    }

    /**
     * Updates the simulation state and display
     * This function updates the simulation state and display using the supplied board state.
     *
     * @param {BoardState} boardState - The state of the Dwenguino board.
     */
    updateScenario(boardState) {
        super.updateScenario(boardState);
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
        this.dwenguinoBoardSimulation.updateScenario(boardState);
    }

    /** 
     * Updates the simulation state
     * This function updates the simulation state using the supplied board state.
     *
     * @param {BoardState} boardState - The state of the Dwenguino board. It has the following structure:
     * {
     *   pins = new Array(33);
     *   pinMapping = {};
     *   lcdContent = new Array(2);
     *  }
     *
     */
    updateScenarioState(boardState) {
        super.updateScenarioState(boardState);

        // update the state of the board simulation
        //this.dwenguinoBoardSimulation.updateScenarioState(boardState);

        // Get motor speed and update the conveyor offset
        var motorSpeed = boardState.getMotorSpeed(1);
        this.state.orientation = motorSpeed / Math.abs(motorSpeed);
        this.state.conveyorOffsetY -= motorSpeed / 100;

        if (motorSpeed > 0) {
            if (this.state.conveyorOffsetY <= -(this.dimensions.conveyor.length * 2)) {
                this.state.conveyorOffsetY = 0;
            }
        } else {
            if (this.state.conveyorOffsetY >= this.dimensions.conveyor.length) {
                this.state.conveyorOffsetY = -this.dimensions.conveyor.length;
            }
        }

        // Get the colors passing under the sensors
        let sensorData = this.getSensorData();
        for (let i = 0; i < this.amount; i++) {
            // Update the state of each sensor

            this.state.sensors[i].r = sensorData[i].r;
            this.state.sensors[i].g = sensorData[i].g;
            this.state.sensors[i].b = sensorData[i].b;
    
            boardState.setIoPinState(this.buttonPins[i], this.state.buttons[i].pressed);
        }

        // the pin-distribution could have changed, so the displayhelper should know
        this.conveyorDisplayHelper.updatePins(this.sensorPins, this.buttonPins);

    }

    /**
     * Get the colors from the canvas that are being detected by the sensors.
     * The sensors detect the color of 1 pixel at the location where 'x' is located:
     *          ---------x---------
     *          | O     RGB     O |
     *          |                 |
     *          |                 |
     *          |                 |
     *          |__|_|_|_|_|_|_|__|  => pins
     */
    getSensorData() {
        let beltCanvas = document.getElementById("sim_conveyor_paper");
        let beltCtx = beltCanvas.getContext('2d');
        let sensorData = new Array(this.amount);
        for (let i = 0; i < this.amount; i++) {
            let x = this.state.sensors[i].pos.x + this.dimensions.sensor.width / 2;
            let y = this.dimensions.conveyor.length - this.dimensions.sensor.height * 2 / 3;
            let imgData = beltCtx.getImageData(x, y, 1, 1);
            sensorData[i] = { r: imgData.data[0], g: imgData.data[1], b: imgData.data[2] }
        }
        return sensorData
    }

    /**
     * Gives the color ([r, g, b]) that the RGB color sensor on the given pin is detecting.
     * If there's no sensor connected on that pin, [-1, -1, -1] is returned.
     * @param {Integer} pin - Pin of the sensor
     */
    getColorSensorOnPin(pin){
        for(var i = 0; i < this.amount; i++ ){
            if(pin == this.sensorPins[i]){
                return [this.state.sensors[i].r, this.state.sensors[i].g, this.state.sensors[i].b];
            }
        }
        return [-1, -1, -1];
    }


    /** Updates the simulation display
     *  This function updates the simulation display using the supplied board state.
     *
     *  @param {BoardState} boardState - The state of the Dwenguino board.
     *
     */
    updateScenarioDisplay(boardState) {
        super.updateScenarioDisplay(boardState);
        if (this.isSimulationRunning) {
            this.conveyorDisplayHelper.setSensorsOpacity(0.5);
        } else {
            this.conveyorDisplayHelper.setSensorsOpacity(1);
        }

        // update the display of the dwenguino board simulation
        //this.dwenguinoBoardSimulation.updateScenarioDisplay(boardState);

        // update the state of this scenario

        this.conveyorDisplayHelper.updateConveyorPaper(this.state.conveyorOffsetY, this.state.conveyorOffsetY + (this.dimensions.conveyor.length * 2 * this.state.orientation));



        for (let i = 0; i < this.amount; i++) {
            if (this.state.leds[i].on) {
                let canvas = document.getElementById('sim_led_' + i);
                //this.conveyorDisplayHelper.drawRGBLed(canvas, 250, 10, 10, this.dimensions.led.width, this.dimensions.led.height, true);
                this.conveyorDisplayHelper.drawRGBLed(canvas, this.state.leds[i].r, this.state.leds[i].g, this.state.leds[i].b, this.dimensions.led.width, this.dimensions.led.height, true);

            } else {
                let canvas = document.getElementById('sim_led_' + i);
                this.conveyorDisplayHelper.drawRGBLed(canvas, this.ledOffColor.r, this.ledOffColor.g, this.ledOffColor.b, this.dimensions.led.width, this.dimensions.led.height, false);
            }
        }
    }

    setIsSimulationRunning(isSimulationRunning) {
        this.isSimulationRunning = isSimulationRunning;
        this.dwenguinoBoardSimulation.setIsSimulationRunning(isSimulationRunning);
    }
}

export default DwenguinoSimulationScenarioConveyor;