/**
 * The supported robot component types
 */
const TypesEnum = {
  SERVO: 'servo', 
  LED: 'led', 
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  //BUTTON: 'button',
  DECORATION: 'decoration'
};
Object.freeze(TypesEnum);

/**
 * This factory produces robot components for the given robot
 * @param {SocialRobot} robot 
 */
function RobotComponentsFactory(robot, scenarioUtils) {
    this.robot = robot;
    this.scenarioUtils = scenarioUtils
    this.renderer = new SimulationCanvasRenderer();
}

RobotComponentsFactory.prototype.addRobotComponent = function(type){
    switch(type){
        case TypesEnum.SERVO:
            this.addServo();
            break;
        case TypesEnum.LED:
            this.addLed();
            break;
        case TypesEnum.PIR:
            this.addPir();
            break;
        case TypesEnum.SONAR:
            this.addSonar();
            break;
        case TypesEnum.LCD:
            this.addLcd();
            break;
    }
}

RobotComponentsFactory.prototype.removeRobotComponent = function(type){
  switch(type){
      case TypesEnum.SERVO:
          this.removeServo();
          break;
      case TypesEnum.LED:
          this.removeLed();
          break;
      case TypesEnum.PIR:
          this.removePir();
          break;
      case TypesEnum.SONAR:
          this.removeSonar();
          break;
      case TypesEnum.LCD:
          this.removeLcd();
          break;
  }
}

/**
  * Add a new servo to the simulation container.
  */
 RobotComponentsFactory.prototype.addServo = function(draw = true, offsetLeft = 5, offsetTop = 5, state = StatesEnum.PLAIN, width = 100, height = 50, image = this.robot.imgServo, classes = 'sim_canvas servo_canvas'){
    DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.SERVO));

    this.incrementNumberOf(TypesEnum.SERVO);
    var id = this.robot.numberOf[TypesEnum.SERVO];
    var servoCanvasId = 'sim_servo_canvas' + id;

    this.robot[servoCanvasId] = {};
    this.robot[servoCanvasId].width = width;
    this.robot[servoCanvasId].height = height;
    this.robot[servoCanvasId].x = 0;
    this.robot[servoCanvasId].y = 30;
    this.robot[servoCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
    this.robot[servoCanvasId].angle = 0;
    this.robot[servoCanvasId].prevAngle = 0;
    this.robot[servoCanvasId].image = new Image();
    this.robot[servoCanvasId].image.src = image;
    this.robot[servoCanvasId].state = state;
    this.robot[servoCanvasId].backgroundColor = '#206499';

    this.addHtml(TypesEnum.SERVO, id, offsetTop, offsetLeft, classes);

    this.renderer.initializeCanvas(servoCanvasId, this.robot);
    if(draw){
      $('#sim_servo' + id).css('visibility', 'visible');
    } else {
      $('#sim_servo' + id).css('visibility', 'hidden');
    }

    this.scenarioUtils.contextMenuServo();
 };

 /**
  * Remove the most recent created servo from the simulation container.
  */
 RobotComponentsFactory.prototype.removeServo = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.SERVO));

  var id = this.robot.numberOf[TypesEnum.SERVO];
  $("#sim_servo"+ id + "").remove();

  delete this.robot['sim_servo_canvas' + id];
  this.decrementNumberOf(TypesEnum.SERVO);
};

/**
 * Add a new LED to the simulation container.
 */
RobotComponentsFactory.prototype.addLed = function(draw = true, offsetLeft = 5, offsetTop = 5, onColor = 'yellow'){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.LED));
  
  this.incrementNumberOf(TypesEnum.LED);
  var i = this.robot.numberOf[TypesEnum.LED];
  var id = this.getLedId(i);
  var ledCanvasId = 'sim_led_canvas' + i;

  this.robot[ledCanvasId] = {};
  this.robot[ledCanvasId].radius = 10;
  this.robot[ledCanvasId].x = 0;
  this.robot[ledCanvasId].y = 0;
  this.robot[ledCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[ledCanvasId].onColor = onColor;
  this.robot[ledCanvasId].offColor = 'gray';
  this.robot[ledCanvasId].borderColor = 'black';
  this.robot[ledCanvasId].state = 0;

  var classes = 'sim_canvas led_canvas';
  this.addHtml(TypesEnum.LED, i, offsetTop, offsetLeft, classes);

  this.renderer.initializeCanvas(ledCanvasId, this.robot);
  if(draw){
    $('#sim_led' + id).css('visibility', 'visible');
  } else {
    $('#sim_led' + id).css('visibility', 'hidden');
  }

  this.scenarioUtils.contextMenuLed();
};

/**
 * Remove the most recent created LED from the simulation container.
 */
RobotComponentsFactory.prototype.removeLed = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.LED));
  var id = this.robot.numberOf[TypesEnum.LED];
  $("#sim_led"+ id + "").remove();

  delete this.robot['sim_led_canvas' + id];
  this.decrementNumberOf(TypesEnum.LED);
};

/**
 * Add a new PIR sensor to the simulation container.
 */
RobotComponentsFactory.prototype.addPir = function(draw = true, offsetLeft = 5, offsetTop = 5){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.PIR));
  
  this.incrementNumberOf(TypesEnum.PIR);
  var id = this.robot.numberOf[TypesEnum.PIR];
  var pirCanvasId = 'sim_pir_canvas' + id;

  this.robot[pirCanvasId] = {};
  this.robot[pirCanvasId].width = 50;
  this.robot[pirCanvasId].height = 50;
  this.robot[pirCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[pirCanvasId].image = new Image();
  this.robot[pirCanvasId].image.src = this.robot.imgPir;
  this.robot[pirCanvasId].state = 0;

  var classes = 'sim_canvas pir_canvas';
  this.addHtml(TypesEnum.PIR, id, offsetTop, offsetLeft, classes);
 
  var buttonLabel = 'button' + id + '_label';
  var pirButtonId = 'pir_button' + id;
  if(!document.getElementById(pirButtonId)){
    $('#sensor_options').append("<div id='" + buttonLabel + "' class='sensor_options_label' alt='Load'>" + MSG.pirButtonLabel + ' ' + id + "</div>");
    $('#sensor_options').append("<div id='" + pirButtonId + "' class='pir_button' alt='Load'></div>");
    
    this.addPirEventHandler(pirButtonId, pirCanvasId);
  }

  this.renderer.initializeCanvas(pirCanvasId, this.robot);
  if(draw){
    $('#sim_pir' + id).css('visibility', 'visible');
  } else {
    $('#sim_pir' + id).css('visibility', 'hidden');
  }
};

/**
 * Remove the most recent created PIR sensor from the simulation container.
 */
RobotComponentsFactory.prototype.removePir = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.PIR));
  var id = this.robot.numberOf[TypesEnum.PIR];
  $('#sim_pir'+ id).remove();

  var buttonLabel = '#button' + id + '_label';
  var pirButtonId = '#pir_button' + id;
  $(buttonLabel).remove();
  $(pirButtonId).remove();

  delete this.robot['sim_pir_canvas' + id];
  this.decrementNumberOf(TypesEnum.PIR);
};

/**
 * Add a new SONAR sensor to the simulation container.
 */
RobotComponentsFactory.prototype.addSonar = function(draw = true, offsetLeft = 5, offsetTop = 5){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.SONAR));
  
  this.incrementNumberOf(TypesEnum.SONAR);
  var id = this.robot.numberOf[TypesEnum.SONAR];
  var sonarCanvasId = 'sim_sonar_canvas' + id;

  this.robot[sonarCanvasId] = {};
  this.robot[sonarCanvasId].width = 100;
  this.robot[sonarCanvasId].height = 58;
  this.robot[sonarCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[sonarCanvasId].image = new Image();
  this.robot[sonarCanvasId].image.src = this.robot.imgSonar;

  var classes = 'sim_canvas sonar_canvas';
  this.addHtml(TypesEnum.SONAR, id, offsetTop, offsetLeft, classes);
 
  this.renderer.initializeCanvas(sonarCanvasId, this.robot);
  if(draw){
    $('#sim_sonar' + id).css('visibility', 'visible');
  } else {
    $('#sim_sonar' + id).css('visibility', 'hidden');
  }

  var sliderId = 'slider' + id;
  var sliderLabel = 'slider' + id + '_label';
  var sliderValue = 'slider' + id + '_value';
  var sonarSliderId = 'sonar_slider' + id;
  if(!document.getElementById(sonarSliderId)){
    console.log('make slider');
    $('#sensor_options').append("<div id='" + sliderLabel + "' class='sensor_options_label' alt='Slider label'>" + MSG.sonarSliderLabel + " " + id + "</div>");
    $('#sensor_options').append("<div id='" + sliderValue + "' class='' alt='Slider value'>100 cm</div>");
    $('#sensor_options').append("<div id='" + sliderId + "' class='sonar_slider slidecontainer' alt='Load'></div>");
    $('#' + sliderId).append("<input type='range' min='0' max='200' value='100' class='slider' id='" + sonarSliderId + "'></input>");
    
    var self = this;
    var slider = document.getElementById(sonarSliderId);
    slider.oninput =function(){
      var id = this.id.replace( /^\D+/g, '');
      self.changeSonarDistance(this.value, id);
    };
  }
};

/**
 * Remove the most recent created SONAR sensor from the simulation container.
 */
RobotComponentsFactory.prototype.changeSonarDistance = function(value, id){
  var sliderValue = 'slider' + id + '_value';
  document.getElementById(sliderValue).innerHTML = value + ' cm';
  DwenguinoSimulation.board.sonarDistance = value;
};

/**
 * Remove the most recent created SONAR sensor from the simulation container.
 */
RobotComponentsFactory.prototype.removeSonar = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.SONAR));
  var id = this.robot.numberOf[TypesEnum.SONAR];
  $('#sim_sonar'+ id).remove();

  delete this.robot['sim_sonar_canvas' + id];
  this.decrementNumberOf(TypesEnum.SONAR);

  if(this.robot.numberOf[TypesEnum.SONAR] === 0){
    $('#slider1_label').remove();
    $('#slider1_value').remove();
    $('#slider1').remove();
  }
};


 /**
  * Add a new decoration component to the simulation container.
  */
 RobotComponentsFactory.prototype.addDecoration = function(draw = true, offsetLeft = 5, offsetTop = 5, state = 'hair'){
  this.incrementNumberOf(TypesEnum.DECORATION);
  var id = this.robot.numberOf[TypesEnum.DECORATION];
  var decorationCanvasId = 'sim_decoration_canvas' + id;

  this.robot[decorationCanvasId] = {};
  this.robot[decorationCanvasId].width = 100;
  this.robot[decorationCanvasId].height = 50;
  this.robot[decorationCanvasId].x = 0;
  this.robot[decorationCanvasId].y = 0;
  this.robot[decorationCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[decorationCanvasId].state = state;

  var classes = 'sim_canvas decoration_canvas';
  this.addHtml(TypesEnum.DECORATION, id, offsetTop, offsetLeft, classes);
 
  this.renderer.initializeCanvas(decorationCanvasId, this.robot);
  if(draw){
    $('#sim_decoration' + id).css('visibility', 'visible');
  } else {
    $('#sim_decoration' + id).css('visibility', 'hidden');
  }
};

/**
* Remove the most recent created decoration element from the simulation container.
*/
RobotComponentsFactory.prototype.removeDecoration = function(){
  var id = this.robot.numberOf[TypesEnum.DECORATION];
  $("#sim_decoration"+ id + "").remove();

  delete this.robot['sim_decoration_canvas' + id];
  this.decrementNumberOf(TypesEnum.DECORATION);
};

 /**
  * Add a new decoration component to the simulation container.
  */
 RobotComponentsFactory.prototype.addLcd = function(draw = true, offsetLeft = 5, offsetTop = 5){
  this.incrementNumberOf(TypesEnum.LCD);
  var id = this.robot.numberOf[TypesEnum.LCD];

  var decorationCanvasId = 'sim_lcd_canvas' + id;

  this.robot[decorationCanvasId] = {};
  this.robot[decorationCanvasId].offset = {'left': offsetLeft, 'top': offsetTop};

  $('#sim_container').append("<div id='sim_lcd"+id+"' class='sim_element sim_element_lcd draggable'><div><span class='grippy'></span>Lcd</div></div>");
  $('#sim_lcd' + id).css('top', offsetTop + 'px');
  $('#sim_lcd' + id).css('left', offsetLeft + 'px');
  $('#sim_lcd' + id).append("<div id='sim_element_lcd_img'></div>");
  $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row0"></div>');
  $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row1"></div>');

  this.renderer.initializeCanvas(decorationCanvasId, this.robot);
  if(draw){
    $('#sim_lcd' + id).css('visibility', 'visible');
  } else {
    $('#sim_lcd' + id).css('visibility', 'hidden');
  }
};

/**
* Remove the most recent created decoration element from the simulation container.
*/
RobotComponentsFactory.prototype.removeLcd = function(){
  var id = this.robot.numberOf[TypesEnum.LCD];
  $("#sim_lcd"+ id + "").remove();

  delete this.robot['sim_lcd_canvas' + id];
  this.decrementNumberOf(TypesEnum.LCD);
};

/**
 * Add a new PIR sensor to the simulation container.
 */
RobotComponentsFactory.prototype.addButton = function(draw = true, offsetLeft = 5, offsetTop = 5){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("addRobotComponent", TypesEnum.BUTTON));
  this.incrementNumberOf(TypesEnum.BUTTON);
  var id = this.robot.numberOf[TypesEnum.BUTTON];
  var buttonId = 'sim_button_canvas' + id;

  this.robot[buttonId] = {};
  this.robot[buttonId].pin = id;
  this.robot[buttonId].width = 50;
  this.robot[buttonId].height = 50;
  this.robot[buttonId].offset = {'left': offsetLeft, 'top': offsetTop};
  this.robot[buttonId].image = new Image();
  this.robot[buttonId].state = 0;

  $('#sim_container').append("<div id='sim_button"+id+"' class='sim_element sim_element_button draggable'><div><span class='grippy'></span>"+MSG.simulator['button']+" pin "+id+"</div></div>");
  $('#sim_button' + id).css('top', offsetTop + 'px');
  $('#sim_button' + id).css('left', offsetLeft + 'px');
  $('#sim_button' + id).append("<div id='sim_button_canvas" +id+"' class='sim_canvas button_canvas sim_button'></canvas>"); 

  // if(!document.getElementById(buttonId)){
  //   $('#sensor_options').append("<div id='" + buttonLabel + "' class='sensor_options_label' alt='Load'>" + MSG.pirButtonLabel + ' ' + id + "</div>");
  //   $('#sensor_options').append("<div id='" + pirButtonId + "' class='pir_button' alt='Load'></div>");
    
  this.addButtonEventHandler(buttonId);
  // }

  this.renderer.initializeCanvas(buttonId, this.robot);
  if(draw){
    $('#sim_button' + id).css('visibility', 'visible');
  } else {
    $('#sim_button' + id).css('visibility', 'hidden');
  }
};

/**
 * Remove the most recent created PIR sensor from the simulation container.
 */
RobotComponentsFactory.prototype.removeButton = function(){
  DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("removeRobotComponent", TypesEnum.BUTTON));
  var id = this.robot.numberOf[TypesEnum.PIR];
  $('#sim_button'+ id).remove();

  delete this.robot['sim_button_canvas' + id];
  this.decrementNumberOf(TypesEnum.BUTTON);
};

/**
 * Returns the led id of the Dwenguino board based on the id of the canvas.
 */
RobotComponentsFactory.prototype.getLedId = function(i){
  var id = 0;
  if(i < 9){
    id = i-1;
  } else {
    id = 13;
  }
  return id;
}

RobotComponentsFactory.prototype.addPirEventHandler = function(pirButtonId, pirCanvasId){
  var self = this;
  console.log(pirButtonId);
  $("#" + pirButtonId).on('mousedown', function() {
    if (document.getElementById(pirButtonId).className === "pir_button") {
      document.getElementById(pirButtonId).className = "pir_button pir_button_pushed";
      self.robot[pirCanvasId].image.src = self.robot.imgPirOn;
      self.robot[pirCanvasId].state = 1;
    }
  });

  $("#"+ pirButtonId).on('mouseup', function() {
    if (document.getElementById(pirButtonId).className === "pir_button pir_button_pushed") {
      document.getElementById(pirButtonId).className = "pir_button";
      self.robot[pirCanvasId].image.src = self.robot.imgPir;
      self.robot[pirCanvasId].state = 0;
    }
  });
}

RobotComponentsFactory.prototype.addButtonEventHandler = function(buttonId){
  var self = this;
  console.log(buttonId);
  $("#" + buttonId).on('mousedown', function() {
    console.log('button clicked');
    console.log(buttonId);
    if (document.getElementById(buttonId).classList.contains('sim_button')) {
      console.log(document.getElementById(buttonId));
      document.getElementById(buttonId).className = "sim_button sim_button_pushed";
      DwenguinoSimulation.digitalWrite(self.robot[buttonId].pin, 'LOW');
      // self.robot[pirCanvasId].image.src = self.robot.imgPirOn;
      // self.robot[pirCanvasId].state = 1;
    }
  });

  $("#"+ buttonId).on('mouseup', function() {
    if (document.getElementById(buttonId).classList.contains('sim_button_pushed')) {
      document.getElementById(buttonId).className = "sim_button";
      DwenguinoSimulation.digitalWrite(self.robot[buttonId].pin, 'HIGH');
      // self.robot[pirCanvasId].image.src = self.robot.imgPir;
      // self.robot[pirCanvasId].state = 0;
    }
  });
}

RobotComponentsFactory.prototype.incrementNumberOf = function(type){
    this.robot.numberOf[type] += 1;
}

RobotComponentsFactory.prototype.decrementNumberOf = function(type){
    this.robot.numberOf[type] -= 1;
}

RobotComponentsFactory.prototype.addHtml = function(type, id, offsetTop, offsetLeft, classes = ''){
  var canvasId = 'sim_' + type + "_canvas" + id;
  $('#sim_container').append("<div id='sim_"+ type +id+"' class='sim_element sim_element_"+type+" draggable'><div><span class='grippy'></span>"+MSG.simulator[type]+" "+id+"</div></div>");
  $('#sim_' + type + id).css('top', offsetTop + 'px');
  $('#sim_' + type + id).css('left', offsetLeft + 'px');
  $('#sim_' + type + id).append("<canvas id='" + canvasId + "' class='" + classes + "'></canvas>");
}