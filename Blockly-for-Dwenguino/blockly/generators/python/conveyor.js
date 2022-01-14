/* global Blockly, goog */

/**
 * @fileoverview Generating conveyor scenario blocks.
 * @author jari.degraeve@UGent.be     (Jari De Graeve)
 */
 'use strict';
 var machine = "DwenguinoSimulation.";
 
 goog.provide('Blockly.Python.conveyor');
 
 goog.require('Blockly.Python');
 
 
 Blockly.Python['initdwenguino'] = function (block) {
     return "";
 };
 
 
 Blockly.Python['conveyor_ledstrip'] = function (block) {
     var code = machine + "ledStrip([";
     for (let i = 1; i < 6; i++) {
 
         var col = Blockly.Python.valueToCode(block, 'color' + i, Blockly.Python.ORDER_NONE) || '0';
 
         code += col;
         code += i == 5 ? '])\n' : ', ';
     }
     return code;
 };
 
 Blockly.Python['conveyor_rgb_color'] = function (block) {
     var r = parseInt(block.getFieldValue('RED'));
     var g = parseInt(block.getFieldValue('GREEN'));
     var b = parseInt(block.getFieldValue('BLUE'));
     var val = r + 256 * g + 65536 * b;
     var code = "" + val;
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['conveyor_rgb_color_with_numbers'] = function (block) {
     var r = parseInt(Blockly.Python.valueToCode(block, 'RED', Blockly.Python.ORDER_NONE) || '0');
     var g = parseInt(Blockly.Python.valueToCode(block, 'GREEN', Blockly.Python.ORDER_NONE) || '0');
     var b = parseInt(Blockly.Python.valueToCode(block, 'BLUE', Blockly.Python.ORDER_NONE) || '0');
     var val = r + 256 * g + 65536 * b;
     var code = "" + val;
     // var code = '[' + r + ',' + g + ',' + b + ']';
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['conveyor_color'] = function (block) {
     let conv_colors = {
         noColor: "-1",
         black: "855309",
         white: "16777215",
         gray: "8421504",
         red: "255",
         orange: "42495",
         yellow: "65535",
         greenyellow: "3145645",
         green: "32768",
         cyan: "16776960",
         blue: "16711680",
         purple: "8388736",
         pink: "13353215",
         magenta: "16711935"
     }
     var code = conv_colors[block.getFieldValue("COLOR_DROPDOWN")];
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['conveyor_color_sensor'] = function (block) {
     var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE) || '0';
     var code = machine + 'rgbColorSensor(' + pin + ')';
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 
 Blockly.Python['conveyor_belt'] = function (block) {
     var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_NONE) || '0';
     var code = machine + 'startDcMotor(1, ' + speed + ')\n';
     return code;
 };
 
 Blockly.Python['conveyor_button'] = function (block) {
     var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE) || '0';
     var code = machine + 'readButtonValue(' + pin + ')';
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 
 Blockly.Python['similar_color'] = function (block) {
     var colA = Blockly.Python.valueToCode(block, 'colorA', Blockly.Python.ORDER_NONE) || '0';
     var colB = Blockly.Python.valueToCode(block, 'colorB', Blockly.Python.ORDER_NONE) || '0';
     var diff = block.getFieldValue("diff");
     var code = machine + 'areColorsSimilar(' + colA + ', ' + colB + ', ' + diff + ')';
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 
 
 
 
