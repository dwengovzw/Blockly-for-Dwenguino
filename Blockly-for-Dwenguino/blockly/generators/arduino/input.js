/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
 'use strict';

 goog.provide('Blockly.Arduino.input');
 
 goog.require('Blockly.Arduino');

 
 // This is now integrated in the setup loop structure so children don't have to know about the initialisation step and can just start coding
 Blockly.Arduino['initdwenguino'] = function (block) {
    return code;
 };

 
 Blockly.Arduino['pir_sensor'] = function (block) {
   var value_trig = Blockly.Arduino.valueToCode(block, 'trig', Blockly.Arduino.ORDER_NONE);
   //define pir settings
   Blockly.Arduino.definitions_['define_pir_trig_' + value_trig] = "#define TRIGGER_PIN_" + value_trig + " " + value_trig + "\n";
 
   //define pir sensor
   Blockly.Arduino.setups_['define_dwenguino_pir_' + value_trig] = "pinMode(TRIGGER_PIN_" + value_trig + ", INPUT);";
   var code = "digitalRead(TRIGGER_PIN_" + value_trig + ")";
 
   return [code, Blockly.Arduino.ORDER_NONE];
 };
 
 Blockly.Arduino['sound_sensor'] = function (block) {
   var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
   Blockly.Arduino.definitions_['define_sound_sensor_' + pin] = "#define SOUND_SENSOR_PIN_" + pin + " " + pin + "\n";
 
   Blockly.Arduino.setups_['define_dwenguino_sound_sensor_' + pin] = "pinMode(SOUND_SENSOR_PIN_" + pin + ", INPUT);";
   var code = "digitalRead(SOUND_SENSOR_PIN_" + pin + ")";
 
   return [code, Blockly.Arduino.ORDER_NONE];
 };
 
 Blockly.Arduino['touch_sensor'] = function (block) {
   var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
   Blockly.Arduino.definitions_['define_touch_sensor_' + pin] = "#define TOUCH_SENSOR_PIN_" + pin + " " + pin + "\n";
 
   Blockly.Arduino.setups_['define_dwenguino_touch_sensor_' + pin] = "pinMode(TOUCH_SENSOR_PIN_" + pin + ", INPUT);";
   var code = "digitalRead(TOUCH_SENSOR_PIN_" + pin + ")";
 
   return [code, Blockly.Arduino.ORDER_NONE];
 };
 
 Blockly.Arduino['button'] = function (block) {
   var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
   Blockly.Arduino.definitions_['define_button_' + pin] = "#define BUTTON_PIN_" + pin + " " + pin + "\n";
 
   Blockly.Arduino.setups_['define_dwenguino_button_' + pin] = "pinMode(BUTTON_PIN_" + pin + ", INPUT);";
   var code = "digitalRead(BUTTON_PIN_" + pin + ")";
 
   return [code, Blockly.Arduino.ORDER_NONE];
 };
 
 Blockly.Arduino['socialrobot_read_pin'] = function(block){
     var pin_number = Blockly.Arduino.valueToCode(block, "PIN", Blockly.Arduino.ORDER_ATOMIC);
     Blockly.Arduino.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';
 
     var code = 'digitalRead(' + pin_number + ')';
     return [code, Blockly.Arduino.ORDER_ATOMIC];
 };