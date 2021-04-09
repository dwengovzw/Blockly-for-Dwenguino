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
    var code = machine + "ledStrip([";
    for (let i = 1; i < 6; i++) {

        var col = Blockly.JavaScript.valueToCode(block, 'color' + i, Blockly.JavaScript.ORDER_NONE) || '0';

        code += col;
        code += i == 5 ? ']);\n' : ', ';
    }
    return code;
};

// Blockly.JavaScript['conveyor_rgb_off'] = function (block) {
//     var code = '[-1, -1, -1]';
//     return [code, Blockly.JavaScript.ORDER_ATOMIC];
// };


Blockly.JavaScript['conveyor_rgb_color'] = function (block) {
    var r = parseInt(block.getFieldValue('RED'));
    var g = parseInt(block.getFieldValue('GREEN'));
    var b = parseInt(block.getFieldValue('BLUE'));
    var val = r + 256 * g + 65536 * b;
    var code = "" + val;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['conveyor_rgb_color_with_numbers'] = function (block) {
    var r = parseInt(Blockly.JavaScript.valueToCode(block, 'RED', Blockly.JavaScript.ORDER_NONE) || '0');
    var g = parseInt(Blockly.JavaScript.valueToCode(block, 'GREEN', Blockly.JavaScript.ORDER_NONE) || '0');
    var b = parseInt(Blockly.JavaScript.valueToCode(block, 'BLUE', Blockly.JavaScript.ORDER_NONE) || '0');
    var val = r + 256 * g + 65536 * b;
    var code = "" + val;
    // var code = '[' + r + ',' + g + ',' + b + ']';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['conveyor_color'] = function (block) {
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


// Blockly.JavaScript['logic_compare_color'] = function(block) {
//     var operator = block.getFieldValue('OP');
//     var order = (operator == 'EQ' || operator == 'NEQ') ?
//         Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL;
//     var colA = Blockly.JavaScript.valueToCode(block, 'colorA', order) || '[0,0,0]';
//     var colB = Blockly.JavaScript.valueToCode(block, 'colorB', order) || '[0,0,0]';
//     var code = machine + 'compareColors(' + colA + ', "' + operator + '", ' + colB + ')';
//     return [code, order];
// };

  


