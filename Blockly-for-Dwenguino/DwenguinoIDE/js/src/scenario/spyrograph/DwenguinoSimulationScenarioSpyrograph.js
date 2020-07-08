import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"

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
        segmentLengths: [20, 20, 150, 150, 120, 120, 150, 150, 50], 
        segmentRanges: [[10, 30], [10, 30], [130, 250], [130, 250], [50, 250], [50, 250], [50, 250], [50, 250], [0, 20]],
        // The following values have to be calulated based on the values above
        hinges: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    }

    drawingScale = {
        motorAxes: [[0, 0], [0, 0]],
        segmentLengths: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        hinges: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
    }

    canvases = [];
    contexts = [];
    canvasNames = {
        SPYROGRAPH_CANVAS: 0,
        SPYROGRAPH_DRAWING_CANVAS: 1,
    };
    container = null;
    imageData = null;
    
    constructor(logger){
        super(logger);
        this.initSimulationState();
    }

    initSimulationState(){
        super.initSimulationState();
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
        this.scaleRepresentationToDrawing(this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].width);  // Rescale based on canvas width
        this.render();                                  // Render the initial drawing
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
        let controlscontainer = $("<span>").css({"position": "absolute", "right": 0, "width": "15%", "text-align": "center", "margin-right": "20px"});

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
            this.drawingContext.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
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
                .attr("value", this.representationScale.segmentLengths[i]);
            l1Slider.css({"border-radius": "5px"});
            let self = this;
            l1Slider.on("change", function(event){
                let sliderValue = parseInt($(this).val());
                console.log(sliderValue);
                self.representationScale.segmentLengths[i] = sliderValue;
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
        let b = ((4*p*(y2-y1))/(q*q))-((4*x1*(y2-y1))/q)-(2*y1);
        let c = ((p*p)/(q*q))-((2*x1*p)/q)+(x1*x1)+(y1*y1)-(l1*l1);

        let y31 = (-1*b + Math.sqrt(b*b-4*a*c))/2*a;
        let y32 = (-1*b - Math.sqrt(b*b-4*a*c))/2*a;

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
        this.scaleRepresentationToDrawing(this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].width);  // Rescale based on canvas width
        // Next time the screen gets repainted the render function 
        // will be called before the screen is repainted
        window.requestAnimationFrame(() => { this.render() });
    }

    scaleRepresentationToDrawing(currentWidth){
        this.scaleSegementLengths(currentWidth);
        this.scaleHingePoints(currentWidth);
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

    render(){
        let canvasWidth = this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].width;
        let canvasHeight = this.canvases[this.canvasNames.SPYROGRAPH_CANVAS].height;
        // Clear canvas
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].clearRect(
            0, 
            0, 
            canvasWidth, 
            canvasHeight);
        
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fillStyle = "#000000";
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].beginPath();
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].arc(
            this.drawingScale.motorAxes[0][0], 
            this.drawingScale.motorAxes[0][1], 
            this.drawingScale.segmentLengths[0], 0, 360);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].arc(
            this.drawingScale.motorAxes[1][0], 
            this.drawingScale.motorAxes[1][1], 
            this.drawingScale.segmentLengths[1], 0, 360);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fill();

        
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fillStyle = "#FF0000";
        for (let i = 0 ; i < 6 ;i++){
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].beginPath();
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].arc(
                this.drawingScale.hinges[i][0], 
                this.drawingScale.hinges[i][1], 3, 0, 360);
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].closePath();
            this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].fill();
        }

        // Draw the arms
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].beginPath();
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].moveTo(this.drawingScale.hinges[0][0], this.drawingScale.hinges[0][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].lineTo(this.drawingScale.hinges[4][0], this.drawingScale.hinges[4][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].lineTo(this.drawingScale.hinges[5][0], this.drawingScale.hinges[5][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].lineTo(this.drawingScale.hinges[3][0], this.drawingScale.hinges[3][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].lineTo(this.drawingScale.hinges[1][0], this.drawingScale.hinges[1][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].moveTo(this.drawingScale.hinges[0][0], this.drawingScale.hinges[0][1]);
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].closePath();
        this.contexts[this.canvasNames.SPYROGRAPH_CANVAS].stroke();
        
        // Draw a point on the drawingcanvas
        this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].fillStyle = this.currentColor;
        this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].beginPath();
        this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].arc(
            this.drawingScale.hinges[5][0], 
            this.drawingScale.hinges[5][1], 1, 0, 360);
        this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].closePath();
        this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].fill();

        // Save drawing in imageData
        this.imageData = this.contexts[this.canvasNames.SPYROGRAPH_DRAWING_CANVAS].getImageData(0, 0, this.container.width(), this.container.height());

    }

}