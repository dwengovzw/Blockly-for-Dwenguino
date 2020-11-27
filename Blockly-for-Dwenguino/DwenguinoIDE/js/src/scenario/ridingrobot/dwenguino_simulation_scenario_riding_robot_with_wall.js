import DwenguinoSimulationScenarioRidingRobot from "./dwenguino_simulation_scenario_riding_robot.js";

/**
 * This Object is the abstraction of the riding robot simulator scenario.
 * It handles the layout and behaviour of a certain simulator scenario.
 * It provides a step function which uses and updates the state of the dwenguino board.
 * For example it uses the motor speed states to change the location of a robot or changes the sonar distance state depending on how far it is form an object.
 *
 * @extends DwenguinoSimulationScenarioRidingRobot
 */
class DwenguinoSimulationScenarioRidingRobotWithWall extends DwenguinoSimulationScenarioRidingRobot{

    constructor(logger){
        //call super prototype
        super(logger);
        //init robot state
        this.initSimulationState(null);

    }

    /**
     * Initializes the simulator robot.
     * This resets the simulation state.
     *
     * @param {BoardState} boardState - The current state of the Dwenguino simulation board.
     *
     */
    initSimulationState(boardState){
        // init superclass
        super.initSimulationState(boardState);
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

        // Add a border to the container
        $("#sim_container")
            .css("border", "solid")
            .css("border-width", "3px")
            .css("border-color", "black")
            .css("max-width", "80%")
            .css("max-height", "80%")

        // Save the new container dimensions
        this.containerWidth = $("#sim_container").width();
        this.containerHeight = $("#sim_container").height();

    };

    /**
     * Updates the simulation state and display
     * This function updates the simulation state and display using the supplied board state.
     *
     * @param {BoardState} boardState - The state of the Dwenguino board.
     */
    updateScenario(boardState) {
        super.updateScenario(boardState);
    };

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
     * @returns {BoardState} The updated Dwenguino board state.
     */
    updateScenarioState(boardState) {
        super.updateScenarioState(boardState);
        
        var speed1 = boardState.getMotorSpeed(1);
        var speed2 = boardState.getMotorSpeed(2);

        // Save the current state of the robot into local variables.
        var x = this.robot.position.x;
        var y = this.robot.position.y;
        var angle = this.robot.position.angle;

        // decide on angle (in deg) and distance (in px) based on 2 motor speeds
        var distance = (speed1 + speed2) / 100;

        if (speed1 !== speed2) {
            angle += ((speed2 - speed1) / 30) % 360;
        }

        x += distance * Math.cos(Math.PI / 180 * angle);
        y += distance * Math.sin(Math.PI / 180 * angle);

        // move to other side of frame if out of frame
        if (x > this.containerWidth - this.robot.image.width) {
            x = this.containerWidth - this.robot.image.width;
        } else if (x < 0) {
            x = 0;
        }
        if (y > this.containerHeight - this.robot.image.height) {
            y = this.containerHeight - this.robot.image.height;
        } else if (y < 0) {
            y = 0;
        }

        // Calulate distance to wall
        //calculate distance between front of car and wall

        var xMiddle = x;
        var yMiddle = y;

        angle = ((angle % 360) + 360) % 360;  // Normalize angle

        var xFront = xMiddle + (this.robot.image.width / 2) * Math.cos(Math.PI / 180 * angle);
        var yFront = yMiddle + (this.robot.image.width / 2) * Math.sin(Math.PI / 180 * angle);


        //Calculate the intersection point between the two possible intersecting horizontal and vertical lines
        // and the line through the robot with a slope defined by its angle.
        var intersectionPoint = [0, 0];
        var intersectionLiness = [[this.containerWidth, this.containerHeight], [0, this.containerHeight], [0, 0], [this.containerWidth, 0]];
        var intersectionPointX = [0, 0];
        var intersectionPointY = [0, 0];

        // do edge cases first
        if (angle == 90) {
            intersectionPointX = intersectionPointY = [xFront, this.containerHeight];
        } else if (angle == 270) {
            intersectionPointX = intersectionPointY = [xFront, 0];
        } else if (angle == 180) {
            intersectionPointX = intersectionPointY = [0, yFront];
        } else if (angle == 0) {
            intersectionPointX = intersectionPointY = [this.containerWidth, yFront];
        } else {
            var slope = Math.tan(angle);
            var intersectionLines = intersectionLiness[Math.floor(angle / 90) % 4];
            intersectionPointX = [intersectionLines[0], Math.tan(angle * Math.PI / 180) * (intersectionLines[0] - xFront) + yFront];
            intersectionPointY = [(intersectionLines[1] - yFront) / Math.tan(angle * Math.PI / 180) + xFront, intersectionLines[1]];
        }

        // Pick the distance to the closest intersecting line.
        var D = Math.min(this.calcDistanceBetweenPoints(intersectionPointX, [xFront, yFront]),
            this.calcDistanceBetweenPoints(intersectionPointY, [xFront, yFront]));

        var trigPin = 11;
        var echoPin = 12;
        boardState.setSonarDistance(trigPin, echoPin, Math.abs(D - 25)); // Compensate for borders

        console.log(boardState.getSonarDistance(trigPin, echoPin));


        this.robot.position = {
            x: x,
            y: y,
            angle: angle
        };

        return boardState;
    };

    /**
     * Calculates the Euclidean distance between two points.
     * @param {int} p1 
     * @param {int} p2 
     */
    calcDistanceBetweenPoints(p1, p2) {
        return Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));
    };

    /** Updates the simulation display
     *  This function updates the simulation display using the supplied board state.
     *
     *  @param {BoardState} boardState - The state of the Dwenguino board.
     *
     */
    updateScenarioDisplay(boardState) {
        super.updateScenarioDisplay(boardState);

        /*var robot = this.robot;
        var $robot = $('#sim_animation');
    
        // Update field size
        this.containerWidth = $("#sim_container").width();
        this.containerHeight = $("#sim_container").height();
    
        $robot
        .css('top', this.robot.position.y + 'px')
        .css('left', this.robot.position.x + 'px')
        .css('transform', 'rotate(' + this.robot.position.angle + 'deg)');*/
    };

    setIsSimulationRunning(isSimulationRunning){
        this.isSimulationRunning = isSimulationRunning;
        this.dwenguinoBoardSimulation.setIsSimulationRunning(isSimulationRunning);
    }
}

export default DwenguinoSimulationScenarioRidingRobotWithWall;