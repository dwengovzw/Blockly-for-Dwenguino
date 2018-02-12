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
 * @fileoverview Generating Arduino for text blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino.texts');

goog.require('Blockly.Arduino');


Blockly.Arduino.text = function() {
  // Text value.
  var code = Blockly.Arduino.quote_(this.getFieldValue('TEXT'));
  return ["String(" + code + ")", Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.char = function() {
  // Character value.
  var code = this.getFieldValue('CHAR');
  return ["'" + code + "'", Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.text_append = function(){
    
};

Blockly.Arduino.text_join = function(){
    var itemCount = this.itemCount_;
    var code = "";
    if (itemCount > 0){
         code = Blockly.Arduino.valueToCode(this, 'ADD0', Blockly.Arduino.ORDER_ATOMIC);
    }
    for (var i = 1 ; i < itemCount ; ++i){
        var element = Blockly.Arduino.valueToCode(this, 'ADD' + i, Blockly.Arduino.ORDER_ATOMIC);
        code = code + ' + ' + element;
    }
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};
