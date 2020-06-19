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
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": MSG.dwenguino_main_program_structure,
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
        .appendField(MSG.delay)
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(MSG.miliseconds);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(MSG.delay_help);
  }
};

var dwenguino_wait_for_switch = {
    "id": "dwenguino_wait_for_switch",
    "message0": MSG.waitForSwitch,
    "args0": [
        {
            "type": "field_dropdown",
            "name": "SWITCH",
            "check": "Number",
            "options": [[MSG.north, "SW_N"], [MSG.east, "SW_E"], [MSG.south, "SW_S"], [MSG.west, "SW_W"], [MSG.center, "SW_C"]]

        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": MSG.digitalReadSwitchTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_wait_for_switch'] = {
    init: function(){
        this.jsonInit(dwenguino_wait_for_switch);
    }
};

var clear_lcd_json = {
  "id": "clear_lcd",
  "message0": MSG.clearLCD,
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
  "message0": MSG.dwenguinoLCD,
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/dwenguino light.jpg",
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
        .appendField(MSG.pin)
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
        .appendField(MSG.toneOnPin)
        .setCheck("Number");
    this.appendValueInput("NUM", "Number")
        .appendField(MSG.frequency)
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(MSG.toneOnPinTooltip);
  }
};

Blockly.Blocks['dwenguino_no_tone_on_pin'] = {
  init: function() {
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendValueInput("PIN", "Pin")
        .appendField(MSG.noToneOnPin)
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(MSG.noToneOnPinTooltip);
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
  "message0": "sonar %1 %2 %3" + MSG.trig + "%4" + MSG.echo + "%5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/sonartje.png",
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
  "tooltip": MSG.sonarTooltip,
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
            .appendField(MSG.digitalRead)
            .setCheck("Number");
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.digitalReadTooltip);
  }
};

var dwenguino_digital_read_switch = {
    "id": "dwenguino_digital_read_switch",
    "message0": MSG.digitalReadSwitch,
    "args0": [
        {
            "type": "field_dropdown",
            "name": "SWITCH",
            "check": "Number",
            "options": [[MSG.north, "SW_N"], [MSG.east, "SW_E"], [MSG.south, "SW_S"], [MSG.west, "SW_W"], [MSG.center, "SW_C"]]

        }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": MSG.digitalReadSwitchTooltip,
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
            .appendField(MSG.digitalWriteToPin)
            .setCheck("Number");
        this.appendValueInput("NUM", "Number")
            .appendField(MSG.digitalWriteValue)
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(MSG.digitalWriteTooltip);
    }
};

Blockly.Blocks['dwenguino_highlow'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[MSG.high, "HIGH"], [MSG.low, "LOW"]]), 'BOOL')
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.highLowTooltip);
  }
};

Blockly.Blocks['dwenguino_pressed'] = {
  init: function() {
    this.setHelpUrl(DwenguinoHelpUrl);
    this.setColour(Blockly.Msg.DWENGUINO_HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[MSG.pressed, "PRESSED"], [MSG.notPressed, "NOT_PRESSED"]]), 'BOOL')
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.pressedTooltip);
  }
};

var dc_motor_json = {
  "id": "dc_motor",
  "message0": MSG.dwenguinoDCMotorBlock,
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
      "name": "speed",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": MSG.dwenguinoDCMotorBlockTooltip,
  "helpUrl": "http://www.dwengo.org/tutorials"
};

var dwenguino_servo_json = {
  "id": "dwenguino_servo",
  "message0": MSG.dwenguinoServoBlock,
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "DwenguinoIDE/img/servo.png",
      "width": 100,
      "height": 100,
      "alt": "*"
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
      "name": "angle",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Msg.DWENGUINO_HUE,
  "tooltip": MSG.dwenguinoServoBlockTooltip,
  "helpUrl": "http://www.dwengo.org/tutorials"
};


Blockly.Blocks['dwenguino_servo'] = {
  init: function() {
    this.jsonInit(dwenguino_servo_json);
  }
};


Blockly.Blocks['dc_motor'] = {
  init: function() {
    this.jsonInit(dc_motor_json);
  }
};

var dwenguino_set_led = {
    "id": "dwenguin_set_led",
    "message0": MSG.setLedState,
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
    "tooltip": MSG.setLedStateTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_set_led'] = {
    init: function(){
        this.jsonInit(dwenguino_set_led);
    }
};

var dwenguino_led_pins = {
    "id": "dwenguino_led_pins",
    "message0": "LED %1 ",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "LED_NUMBER",
        "options": profile.dwenguino.leds
      }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": MSG.ledPinsTooltip,
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
        "options": [[MSG.dwenguinoOn, 'ON'], [MSG.dwenguinoOff, 'OFF']]
      }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": MSG.dwenguinoOnOffTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_on_off'] = {
    init: function(){
        this.jsonInit(dwenguino_on_off);
    }
};

var dwenguino_analog_write = {
    "id": "dwenguino_analog_wirte",
    "message0": MSG.dwenguinoAnalogWrite,
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
    "tooltip": MSG.dwenguinoAnalogWriteTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_analog_write'] = {
    init: function(){
        this.jsonInit(dwenguino_analog_write);
    }
};

var dwenguino_analog_read = {
    "id": "dwenguino_analog_read",
    "message0": MSG.dwenguinoAnalogRead,
    "args0": [
        {
            "type": "input_value",
            "name": "PIN",
            "check": "Number"
        }
    ],
    "output": "Number",
    "colour": Blockly.Msg.DWENGUINO_HUE,
    "tooltip": MSG.dwenguinoAnalogWriteTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};
Blockly.Blocks['dwenguino_analog_read'] = {
    init: function(){
        this.jsonInit(dwenguino_analog_read);
    }
};

var dwenguino_leds_reg = {
    "id": "dwenguino_leds_reg",
    "message0": MSG.ledsReg + " %1",
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
    "tooltip": MSG.dwenguinoLedsRegTooltip,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['dwenguino_leds_reg'] = {
    init: function(){
        this.jsonInit(dwenguino_leds_reg);
    }
};


