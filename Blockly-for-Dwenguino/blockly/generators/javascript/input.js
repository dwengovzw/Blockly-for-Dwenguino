/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 * @author juta.staes@UGent.be     (Juta Staes)
 */
 'use strict';
 var machine = "DwenguinoSimulation.";
 
 goog.provide('Blockly.JavaScript.input');
 
 goog.require('Blockly.JavaScript');
 
 Blockly.JavaScript['initdwenguino'] = function (block) {
     return "";
 };
 
 Blockly.JavaScript['pir_sensor'] = function (block) {
   var value_trig = Blockly.JavaScript.valueToCode(block, 'trig', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "pir(" + value_trig + ')';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };
 
 Blockly.JavaScript['sound_sensor'] = function (block) {
   var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "soundSensor(" + pin + ')';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };
 
 Blockly.JavaScript['touch_sensor'] = function (block) {
   var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "touchSensor(" + pin + ')';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };
 
 Blockly.JavaScript['button'] = function(block) {
   var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "readButton('" + pin + "')";
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 }
 
 Blockly.JavaScript['socialrobot_read_pin'] = function(block){
   var pin_number = Blockly.JavaScript.valueToCode(block, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
 
   //Blockly.JavaScript.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';
 
   var code = machine + 'digitalRead("' + pin_number + '")';
   return [code, Blockly.Arduino.ORDER_ATOMIC];
 };
 
 
 