/**
 * @fileoverview Array blocks for Blockly.
 * Provides blocks for creating, accessing, and modifying arrays.
 * Designed to work with both Arduino C++ and JavaScript code generators.
 */
'use strict';

goog.provide('Blockly.Blocks.arrays');

goog.require('Blockly');
goog.require('Blockly.Blocks');
goog.require('Blockly.FieldVariable');

Blockly.Blocks.arrays.HUE = 260;

Blockly.defineBlocksWithJsonArray([
  {
    "type": "array_create",
    "message0": "%{BKY_ARRAY_CREATE}",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["Array"],
        "defaultType": "Array"
      },
      {
        "type": "field_dropdown",
        "name": "TYPE",
        "options": [
          ["int", "int"],
          ["String", "String"],
          ["double", "double"]
        ]
      },
      {
        "type": "input_value",
        "name": "SIZE",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 260,
    "tooltip": "%{BKY_ARRAY_CREATE_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "array_get_index",
    "message0": "%{BKY_ARRAY_GET_INDEX}",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["Array"],
        "defaultType": "Array"
      },
      {
        "type": "input_value",
        "name": "INDEX",
        "check": "Number"
      }
    ],
    "output": null,
    "colour": 260,
    "tooltip": "%{BKY_ARRAY_GET_INDEX_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "array_set_index",
    "message0": "%{BKY_ARRAY_SET_INDEX}",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["Array"],
        "defaultType": "Array"
      },
      {
        "type": "input_value",
        "name": "INDEX",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 260,
    "tooltip": "%{BKY_ARRAY_SET_INDEX_TOOLTIP}",
    "helpUrl": ""
  },
  {
    "type": "array_length",
    "message0": "%{BKY_ARRAY_LENGTH}",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "%{BKY_VARIABLES_DEFAULT_NAME}",
        "variableTypes": ["Array"],
        "defaultType": "Array"
      }
    ],
    "output": "Number",
    "colour": 260,
    "tooltip": "%{BKY_ARRAY_LENGTH_TOOLTIP}",
    "helpUrl": ""
  }
]);
