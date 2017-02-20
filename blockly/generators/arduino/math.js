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
 * @fileoverview Generating Arduino for math blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.math');

goog.require('Blockly.Arduino');


Blockly.Arduino.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getFieldValue('NUM'));
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ?
      Blockly.Arduino.ORDER_UNARY_PREFIX : Blockly.Arduino.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Arduino.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getFieldValue('OP');
  var tuple = Blockly.Arduino.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code;
  if (!operator) {
    Blockly.Arduino.definitions_['define_math_h'] = '#include <math.h>\n';
    code = 'pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Arduino.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.Arduino.ORDER_ADDITIVE],
  MINUS: [' - ', Blockly.Arduino.ORDER_ADDITIVE],
  MULTIPLY: [' * ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  DIVIDE: [' / ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  SHIFT_LEFT: [' << ', Blockly.Arduino.ORDER_SHIFT],
  SHIFT_RIGHT: [' >> ', Blockly.Arduino.ORDER_SHIFT],
  POWER: [null, Blockly.Arduino.ORDER_NONE]  // Handle power separately.
};

Blockly.Arduino.math_number_property = function(block){
  var property = block.getFieldValue('PROPERTY');
  var number = Blockly.Arduino.valueToCode(block, 'NUMBER_TO_CHECK', Blockly.Arduino.ORDER_ATOMIC);
  console.log(property);
  console.log(number);
  if (property === 'EVEN'){
      console.log(number + ' \% 2 == 0');
      return number + ' \% 2 == 0';
  }else if (property === 'ODD'){
      return number + ' \% 2 == 1';
  }else if (property === "POSITIVE"){
      return number + ' > 0';
  }else if (property === "NEGATIVE"){
      return number + ' < 0';
  }else if (property === "DIVISIBLE_BY"){
      var divisor = Blockly.Arduino.valueToCode(block, 'DIVISOR', Blockly.Arduino.ORDER_ATOMIC);
      return number + ' \% ' + divisor + ' == 0';
  }else{
      return "nop"
  }
};

Blockly.Arduino.math_change = function(block){
  var varName = block.getFieldValue("VAR");
  var delta = Blockly.Arduino.valueToCode(block, 'DELTA', Blockly.Arduino.ORDER_ATOMIC);
  return varName + " += " + delta + ";\n"
};

Blockly.Arduino.math_round = function(block){
    Blockly.Arduino.definitions_['define_math_h'] = '#include <math.h>\n';

    var roundType = block.getFieldValue('OP');
    var value = Blockly.Arduino.valueToCode(block, 'NUM', Blockly.Arduino.ORDER_ATOMIC);

    if (roundType == 'ROUND'){
        return ['Math.round(' + value + ')', Blockly.Arduino.ORDER_NONE];
    }else if (roundType == 'ROUNDUP'){
        return ['Math.ceil(' + value + ')', Blockly.Arduino.ORDER_NONE];
    }else if (roundType == 'ROUNDDOWN'){
        return ['Math.floor(' + value + ')', Blockly.Arduino.ORDER_NONE];
    }else{
        return "nop;";
    }
};

Blockly.Arduino.math_map = function(block){
    //Blockly.Arduino.definitions_['define_math_h'] = '#include <math.h>\n';

    //var value = block.getFieldValue('VALUE');
    var value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
    var fromLow = Blockly.Arduino.valueToCode(block, 'FROM_LOW', Blockly.Arduino.ORDER_ATOMIC);
    var fromHigh = Blockly.Arduino.valueToCode(block, 'FROM_HIGH', Blockly.Arduino.ORDER_ATOMIC);
    var toLow = Blockly.Arduino.valueToCode(block, 'TO_LOW', Blockly.Arduino.ORDER_ATOMIC);
    var toHigh = Blockly.Arduino.valueToCode(block, 'TO_HIGH', Blockly.Arduino.ORDER_ATOMIC);

     return ["map(" + value + ", " + fromLow + ", " + fromHigh + ", " + toLow + ", " + toHigh + ")", Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino.math_modulo = function(block){
     var dividend = Blockly.Arduino.valueToCode(block, 'DIVIDEND', Blockly.Arduino.ORDER_ATOMIC);
     var divisor = Blockly.Arduino.valueToCode(block, 'DIVISOR', Blockly.Arduino.ORDER_ATOMIC);
     return [dividend + ' % ' + divisor,  Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

Blockly.Arduino.math_random_int = function(block){
    var lower = Blockly.Arduino.valueToCode(block, 'FROM', Blockly.Arduino.ORDER_ATOMIC);
    var upper = Blockly.Arduino.valueToCode(block, 'TO', Blockly.Arduino.ORDER_ATOMIC);
    return ["random(" + lower + ', ' + upper + ')', Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['char_type'] = function (block) {
    var text_bitmask = block.getFieldValue('BITMASK');
    var code = text_bitmask;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
