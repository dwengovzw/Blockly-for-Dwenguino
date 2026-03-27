/**
 * @fileoverview Generating JavaScript code for array blocks.
 */
'use strict';

goog.provide('Blockly.JavaScript.arrays');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['array_create'] = function(block) {
  var arrayName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var arrayType = block.getFieldValue('TYPE');
  var size = Blockly.JavaScript.valueToCode(block, 'SIZE',
      Blockly.JavaScript.ORDER_ATOMIC) || '5';
  var defaultValue = (arrayType === 'String') ? '""' : '0';
  return arrayName + ' = new Array(' + size + ').fill(' + defaultValue + ');\n';
};

Blockly.JavaScript['array_get_index'] = function(block) {
  var arrayName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var index = Blockly.JavaScript.valueToCode(block, 'INDEX',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var code = arrayName + '[' + index + ']';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};

Blockly.JavaScript['array_set_index'] = function(block) {
  var arrayName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var index = Blockly.JavaScript.valueToCode(block, 'INDEX',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
  var value = Blockly.JavaScript.valueToCode(block, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return arrayName + '[' + index + '] = ' + value + ';\n';
};

Blockly.JavaScript['array_length'] = function(block) {
  var arrayName = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var code = arrayName + '.length';
  return [code, Blockly.JavaScript.ORDER_MEMBER];
};
