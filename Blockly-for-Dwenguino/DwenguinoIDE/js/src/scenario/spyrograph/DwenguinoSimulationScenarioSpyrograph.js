import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"
import SpyrographGraphicsLib from "./SpyrographGraphicsLib.js"
import Point from "../../graphicsLib/Point.js";

export default class DwenguinoSimulationScenarioSpyrograph extends DwenguinoSimulationScenario{
    startScale = 400;
    currentScale = 400;
    currentColor = "#000000";
    representationScale = {
        // The coordinates of the different joints (in mm)
        motorAxes: [[30, 30], [280, 30]],
        motorAngles: [0, 0], // Determined by the simulation
        // [Motor1 connector, motor2 connector, length to central hinge motor1, 
        // length to central hinge motor2, central hinge to point above motor1, central hinge to point above motor 2,
        // length from point above motor one to top hinge, length from point above motor 2 to top hinge, 
        //top hinge to drawing point]
        segmentLengths: [30, 20, 150, 150, 120, 120, 150, 150, 50],
        segmentCount: [3, 2, 15, 15, 12, 12, 15, 15, 5], 
        segmentRanges: [[2, 3], [2, 3], [10, 20], [10, 20], [5, 15], [5, 15], [5, 15], [5, 15], [0, 2]],
        segmentIncrement: 10,
        armWidth: 10,
        holeDiameter: 2.5,
        // The following values have to be calulated based on the values above
        hinges: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    }

    drawingScale = {
        motorAxes: [[0, 0], [0, 0]],
        segmentLengths: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        hinges: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        armWidth: 0,
        holeDiameter: 10
    }

    canvases = [];
    contexts = [];
    canvasNames = {
        SPYROGRAPH_CANVAS: 0,
        SPYROGRAPH_DRAWING_CANVAS: 1,
    };
    container = null;
    imageData = null;

    graphicsLib = null;
    
    constructor(logger){
        super(logger);
        this.initSimulationState(null);
        this.graphicsLib = new SpyrographGraphicsLib();
    }

    initSimulationState(boardState){
        super.initSimulationState(boardState);
        this.representationScale.motorAngles = [0, 0] // Determined by the simulation       
    }

    initSimulationDisplay(containerId){
        super.initSimulationDisplay(containerId);       // Removes the container
        // Remove previous canvas and context
        this.canvases = [];
        this.contexts = [];

        this.initDrawingEnvironment(containerId);       // Setup drawing canvases
        this.loadPreviousImageIfExists();               // Check if an image was saved before and load it
        this.createControlsMenu();                      // Create the controls for scaling segments and changing color
        this.convertToDisplayAndRender(false);                                  // Render the initial drawing
    }

    initDrawingEnvironment(containerId){
        this.container = $(`#${containerId}`);
        this.container.css({"position": "relative"});

        // Create two canvasses, one for the robot and one for the drawing it makes.
        let canvasIds = ["spyrograph_canvas", "spyrograph_drawing_canvas"];
        for (let id of canvasIds){
            this.setupCanvas(id, this.container);
        }       
    }

    loadPreviousImageIfExists(){
        // If there is a previous image, redraw it
        if (this.imageData != null){
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].putImageData(this.imageData, 0, 0);
        }
    }
    /**
     * Adds canvas to dom and to the local array of canvases
     * @param {String} id the dom id the canvas should have
     */
    setupCanvas(id, container){
        let canvas = $("<canvas>").attr("id", id).css({"position": "absolute", "left": 0, "top": 0})[0];
        let context = canvas.getContext("2d");
        canvas.width = container.width();
        canvas.height = container.height();
        this.canvases.push(canvas);
        this.contexts.push(context);
        this.container.append(canvas);
    }

    createControlsMenu(){
        // Create slider for the different arm segments
        let controlscontainer = $("<span>").css({"position": "absolute", 
                                                "right": 0,
                                                "bottom": 0, 
                                                "width": "15%", 
                                                "text-align": "center", 
                                                "margin-right": "20px",
                                                "margin-bottom": "20px"
                                            });

        // Create segment sliders
        this.createSlidersForSegments(controlscontainer);

        // Create color picker
        let colorpicker = $("<input>").attr("type", "color").attr("value", this.currentColor);
        let self = this;
        colorpicker.on("change", function(event){
            console.log($(this).val());
            self.currentColor = $(this).val();
        });
        controlscontainer.append(colorpicker);

        //Create clear button
        let clearbutton = $("<button>").attr("value", "Clear").html("Clear").css({"width": "90%", "margin-top": "5px"});
        clearbutton.on("click", (evt) => {
            // Clear drawing canvas
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].clearRect(
                0, 
                0, 
                this.canvases[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].width, 
                this.canvases[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].height);
            this.imageData = null;
        });
        controlscontainer.append(clearbutton);

        //Create save button
        let saveButton = $("<button>").attr("value", "Save").html("Save").css({"width": "90%", "margin-top": "5px"});
        saveButton.on("click", (evt) => {
            // Clear drawing canvas
            var img = this.canvases[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].toDataURL('image/png');
            var link = document.createElement('a');
            link.download = 'tekening.png';
            link.href = img;
            link.click();
        });
        controlscontainer.append(saveButton);
        this.container.append(controlscontainer);
    }

    

    createSlidersForSegments(controlscontainer){
        for (let i = 0 ; i < this.representationScale.segmentLengths.length - 1 ; ++i){
             // Add sliders for adjusting the arm lengths
            let l1SliderContainer = $("<span>")
            let l1SliderLabel = $("<span>").html("l" + i);
            let l1Slider = $("<input>").attr("type", "range")
                .attr("min", this.representationScale.segmentRanges[i][0])
                .attr("max", this.representationScale.segmentRanges[i][1])
                .attr("value", this.representationScale.segmentCount[i]);
            l1Slider.css({"border-radius": "5px"});
            let self = this;
            l1Slider.on("change", function(event){
                let sliderValue = parseInt($(this).val());
                console.log(sliderValue);
                self.representationScale.segmentCount[i] = sliderValue;
                self.representationScale.segmentLengths[i] = self.representationScale.segmentIncrement*sliderValue;
                self.calculateHingePoints();
                self.convertToDisplayAndRender(false); 
            });

            l1SliderContainer.append(l1SliderLabel);
            l1SliderContainer.append(l1Slider);
            controlscontainer.append(l1SliderContainer);
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
            this.representationScale.motorAngles[i] += boardState.getMotorSpeed(i+1)/(255*15);
        }
        this.calculateHingePoints();
    }

    calculateHingePoints(){
        //Calculate hinges for short arms attached to the motor.
        for (let i = 0 ; i < 2 ;i++){
            this.representationScale.hinges[i] = 
                [this.representationScale.motorAxes[i][0] + this.representationScale.segmentLengths[i]*Math.cos(this.representationScale.motorAngles[i]), 
                this.representationScale.motorAxes[i][1] + this.representationScale.segmentLengths[i]*Math.sin(this.representationScale.motorAngles[i])];
        }
        this.calulateFirstHingePoint();
        this.calculateCentralHingePoints();
        this.calculateFinalHingePoint();
    }

    calulateFirstHingePoint(){
        // These variables are used for clarity
        let l1 = this.representationScale.segmentLengths[2];
        let l2 = this.representationScale.segmentLengths[3];
        let x1 = this.representationScale.hinges[0][0];
        let y1 = this.representationScale.hinges[0][1];
        let x2 = this.representationScale.hinges[1][0];
        let y2 = this.representationScale.hinges[1][1];
        let hingepoint = this.calculateHingePoint(x1, y1, x2, y2, l1, l2);
        this.representationScale.hinges[2][0] = hingepoint[0];
        this.representationScale.hinges[2][1] = hingepoint[1];
    }

    calculateCentralHingePoints(){
        // Caculate the next point past the central hinge
        // Hinge above motor 1
        let l1 = this.representationScale.segmentLengths[3];
        let l2 = this.representationScale.segmentLengths[4];
        let x1 = this.representationScale.hinges[1][0];
        let y1 = this.representationScale.hinges[1][1];
        let x2 = this.representationScale.hinges[2][0];
        let y2 = this.representationScale.hinges[2][1];
        this.representationScale.hinges[3][0] = x1 + (l1+l2)*(x2-x1)/l1;
        this.representationScale.hinges[3][1] = y1 + (l1+l2)*(y2-y1)/l1;
        // Hinge above motor 2
        l1 = this.representationScale.segmentLengths[2];
        l2 = this.representationScale.segmentLengths[5];
        x1 = this.representationScale.hinges[0][0];
        y1 = this.representationScale.hinges[0][1];
        x2 = this.representationScale.hinges[2][0];
        y2 = this.representationScale.hinges[2][1];
        this.representationScale.hinges[4][0] = x1 + (l1+l2)*(x2-x1)/l1;
        this.representationScale.hinges[4][1] = y1 + (l1+l2)*(y2-y1)/l1;
    }

    calculateFinalHingePoint(){
        // Second central hinge point
        let x1 = this.representationScale.hinges[3][0];
        let y1 = this.representationScale.hinges[3][1];
        let x2 = this.representationScale.hinges[4][0]
        let y2 = this.representationScale.hinges[4][1]
        let l1 = this.representationScale.segmentLengths[6]
        let l2 = this.representationScale.segmentLengths[7]
        let hingepoint = this.calculateHingePoint(x1, y1, x2, y2, l1, l2);
        this.representationScale.hinges[5][0] = hingepoint[0];
        this.representationScale.hinges[5][1] = hingepoint[1];
    }

    calculateHingePoint(x1, y1, x2, y2, l1, l2){
        let p = l2*l2-l1*l1-x2*x2+x1*x1-y2*y2+y1*y1;
        let q = 2*(x1-x2);
        let a = ((4*(y2-y1)*(y2-y1))/(q*q))+1;
        let tellerA = (4*(y2-y1)*(y2-y1)) + q*q;
        let noemerA = q*q;
        let b = ((4*p*(y2-y1))/(q*q))-((4*x1*(y2-y1))/q)-(2*y1);
        let c = ((p*p)/(q*q))-((2*x1*p)/q)+(x1*x1)+(y1*y1)-(l1*l1);

        let y31 = (-1*b + Math.sqrt(b*b-4*a*c))*noemerA/(2*tellerA);
        let y32 = (-1*b - Math.sqrt(b*b-4*a*c))*noemerA/(2*tellerA);
        /*let y31 = (-1*b + Math.sqrt(b*b-4*a*c))/(2*a);
        let y32 = (-1*b - Math.sqrt(b*b-4*a*c))/(2*a);*/

        let x31 = (2*y31*(y2-y1) + p)/q;
        let x32 = (2*y32*(y2-y1) + p)/q;


        if (y31 > y32){
            return [x31, y31];
        }else{
            return [x32, y32];
        }
    }

  
    updateScenarioDisplay(boardState){
        super.updateScenarioDisplay(boardState);
        this.convertToDisplayAndRender(true);
    }

    convertToDisplayAndRender(paintOnDrawingCanvas = true){
        this.scaleRepresentationToDrawing(this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].width);  // Rescale based on canvas width
        this.mirrorDisplayVertically(this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].height);
        // Next time the screen gets repainted the render function 
        // will be called before the screen is repainted
        window.requestAnimationFrame(() => { this.render(paintOnDrawingCanvas) });
    }

    mirrorDisplayVertically(currentHeight){
        for (let i = 0 ; i < this.drawingScale.motorAxes.length ; ++i){
            this.drawingScale.motorAxes[i][1] = -1*this.drawingScale.motorAxes[i][1] + currentHeight;
        }
        for (let i = 0 ; i < this.drawingScale.hinges.length ; ++i ){
            this.drawingScale.hinges[i][1] = -1*this.drawingScale.hinges[i][1] + currentHeight; 
        }
    }

    scaleRepresentationToDrawing(currentWidth){
        this.scaleSegementLengths(currentWidth);
        this.scaleHingePoints(currentWidth);
        this.scaleArmProperties(currentWidth);
    }

    scaleArmProperties(screenwidth){
        this.drawingScale.armWidth = this.representationScale.armWidth/this.startScale*screenwidth;
        this.drawingScale.holeDiameter = this.representationScale.holeDiameter/this.startScale*screenwidth;
    }

    scaleHingePoints(screenwidth){
        for (let i = 0 ; i < this.representationScale.motorAxes.length ; ++i){
            for (let j = 0 ; j < this.representationScale.motorAxes[i].length ; ++j){
                this.drawingScale.motorAxes[i][j] = this.representationScale.motorAxes[i][j]/this.startScale*screenwidth;
            }
        }
        for (let i = 0 ; i < this.representationScale.hinges.length ; ++i){
            for (let j = 0 ; j < this.representationScale.hinges[i].length ; ++j){
                this.drawingScale.hinges[i][j] = this.representationScale.hinges[i][j]/this.startScale*screenwidth;
            }
        }
    }

    scaleSegementLengths(screenwidth){
        for (let i = 0 ; i < this.representationScale.motorAxes.length ; i++){
            for (let j = 0 ; j < this.representationScale.motorAxes[i].length ; j++){
                this.drawingScale.motorAxes[i][j] = this.representationScale.motorAxes[i][j]/this.startScale*screenwidth;
            }
        }
        for (let i = 0 ; i < this.representationScale.segmentLengths.length ; i++){
            this.drawingScale.segmentLengths[i] = this.representationScale.segmentLengths[i]/this.startScale*screenwidth
        }
        this.currentScale = screenwidth;
    }

    render(paintOnDrawingCanvas = TextTrackCueList){
        let canvasWidth = this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].width;
        let canvasHeight = this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].height;
        // Clear canvas
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].clearRect(
            0, 
            0, 
            canvasWidth, 
            canvasHeight);
        
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fillStyle = "#000000";
        this.graphicsLib.drawBasePlate(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS],
            new Point(this.drawingScale.motorAxes[0][0], this.drawingScale.motorAxes[0][1]),
            new Point(this.drawingScale.motorAxes[1][0], this.drawingScale.motorAxes[1][1])
        );

        
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fillStyle = "#FF0000";
        let allHinges = this.drawingScale.hinges.concat(this.drawingScale.motorAxes);
        for (let i = 0 ; i < allHinges.length ;i++){
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].beginPath();
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].arc(
                allHinges[i][0], 
                allHinges[i][1], 3, 0, 360);
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].closePath();
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fill();
        }

        // Draw the arms
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.motorAxes[0][0], this.drawingScale.motorAxes[0][1]),
            new Point(this.drawingScale.hinges[0][0], this.drawingScale.hinges[0][1]),
            this.representationScale.segmentCount[0],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.motorAxes[1][0], this.drawingScale.motorAxes[1][1]),
            new Point(this.drawingScale.hinges[1][0], this.drawingScale.hinges[1][1]),
            this.representationScale.segmentCount[1],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.hinges[0][0], this.drawingScale.hinges[0][1]),
            new Point(this.drawingScale.hinges[4][0], this.drawingScale.hinges[4][1]),
            this.representationScale.segmentCount[2] + this.representationScale.segmentCount[5],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.hinges[1][0], this.drawingScale.hinges[1][1]),
            new Point(this.drawingScale.hinges[3][0], this.drawingScale.hinges[3][1]),
            this.representationScale.segmentCount[3] + this.representationScale.segmentCount[4],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.hinges[3][0], this.drawingScale.hinges[3][1]),
            new Point(this.drawingScale.hinges[5][0], this.drawingScale.hinges[5][1]),
            this.representationScale.segmentCount[6],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);
        this.graphicsLib.drawRobotArm(
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS], 
            new Point(this.drawingScale.hinges[4][0], this.drawingScale.hinges[4][1]),
            new Point(this.drawingScale.hinges[5][0], this.drawingScale.hinges[5][1]),
            this.representationScale.segmentCount[7],
            this.drawingScale.armWidth,
            this.drawingScale.holeDiameter);


        /*let p1 = new Point(this.representationScale.hinges[0][0], this.representationScale.hinges[0][1]);
        let p2 = new Point(this.representationScale.hinges[4][0], this.representationScale.hinges[4][1]);
        console.log("Arm 1 length:" + p1.getEuclideanDistanceTo(p2));
        p1 = new Point(this.representationScale.hinges[1][0], this.representationScale.hinges[1][1]);
        p2 = new Point(this.representationScale.hinges[3][0], this.representationScale.hinges[3][1]);
        console.log("Arm 2 length:" + p1.getEuclideanDistanceTo(p2));*/
        
        // Draw a point on the drawingcanvas
        if (paintOnDrawingCanvas){
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].fillStyle = this.currentColor;
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].beginPath();
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].arc(
                this.drawingScale.hinges[5][0], 
                this.drawingScale.hinges[5][1], 1, 0, 360);
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].closePath();
            this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].fill();
        }

        // Save drawing in imageData
        this.imageData = this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].getImageData(0, 0, this.container.width(), this.container.height());

    }

}