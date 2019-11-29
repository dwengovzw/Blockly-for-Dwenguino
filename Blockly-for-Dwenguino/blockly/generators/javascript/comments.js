/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.JavaScript.comments');

goog.require('Blockly.JavaScript');

Blockly.JavaScript['line_comment'] = function(block) {
    // Text value.
    var code = '// ' + block.getFieldValue('TEXT') + '\n';
    return code;
  };

  