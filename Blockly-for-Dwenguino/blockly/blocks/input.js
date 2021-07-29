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
 * @fileoverview Dwenguino input blocks for Blockly.
 * @author zimcke.vandestaey@ugent.be
 */
 'use strict';

 goog.provide('Blockly.Blocks.input');
 
 goog.require('Blockly.Blocks');
 goog.require('Blockly.Arduino');
 
 
 var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";
 
 Blockly.Blocks.input.HUE = 25;
 
 var sound_sensor_json = {
    "id": "sound_sensor",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotSoundSensorBlock']),
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": "DwenguinoIDE/img/socialrobot/sound_sensor.png",
        "width": 80,
        "height": 34,
        "alt": "*"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "pin",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": Blockly.Blocks.input.HUE,
    "tooltip": "",
    "helpUrl": DwenguinoHelpUrl
  };
  
  Blockly.Blocks['sound_sensor'] = {
    init: function() {
      this.jsonInit(sound_sensor_json);
    }
  };

 var pir_sensor_json = {
   "id": "pir_sensor",
   "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotPirBlock']),
   "args0": [
     {
       "type": "input_dummy"
     },
     {
       "type": "field_image",
       "src": "DwenguinoIDE/img/pir.png",
       "width": 150,
       "height": 87,
       "alt": "*"
     },
     {
       "type": "input_dummy"
     },
     {
       "type": "input_value",
       "name": "trig",
       "check": "Number"
     }
   ],
   "output": "Number",
   "colour": Blockly.Blocks.input.HUE,
   "tooltip": DwenguinoBlocklyLanguageSettings.translate(['sonarTooltip']),
   "helpUrl": DwenguinoHelpUrl
 };
 
 Blockly.Blocks['pir_sensor'] = {
   init: function() {
     this.jsonInit(pir_sensor_json);
   }
 };
 
 var touch_sensor_json = {
   "id": "touch_sensor",
   "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotTouchSensorBlock']),
   "args0": [
     {
       "type": "input_dummy"
     },
     {
       "type": "field_image",
       "src": "DwenguinoIDE/img/socialrobot/touch_sensor.png",
       "width": 50,
       "height": 50,
       "alt": "*"
     },
     {
       "type": "input_dummy"
     },
     {
       "type": "input_value",
       "name": "pin",
       "check": "Number"
     }
   ],
   "output": "Number",
   "colour": Blockly.Blocks.input.HUE,
   "tooltip": "",
   "helpUrl": DwenguinoHelpUrl
 };
 
 Blockly.Blocks['touch_sensor'] = {
   init: function() {
     this.jsonInit(touch_sensor_json);
   }
 };
 
 var button_json = {
   "id": "button_on",
   "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotButtonBlock']),
   "args0": [
     {
       "type": "input_dummy"
     },
     {
       "type": "field_image",
       "src": "DwenguinoIDE/img/socialrobot/button.svg",
       "width": 50,
       "height": 50,
       "alt": "*"
     },
     {
       "type": "input_dummy"
     },
     {
       "type": "input_value",
       "name": "pin",
       "check": "Number"
     }
   ],
   "output": "Number",
   "colour": Blockly.Blocks.input.HUE,
   "tooltip": "",
   "helpUrl": DwenguinoHelpUrl
 };
 
 Blockly.Blocks['button'] = {
   init: function() {
     this.jsonInit(button_json);
   }
 };
 
   var socialrobot_read_pin_json = {
     "id": "socialrobot_read_pin",
     "message0": DwenguinoBlocklyLanguageSettings.translate(['socialrobotReadPinBlock']),
     "args0": [
         {
         "type": "input_dummy"
         },
         {
             "type": "input_value",
             "name": "PIN",
             "check": "Number"
         }
     ],
     "output": "Number",
     "colour": Blockly.Blocks.input.HUE,
     "tooltip": "Read pin",
     "helpUrl": "http://www.dwengo.org/tutorials"
 };
 
 Blockly.Blocks['socialrobot_read_pin'] = {
     init: function(){
         this.jsonInit(socialrobot_read_pin_json);
     }
 };
 