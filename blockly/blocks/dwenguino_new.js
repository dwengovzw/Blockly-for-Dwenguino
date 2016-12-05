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
  "colour": Blockly.Blocks.dwenguino.HUE,
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
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


var clear_lcd_json = {
  "id": "clear_lcd",
  "message0": MSG.clearLCD,
  "args0": [],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.dwenguino.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
}

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
      "src": "img/dwenguino light.jpg",
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
  "colour": Blockly.Blocks.dwenguino.HUE,
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
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
    "colour": Blockly.Blocks.math.HUE,
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
  "message0": "Sonar %1 %2 %3" + MSG.trig + "%4" + MSG.echo + "%5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "img/sonartje.png",
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
  "colour": Blockly.Blocks.dwenguino.HUE,
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
    this.appendValueInput('PIN', 'PIN')
            .appendField(MSG.digitalRead)
            .setCheck("Number");
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.digitalReadTooltip);
  }
};

Blockly.Blocks['dwenguino_digital_write'] = {
    init: function(){
        this.setHelpUrl(DwenguinoHelpUrl);
        this.setColour(Blockly.Blocks.dwenguino.HUE);
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
    this.setColour(Blockly.Blocks.dwenguino.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[MSG.high, "HIGH"], [MSG.low, "LOW"]]), 'BOOL')
    this.setOutput(true, 'Number');
    this.setTooltip(MSG.highLowTooltip);
  }
};

var dc_motor_json = {
  "id": "dc_motor",
  "message0": "DC Motor %1 %2 %3 channel %4 speed %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "img/dc.png",
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
  "colour": Blockly.Blocks.dwenguino.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

var dwenguino_servo_json = {
  "id": "dwenguino_servo",
  "message0": "Dwenguino Servo %1 %2 %3 chann # %4 angle %5",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": "img/servo.png",
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
  "colour": Blockly.Blocks.dwenguino.HUE,
  "tooltip": "",
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
