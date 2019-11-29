/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.comments');

goog.require('Blockly.Arduino');

Blockly.Arduino['line_comment'] = function(block) {
    // Text value.
    var code = '/* ' + block.getFieldValue('TEXT') + ' */\n';
    return code;
  }