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
 * @fileoverview Dwenguino social robot blocks for Blockly.
 * @author zimcke.vandestaey@ugent.be
 */
'use strict';

goog.provide('Blockly.Blocks.socialrobot');

goog.require('Blockly.Blocks');
goog.require('Blockly.Arduino');


var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";

Blockly.Blocks.socialrobot.HUE = 25;

var pir_sensor_json = {
  "id": "pir_sensor",
  "message0": MSG.socialRobotPirBlock,
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
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": MSG.sonarTooltip,
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['pir_sensor'] = {
  init: function() {
    this.jsonInit(pir_sensor_json);
  }
};

var sound_sensor_json = {
  "id": "sound_sensor",
  "message0": MSG.socialRobotSoundSensorBlock,
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
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['sound_sensor'] = {
  init: function() {
    this.jsonInit(sound_sensor_json);
  }
};

var socialrobot_rgbled_json = {
  "id": "socialrobot_rgbled",
  "message0": MSG.socialRobotRgbLedBlock + " %1 %2 " + MSG.socialRobotPinRed +  " %3 " + MSG.socialRobotPinGreen + " %4 " + MSG.socialRobotPinBlue + " %5 ",
  "args0": [
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/socialrobot/rgb_led.svg",
      "width": 30,
      "height": 30,
      "alt":  "rgbled"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "pin_red",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "pin_green",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "pin_blue",
      "check": "Number"
    }
  ],
  "message1": MSG.socialRobotRgbColorBlock + " %1",
  "args1":[
    {
      "type": "input_value",
      "name": "color",
      "check": "Color"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
  
};

Blockly.Blocks['socialrobot_rgbled'] = {
  init: function() {
    this.jsonInit(socialrobot_rgbled_json);
  }
};

var socialrobot_rgbled_off_json = {
  "id": "socialrobot_rgbled_off",
  "message0": MSG.socialRobotRgbLedOffBlock + " " + MSG.socialRobotPinRed +  " %1 " + MSG.socialRobotPinGreen + " %2 " + MSG.socialRobotPinBlue + " %3 ",
  "args0": [
    {
      "type": "input_value",
      "name": "pin_red",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "pin_green",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "pin_blue",
      "check": "Number"
    }
  ],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
  
};

Blockly.Blocks['socialrobot_rgbled_off'] = {
  init: function() {
    this.jsonInit(socialrobot_rgbled_off_json);
  }
};

var socialrobot_rgb_color_json = {
  "id": "socialrobot_rgb_color",
  "message0": MSG.socialRobotRgbColorBlock + " %1 %2 %3",
  "type": "rgb_color",
  "args0": [
    {
      "type": "field_number",
      "name": "RED",
      "value": 133,
      "min": 0,
      "max": 255,
      "precision": 0
    },
    {
      "type": "field_number",
      "name": "GREEN",
      "value": 196,
      "min": 0,
      "max": 255,
      "precision": 0
    },
    {
      "type": "field_number",
      "name": "BLUE",
      "value": 65,
      "min": 0,
      "max": 255,
      "precision": 0
    }
  ],
  "output": "Color",
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_rgb_color'] = {
  init: function() {
    this.jsonInit(socialrobot_rgb_color_json);
  }
};

var socialrobot_rgb_color_with_numbers_json = {
  "id": "socialrobot_rgb_color",
  "message0": MSG.socialRobotRgbColorBlock + " %1 %2 %3",
  "type": "rgb_color",
  "args0": [
    {
      "type": "input_value",
      "name": "RED",
      "value": 100,
      "min": 0,
      "max": 255,
      "precision": 0
      
    },
    {
      "type": "input_value",
      "name": "GREEN",
      "value": 100,
      "min": 0,
      "max": 255,
      "precision": 0
    },
    {
      "type": "input_value",
      "name": "BLUE",
      "value": 100,
      "min": 0,
      "max": 255,
      "precision": 0
    }
  ],
  "inputsInline": true,
  "output": "Color",
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_rgb_color_with_numbers'] = {
  init: function() {
    this.jsonInit(socialrobot_rgb_color_with_numbers_json);
  }
};

var socialrobot_servo_json = {
  "id": "socialrobot_servo",
  "message0": MSG.socialrobotServoBlock,
  "args0": [
    { "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/servo.png",
      "width": 100,
      "height": 100,
      "alt": "*"
    },
    { "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "pin",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "angle",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "Put arms down",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_servo'] = {
  init: function() {
    this.jsonInit(socialrobot_servo_json);
  }
};

var socialrobot_arms_down_json = {
  "id": "socialrobot_arms_down",
  "message0": MSG.socialRobotArmsDownBlock,
  "args0": [
  {
      "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": "DwenguinoIDE/img/socialrobot/arms_down.png",
        "width": 177,
        "height": 147,
        "alt": "*"
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
  "tooltip": "Put arms down",
  "helpUrl": "http://www.dwengo.org/tutorials"
};


Blockly.Blocks['socialrobot_arms_down'] = {
  init: function() {
    this.jsonInit(socialrobot_arms_down_json);
  }
};

var socialrobot_arms_up_json = {
  "id": "socialrobot_arms_up",
  "message0": MSG.socialRobotArmsUpBlock,
  "args0": [
  {
      "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": "DwenguinoIDE/img/socialrobot/arms_up.png",
        "width": 177,
        "height": 147,
        "alt": "*"
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
      "name": "servo_right_hand2",
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
      "name": "servo_left_hand2",
      "check": "Number",
      "align": "RIGHT"
      }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "Put arms up",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_arms_up'] = {
  init: function() {
    this.jsonInit(socialrobot_arms_up_json);
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

  var socialrobot_eyes_left_json = {
    "id": "socialrobot_eyes_left",
    "message0": MSG.socialRobotEyesLeftBlock,
    "args0": [
    {
        "type": "input_dummy"
        },
        {
          "type": "field_image",
          "src": "DwenguinoIDE/img/socialrobot/turn_eyes_left.png",
          "width": 150,
          "height": 65,
          "alt": "*"
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
        "name": "servo_right_eye",
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
        "name": "servo_left_eye",
        "check": "Number",
        "align": "RIGHT"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Turn eyes left",
    "helpUrl": "http://www.dwengo.org/tutorials"
  };
  
  Blockly.Blocks['socialrobot_eyes_left'] = {
    init: function() {
      this.jsonInit(socialrobot_eyes_left_json);
    }
  };

  var socialrobot_eyes_right_json = {
    "id": "socialrobot_eyes_right",
    "message0": MSG.socialRobotEyesRightBlock,
    "args0": [
    {
        "type": "input_dummy"
        },
        {
          "type": "field_image",
          "src": "DwenguinoIDE/img/socialrobot/turn_eyes_right.png",
          "width": 150,
          "height": 65,
          "alt": "*"
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
        "name": "servo_right_eye1",
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
        "name": "servo_left_eye1",
        "check": "Number",
        "align": "RIGHT"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Turn eyes right",
    "helpUrl": "http://www.dwengo.org/tutorials"
  };
  
  Blockly.Blocks['socialrobot_eyes_right'] = {
    init: function() {
      this.jsonInit(socialrobot_eyes_right_json);
    }
  };

  var socialrobot_set_pin = {
    "id": "socialrobot_set_pin",
    "message0": MSG.socialrobotSetPinState,
    "args0": [
      {
        "type": "input_value",
        "name": "PIN",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "PIN_STATE",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Set pin",
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_set_pin'] = {
    init: function(){
        this.jsonInit(socialrobot_set_pin);
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
