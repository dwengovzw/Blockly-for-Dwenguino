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
 
 var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";
 
 Blockly.Blocks.input.HUE = 25;

  // Sonar sensor

  let sonar_select_options = [
        [MSG.inputSonarDropdownBlock + " 1", "SONAR1"],
        [MSG.inputSonarDropdownBlock + " 2", "SONAR2"]
  ];

  var input_sonar_sensor_select_json = {
    "id": "input_sonar_sensor_select",
    "message0": MSG.inputSonarSensorSelectBlock,
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": "DwenguinoIDE/img/sonar.png",
        "width": 150,
        "height": 87,
        "alt": "*"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "number",
        "options": sonar_select_options
      }
    ],
    "output": "Number",
    "colour": Blockly.Blocks.input.HUE,
    "tooltip": MSG.sonarTooltip,
    "helpUrl": DwenguinoHelpUrl
  };
  
  Blockly.Blocks['input_sonar_sensor_select'] = {
    init: function() {
      this.jsonInit(input_sonar_sensor_select_json);
    }
  };

  var input_sonar_sensor_json = {
    "id": "input_sonar_sensor",
    "message0": MSG.dwenguinoSonarBlock,
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": "DwenguinoIDE/img/sonar.png",
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
      },
      {
        "type": "input_value",
        "name": "echo",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": Blockly.Blocks.input.HUE,
    "tooltip": MSG.sonarTooltip,
    "helpUrl": DwenguinoHelpUrl
  };
  
  Blockly.Blocks['input_sonar_sensor'] = {
    init: function() {
      this.jsonInit(input_sonar_sensor_json);
    }
  };
  
  // Sound sensor
  let sound_select_options = [
    [MSG.inputSoundDropdownBlock + " 1", "SOUND1"]
  ];

  var input_sound_sensor_select_json = {
  "id": "input_sound_sensor_select",
  "message0": MSG.inputSoundSensorSelectBlock,
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
      "type": "field_dropdown",
      "name": "number",
      "options": sound_select_options
    }
  ],
  "output": "Number",
  "colour": Blockly.Blocks.input.HUE,
  "tooltip": MSG.socialRobotSoundSensorBlockTooltip,
  "helpUrl": DwenguinoHelpUrl
  };

  Blockly.Blocks['input_sound_sensor_select'] = {
    init: function() {
      this.jsonInit(input_sound_sensor_select_json);
    }
  };


 var input_sound_sensor_json = {
    "id": "input_sound_sensor",
    "message0": MSG.inputSoundSensorBlock,
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
  
  Blockly.Blocks['input_sound_sensor'] = {
    init: function() {
      this.jsonInit(input_sound_sensor_json);
    }
  };

 var input_pir_sensor_json = {
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
 
 Blockly.Blocks['input_pir_sensor'] = {
   init: function() {
     this.jsonInit(input_pir_sensor_json);
   }
 };
 
 var input_touch_sensor_json = {
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
 
 Blockly.Blocks['input_touch_sensor'] = {
   init: function() {
     this.jsonInit(input_touch_sensor_json);
   }
 };
 
 var input_button_json = {
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
 
 Blockly.Blocks['input_button'] = {
   init: function() {
     this.jsonInit(input_button_json);
   }
 };
 
   var input_read_pin_json = {
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
 
 Blockly.Blocks['input_read_pin'] = {
     init: function(){
         this.jsonInit(input_read_pin_json);
     }
 };
 