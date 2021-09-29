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
 * @fileoverview Dwenguino conveyor blocks for Blockly
 * @author jari.degraeve@ugent.be   (Jari De Graeve)
 */
'use strict';

goog.provide('Blockly.Blocks.conveyor');

goog.require('Blockly.Blocks');
goog.require('Blockly.Arduino');


var DwenguinoHelpUrl = "http://www.dwengo.org/blockly";

Blockly.Blocks.conveyor.HUE = 180;

var conveyor_belt_json = {
    "id": "conveyor_belt",
    "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['conveyorBlock']) + " %1 %2 %3" + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['conveyorSpeed']) +  " %4 ",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_image",
        "src": settings.basepath + "DwenguinoIDE/img/conveyor/conveyor.png",
        "width": 100,
        "height": 120,
        "alt": "*"
    },
    {
        "type": "input_dummy"
    },
      {
        "type": "input_value",
        "name": "speed",
        "check": "Number"
      },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": Blockly.Blocks.conveyor.HUE,
    "tooltip": "",
    "helpUrl": "http://www.dwengo.org/tutorials"
    
  };

  Blockly.Blocks['conveyor_belt'] = {
    init: function() {
      this.jsonInit(conveyor_belt_json);
    }
  };


var conv_button_json = {
  "id": "conveyor_button",
  "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['buttonBlock']) + "%1 %2" + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['pin']) + "%3" ,
  "args0": [
    {
        "type": "field_image",
        "src": settings.basepath + "DwenguinoIDE/img/conveyor/button.png",
        "width": 30,
        "height": 30,
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
  "colour": Blockly.Blocks.conveyor.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['conveyor_button'] = {
  init: function() {
    this.jsonInit(conv_button_json);
  }
};


var color_sensor_json = {
  "id": "conveyor_color_sensor",
  "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['rgbSensorBlock']) + "%1 %2 %3" + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['rgbSensorPin']) + "%4" ,
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_image",
      "src": settings.basepath + "DwenguinoIDE/img/conveyor/rgb_sensor.png",
      "width": 80,
      "height": 80,
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
  "output": "Color",
  "colour": Blockly.Blocks.conveyor.HUE,
  "tooltip": "",
  "helpUrl": DwenguinoHelpUrl
};

Blockly.Blocks['conveyor_color_sensor'] = {
  init: function() {
    this.jsonInit(color_sensor_json);
  }
};



var conveyor_ledstrip_json = {
  "id": "conveyor_ledstrip",
  "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['ledStripBlock']) + " %1 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['clockPin']) +  " %2 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['dataPin']) + " %3 ",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "input_value",
      "name": "clockPin",
      "check": "Number"
    },
    {
      "type": "input_value",
      "name": "dataPin",
      "check": "Number"
    },
  ],
  "message1": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['colorBlock']) + "1 %1",
  "args1":[
    {
      "type": "input_value",
      "name": "color1",
      "check": "Color"
    },
  ],
  "message2": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['colorBlock']) + "2 %1",
  "args2":[
    {
      "type": "input_value",
      "name": "color2",
      "check": "Color"
    },
  ],
  "message3": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['colorBlock']) + "3 %1",
  "args3":[
    {
      "type": "input_value",
      "name": "color3",
      "check": "Color"
    },
  ],
  "message4": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['colorBlock']) + "4 %1",
  "args4":[
    {
      "type": "input_value",
      "name": "color4",
      "check": "Color"
    },
  ],
  "message5": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['colorBlock']) + "5 %1",
  "args5":[
    {
      "type": "input_value",
      "name": "color5",
      "check": "Color"
    },
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": Blockly.Blocks.conveyor.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
  
};

Blockly.Blocks['conveyor_ledstrip'] = {
  init: function() {
    this.jsonInit(conveyor_ledstrip_json);
  }
};

let colors = [
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['noColor']), "noColor"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['black']), "black"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['white']), "white"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['gray']), "gray"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['red']), "red"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['orange']), "orange"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['yellow']), "yellow"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['greenyellow']), "greenyellow"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['green']), "green"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['cyan']), "cyan"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['blue']), "blue"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['purple']), "purple"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['pink']), "pink"],
  [DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['magenta']), "magenta"]
]
var conveyor_color_json = {
  "id": "conveyor_color",
  "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['color']) + "%1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "COLOR_DROPDOWN",
      "options": colors
    }
  ],
  "output": "Color",
  "colour": Blockly.Blocks.conveyor.HUE,
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['conveyor_color'] = {
  init: function() {
    this.jsonInit(conveyor_color_json);
  }
};

var conveyor_rgb_color_json = {
    "id": "conveyor_rgb_color",
    "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['red']) + "%1 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['green']) + "%2 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['blue']) + "%3 " ,
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
    "inputsInline": true,
    "output": "Color",
    "colour": Blockly.Blocks.conveyor.HUE,
    "tooltip": "",
    "helpUrl": "http://www.dwengo.org/tutorials"
  };
  
  Blockly.Blocks['conveyor_rgb_color'] = {
    init: function() {
      this.jsonInit(conveyor_rgb_color_json);
    }
  };

var conveyor_rgb_color_with_numbers_json = {
  "id": "conveyor_rgb_color_with_numbers",
  "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['red']) + "%1 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['green']) + "%2 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['blue']) + "%3 " ,
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
  "colour": Blockly.Blocks.conveyor.HUE,
  "tooltip": "",
  "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['conveyor_rgb_color_with_numbers'] = {
  init: function() {
    this.jsonInit(conveyor_rgb_color_with_numbers_json);
  }
};

var similar_color_json = {
    "id": "similar_color",
    "message0": DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['color']) + " %1 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['isSimilar']) + " " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['color']) + " %2 " + DwenguinoBlocklyLanguageSettings.translateFrom('conveyor',['withDifference']),
    "args0": [
      {
        "type": "input_value",
        "name": "colorA",
        "check": "Color"
      },
      {
        "type": "input_value",
        "name": "colorB",
        "check": "Color"
      },
      {
        "type": "field_number",
        "name": "diff",
        "value": 20,
        "min": 0,
        "max": 100,
        "precision": 0
      }
    ],
    "inputsInline": true,
    "output": "Boolean",
    "colour": Blockly.Blocks.conveyor.HUE,
    "helpUrl": "http://www.dwengo.org/tutorials"
};

Blockly.Blocks['similar_color'] = {
    init: function() {
      this.jsonInit(similar_color_json);
    }
  };
