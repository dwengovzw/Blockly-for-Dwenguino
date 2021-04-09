/* global Blockly, goog */

/**
 * @fileoverview Generating conveyor scenario blocks.
 * @author jari.degraeve@UGent.be     (Jari De Graeve)
 */
'use strict';
var machine = "DwenguinoSimulation.";

goog.provide('Blockly.JavaScript.conveyor');

goog.require('Blockly.JavaScript');



Blockly.JavaScript['initdwenguino'] = function (block) {
    return "";
};


Blockly.JavaScript['conveyor_ledstrip'] = function (block) {
    var col1 = Blockly.JavaScript.valueToCode(block, 'color1', Blockly.JavaScript.ORDER_NONE);
    var col2 = Blockly.JavaScript.valueToCode(block, 'color2', Blockly.JavaScript.ORDER_NONE);
    var col3 = Blockly.JavaScript.valueToCode(block, 'color3', Blockly.JavaScript.ORDER_NONE);
    var col4 = Blockly.JavaScript.valueToCode(block, 'color4', Blockly.JavaScript.ORDER_NONE);
    var col5 = Blockly.JavaScript.valueToCode(block, 'color5', Blockly.JavaScript.ORDER_NONE);
    var code = machine + "ledStrip([" + col1 + ', ' + col2 + ', ' + col3 + ', ' + col4 + ', ' + col5 + "]);\n";
    return code;
};

Blockly.JavaScript['conveyor_rgb_off'] = function (block) {
    var code = '[-1, -1, -1]';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['conveyor_rgb_color'] = function (block) {
    var r = block.getFieldValue('RED');
    var g = block.getFieldValue('GREEN');
    var b = block.getFieldValue('BLUE');
    var code = '[' + r + ',' + g + ',' + b + ']';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['conveyor_rgb_color_with_numbers'] = function (block) {
    var r = Blockly.JavaScript.valueToCode(block, 'RED', Blockly.JavaScript.ORDER_NONE);
    var g = Blockly.JavaScript.valueToCode(block, 'GREEN', Blockly.JavaScript.ORDER_NONE);
    var b = Blockly.JavaScript.valueToCode(block, 'BLUE', Blockly.JavaScript.ORDER_NONE);
    var code = '[' + r + ',' + g + ',' + b + ']';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['conveyor_color_sensor'] = function (block) {
    var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
    var code = machine + 'rgbColorSensor(' + pin + ')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['conveyor_belt'] = function (block) {
    var speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_NONE);
    var code = machine + 'startDcMotor(1, ' + speed + ');\n';
    return code;
};

Blockly.JavaScript['conveyor_button'] = function (block) {
    var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
    var code = machine + 'readButtonValue(' + pin + ')';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['logic_compare_color'] = function(block) {
    var operator = block.getFieldValue('OP');
    var order = (operator == 'EQ' || operator == 'NEQ') ?
        Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
    var colA = Blockly.JavaScript.valueToCode(block, 'colorA', order) || '[0,0,0]';
    var colB = Blockly.JavaScript.valueToCode(block, 'colorB', order) || '[0,0,0]';
    var code = machine + 'compareColors(' + colA + ', "' + operator + '", ' + colB + ')';
    return [code, order];
};

  


