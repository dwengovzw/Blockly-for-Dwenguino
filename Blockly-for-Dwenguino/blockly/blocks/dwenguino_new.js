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

goog.provide('Blockly.Blocks.dwenguino');

goog.require('Blockly.Blocks');


var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";

Blockly.Blocks.dwenguino.HUE = 315;

var setup_loop_json = {
  "type": "setup_loop_structure",
  "message0":  DwenguinoBlocklyLanguageSettings.translate(['setup']) + " %1 %2 " + DwenguinoBlocklyLanguageSettings.translate(['loop']) +  "%3 %4",
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
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguino_main_program_structure']),
  "helpUrl": DwenguinoHelpUrl,
  "data": "testdatastring"
};

Blockly.Blocks['setup_loop_structure'] = {
    init: function(){
        this.jsonInit(setup_loop_json);
    }
};


Blockly.Blocks['dwenguino_delay'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendValueInput("DELAY_TIME", 'Number')
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['delay']))
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['miliseconds']));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['delay_help']));
  }
};

var dwenguino_wait_for_switch = {
    "id": "dwenguino_wait_for_switch",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['waitForSwitch']),
    "args0": [
        {
            "type": "field_dropdown",
            "name": "SWITCH",
            "check": "Number",
            "options": [[DwenguinoBlocklyLanguageSettings.translate(['north']), "SW_N"], [DwenguinoBlocklyLanguageSettings.translate(['east']), "SW_E"], [DwenguinoBlocklyLanguageSettings.translate(['south']), "SW_S"], [DwenguinoBlocklyLanguageSettings.translate(['west']), "SW_W"], [DwenguinoBlocklyLanguageSettings.translate(['center']), "SW_C"]]

        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['digitalReadSwitchTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_wait_for_switch'] = {
    init: function(){
        this.jsonInit(dwenguino_wait_for_switch);
    }
};

var clear_lcd_json = {
  "id": "clear_lcd",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['clearLCD']),
  "args0": [],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['clear_lcd'] = {
  init: function() {
    this.jsonInit(clear_lcd_json);
  }
};

var dwenguino_lcd_json = {
  "id": "dwenguino_lcd",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoLCD']),
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath +  "DwenguinoIDE/img/dwenguino light.jpg",
      "width": 150,
      "height": 63,
      "alt": "*"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "text",
      "check": "String"
    },
    {
      "type": "input_value",
      "name": "line_number",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "character_number",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['dwenguino_lcd'] = {
  init: function() {
    this.jsonInit(dwenguino_lcd_json);
  }
};

Blockly.Blocks['dwenguino_pins'] = {
  helpUrl: 'DwenguinoHelpUrl',
  init: function() {
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendDummyInput()
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['pin']))
        .appendField(new Blockly.FieldDropdown(profile.dwenguino.digital), 'PIN')
    this.setOutput(true, 'Number');
    this.setTooltip('');
  }
};


Blockly.Blocks['dwenguino_tone_on_pin'] = {
  helpUrl: 'DwenguinoHelpUrl',
  init: function() {
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendValueInput("PIN", "Pin")
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['toneOnPin']))
        .setCheck("Number");
    this.appendValueInput("NUM", "Number")
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['frequency']))
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['toneOnPinTooltip']));
  }
};

Blockly.Blocks['dwenguino_no_tone_on_pin'] = {
  init: function() {
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendValueInput("PIN", "Pin")
        .appendField(DwenguinoBlocklyLanguageSettings.translate(['noToneOnPin']))
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['noToneOnPinTooltip']));
  }
};

var char_type_json = {
    "id": "char_type",
    "message0": "%1",
    "args0": [
        {
            "type": "field_input",
            "name": "BITMASK",
            "text": "0b10101010"
        }
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": Blockly.Msg.MATH_HUE,
    "tooltip": "",
    "helpUrl": DwenguinoHelpUrl
};
Blockly.Blocks['char_type'] = {
    init: function () {
        this.jsonInit(char_type_json);
    }
};


var sonar_sensor_json = {
  "id": "sonar_sensor",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoSonarBlock']),
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath + "DwenguinoIDE/img/sonar.png",
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
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['sonarTooltip']),
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['sonar_sensor'] = {
  init: function() {
    this.jsonInit(sonar_sensor_json);
  }
};


Blockly.Blocks['dwenguino_digital_read'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendValueInput('PIN', 'PIN')
            .appendField(DwenguinoBlocklyLanguageSettings.translate(['digitalRead']))
            .setCheck("Number");
    this.setOutput(true, 'Number');
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['digitalReadTooltip']));
  }
};

var dwenguino_digital_read_switch = {
    "id": "dwenguino_digital_read_switch",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['digitalReadSwitch']),
    "args0": [
        {
            "type": "field_dropdown",
            "name": "SWITCH",
            "check": "Number",
            "options": [[DwenguinoBlocklyLanguageSettings.translate(['north']), "SW_N"], [DwenguinoBlocklyLanguageSettings.translate(['east']), "SW_E"], [DwenguinoBlocklyLanguageSettings.translate(['south']), "SW_S"], [DwenguinoBlocklyLanguageSettings.translate(['west']), "SW_W"], [DwenguinoBlocklyLanguageSettings.translate(['center']), "SW_C"]]

        }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['digitalReadSwitchTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_digital_read_switch'] = {
    init: function(){
        this.jsonInit(dwenguino_digital_read_switch);
    }
};


Blockly.Blocks['dwenguino_digital_write'] = {
    init: function(){
        this.setHelpUrl(DwenguinoHelpUrl);
        this.setColour(Blockly.Msg.DWENGUINO_HUE);
        this.appendValueInput('PIN', 'PIN')
            .appendField(DwenguinoBlocklyLanguageSettings.translate(['digitalWriteToPin']))
            .setCheck("Number");
        this.appendValueInput("NUM", "Number")
            .appendField(DwenguinoBlocklyLanguageSettings.translate(['digitalWriteValue']))
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['digitalWriteTooltip']));
    }
};

Blockly.Blocks['dwenguino_highlow'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[DwenguinoBlocklyLanguageSettings.translate(['high']), "HIGH"], [DwenguinoBlocklyLanguageSettings.translate(['low']), "LOW"]]), 'BOOL')
    this.setOutput(true, 'Number');
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['highLowTooltip']));
  }
};

Blockly.Blocks['dwenguino_pressed'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[DwenguinoBlocklyLanguageSettings.translate(['pressed']), "PRESSED"], [DwenguinoBlocklyLanguageSettings.translate(['notPressed']), "NOT_PRESSED"]]), 'BOOL')
    this.setOutput(true, 'Number');
    this.setTooltip(DwenguinoBlocklyLanguageSettings.translate(['pressedTooltip']));
  }
};

var dc_motor_json = {
  "id": "dc_motor",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoDCMotorBlock']),
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath + "DwenguinoIDE/img/dc.png",
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
      "name": "speed",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoDCMotorBlockTooltip']),
  "helpUrl": "http://www.dwengo.org/tutorials"
};

var dwenguino_servo_json = {
  "id": "dwenguino_servo",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoServoBlock']),
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath + "DwenguinoIDE/img/socialrobot/servo_new_centered.png",
      "width": 100,
      "height": 100,
      "alt": "*"
    },
    {
      "type": "input_dummy"
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
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoServoBlockTooltip']),
  "helpUrl": "http://www.dwengo.org/tutorials"
};


Blockly.Blocks['dwenguino_servo'] = {
  init: function() {
    this.jsonInit(dwenguino_servo_json);
  }
};


var dwenguino_continuous_servo_json = {
  "id": "continuous_dwenguino_servo",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoContinuousServoBlock']),
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath + "DwenguinoIDE/img/socialrobot/continuous_servo_new_centered.png", // TODO: change this to gray servo image!
      "width": 100,
      "height": 100,
      "alt": "*"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "pin",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "speed",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoContinuousServoBlockTooltip']),
  "helpUrl": "http://www.dwengo.org/tutorials"
};


Blockly.Blocks['dwenguino_continuous_servo'] = {
  init: function() {
    this.jsonInit(dwenguino_continuous_servo_json);
  }
};


var dwenguino_servo_dropdown = {
  "id": "dwenguino_servo_dropdown",
  "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoServoDropdownBlock']),
  "args0": [
    {
      "type": "field_dropdown",
      "name": "SERVO_DROPDOWN",
      "check": "Number",
      "options": [['1', 'SERVO1'], ['2', 'SERVO2']]
    }
  ],
  "output": "Number",
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoServoDropdownTooltip']),
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_servo_dropdown'] = {
  init: function(){
      this.jsonInit(dwenguino_servo_dropdown);
  }
};


Blockly.Blocks['dc_motor'] = {
  init: function() {
    this.jsonInit(dc_motor_json);
  }
};

var dwenguino_set_led = {
    "id": "dwenguin_set_led",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['setLedState']),
    "args0": [
      {
        "type": "input_value",
        "name": "LED",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "LED_STATE",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['setLedStateTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_set_led'] = {
    init: function(){
        this.jsonInit(dwenguino_set_led);
    }
};

var dwenguino_led_pins = {
    "id": "dwenguino_led_pins",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoLedBlock']) + " %1 ",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "LED_NUMBER",
        "options": profile.dwenguino.leds
      }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['ledPinsTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_led_pins'] = {
    init: function(){
        this.jsonInit(dwenguino_led_pins);
    }
};

var dwenguino_on_off = {
    "id": "dwenguino_on_off",
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "LED_ON_OFF",
        "check": "Number",
        "options": [[DwenguinoBlocklyLanguageSettings.translate(['dwenguinoOn']), 'ON'], [DwenguinoBlocklyLanguageSettings.translate(['dwenguinoOff']), 'OFF']]
      }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoOnOffTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_on_off'] = {
    init: function(){
        this.jsonInit(dwenguino_on_off);
    }
};

var dwenguino_analog_write = {
    "id": "dwenguino_analog_wirte",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoAnalogWrite']),
    "args0":[
        {
            "type": "input_value",
            "name": "PIN",
            "check": "Number"
        },
        {
            "type": "input_value",
            "name": "VAL",
            "check": "Number"
        }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoAnalogWriteTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_analog_write'] = {
    init: function(){
        this.jsonInit(dwenguino_analog_write);
    }
};

var dwenguino_analog_read = {
    "id": "dwenguino_analog_read",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoAnalogRead']),
    "args0": [
        {
            "type": "input_value",
            "name": "PIN",
            "check": "Number"
        }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoAnalogWriteTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};
Blockly.Blocks['dwenguino_analog_read'] = {
    init: function(){
        this.jsonInit(dwenguino_analog_read);
    }
};

var dwenguino_leds_reg = {
    "id": "dwenguino_leds_reg",
    "message0": DwenguinoBlocklyLanguageSettings.translate(['ledsReg']) + " %1",
    "args0":[
        {
            "type": "input_value",
            "name": "MASK",
            "check": "Number"
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": DwenguinoBlocklyLanguageSettings.translate(['dwenguinoLedsRegTooltip']),
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_leds_reg'] = {
    init: function(){
        this.jsonInit(dwenguino_leds_reg);
    }
};


