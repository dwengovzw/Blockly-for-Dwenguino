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

goog.provide('Blockly.Blocks.socialrobot');

goog.require('Blockly.Blocks');
goog.require('Blockly.Arduino');


var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";

Blockly.Blocks.socialrobot.HUE = 200;

var socialrobot_arms_down_json = {
  "id": "socialrobot_arms_down",
  "message0": MSG.socialRobotArmsDownBlock,
  "args0": [
  {
      "type": "input_dummy"
      },
      {
      "type": "input_dummy"
      },
      {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": ""
      },
      {
      "type": "input_value",
      "name": "servo_right_hand1",
      "check": "Number",
      "align": "RIGHT"
      },
      {
      "type": "field_label_serializable",
      "name": "NAME",
      "text": ""
      },
      {
      "type": "input_value",
      "name": "servo_left_hand1",
      "check": "Number",
      "align": "RIGHT"
      }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "Wave arms",
  "helpUrl": "http://www.dwengo.org/tutorials"
};


Blockly.Blocks['socialrobot_arms_down'] = {
  init: function() {
    this.jsonInit(socialrobot_arms_down_json);
  }
};

var socialrobot_wave_arms_json = {
    "id": "socialrobot_wave_arms",
    "message0": MSG.socialrobotWaveArmesBlock,
    "args0": [
    {
        "type": "input_dummy"
        },
        {
        "type": "input_dummy"
        },
        {
        "type": "field_label_serializable",
        "name": "NAME",
        "text": ""
        },
        {
        "type": "input_value",
        "name": "servo_right_hand",
        "check": "Number",
        "align": "RIGHT"
        },
        {
        "type": "field_label_serializable",
        "name": "NAME",
        "text": ""
        },
        {
        "type": "input_value",
        "name": "servo_left_hand",
        "check": "Number",
        "align": "RIGHT"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Wave arms",
    "helpUrl": "http://www.dwengo.org/tutorials"
  };
  
  
  Blockly.Blocks['socialrobot_wave_arms'] = {
    init: function() {
      this.jsonInit(socialrobot_wave_arms_json);
    }
  };


  var socialrobot_read_pin_json = {
    "id": "socialrobot_read_pin",
    "message0": MSG.socialrobotReadPinBlock,
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
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Read pin",
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_read_pin'] = {
    init: function(){
        this.jsonInit(socialrobot_read_pin_json);
    }
};
