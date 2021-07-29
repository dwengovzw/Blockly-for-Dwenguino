/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 * @author juta.staes@UGent.be     (Juta Staes)
 */
 'use strict';
 var machine = "DwenguinoSimulation.";
 
 goog.provide('Blockly.Python.input');
 
 goog.require('Blockly.Python');
 
 Blockly.Python['initdwenguino'] = function (block) {
     return "";
 };
 
 Blockly.Python['pir_sensor'] = function (block) {
   var value_trig = Blockly.Python.valueToCode(block, 'trig', Blockly.Python.ORDER_NONE);
 
   var code = machine + "pir(" + value_trig + ')';
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['sound_sensor'] = function (block) {
   var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
 
   var code = machine + "soundSensor(" + pin + ')';
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['touch_sensor'] = function (block) {
   var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
 
   var code = machine + "touchSensor(" + pin + ')';
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python['button'] = function(block) {
   var pin = Blockly.Python.valueToCode(block, 'pin', Blockly.Python.ORDER_NONE);
 
   var code = machine + "readButton('" + pin + "')";
   return [code, Blockly.Python.ORDER_ATOMIC];
 }
 
 Blockly.Python['socialrobot_read_pin'] = function(block){
   var pin_number = Blockly.Python.valueToCode(block, "PIN", Blockly.Python.ORDER_ATOMIC);
 
   //Blockly.Python.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';
 
   var code = machine + 'digitalRead("' + pin_number + '")';
   return [code, Blockly.Arduino.ORDER_ATOMIC];
 };
 
 
 