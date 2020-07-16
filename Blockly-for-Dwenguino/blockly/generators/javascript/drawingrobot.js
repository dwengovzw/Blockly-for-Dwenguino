/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';
var machine = "DwenguinoSimulation.";

goog.provide('Blockly.JavaScript.drawingrobot');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['initdwenguino'] = function (block) {
    return "";
};


Blockly.JavaScript['drawingrobot_stepper_motor'] = function(block) {
  var value_channel = Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC);
  var value_step = Blockly.JavaScript.valueToCode(block, 'step', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = ""; 
  code += "for (let i = 0 ; i < Math.abs(" + value_step + ") ; ++i){";
  code += machine + 'stepperMotorStep(' + value_channel + ', ' + value_step + ');\n';
  code += "}";
  return code;
}

Blockly.JavaScript['drawingrobot_move'] = function(block) {
  var amount = Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC);
  var direction = parseInt(block.getFieldValue('direction'));

  var code = "";
  switch (direction){
    case 0: code += generateCodeForLineInDirection(amount, 0, -1);
    break;
    case 1: code += generateCodeForLineInDirection(amount, 0, 1);
    break;
    case 2: code += generateCodeForLineInDirection(amount, -1, 0);
    break;
    case 3: code += generateCodeForLineInDirection(amount, 1, 0);
  }
  return code;
}

Blockly.JavaScript['drawingrobot_move_direction'] = function(block) {
  var amount = Blockly.JavaScript.valueToCode(block, 'amount', Blockly.JavaScript.ORDER_ATOMIC);
  var angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);

  angle = parseInt(angle)/180*Math.PI; // Convert from degrees to radians.

  let xIncrement = Math.cos(angle);
  let yIncrement = Math.sin(angle);
  xIncrement = xIncrement; //convert length to number of steps
  yIncrement = -1*yIncrement; //convert length to number of steps

  return generateCodeForLineInDirection(amount, xIncrement, yIncrement);
};


Blockly.JavaScript['drawingrobot_move_direction_x_y'] = function(block) {
  var x = Blockly.JavaScript.valueToCode(block, 'xValue', Blockly.JavaScript.ORDER_ATOMIC);
  var y = Blockly.JavaScript.valueToCode(block, 'yValue', Blockly.JavaScript.ORDER_ATOMIC);

  angle = parseInt(angle)/180*Math.PI; // Convert from degrees to radians.

  let xIncrement = Math.cos(angle);
  let yIncrement = Math.sin(angle);
  xIncrement = xIncrement; //convert length to number of steps
  yIncrement = -1*yIncrement; //convert length to number of steps

  return generateCodeForLineInDirection(amount, xIncrement, yIncrement);
};

function generateCodeForLineInDirection(amount, xIncrement, yIncrement){
  let code = "";
  code += "for (let i = 0 ; i < " + amount + " ; ++i){";
  code += machine + 'stepMotorsTo([' + xIncrement + ', ' + yIncrement + ']);\n';
  code += "}";

  return code;
};

Blockly.JavaScript['drawingrobot_line'] = function(block) {
  var x = Blockly.JavaScript.valueToCode(block, 'x', Blockly.JavaScript.ORDER_ATOMIC);
  var y = Blockly.JavaScript.valueToCode(block, 'y', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine + 'drawRobotLine(' + x + ',' + y + ',' + true + ');\n';
  return code;
}

Blockly.JavaScript['drawingrobot_circle'] = function(block) {
  var radius = Blockly.JavaScript.valueToCode(block, 'radius', Blockly.JavaScript.ORDER_ATOMIC);
  let code = "";
  for (let i = 1 ; i < 360 ; ++i){
    let prevAngle = (i-1)/180*Math.PI;
    let angle = i/180*Math.PI;
    let xIncrement = radius * (Math.cos(angle) - Math.cos(prevAngle));
    let yIncrement = radius * (Math.sin(angle) - Math.sin(prevAngle));
    code += machine + 'stepMotorsTo([' + xIncrement + ', ' + yIncrement + ']);\n';
  }
  return code;
}



Blockly.JavaScript['drawingrobot_rectangle'] = function(block) {
  var width = Blockly.JavaScript.valueToCode(block, 'width', Blockly.JavaScript.ORDER_ATOMIC);
  var height = Blockly.JavaScript.valueToCode(block, 'height', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = "";
  code += generateCodeForLineInDirection(width, 1, 0);
  code += generateCodeForLineInDirection(height, 0, -1);
  code += generateCodeForLineInDirection(width, -1, 0);
  code += generateCodeForLineInDirection(height, 0, 1);
  return code;
}

Blockly.JavaScript['drawingrobot_lower_stylus'] = function(block) {  
  var code = machine + 'drawRobotLowerStylus();\n';
  return code;
}

Blockly.JavaScript['drawingrobot_lift_stylus'] = function(block) {  
  var code = machine + 'drawRobotLiftStylus();\n';
  return code;
}

Blockly.JavaScript['drawingrobot_color'] = function(block) {
  var color = Blockly.JavaScript.quote_(block.getFieldValue('col'));
  var code = machine + 'changeColor(' + color + ');\n';
  return code;
}

Blockly.JavaScript['drawingrobot_motor_number'] = function() {
  // Boolean values HIGH and LOW.
  var code = parseInt(this.getFieldValue('NUMBER'));
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};