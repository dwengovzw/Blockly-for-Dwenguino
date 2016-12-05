/**
 * @license
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
 * @fileoverview Dwenguino blocks for Blockly.
 * @author Tom.Neutens@UGent.be
 */
'use strict';

goog.provide('Blockly.Blocks.arduino');

goog.require('Blockly.Blocks');

var ArduinoHelpUrl = "http://www.arduino.cc";

Blockly.Blocks.arduino.HUE = 100;

var setup_loop_arduino_json = {
  "type": "setup_loop_structure_arduino",
  "message0":  MSG.setup + " %1 %2 " + MSG.loop +  "%3 %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "SETUP"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_statement",
      "name": "LOOP"
    }
  ],
  "colour": Blockly.Blocks.arduino.HUE,
  "tooltip": MSG.dwenguino_main_program_structure,
  "helpUrl": ArduinoHelpUrl,
  "data": "testdatastring"
};

Blockly.Blocks['setup_loop_structure_arduino'] = {
    init: function(){
        this.jsonInit(setup_loop_arduino_json);
    }
};
