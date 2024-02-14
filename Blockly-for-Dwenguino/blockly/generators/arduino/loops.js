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
 * @fileoverview Generating Arduino for control blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.loops');

goog.require('Blockly.Arduino');


Blockly.Arduino.controls_for = function() {
  // For loop.
  var variable0 = Blockly.Arduino.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Arduino.valueToCode(this, 'FROM',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'TO',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.Arduino.valueToCode(this, 'BY',
      Blockly.Arduino.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }

  let up;
  let code;
  let a1 = Number(argument1);
  let a0 = Number(argument0);
  let inc = Number(increment);
  // Not all arguments are numeric. If they are not, we need to check at runtime
  if (isNaN(a1) || isNaN(a0) || isNaN(inc)){
    up = true;
    code = 'for ( int ' + variable0 + ' = ' + argument0 + ' ; ' +
    variable0 + (up ? ' <= ' : ' >= ') + argument1 + ' ; ' +
    variable0 + '+=' + "(((" + argument1 + ") - (" + argument0 + ") >= 0" + ") ? abs(" + increment + ") : -1*abs(" + increment + ")" + ')) {\n' +
    branch + '}\n';
  } else { // all arguments are numeric, reverse increment when needed
    up = a1 - a0 > 0;
    if (up && inc < 0) {
      inc = -inc;
    } else if (!up && inc > 0) {
      inc = -inc;
    }
    code = 'for ( int ' + variable0 + ' = ' + argument0 + ' ; ' +
    variable0 + (up ? ' <= ' : ' >= ') + argument1 + ' ; ' +
    variable0 + '+=' + inc + ') {\n' +
    branch + '}\n';
  }

  return code;
};

Blockly.Arduino.controls_whileUntil = function() {
  // Do while/until loop.
  var until = this.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Arduino.valueToCode(this, 'BOOL',
      Blockly.Arduino.ORDER_NONE) || 'false';
  var branch = Blockly.Arduino.statementToCode(this, 'DO');
  if (Blockly.Arduino.INFINITE_LOOP_TRAP) {
    branch = Blockly.Arduino.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  // Reverse condition when until loop
  if (until){
    argument0 = "!(" + argument0 + ")";
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
}
