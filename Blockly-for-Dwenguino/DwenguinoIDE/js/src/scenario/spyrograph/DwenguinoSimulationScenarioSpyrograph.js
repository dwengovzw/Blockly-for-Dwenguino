import DwenguinoSimulationScenario from "../DwenguinoSimulationScenario.js"

export default class DwenguinoSimulationScenarioSpyrograph extends DwenguinoSimulationScenario{
    startScale = 400;
    currentScale = 400;
    currentColor = "#000000";
    // The coordinates of the different joints (in mm)
    motorAxes = [[30, 30], [280, 30]];
    motorAngles = [0, 0] // Determined by the simulation
    // [Motor1 connector, motor2 connector, length to central hinge motor1, 
    // length to central hinge motor2, central hinge to point above motor1, central hinge to point above motor 2,
    // length from point above motor one to top hinge, length from point above motor 2 to top hinge, top hinge to drawing point]
    segmentLengths = [20, 20, 150, 150, 120, 120, 150, 150, 50] 
    segmentRanges = [[10, 30], [10, 30], [130, 250], [130, 250], [75, 250], [75, 250], [130, 250], [130, 250], [0, 20]]
    // The following values have to be calulated based on the values above
    hinges = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

    canvas = null;
    context = null;
    container = null;

    imageData = null;
    
    constructor(logger){
        super(logger);
        this.initSimulationState();

        // Create canvas for drawing here so it doesn't get recreated beteween runs
        


    }

    initSimulationState(){
        super.initSimulationState();
        this.motorAngles = [0, 0] // Determined by the simulation

        
    }

    initSegementLengths(screenwidth){
        for (let i = 0 ; i < 2 ; i++){
            for (let j = 0 ; j < 2 ; j++){
                this.motorAxes[i][j] = this.motorAxes[i][j]/this.currentScale*screenwidth;
            }
        }
        for (let i = 0 ; i < this.segmentLengths.length ; i++){
            this.segmentLengths[i] = this.segmentLengths[i]/this.currentScale*screenwidth
        }
        this.currentScale = screenwidth;
    }

    initSimulationDisplay(containerId){
        super.initSimulationDisplay(containerId);

        this.container = $(`#${containerId}`);
        this.container.css({"position": "relative"});

        this.drawingCanvas = $("<canvas>").attr("id", "spyrograph_drawing_canvas").css({"position": "absolute", "left": 0, "top": 0})[0];
        this.drawingContext = this.drawingCanvas.getContext("2d");
        this.drawingCanvas.width = this.container.width();
        this.drawingCanvas.height = this.container.height();
        
        this.container.append(this.drawingCanvas);

        // If there is a previous image, redraw it
        if (this.imageData != null){
            this.drawingContext.putImageData(this.imageData, 0, 0);
        }

        // Create two canvasses, one for the robot and one for the drawing it makes.
        this.canvas = $("<canvas>").attr("id", "spyrograph_canvas").css({"position": "absolute", "left": 0, "top": 0})[0];
        this.context = this.canvas.getContext("2d");
        this.canvas.width = this.container.width();
        this.canvas.height = this.container.height();


        this.container.append(this.canvas);
        

        // Rescale based on canvas width
        this.initSegementLengths(this.canvas.width);

        // Create slider for the different arm segments
        let controlscontainer = $("<span>").css({"position": "absolute", "right": 0, "width": "15%", "text-align": "center", "margin-right": "20px"});
        
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
            var img = this.drawingCanvas.toDataURL('image/png');
            var link = document.createElement('a');
            link.download = 'tekening.png';
            link.href = img;
            link.click();
        });
        controlscontainer.append(saveButton);

        this.container.append(controlscontainer);
    }

    createSlidersForSegments(controlscontainer){
        for (let i = 0 ; i < this.segmentLengths.length - 1 ; ++i){
             // Add sliders for adjusting the arm lengths
            let l1SliderContainer = $("<span>")
            let l1SliderLabel = $("<span>").html("l" + i);
            let l1Slider = $("<input>").attr("type", "range").attr("min", this.segmentRanges[i][0]).attr("max", this.segmentRanges[i][1]).attr("value", this.segmentLengths[i]/this.currentScale*this.startScale);
            l1Slider.css({"border-radius": "5px"});
            let self = this;
            l1Slider.on("change", function(event){
                let sliderValue = $(this).val();
                console.log(sliderValue);
                self.segmentLengths[i] = sliderValue/self.startScale*self.currentScale;
            });

            l1SliderContainer.append(l1SliderLabel);
            l1SliderContainer.append(l1Slider);
            controlscontainer.append(l1SliderContainer);
        }
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
        for (let i = 0 ; i < 6 ;i++){
            this.context.beginPath();
            this.context.arc(this.hinges[i][0], this.hinges[i][1], 3, 0, 360);
            this.context.closePath();
            this.context.fill();
        }

        // Draw the arms
        this.context.beginPath();
        this.context.moveTo(this.hinges[0][0], this.hinges[0][1]);
        this.context.lineTo(this.hinges[4][0], this.hinges[4][1]);
        this.context.lineTo(this.hinges[5][0], this.hinges[5][1]);
        this.context.lineTo(this.hinges[3][0], this.hinges[3][1]);
        this.context.lineTo(this.hinges[1][0], this.hinges[1][1]);
        this.context.moveTo(this.hinges[0][0], this.hinges[0][1]);
        this.context.closePath();
        this.context.stroke();
        
        // Draw a point on the drawingcanvas
        this.drawingContext.fillStyle = this.currentColor;
        this.drawingContext.beginPath();
        this.drawingContext.arc(this.hinges[5][0], this.hinges[5][1], 1, 0, 360);
        this.drawingContext.closePath();
        this.drawingContext.fill();

        // Save drawing in imageData
        this.imageData = this.drawingContext.getImageData(0, 0, this.container.width(), this.container.height());

        
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

        let hingepoint = this.calculateHingePoint(x1, y1, x2, y2, l1, l2);
        this.hinges[2][0] = hingepoint[0];
        this.hinges[2][1] = hingepoint[1];
        
        // Caculate the next point past the central hinge
        // Hinge above motor 1
        l1 = this.segmentLengths[3];
        l2 = this.segmentLengths[4];
        x1 = this.hinges[1][0];
        y1 = this.hinges[1][1];
        x2 = this.hinges[2][0];
        y2 = this.hinges[2][1];
        this.hinges[3][0] = x1 + (l1+l2)*(x2-x1)/l1;
        this.hinges[3][1] = y1 + (l1+l2)*(y2-y1)/l1;
        // Hinge above motor 2
        l1 = this.segmentLengths[2];
        l2 = this.segmentLengths[5];
        x1 = this.hinges[0][0];
        y1 = this.hinges[0][1];
        x2 = this.hinges[2][0];
        y2 = this.hinges[2][1];
        this.hinges[4][0] = x1 + (l1+l2)*(x2-x1)/l1;
        this.hinges[4][1] = y1 + (l1+l2)*(y2-y1)/l1;

        // Second central hinge point
        hingepoint = this.calculateHingePoint(this.hinges[3][0], 
                                                this.hinges[3][1], 
                                                this.hinges[4][0], 
                                                this.hinges[4][1], 
                                                this.segmentLengths[6], 
                                                this.segmentLengths[7]);

        this.hinges[5][0] = hingepoint[0];
        this.hinges[5][1] = hingepoint[1];


        /*let eq1 = l1 + '^2=(x-' + x1 + ')^2+(y-' + y1 + ')^2';
        console.log(eq1);
        let eq2 = l2 + '^2=(x-' + x2 + ')^2+(y-' + y2 + ')^2';
        console.log(eq2);
        var sol = nerdamer.solveEquations([eq1, eq2]);
        this.hinges[2] = [sol[0][1], sol[1][1]];
        if (this.hinges[2][1] < this.hinges[0][1] || this.hinges[2][1] < this.hinges[1][1] ){
            // Find other solution to system of equations
            this.findOtherSolutionToEquation();
        }
        console.log(this.hinges);*/
        
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
        // Next time the screen gets repainted the render function 
        // will be called before the screen is repainted
        window.requestAnimationFrame(() => { this.render() });
    }

}