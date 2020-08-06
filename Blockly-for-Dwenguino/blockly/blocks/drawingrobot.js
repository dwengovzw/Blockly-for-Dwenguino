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

goog.provide('Blockly.Blocks.drawingrobot');

goog.require('Blockly.Blocks');
goog.require('Blockly.Arduino');


var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";

Blockly.Blocks.drawingrobot.HUE = 330;

var drawingrobot_stepper_motor_json = {
  "id": "drawingrobot_stepper_motor",
  "message0": MSG.dwenguinoStepperMotorBlock,
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/dc.png",
      "width": 150,
      "height": 90,
      "alt": "Image Dc motor"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "channel",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "step",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_stepper_motor'] = {
  init: function() {
    this.jsonInit(drawingrobot_stepper_motor_json);
  }
};

var drawingrobot_move_json = {
  "id": "drawingrobot_move",
  "message0": MSG.drawingrobotMove,
  "args0": [
    {
      "type": "field_dropdown",
      "name": "direction",
      "options": [
        [MSG.up, "0"], 
        [MSG.down, "1"], 
        [MSG.left, "2"], 
        [MSG.right, "3"]
      ]

  },
    {
      "type": "input_value",
      "name": "amount",
      "check": "Number"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_move'] = {
  init: function() {
    this.jsonInit(drawingrobot_move_json);
  }
};


var drawingrobot_move_direction_json = {
  "id": "drawingrobot_move_direction",
  "message0": MSG.drawingrobotMove,
  "args0": [
    {
      "type": "input_value",
      "name": "angle",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "amount",
      "check": "Number"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_move_direction'] = {
  init: function() {
    this.jsonInit(drawingrobot_move_direction_json);
  }
};

var drawingrobot_move_direction_x_y_json = {
  "id": "drawingrobot_move_direction_x_y",
  "message0": MSG.drawingrobotMoveXY,
  "args0": [
    {
      "type": "input_value",
      "name": "xValue",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "yValue",
      "check": "Number"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_move_direction_x_y'] = {
  init: function() {
    this.jsonInit(drawingrobot_move_direction_x_y_json);
  }
};


var drawingrobot_line_json = {
  "id": "drawingrobot_line",
  "message0": MSG.drawingrobotLine,
  "args0": [
    {
      "type": "input_value",
      "name": "x",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "y",
      "check": "Number"
    },
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_line'] = {
  init: function() {
    this.jsonInit(drawingrobot_line_json);
  }
};

var drawingrobot_circle_json = {
  "id": "drawingrobot_circle",
  "message0": MSG.drawingrobotCircle,
  "args0": [
    {
      "type": "input_value",
      "name": "radius",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_circle'] = {
  init: function() {
    this.jsonInit(drawingrobot_circle_json);
  }
};

var drawingrobot_rectangle_json = {
  "id": "drawingrobot_rectangle",
  "message0": MSG.drawingrobotRectangle,
  "args0": [
    {
      "type": "input_value",
      "name": "width",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "height",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_rectangle'] = {
  init: function() {
    this.jsonInit(drawingrobot_rectangle_json);
  }
};

var drawingrobot_lift_stylus_json = {
  "id": "drawingrobot_lift_stylus",
  "message0": MSG.drawingrobotLiftStylus,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_lift_stylus'] = {
  init: function() {
    this.jsonInit(drawingrobot_lift_stylus_json);
  }
};

var drawingrobot_lower_stylus_json = {
  "id": "drawingrobot_lower_stylus",
  "message0": MSG.drawingrobotLowerStylus,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_lower_stylus'] = {
  init: function() {
    this.jsonInit(drawingrobot_lower_stylus_json);
  }
};


var drawingrobot_color_json = {
    "id": "drawingrobot_color",
    "message0": MSG.drawingrobotChangeColor,
    "args0": [
      {
        "type": "field_colour",
        "name": "col",
        "color": "#ff0000"
      }
    ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DRAWINGROBOT_HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['drawingrobot_color'] = {
  init: function() {
    this.jsonInit(drawingrobot_color_json);
  }
};

Blockly.Blocks['drawingrobot_motor_number'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DRAWINGROBOT_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[MSG.stepperMotorOne, "33"], [MSG.stepperMotorTwo, "34"]]), 'NUMBER')
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.stepperMotorTooltip);
  }
};