/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
 'use strict';

 goog.provide('Blockly.Python.comments');
 
 goog.require('Blockly.Python');
 
 Blockly.JavaScript['line_comment'] = function(block) {
     // Text value.
     var code = '# ' + block.getFieldValue('TEXT') + '\n';
     return code;
   };
 