/**
 * A helper class to create the display for the conveyor scenario. 
 */
class ConveyorDisplayHelper {
    ModalType = {
        CONVEYOR: "conveyor",
        PIN: "pin"
    }
    colors = ["#0d0d0d", "white", "gray", "red", "orange", "yellow", "greenyellow", "green", "cyan", "blue", "purple", "pink", "magenta"];
    color = this.colors[0];
    drawingCanvasId = 'conveyor_modal_canvas';
    drawingUrl;
    pins = [...Array(24).keys()];

    constructor(dimensions, amount, startPositionY, sensorPins, buttonPins) {
        this.dimensions = dimensions;
        this.amount = amount;
        this.startPositionY = startPositionY;
        this.sensorPins = sensorPins;
        this.buttonPins = buttonPins;
    }

    /**
     * Updates the arrays with the pin distributions.
     * @param {Array} sensorPins - The pin distribution for the sensors.
     * @param {Array} buttonPins - The pin distribution for the buttons.
     */
    updatePins(sensorPins, buttonPins){
        this.sensorPins = sensorPins;
        this.buttonPins = buttonPins;
    }

    /**
    * Show the HTML-element by setting the display setting to 'block'. 
    * @param {Object} element - The HTML-element
    */
    showElement(element) {
        console.log(`Show element with id: ${element.attr('id')}`);
        element.css({
            "display": "block"
        });
    }
    /**
     * Hide the HTML-element by setting the display setting to 'none'. 
     * @param {Object} element - The HTML-element
     */
    hideElement(element) {
        console.log(`Hide element with id: ${element.attr('id')}`);
        element.css({
            "display": "none"
        });
    }

    /**
     * Set the RGB-sensors opacity to the value given.
     * @param {float} value - The opacity value
     */
    setSensorsOpacity(value) {
        $("#sim_rgbsensors").css({
            "opacity": `${value}`
        });
    }

    /**
     * If an image or drawing was already chosen before, 
     * draw it in the preview canvas and in the conveyor-paper canvas.
     */
    drawCurrentImageOnCanvasses() {
        if (this.drawingUrl) {
            // redraw preview
            let previewCanvas = document.getElementById('sim_image_preview');
            let previewCtx = previewCanvas.getContext('2d');
            let prevImgWidth = this.dimensions.conveyor.width / 4;
            let prevImgHeight = this.dimensions.conveyor.length / 2;
            previewCanvas.height = prevImgHeight;
            previewCanvas.width = prevImgWidth;
            var prevImg = new Image();
            prevImg.onload = function () {
                previewCtx.save();
                previewCtx.translate(prevImgWidth / 2, prevImgHeight / 2);
                previewCtx.rotate(-Math.PI / 2);
                previewCtx.translate(-prevImgHeight / 2, -prevImgWidth / 2)
                //previewCtx.clearRect(0, 0, previewCanvas.height, previewCanvas.width);
                previewCtx.drawImage(prevImg, 0, 0, previewCanvas.height, previewCanvas.width);
                previewCtx.restore();
            };
            prevImg.src = this.drawingUrl;

            // redraw paper on belt
            let beltCanvas = document.getElementById('sim_conveyor_paper');
            let beltCtx = beltCanvas.getContext('2d');
            let imgWidth = this.dimensions.conveyor.width;
            let imgHeight = this.dimensions.conveyor.length;
            beltCanvas.height = imgHeight;
            beltCanvas.width = imgWidth;
            var beltImg = new Image();
            beltImg.onload = function () {
                beltCtx.save();
                beltCtx.translate(imgWidth / 2, imgHeight / 2);
                beltCtx.rotate(-Math.PI / 2);
                beltCtx.translate(-imgHeight / 2, -imgWidth / 2)
                //beltCtx.clearRect(0, 0, beltCanvas.height, beltCanvas.width);
                beltCtx.drawImage(beltImg, 0, 0);
                beltCtx.restore();
            };
            beltImg.src = this.drawingUrl;
        }
    }

    /**
     * Creates the controls menu containing an imagepicker and a preview of that image.
     * @param {Object} parent - The parent HTML-element in which the contaols menu is being drawn.
     */
    createControlsMenu(parent) {
        /*Controls: 
            - pin distribution (opens modal to change pin distribution)
            - image picker (opens modal to draw/import/export/clear image for conveyor)
            - image preview
        */
        let self = this;

        let controlscontainer = $("<div>").css({
            "position": "absolute",
            "left": 0,
            "right": 0,
            "bottom": 0,
            "height": "65%",
            "text-align": "center",
            "padding-left": "20px",
            "padding-right": "20px",
            "padding-bottom": "20px"
        });

        //Button to open modal with pin distribution
        let pinDistribution = $("<button>").attr("value", "Pin distribution")
            .html(MSG.conveyor.pinDistribution)
            .css({
                "margin": "5px auto",
                "display": "block"
            }).click(function () {
                self.showElement($("#pin_modal"));
            });

        //Create image picker button
        let imagepicker = $("<button>").attr("value", "Choose image")
            .html(MSG.conveyor.chooseImage)
            .css({
                "margin": "10px auto",
                "display": "block"
            }).click(function () {
                self.showElement($("#conveyor_modal"));
            });

        // Create image preview label
        let previewLabel = $("<p>").html(MSG.conveyor.preview).css({
            "margin": "5px auto 0px",
            "display": "block",
            "text-decoration": "underline"
        });
        // Create image preview canvas
        let previewImage = $("<canvas>").attr("id", "sim_image_preview").css({
            "width": this.dimensions.conveyor.width / 4 + "px",
            "height": this.dimensions.conveyor.length / 2 + "px",
            "margin": "5px auto",
            "display": "block",
            "background-image": "url('DwenguinoIDE/img/conveyor/conveyor_belt.png')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat"
        });

        controlscontainer.append(pinDistribution);
        controlscontainer.append(imagepicker);
        controlscontainer.append(previewLabel);
        controlscontainer.append(previewImage);
        parent.append(controlscontainer);

    }

    /**
     * Creates a modal (pop-up with a darker background around it).
     * @param {Object} parent - The parent HTML-element in which the modal is being drawn.
     * @param {String} type - The type of modal that describes the usage.
     */
    createModal(parent, type) {

        let self = this;

        let modal = $("<div>").attr("id", type + "_modal").css({
            "position": "fixed",
            "z-index": 100,
            "padding-top": "100px",
            "left": 0,
            "top": 0,
            "width": "100%", /* Full width */
            "height": "100%", /* Full height */
            "overflow": "auto", /* Enable scroll if needed */
            "background-color": "rgb(0, 0, 0)", /* Fallback color */
            "background-color": "rgba(0, 0, 0, 0.4)" /* Black w/ opacity */
        }).click(function (event) {
            if (event.target.id == type + "_modal") {
                self.hideElement($("#"+ type + "_modal"));
            }
        });

        let modalContent = $("<div>").attr("id", type + "_modal_content").css({
            "background-color": "#fefefe",
            "margin": "auto",
            "padding": "20px",
            "border": "1px solid #888",
            "width": "80%",
            "overflow": "hidden"
        });

        let closeButton = $("<span>").attr("id", "close_button").html("&times;").css({
            "color": "#aaaaaa",
            "float": "right",
            "font-size": "28px",
            "font-weight": "bold"
        }).hover(function () {
            $(this).css({
                "color": "#000",
                "text-decoration": "none",
                "cursor": "pointer"
            });
        }, function () {
            $(this).css({
                "color": "#aaaaaa",
                "text-decoration": "none",
                "cursor": "default"
            });
        }).click(function () {
            self.hideElement($("#" + type + "_modal"));
        });

        modalContent.append(closeButton);
        this.createModalContent(modalContent, type);
        modal.append(modalContent);
        parent.append(modal);

        this.hideElement(modal);
    }

    /**
     * Calls the necessary 'create'-function to create the modal content, depending on the type of modal.
     * @param {Object} parent - The parent HTML-element in which the modal content is being drawn.
     * @param {String} type - The type of modal that describes the usage.
     */
    createModalContent(parent, type) {
        switch (type) {
            case this.ModalType.CONVEYOR:
                this.createConveyorModalContent(parent);
                break;
            case this.ModalType.PIN:
                this.createPinModalContent(parent);
                break;
            default:
                throw new Error("A modal of type " + type + " could not be generated. This is not implemented. Did you mean '" + this.ModalType.CONVEYOR + "' or '" +this.ModalType.PIN+ "'?");
        }
    }

    /**
     * Creates the modal content for the pin distribution modal. This contains the the pin distribution for
     * the buttons and the leds and a way to change them.
     * @param {Object} parent - The parent HTML-element in which the modal content is being drawn.
     */
    createPinModalContent(parent){

        let container = $("<div>").html(`
            <h3 style="grid-column: 1/span 2; grid-row:1;text-align:center;margin-bottom:30px"> ${MSG.conveyor.pinDistribution} </h3>
            <p style="grid-column: 1; grid-row:2;text-align:right;margin-right:10px"> ${MSG.conveyor.sensors}: <p>
            <p style="grid-column: 1; grid-row:4;text-align:right;margin-right:10px"> ${MSG.conveyor.buttons}: <p>
        `).css({
            "display": "grid",
            "grid-template-columns": "auto max-content",
            "grid-template-rows":  "auto, auto, auto, auto auto",
            "grid-gap": "10px",
            "justify-content": "center",
        });
        let sensors = $("#sim_rgbsensors").clone().css({
            "position": "relative",
            "bottom": "auto",
            "grid-column": "2",
            "grid-row": "2"
        });

        let sensor_pins = $("<div>").css({
            "display": "grid",
            "grid-template-columns": "auto auto auto auto auto",
            "justify-content": "space-between",
            "padding": "0px 5px",
            "margin-bottom": "30px",
            "grid-column": "2",
            "grid-row": "3"
        });

        for(var i = 0; i < this.amount; i++) {
            let options;
            this.pins.forEach(pin => {
                if(this.sensorPins[i] == pin){
                    options += `<option value=${pin} selected>${pin}</option>\n`
                } else {
                    options += `<option value=${pin}>${pin}</option>\n`
                }
            });
            let select = $(`<select id="select_snr_${i}" name="select_snr_${i}">${options}</select>`);
            sensor_pins.append(select);
        }
        
        let buttons = $("#sim_gamebuttons").clone().css({
            "position": "relative",
            "bottom": "auto",
            "grid-column": "2",
            "grid-row": "4"
        });

        let button_pins = $("<div>").css({
            "display": "grid",
            "grid-template-columns": "auto auto auto auto auto",
            "justify-content": "space-between",
            "padding": "0px 2px",
            "grid-column": "2",
            "grid-row": "5"
        });
        for(var i = 0; i < this.amount; i++) {
            let options;
            this.pins.forEach(pin => {
                if(this.buttonPins[i] == pin){
                    options += `<option value=${pin} selected>${pin}</option>\n`
                } else {
                    options += `<option value=${pin}>${pin}</option>\n`
                }
            });
            let select = $(`<select id="select_btn_${i}" name="select_btn_${i}">${options}</select>`);
            button_pins.append(select);
        }

        container.append(sensors);
        container.append(sensor_pins);
        container.append(buttons);
        container.append(button_pins);
        parent.append(container);

    }

    /**
     * Creates the modal content for the conveyor modal. This contains the drawing canvas, 
     * a color picker and buttons to save, load or clear the image.
     * @param {Object} parent - The parent HTML-element in which the modal content is being drawn.
     */
    createConveyorModalContent(parent) {
        let self = this;

        let top = $("<div>").css({
            "display": "block",
            "overflow": "hidden",
            "position": "relative",
        });

        // Create the sensors (to indicate the orientation)
        let sim_sensors_height = this.dimensions.sensor.width * this.amount + this.dimensions.sensor.spacing * (this.amount - 1);
        let sensors = $("<div>").attr("id", "sim_modal_rgbsensors").css({
            "width": this.dimensions.sensor.width + "px",
            "height": sim_sensors_height + "px",
            "display": "inline-block",
            "margin-right": "5px"
        });

        for (let i = 0; i < this.amount; i++) {
            let sens = $("<div>").attr("id", "sim_modal_rgbsensor_" + i).css({
                "width": this.dimensions.sensor.width + "px",
                "height": this.dimensions.sensor.height + "px",
                "position": "absolute",
                "background-image": "url('DwenguinoIDE/img/conveyor/rgb_sensor_rotated.png')",
                "background-size": "100%",
                "background-repeat": "no-repeat",
                "top": (this.dimensions.sensor.height + this.dimensions.sensor.spacing) * i + "px",
                "left": 0
            });
            sensors.append(sens);

        }

        // Create the raster to draw as the background of the canvas
        var raster = document.createElement('canvas');
        raster.width = this.dimensions.conveyor.length * 2
        raster.height = this.dimensions.conveyor.width
        let ctx = raster.getContext('2d');
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(200,200,200)";
        let y = this.dimensions.sensor.width + this.dimensions.sensor.spacing / 2

        for (var i = 1; i < this.amount; i++) {
            ctx.moveTo(0, y);
            ctx.lineTo(this.dimensions.conveyor.length * 2, y);
            ctx.stroke();

            y += this.dimensions.sensor.width + this.dimensions.sensor.spacing;
        }

        let rasterUrl = raster.toDataURL();

        // Create the canvas
        let canvas = $("<canvas>").attr("id", this.drawingCanvasId).css({
            "width": this.dimensions.conveyor.length * 2,
            "height": this.dimensions.conveyor.width,
            "border": "2px solid rgb(50,50,50)",
            "background-image": "url(" + rasterUrl + ")",
            "background-size": "100%"
        });


        // Create the colorpalette
        let colorPalette = $("<div>").attr("id", "conveyor_modal_palette").css({
            "overflow": "hidden",
            "margin-top": "5px",
            "float": "left"
        });

        this.colors.forEach(col => {
            let colDiv = $("<div>").attr("id", "palette_" + col).css({
                "background-color": col,
                "width": 27,
                "height": 27,
                "float": "left",
                "border": "1px solid #454545"
            }).click(function () {
                $(this).css({
                    "border": "3px solid #454545"
                });
                self.color = col;
                self.colors.forEach(c => {
                    if (c !== col) {
                        $("#palette_" + c).css({
                            "border": "1px solid #454545"
                        })
                    }
                })
            });
            colorPalette.append(colDiv);
        });

        let color_hover = $("<div>").attr("id", "hover_color_value").css({
            "margin-left": "10px",
            "margin-top": "5px",
            "float": "left",
            "font-family": "'Courier New', monospace"
        }).html("rgb(\xa0\xa00, \xa0\xa00, \xa0\xa00)");

        canvas.mousemove(function(e) {
            let pos = { x: 0, y: 0 };
            var offset = canvas.offset();
            pos.x = e.clientX - offset.left;
            pos.y = e.clientY - offset.top;
            
            var c = this.getContext('2d');
            var p = c.getImageData(pos.x, pos.y, 1, 1).data; 
            var r = p[0].toString();
            while (r.length < 3) r = "\xa0" + r;
            var g = p[1].toString();
            while (g.length < 3) g = "\xa0" + g;
            var b = p[2].toString();
            while (b.length < 3) b = "\xa0" + b;
            color_hover.html(`rgb(${r}, ${g}, ${b})`);
        });

        // Create the button to load/import an image
        let importImageButton = $("<button>").attr("value", "Import image")
            .html(MSG.conveyor.importImage)
            .css({
                "margin-top": "5px",
                "margin-left": "10px",
                "float": "left",
            }).click(function () {
                // Create file-input that asks for a png + draw image on canvas when chosen.
                let imageLoader = document.createElement('input');
                imageLoader.setAttribute('type', "file");
                imageLoader.setAttribute('accept', "image/x-png,image/gif,image/jpeg");
                imageLoader.addEventListener('change', function (e) {
                    var canvas = document.getElementById(self.drawingCanvasId);
                    var ctx = canvas.getContext('2d');
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var img = new Image();
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        }
                        img.src = event.target.result;
                    }
                    reader.readAsDataURL(e.target.files[0]);
                }, false);
                imageLoader.click();

            });

        // Create the button that saves/downloads the drawing/image.
        let saveImageContainer = $("<div>").css({
            "margin-top": "5px",
            "margin-bottom": "5px",
            "margin-left": "10px",
            "float": "left",
        });
        let saveImageButton = $("<button>").attr("value", "Save image")
            .html(MSG.conveyor.saveImage)
            .click(function () {
                let downloadLink = document.createElement('a');
                downloadLink.setAttribute('download', MSG.conveyor.imageDownloadName + ".png");
                let canvas = document.getElementById(self.drawingCanvasId);

                var resizedCanvas = document.createElement("canvas");
                var resizedContext = resizedCanvas.getContext("2d");
                resizedCanvas.height = $("#conveyor_dim_height").val();
                resizedCanvas.width = $("#conveyor_dim_width").val();
                resizedContext.drawImage(canvas, 0, 0, $("#conveyor_dim_width").val(), $("#conveyor_dim_height").val());
                // Draw border, to make it easy to cut out when printed
                resizedContext.lineWidth = 1;
                resizedContext.strokeStyle="black";
                resizedContext.strokeRect(0, 0, resizedCanvas.width, resizedCanvas.height);
                let dataURL = resizedCanvas.toDataURL('image/png');
                downloadLink.setAttribute('href', dataURL);
                downloadLink.click();

            });

        let dimensions = $("<div>").html(`
            <label for="conveyor_dim_width" style="text-align:right">W:</label>
            <input type="number" id="conveyor_dim_width" value="${self.dimensions.conveyor.length * 2}" style="max-width:75px">
            <label for="conveyor_dim_height" style="text-align:right">H:</label>
            <input type="number" id="conveyor_dim_height" value="${self.dimensions.conveyor.width}" style="max-width:75px">
        `).css({
            "display": "grid",
            "grid-template-columns": "max-content max-content",
            "grid-gap": "5px"
        });

        // Create the button that clears the drawing-canvas.
        let clearButton = $("<button>").attr("value", "Clear")
            .html(MSG.conveyor.clear)
            .css({
                "margin-top": "5px",
                "margin-left": "10px",
                "float": "left",
            }).click(function () {
                // clear canvas
                let canvas = document.getElementById(self.drawingCanvasId)
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });

        // Create the button that cancels all drawing actions since the modal was opened.
        let cancelButton = $("<button>").attr("value", "Cancel")
            .html(MSG.conveyor.cancel)
            .css({
                "margin-top": "5px",
                "float": "right",
            }).click(function () {
                // clear canvas
                let canvas = document.getElementById(self.drawingCanvasId)
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // redraw previous drawing, if there is one
                if (self.drawingUrl) {
                    var img = new Image();
                    img.onload = function () {
                        ctx.drawImage(img, 0, 0);
                    };
                    img.src = self.drawingUrl;
                }

                self.hideElement($("#conveyor_modal"));
            });

        // Create the button that sets the new drawingURL and draws the image to all needed canvases.
        let readyButton = $("<button>").attr("value", "Ready")
            .html(MSG.conveyor.ready)
            .css({
                "margin-top": "5px",
                "margin-left": "10px",
                "float": "right",
            }).click(function () {
                // Save drawing/image
                let drawing = document.getElementById(self.drawingCanvasId)
                self.drawingUrl = drawing.toDataURL();

                let previewCanvas = document.getElementById('sim_image_preview')
                let previewCtx = previewCanvas.getContext('2d');
                let imgWidth = self.dimensions.conveyor.width / 4;
                let imgHeight = self.dimensions.conveyor.length / 2;
                previewCanvas.height = imgHeight;
                previewCanvas.width = imgWidth;

                // var img = new Image();
                // img.onload = function () {
                previewCtx.save();
                previewCtx.translate(imgWidth / 2, imgHeight / 2);
                previewCtx.rotate(-Math.PI / 2);
                previewCtx.translate(-imgHeight / 2, -imgWidth / 2)
                //previewCtx.clearRect(0, 0, previewCanvas.height, previewCanvas.width);
                previewCtx.drawImage(drawing, 0, 0, previewCanvas.height, previewCanvas.width);
                previewCtx.restore();
                // };
                // img.src = self.drawingUrl;

                self.updateConveyorPaper(self.startPositionY);
                self.hideElement($("#conveyor_modal"));
            });


        top.append(sensors);
        top.append(canvas);
        saveImageContainer.append(saveImageButton)
        saveImageContainer.append(dimensions);
        parent.append(top);
        parent.append(colorPalette);
        parent.append(color_hover);
        parent.append(importImageButton);
        parent.append(saveImageContainer);
        parent.append(clearButton);
        parent.append(readyButton);
        parent.append(cancelButton);
    }

    /**
     * Adds drawing capabilities to the canvas. Drawing is possible when the mouse is clicked. 
     * It uses the previously selected color from the color palette.
     */
    initCanvas() {
        let self = this;
        let canvas = document.getElementById(this.drawingCanvasId)
        canvas.width = this.dimensions.conveyor.length * 2
        canvas.height = this.dimensions.conveyor.width
        let ctx = canvas.getContext('2d');
        let pos = { x: 0, y: 0 };

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mousedown', setPosition);
        canvas.addEventListener('mouseenter', setPosition);

        if (this.drawingUrl) {

            var img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = self.drawingUrl;
        }

        // new position from mouse event
        function setPosition(e) {
            var offset = $("#" + self.drawingCanvasId).offset();
            pos.x = e.clientX - offset.left;
            pos.y = e.clientY - offset.top;
        }

        function draw(e) {
            // mouse left button must be pressed
            if (e.buttons !== 1) return;

            ctx.beginPath(); // begin

            ctx.lineWidth = self.dimensions.sensor.width * 0.7;
            ctx.lineCap = 'round';
            ctx.strokeStyle = self.color;

            ctx.moveTo(pos.x, pos.y); // from
            setPosition(e);
            ctx.lineTo(pos.x, pos.y); // to

            ctx.stroke(); // draw it
        }
    }

    /**
     * Creates the elements to visualize the conveyor belt robot, with the leds, buttons and sensors.
     * @param {Object} parent - The parent HTML-element in which the robot display is being drawn.
     * @param {Object[]} leds - The state of the RGBleds. It contains the relative position of each led in their parent-container.
     * @param {Object[]} buttons - The state of the buttos. It contains the relative position of each led in their parent-container.
     * @param {Object[]} sensors - The state of the RGBsensors. It contains the relative position of each led in their parent-container.
     */
    createRobotDisplay(parent, leds, buttons, sensors) {
        let sim_container = $("<div>").attr("id", "sim_container").css({
            "position": "absolute",
            "left": 0,
            "top": 0,
            "right": 0,
            "bottom": 0,
            "margin": "10px",
            "width": "100%",
            "height": "100%",
            "text-align": "center"
        });;

        // Create the buttons-container
        let sim_buttons_width = this.dimensions.button.width * this.amount + this.dimensions.button.spacing * (this.amount - 1);
        let sim_gamebuttons = $("<div>").attr("id", "sim_gamebuttons").css({
            "width": sim_buttons_width + "px",
            "height": this.dimensions.button.height + "px",
            "margin-left": "5px",
            "position": "absolute",
            "bottom": "-" + (this.dimensions.button.height + this.dimensions.sensor.height / 3 + 10) + "px"

        });
        // Create the RGBleds-container
        let sim_leds_width = sim_buttons_width;
        let sim_gameleds = $("<div>").attr("id", "sim_gameleds").css({
            "width": sim_leds_width + "px",
            "height": this.dimensions.button.height + "px",
            "margin-left": "5px",
            "position": "absolute",
            "bottom": "-" + (this.dimensions.button.height * 2 + this.dimensions.sensor.height / 3 + 15) + "px"

        });
        // Create the RGBsensors-container
        let sim_sensors_width = this.dimensions.sensor.width * this.amount + this.dimensions.sensor.spacing * (this.amount - 1);
        let sim_rgbsensors = $("<div>").attr("id", "sim_rgbsensors").css({
            "width": sim_sensors_width + "px",
            "height": this.dimensions.sensor.height + "px",
            "position": "absolute",
            "bottom": "-" + this.dimensions.sensor.height / 3 + "px"

        });
        // Create the conveyor-container
        let sim_conveyor = $("<div>").attr("id", "sim_conveyor").css({
            "width": (this.dimensions.conveyor.width + this.dimensions.conveyor.border * 2) + "px",
            "height": this.dimensions.conveyor.length + "px",
            "position": "relative",
            "margin": "0px auto"
        });
        // Create the left border of the conveyor belt
        let sim_conveyor_left = $("<div>").attr("id", "sim_conveyor_left").css({
            "width": this.dimensions.conveyor.border + "px",
            "height": this.dimensions.conveyor.length + "px",
            "top": 0,
            "left": 0,
            "position": "absolute",
            "background-image": "url('DwenguinoIDE/img/conveyor/conveyor_border_left.png')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat"
        });
        // Create the middle part of the conveyor belt, the actual belt
        let sim_conveyor_middle = $("<div>").attr("id", "sim_conveyor_middle").css({
            "width": this.dimensions.conveyor.width + "px",
            "height": this.dimensions.conveyor.length + "px",
            "top": 0,
            "left": this.dimensions.conveyor.border,
            "position": "absolute",
            "background-image": "url('DwenguinoIDE/img/conveyor/conveyor_belt.png')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat"
        });
        // Create the right border of the conveyor belt
        let sim_conveyor_right = $("<div>").attr("id", "sim_conveyor_right").css({
            "width": this.dimensions.conveyor.border + "px",
            "height": this.dimensions.conveyor.length + "px",
            "top": 0,
            "right": 0,
            "position": "absolute",
            "background-image": "url('DwenguinoIDE/img/conveyor/conveyor_border_right.png')",
            "background-size": "100% 100%",
            "background-repeat": "no-repeat"
        });
        // Create the canvas on the conveyor to draw the chosen image/drawing
        let sim_conveyor_paper = $("<canvas>").attr("id", "sim_conveyor_paper").css({
            "width": "100%",
            "height": "100%"
        });

        sim_conveyor_middle.append(sim_conveyor_paper);
        sim_conveyor_middle.append(sim_gamebuttons);
        sim_conveyor_middle.append(sim_gameleds);
        sim_conveyor_middle.append(sim_rgbsensors);
        sim_conveyor.append(sim_conveyor_middle);
        sim_conveyor.append(sim_conveyor_left);
        sim_conveyor.append(sim_conveyor_right);
        sim_container.append(sim_conveyor);
        parent.append(sim_container);

        // Create the buttons, RGBsensors and RGBleds
        for (let i = 0; i < this.amount; i++) {
            let sim_button = $("<div>").attr("id", "sim_button_" + i).css({
                "width": this.dimensions.button.width + "px",
                "height": this.dimensions.button.height + "px",
                "position": "absolute",
                "background-image": "url('DwenguinoIDE/img/conveyor/button.png')",
                "background-size": "100%",
                "background-repeat": "no-repeat",
                'top': buttons[i].pos.y + 'px',
                'left': buttons[i].pos.x + 'px',
            });
            sim_gamebuttons.append(sim_button);
            let sim_rgbsensor = $("<div>").attr("id", "sim_rgbsensor_" + i).css({
                "width": this.dimensions.sensor.width + "px",
                "height": this.dimensions.sensor.height + "px",
                "position": "absolute",
                "background-image": "url('DwenguinoIDE/img/conveyor/rgb_sensor.png')",
                "background-size": "100%",
                "background-repeat": "no-repeat",
                'top': sensors[i].pos.y + 'px',
                'left': sensors[i].pos.x + 'px',
            });
            sim_rgbsensors.append(sim_rgbsensor);
            let sim_led = $("<canvas>").attr("id", "sim_led_" + i).css({
                "position": "absolute",
                'top': leds[i].pos.y + 'px',
                'left': leds[i].pos.x + 'px',
            });
            sim_gameleds.append(sim_led);
            let canvasLed = document.getElementById('sim_led_' + i);
            this.drawRGBLed(canvasLed, sensors[i].r, sensors[i].g, sensors[i].b, this.dimensions.led.width, this.dimensions.led.height);

        }

        //this.updateConveyorPaper(0);

    }
    /**
     * The canvas on the conveyor belt is updated with the chosen/drawn image, if an image is already chosen.
     * 
     * @param {integer} offset1 - The y-offset for the first image that is drawn (it is used as x-offset, because of the rotation)
     * @param {integer} offset2 - The y-offset for the second image that is drawn (it is used as x-offset, because of the rotation)
     */
    updateConveyorPaper(offset1, offset2) {
        let drawing = document.getElementById(this.drawingCanvasId);
        let beltCanvas = document.getElementById('sim_conveyor_paper')
        let beltCtx = beltCanvas.getContext('2d');
        let imgWidth = this.dimensions.conveyor.width;
        let imgHeight = this.dimensions.conveyor.length;
        beltCanvas.height = imgHeight;
        beltCanvas.width = imgWidth;
        beltCtx.save();
        beltCtx.translate(imgWidth / 2, imgHeight / 2);
        beltCtx.rotate(-Math.PI / 2);
        beltCtx.translate(-imgHeight / 2, -imgWidth / 2)
        //beltCtx.clearRect(0, 0, beltCanvas.height, beltCanvas.width);
        beltCtx.drawImage(drawing, offset1, 0);
        if (offset2) {
            beltCtx.drawImage(drawing, offset2, 0);
        }
        beltCtx.restore();


    }

    /**
     * An RGB-Led is drawn with a glow if it is on.
     * 
     * @param {Object} canvas - The canvas HTML-element to draw the RGBLed in. 
     * For the RBG-Led to be round, the width and the height of the canvas need to be the same.
     * @param {integer} r - The red value (0-255).
     * @param {integer} g - The green value (0-255).
     * @param {integer} b - The blue value (0-255).
     * @param {float} width - The width of the drawing.
     * @param {float} height - The height of the drawing
     * @param {boolean} on - Indicates if the RGB-Led is on or off.
     */
    drawRGBLed(canvas, r, g, b, width, height, on) {
        canvas.width = width
        canvas.height = height
        if (canvas.getContext) {
            let ctx = canvas.getContext('2d');
            let x = canvas.width / 2; // x coordinate
            let y = canvas.height / 2; // y coordinate
            let rad = canvas.width / 3; // Arc radius
            if (on) {
                //glow
                var grd = ctx.createRadialGradient(x, y, canvas.width / 5, x, y, canvas.width / 2);
                grd.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
                grd.addColorStop(1, "white");
                ctx.beginPath();
                ctx.fillStyle = grd
                ctx.arc(x, y, canvas.width / 2, 0, Math.PI * 2)
                ctx.fill();
            }

            //led itself
            ctx.beginPath();
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
            ctx.arc(x, y, rad, 0, Math.PI * 2)
            ctx.fill();

            //slightly darker border around led (for visual with very light colors mainly)
            ctx.beginPath();
            let darkerR = r - 20 >= 0 ? r - 20 : 0
            let darkerG = g - 20 >= 0 ? g - 20 : 0
            let darkerB = b - 20 >= 0 ? b - 20 : 0
            ctx.strokeStyle = `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
            ctx.arc(x, y, rad, 0, Math.PI * 2)
            ctx.stroke();


        }
    }
}

export default ConveyorDisplayHelper;