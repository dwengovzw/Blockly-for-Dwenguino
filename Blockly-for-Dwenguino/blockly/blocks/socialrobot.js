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

var ledmatrixDropdown = [
  ["1", "0"],
  ["2", "1"],
  ["3", "2"],
  ["4", "3"]
];

let eyePatternDropdown = [
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['restPosition']),'0'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['blink1']),'1'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['blink2']),'2'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['blink3']),'3'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['blink4']),'4'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['blink5']),'5'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['right1']),'6'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['right2']),'7'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['left1']),'8'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['left2']),'9'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['up1']),'11'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['up2']),'12'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['up3']),'13'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['down1']),'14'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['down2']),'15'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['down3']),'16'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryLeft1']),'17'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryLeft2']),'18'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryLeft3']),'19'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryLeft4']),'20'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryRight1']),'22'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryRight2']),'23'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryRight3']),'24'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['angryRight4']),'25'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadLeft1']),'27'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadLeft2']),'28'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadLeft3']),'29'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadRight1']),'32'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadRight2']),'33'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['sadRight3']),'34'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['evilLeft1']),'37'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['evilLeft2']),'38'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['evilRight1']),'39'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['evilRight2']),'40'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanHorizontal1']),'41'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanHorizontal2']),'42'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanHorizontal3']),'43'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanHorizontal4']),'44'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical1']),'46'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical2']),'47'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical3']),'48'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical4']),'49'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical5']),'50'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['scanVertical6']),'51'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['rip1']),'52'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['rip2']),'53'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['peering1']),'54'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['peering2']),'55'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['peering3']),'56'],
  [DwenguinoBlocklyLanguageSettings.translateFrom('ledmatrix',['peering4']),'57']
];

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
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['sonarTooltip']),
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['pir_sensor'] = {
  init: function() {
    this.jsonInit(pir_sensor_json);
  }
};

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
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['sound_sensor'] = {
  init: function() {
    this.jsonInit(sound_sensor_json);
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
  "colour": Blockly.Blocks.socialrobot.HUE,
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
  "colour": Blockly.Blocks.socialrobot.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['button'] = {
  init: function() {
    this.jsonInit(button_json);
  }
};

var socialrobot_rgbled_json = {
  "id": "socialrobot_rgbled",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotRgbLedBlock']) + " %1 %2 " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinRed']) +  " %3 " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinGreen']) + " %4 " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinBlue']) + " %5 ",
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
  "message1": DwenguinoBlocklyLanguageSettings.translate(['socialRobotRgbColorBlock']),
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
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotRgbLedOffBlock']) + " " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinRed']) +  " %1 " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinGreen']) + " %2 " + DwenguinoBlocklyLanguageSettings.translate(['socialRobotPinBlue']) + " %3 ",
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
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotRgbColor']),
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
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotRgbColor']),
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

Blockly.Blocks['socialrobot_show_ledmatrix_image'] = {
  init: function () {
      this.setColour(Blockly.Blocks.socialrobot.HUE);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendDummyInput()
            .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixImageBlock']))
            .appendField(new Blockly.FieldDropdown(ledmatrixDropdown), "NUMBERDISPLAY");
      this.appendDummyInput().appendField("    0     1     2     3     4     5     6     7");
      this.appendDummyInput().appendField("0").appendField(new Blockly.FieldCheckbox("FALSE"), "LED00").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED10").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED20").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED30").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED40").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED50").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED60").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED70");
      this.appendDummyInput().appendField("1").appendField(new Blockly.FieldCheckbox("FALSE"), "LED01").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED11").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED21").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED31").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED41").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED51").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED61").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED71");
      this.appendDummyInput().appendField("2").appendField(new Blockly.FieldCheckbox("FALSE"), "LED02").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED12").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED22").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED32").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED42").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED52").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED62").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED72");
      this.appendDummyInput().appendField("3").appendField(new Blockly.FieldCheckbox("FALSE"), "LED03").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED13").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED23").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED33").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED43").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED53").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED63").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED73");
      this.appendDummyInput().appendField("4").appendField(new Blockly.FieldCheckbox("FALSE"), "LED04").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED14").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED24").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED34").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED44").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED54").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED64").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED74");
      this.appendDummyInput().appendField("5").appendField(new Blockly.FieldCheckbox("FALSE"), "LED05").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED15").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED25").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED35").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED45").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED55").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED65").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED75");
      this.appendDummyInput().appendField("6").appendField(new Blockly.FieldCheckbox("FALSE"), "LED06").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED16").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED26").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED36").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED46").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED56").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED66").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED76");
      this.appendDummyInput().appendField("7").appendField(new Blockly.FieldCheckbox("FALSE"), "LED07").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED17").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED27").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED37").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED47").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED57").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED67").appendField(" ").appendField(new Blockly.FieldCheckbox("FALSE"), "LED77");
      this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixImageBlockTooltip']));
  }
};

Blockly.Blocks['socialrobot_show_ledmatrix_eye_pattern'] = {
  init: function() {
    this.setColour(Blockly.Blocks.socialrobot.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixEyePatternBlock']))
        .appendField(new Blockly.FieldDropdown(eyePatternDropdown), "EYEPATTERN");
    this.appendDummyInput()
          .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixEyePatternSegmentBlock']))
          .appendField(new Blockly.FieldDropdown(ledmatrixDropdown), "NUMBERDISPLAY");
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixEyePatternBlockTooltip']));
  }
}

Blockly.Blocks['socialrobot_clear_ledmatrix_segment'] = {
  init: function() {
    this.setColour(Blockly.Blocks.socialrobot.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
          .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixClearSegmentBlock']))
          .appendField(new Blockly.FieldDropdown(ledmatrixDropdown), "NUMBERDISPLAY");
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixClearSegmentBlockTooltip']));
  }
}

Blockly.Blocks['socialrobot_clear_ledmatrix'] = {
  init: function() {
    this.setColour(Blockly.Blocks.socialrobot.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
          .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixClearDisplayBlock']))
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixClearDisplayBlockTooltip']));
  }
}

// Blockly.Blocks['socialrobot_play_animation'] = {
//   init: function() {
//     this.setColour(Blockly.Blocks.socialrobot.HUE);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.appendDummyInput()
//           .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixDisplayAnimationBlock)
//           .appendField(new Blockly.FieldDropdown(animationDropdown), "ANIMATION");
//     this.appendDummyInput()
//           .appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixLeftSegmentBlock)
//           .appendField(new Blockly.FieldDropdown(ledmatrixDropdown), "NUMBERDISPLAY");
//     this.appendDummyInput().appendField(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixRightSegmentBlock)
//           .appendField(new Blockly.FieldDropdown(ledmatrixDropdown), "NUMBERDISPLAY");

//     this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['socialRobotLedmatrixClearDisplayBlockTooltip);
//   }
// }

var socialrobot_servo_json = {
  "id": "socialrobot_servo",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialrobotServoBlock']),
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
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotArmsDownBlock']),
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
  "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotArmsUpBlock']),
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
    "message0": DwenguinoBlocklyLanguageSettings.translate(['socialrobotWaveArmesBlock']),
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
    "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotEyesLeftBlock']),
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
    "message0": DwenguinoBlocklyLanguageSettings.translate(['socialRobotEyesRightBlock']),
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
    "message0": DwenguinoBlocklyLanguageSettings.translate(['socialrobotSetPinState']),
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
    "colour": Blockly.Blocks.socialrobot.HUE,
    "tooltip": "Read pin",
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['socialrobot_read_pin'] = {
    init: function(){
        this.jsonInit(socialrobot_read_pin_json);
    }
};
