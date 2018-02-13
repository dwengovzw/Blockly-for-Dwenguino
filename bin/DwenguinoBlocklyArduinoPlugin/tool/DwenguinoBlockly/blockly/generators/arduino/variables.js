/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Arduino.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.variables');

goog.require('Blockly.Arduino');


Blockly.Arduino.variables_get = function() {
  // Variable getter.
  var code = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino.variables_declare = function() {
  // Variable setter.
  var varType = this.getFieldValue('TYPE');
  //TODO: settype to variable
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  //Blockly.Arduino.definitions_[varName + '_' + varType] = varType + ' ' + varName + ';\n';
  return varType + ' ' + varName + ';\n';
};

Blockly.Arduino.variables_declare_global = function() {
  // Variable setter.
  var varType = this.getFieldValue('TYPE');
  //TODO: settype to variable
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  Blockly.Arduino.definitions_[varName + '_' + varType] = varType + ' ' + varName + ';\n';
  return "";
};

Blockly.Arduino.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
 // var type = Blockly.Arduino.getFieldValue('TYPE');

  return varName + ' = ' + argument0 + ';\n';
};

Blockly.Arduino.variables_declare_set = function() {
  // Variable setter.
  var varValue = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  Blockly.Arduino.definitions_[varName] = 'int ' + varName + ';\n';

  return varName + ' = ' + varValue + ';\n';
};


Blockly.Arduino.variables_declare_set_with_type = function() {
  // Variable setter.
  var varValue = Blockly.Arduino.valueToCode(this, 'VALUE',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var varType = this.getFieldValue('TYPE') || 'int';
  Blockly.Arduino.definitions_[varName] = varType + ' ' + varName + ';\n';

  return varName + ' = ' + varValue + ';\n';
};
