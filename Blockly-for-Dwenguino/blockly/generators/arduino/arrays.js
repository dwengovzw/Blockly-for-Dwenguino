/**
 * @fileoverview Generating Arduino C++ code for array blocks.
 */
'use strict';

goog.provide('Blockly.Arduino.arrays');

goog.require('Blockly.Arduino');


Blockly.Arduino['array_create'] = function(block) {
  var arrayName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var arrayType = block.getFieldValue('TYPE');
  var size = Blockly.Arduino.valueToCode(block, 'SIZE',
      Blockly.Arduino.ORDER_ATOMIC) || '5';
  Blockly.Arduino.definitions_['array_' + arrayName] =
      arrayType + ' ' + arrayName + '[' + size + '];\n';
  return '';
};

Blockly.Arduino['array_get_index'] = function(block) {
  var arrayName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var index = Blockly.Arduino.valueToCode(block, 'INDEX',
      Blockly.Arduino.ORDER_ATOMIC) || '0';
  var code = arrayName + '[' + index + ']';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['array_set_index'] = function(block) {
  var arrayName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var index = Blockly.Arduino.valueToCode(block, 'INDEX',
      Blockly.Arduino.ORDER_ATOMIC) || '0';
  var value = Blockly.Arduino.valueToCode(block, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  return arrayName + '[' + index + '] = ' + value + ';\n';
};

Blockly.Arduino['array_length'] = function(block) {
  var arrayName = Blockly.Arduino.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var code = '(sizeof(' + arrayName + ') / sizeof(' + arrayName + '[0]))';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
