/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.arduino');

goog.require('Blockly.Arduino');

Blockly.Arduino['setup_loop_structure_arduino'] = function (block) {
    var statements_setup = Blockly.Arduino.statementToCode(block, 'SETUP');
    var statements_loop = Blockly.Arduino.statementToCode(block, 'LOOP');
    // Assemble Arduino into code variable.
    Blockly.Arduino.setups_['userSetupCode'] = statements_setup + "\n";
    console.log("Translating arduino setup loop structure");
    console.log(statements_setup);
    console.log(statements_loop);

    return statements_loop;


};
