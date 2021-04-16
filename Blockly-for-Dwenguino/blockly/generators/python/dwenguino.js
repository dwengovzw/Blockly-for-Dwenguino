/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
 'use strict';
 var machine = "DwenguinoSimulation.";
 
 goog.provide('Blockly.Python.dwenguino');
 
 goog.require('Blockly.Python');
 
 
 Blockly.Python['initdwenguino'] = function (block) {
     return "";
 };
 
 Blockly.Python['setup_loop_structure'] = function (block) {
     var statements_setup = Blockly.Python.statementToCode(block, 'SETUP');
     var statements_loop = Blockly.Python.statementToCode(block, 'LOOP');
     // Assemble Python into code variable.
     //Blockly.Python.setups_['userSetupCode'] = 'DwenguinoSimulation.initDwenguino();\n' + statements_setup + "\nloop0();\n";
     Blockly.Python.setups_.push(statements_setup.trim() + "\n");
 
     return statements_loop;
 };
 
 Blockly.Python['set_leds'] = function (block) {
     var value_register_value = Blockly.Python.valueToCode(block, 'register value', Blockly.Python.ORDER_ATOMIC);
     var code = machine + 'setLeds("' + value_register_value + '")\n';
     return code;
 };
 
 
 
 Blockly.Python['dc_motor'] = function (block) {
     var value_channel = Blockly.Python.valueToCode(block, 'channel', Blockly.Python.ORDER_ATOMIC);
     var value_speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
     //start motor
     var code = machine + 'startDcMotor(' + value_channel + ', ' + value_speed + ')\n';
     return code;
 };
 
 Blockly.Python.dwenguino_delay = function() {
   var delay_time = Blockly.Python.valueToCode(this, 'DELAY_TIME', Blockly.Python.ORDER_ATOMIC) || '1000';
   var code = machine + 'sleep(' + delay_time + ')\n';
   return code;
 };
 
 Blockly.Python['dwenguino_lcd'] = function (block) {
     var value_text = Blockly.Python.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
     var value_line_number = Blockly.Python.valueToCode(block, 'line_number', Blockly.JavaScript.ORDER_ATOMIC);
     var value_character_number = Blockly.Python.valueToCode(block, 'character_number', Blockly.JavaScript.ORDER_ATOMIC);
     // Assemble Python into code variable.
     var code = machine + 'writeLcd(' + value_text + ', '+ value_line_number + ', '+ value_character_number + ')\n';
     return code;
 };
 
 Blockly.Python['clear_lcd'] = function (block) {
     //  Assemble Python into code variable.
     var code = machine + 'clearLcd()\n';
     return code;
 };
 
 Blockly.Python['sonar_sensor'] = function (block) {
     var value_trig = Blockly.Python.valueToCode(block, 'trig', Blockly.Python.ORDER_NONE);
     var value_echo = Blockly.Python.valueToCode(block, 'echo', Blockly.Python.ORDER_NONE);
     //define sonar settings
 
     //  Assemble Python into code variable.
     var code = machine + "sonar(" + value_trig +', ' + value_echo + ')';
 
     return [code, Blockly.JavaScript.ORDER_NONE];
 };
 
 Blockly.Python['dwenguino_servo'] = function (block) {
     var value_channel = Blockly.Python.valueToCode(block, 'channel', Blockly.Python.ORDER_ATOMIC);
     var value_angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
     // Assemble Python into code variable.
     var code = machine + 'servo(' + value_channel + ', ' + value_angle + ')\n';
     return code;
 };
 
 Blockly.Python['dwenguino_controls_while'] = function (block) {
     var value_condition = Blockly.Python.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_ATOMIC);
     var statements_looped_code = Blockly.Python.statementToCode(block, 'LOOPED_CODE');
     //  Assemble Python into code variable.
     var code = 'while ' + value_condition + ':\n\t'
             + statements_looped_code + '\n';
     return code;
 };
 
 
 
 Blockly.Python.dwenguino_pins = function() {
   var dropdown_value = this.getFieldValue('PIN');
   return [dropdown_value, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_tone_on_pin = function() {
   var value_pin = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
   var value_num = Blockly.Python.valueToCode(this, "NUM", Blockly.Python.ORDER_ATOMIC);
   //Blockly.Python.setups_['setup_output'+value_pin] = 'pinMode('+value_pin+', OUTPUT);\n';
   var code = machine + "tone(\"" + value_pin + "\", " + value_num + ")\n";
   return code;
 };
 
 Blockly.Python.dwenguino_no_tone_on_pin = function() {
   var dropdown_pin = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
   //Blockly.Python.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);\n';
   var code = machine + "noTone(\"" + dropdown_pin + "\")\n";
   return code;
 };
 
 Blockly.Python.dwenguino_digital_read = function() {
   var dropdown_pin = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
   Blockly.Python.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT)\n';
   var code = machine + 'digitalRead("' + dropdown_pin + '")';
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_digital_write = function() {
   var value_pin = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
   var value_num = Blockly.Python.valueToCode(this, "NUM", Blockly.Python.ORDER_ATOMIC);
   Blockly.Python.setups_['setup_output'+value_pin] = 'pinMode('+value_pin+', OUTPUT)\n';
   var code = machine + "digitalWrite(\"" + value_pin + "\", " + value_num + ")\n";
   return code;
 };
 
 Blockly.Python.dwenguino_highlow = function() {
   // Boolean values HIGH and LOW.
   var code = (this.getFieldValue('BOOL') === 'HIGH') ? 1 : 0;
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_pressed = function() {
   // Boolean values PRESSED and NOT PRESSED.
   var code = (this.getFieldValue('BOOL') === 'PRESSED') ? 0 : 1;
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_on_off = function() {
   // Boolean values HIGH and LOW.
   var code = (this.getFieldValue('LED_ON_OFF') === 'ON') ? 1 : 0;
   return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_led_pins = function() {
   var dropdown_value = this.getFieldValue('LED_NUMBER');
   if (dropdown_value !== '13'){
       dropdown_value = parseInt(dropdown_value) + 32;
   }
   return [dropdown_value, Blockly.Python.ORDER_ATOMIC];
 };
 
 Blockly.Python.dwenguino_set_led = function(){
     var pin_number = Blockly.Python.valueToCode(this, "LED", Blockly.Python.ORDER_ATOMIC);
     var led_state = Blockly.Python.valueToCode(this, "LED_STATE", Blockly.Python.ORDER_ATOMIC);
     //Blockly.Python.setups_['setup_output_'+pin_number] = 'pinMode('+pin_number+', OUTPUT);';
 
     var code = machine + 'digitalWrite("' + pin_number + '", "' + led_state + '")\n';
     return code;
 };
 
 Blockly.Python.dwenguino_analog_write = function(){
     var pin_number = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
     var pin_value = Blockly.Python.valueToCode(this, "VAL", Blockly.Python.ORDER_ATOMIC);
     //Blockly.Python.setups_['setup_output_' + pin_number] = 'pinMode(' + pin_number + ', OUTPUT);';
 
     var code = machine + 'analogWrite("' + pin_number + '", ' + pin_value + ')\n';
     return code;
 };
 
 Blockly.Python.dwenguino_analog_read = function(){
     var pin_number = Blockly.Python.valueToCode(this, "PIN", Blockly.Python.ORDER_ATOMIC);
 
     var code = machine + 'analogRead("' + pin_number + '")';
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 
 Blockly.Python.dwenguino_digital_read_switch = function(){
     var switch_number = this.getFieldValue('SWITCH');
     var code = machine + 'digitalRead("' + switch_number + '")';
 
     return [code, Blockly.Python.ORDER_ATOMIC];
 };
 
 
 Blockly.Python.dwenguino_wait_for_switch = function(){
     var switch_number = this.getFieldValue('SWITCH');
     var code = 'while ' + machine + 'digitalRead("' + switch_number + '"):\n\t';
 
     return code
 };
 
 
 Blockly.Python.dwenguino_leds_reg = function(){
     var bitmask = Blockly.Python.valueToCode(this, "MASK", Blockly.Python.ORDER_ATOMIC);
     var code = machine + 'setLeds("' + bitmask + '")\n';
 
     return code;
 };
 
 