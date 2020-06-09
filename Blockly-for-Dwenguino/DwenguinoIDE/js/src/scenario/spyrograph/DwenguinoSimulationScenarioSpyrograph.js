import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"

export default class DwenguinoSimulationScenarioSpyrograph extends DwenguinoSimulationScenario{
    // The coordinates of the different joints (in mm)
    motorAxes = [[30, 30], [280, 30]];
    motorAngles = [0, 0] // Determined by the simulation
    // [Motor1 connector, motor2 connector, length to central hinge motor1, 
    // length to central hinge motor2, central hinge to point above motor1, central hinge to point above motor 2,
    // length from point above motor one to top hinge, length from point above motor 2 to top hinge, top hinge to drawing point]
    segmentLengths = [20, 20, 150, 150, 120, 120, 100, 100, 50] 
    // The following values have to be calulated based on the values above
    hinges = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    canvas = null;
    context = null;
    
    constructor(logger){
        super(logger);
        this.initSimulationState();
    }

    initSimulationState(){
        super.initSimulationState();
        
        this.motorAngles = [0, 0] // Determined by the simulation
        


    }

    initSimulationDisplay(containerId){
        super.initSimulationDisplay(containerId);

        let container = $(`#${containerId}`);

        this.canvas = $("<canvas>").attr("id", "spyrograph_canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.canvas.width = container.width();
        this.canvas.height = container.height();

        container.append(this.canvas);

    }

    render(){
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.fillStyle = "#000000";
        this.context.beginPath();
        this.context.arc(this.motorAxes[0][0], this.motorAxes[0][1], this.segmentLengths[0], 0, 360);
        this.context.arc(this.motorAxes[1][0], this.motorAxes[1][1], this.segmentLengths[1], 0, 360);
        this.context.fill();

        
        this.context.fillStyle = "#FF0000";
        for (let i = 0 ; i < 3 ;i++){
            this.context.beginPath();
            this.context.arc(this.hinges[i][0], this.hinges[i][1], 3, 0, 360);
            this.context.closePath();
            this.context.fill();
        }
        
        
    }

    updateScenario(boardState){
        super.updateScenario(boardState)
        this.updateScenarioState(boardState);
        this.updateScenarioDisplay(boardState);
    }

    updateScenarioState(boardState){
        super.updateScenarioState(boardState);
        this.timestep++;
        for (let i = 0 ; i < 2 ; i++){
            this.motorAngles[i] += boardState.getMotorSpeed(i+1)/(255*15);
        }
        for (let i = 0 ; i < 2 ;i++){
            this.hinges[i] = [this.motorAxes[i][0] + this.segmentLengths[i]*Math.cos(this.motorAngles[i]), 
                this.motorAxes[i][1] + this.segmentLengths[i]*Math.sin(this.motorAngles[i])];
        }
        let l1 = this.segmentLengths[2];
        let l2 = this.segmentLengths[3];
        let x1 = this.hinges[0][0];
        let y1 = this.hinges[0][1];
        let x2 = this.hinges[1][0];
        let y2 = this.hinges[1][1];
        let eq1 = l1 + '^2=(x-' + x1 + ')^2+(y-' + y1 + ')^2';
        console.log(eq1);
        let eq2 = l2 + '^2=(x-' + x2 + ')^2+(y-' + y2 + ')^2';
        console.log(eq2);
        var sol = nerdamer.solveEquations([eq1, eq2]);
        this.hinges[2] = [sol[0][1], sol[1][1]];
        if (this.hinges[2][1] < this.hinges[0][1] || this.hinges[2][1] < this.hinges[1][1] ){
            // Find other solution to system of equations
            this.findOtherSolutionToEquation();
        }
        console.log(this.hinges);
        
    }

    findOtherSolutionToEquation(){
        // Find line perpendicular to the line between hinge 0 and hinge 1 (y = mx + q)
        // slope and offset between h0 and h1
        let slope = (this.hinges[1][1] - this.hinges[0][1])/(this.hinges[1][0] - this.hinges[0][0]);
        let offset = this.hinges[0][1] - slope * this.hinges[0][0];
        // slope and offset of perpendicular line
        let perpendicularSlope = -1 * (this.hinges[1][0] - this.hinges[0][0])/(this.hinges[1][1] - this.hinges[0][1]); //m
        let perpendicularOffset = this.hinges[2][1] - perpendicularSlope * this.hinges[2][0]; //q
        // Find intersection between line between h0 and h1 with the perpendicular line
        // Check if line is horizontal
        if (slope == 0){
            this.hinges[2][1] += 2*(this.hinges[0][1]-this.hinges[2][1]); // If line is horizontal x = same, y += 2* distance from point to horizontal line
        }else{
            let eq1 = "y=" + perpendicularSlope + "*x + " + perpendicularOffset; //perpendicular line
            let eq2 = "y=" + slope + "*x + " + offset; 
            let sol = nerdamer.solveEquations([eq1, eq2]);
            let intersectionPoint = [sol[0][1], sol[1][1]];
            this.hinges[2][0] += 2*Math.abs(this.hinges[2][0] - intersectionPoint[0]);
            this.hinges[2][1] += 2*Math.abs(this.hinges[2][1] - intersectionPoint[1]);
        }

        
    }

    updateScenarioDisplay(boardState){
        super.updateScenarioDisplay(boardState);
        // Next time the screen gets repainted the render function 
        // will be called before the screen is repainted
        window.requestAnimationFrame(() => { this.render() });
    }

}