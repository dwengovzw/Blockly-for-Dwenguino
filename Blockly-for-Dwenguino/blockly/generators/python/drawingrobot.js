/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
 'use strict';
 var machine = "DwenguinoSimulation.";
 
 goog.provide('Blockly.Python.drawingrobot');
 
 goog.require('Blockly.Python');
 
 
 Blockly.Python['initdwenguino'] = function (block) {
     return "";
 };
 
 
 Blockly.Python['drawingrobot_stepper_motor'] = function(block) {
   var value_channel = Blockly.Python.valueToCode(block, 'channel', Blockly.Python.ORDER_ATOMIC);
   var value_step = Blockly.Python.valueToCode(block, 'step', Blockly.Python.ORDER_ATOMIC);
   
   var code = ""; 
   code += "for i in range(Math.abs(" + value_step + ")):\n\t";
   code += machine + 'stepperMotorStep(' + value_channel + ', ' + value_step + ')\n';
   return code;
 }
 
 Blockly.Python['drawingrobot_move'] = function(block) {
   var amount = Blockly.Python.valueToCode(block, 'amount', Blockly.Python.ORDER_ATOMIC);
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
 
 Blockly.Python['drawingrobot_move_direction'] = function(block) {
   var amount = Blockly.Python.valueToCode(block, 'amount', Blockly.Python.ORDER_ATOMIC);
   var angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
 
   angle = parseInt(angle)/180*Math.PI; // Convert from degrees to radians.
 
   let xIncrement = Math.cos(angle);
   let yIncrement = Math.sin(angle);
   xIncrement = xIncrement; //convert length to number of steps
   yIncrement = -1*yIncrement; //convert length to number of steps
 
   return generateCodeForLineInDirection(amount, xIncrement, yIncrement);
 };
 
 
 Blockly.Python['drawingrobot_move_direction_x_y'] = function(block) {
   var x = Blockly.Python.valueToCode(block, 'xValue', Blockly.Python.ORDER_ATOMIC);
   var y = Blockly.Python.valueToCode(block, 'yValue', Blockly.Python.ORDER_ATOMIC);
 
   angle = parseInt(angle)/180*Math.PI; // Convert from degrees to radians.
 
   let xIncrement = Math.cos(angle);
   let yIncrement = Math.sin(angle);
   xIncrement = xIncrement; //convert length to number of steps
   yIncrement = -1*yIncrement; //convert length to number of steps
 
   return generateCodeForLineInDirection(amount, xIncrement, yIncrement);
 };
 
 function generateCodeForLineInDirection(amount, xIncrement, yIncrement){
   let code = "";
   code += "for i in range(" + amount + "):\n\t";
   code += machine + 'stepMotorsTo([' + xIncrement + ', ' + yIncrement + ']);\n';
 
   return code;
 };
 
 Blockly.Python['drawingrobot_line'] = function(block) {
   var x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
   var y = Blockly.Python.valueToCode(block, 'y', Blockly.Python.ORDER_ATOMIC);
   
   var code = machine + 'drawRobotLine(' + x + ',' + y + ',' + true + ')\n';
   return code;
 }
 
 Blockly.Python['drawingrobot_circle'] = function(block) {
   var radius = Blockly.Python.valueToCode(block, 'radius', Blockly.Python.ORDER_ATOMIC);
   let code = "";
   for (let i = 1 ; i < 360 ; ++i){
     let prevAngle = (i-1)/180*Math.PI;
     let angle = i/180*Math.PI;
     let xIncrement = radius * (Math.cos(angle) - Math.cos(prevAngle));
     let yIncrement = radius * (Math.sin(angle) - Math.sin(prevAngle));
     code += machine + 'stepMotorsTo([' + xIncrement + ', ' + yIncrement + '])\n';
   }
   return code;
 }
 
 
 
 Blockly.Python['drawingrobot_rectangle'] = function(block) {
   var width = Blockly.Python.valueToCode(block, 'width', Blockly.Python.ORDER_ATOMIC);
   var height = Blockly.Python.valueToCode(block, 'height', Blockly.Python.ORDER_ATOMIC);
   
   var code = "";
   code += generateCodeForLineInDirection(width, 1, 0);
   code += generateCodeForLineInDirection(height, 0, -1);
   code += generateCodeForLineInDirection(width, -1, 0);
   code += generateCodeForLineInDirection(height, 0, 1);
   return code;
 }
 
 Blockly.Python['drawingrobot_lower_stylus'] = function(block) {  
   var code = machine + 'drawRobotLowerStylus()\n';
   return code;
 }
 
 Blockly.Python['drawingrobot_lift_stylus'] = function(block) {  
   var code = machine + 'drawRobotLiftStylus()\n';
   return code;
 }
 
 Blockly.Python['drawingrobot_color'] = function(block) {
   var color = Blockly.Python.quote_(block.getFieldValue('col'));
   var code = machine + 'changeColor(' + color + ')\n';
   return code;
 }
 
 Blockly.Python['drawingrobot_motor_number'] = function() {
   // Boolean values HIGH and LOW.
   var code = parseInt(this.getFieldValue('NUMBER'));
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
