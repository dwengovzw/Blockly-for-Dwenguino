/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 * @author juta.staes@UGent.be     (Juta Staes)
 */
'use strict';
var machine = "DwenguinoSimulation.";

goog.provide('Blockly.JavaScript.dwenguino');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['initdwenguino'] = function (block) {
    return "";
};

Blockly.JavaScript['setup_loop_structure'] = function (block) {
    var statements_setup = Blockly.JavaScript.statementToCode(block, 'SETUP');
    var statements_loop = Blockly.JavaScript.statementToCode(block, 'LOOP');
    // Assemble JavaScript into code variable.
    //Blockly.JavaScript.setups_['userSetupCode'] = 'DwenguinoSimulation.initDwenguino();\n' + statements_setup + "\nloop0();\n";
    Blockly.JavaScript.setups_['userSetupCode'] = statements_setup.trim() + "\n";

    return statements_loop;
};

Blockly.JavaScript['set_leds'] = function (block) {
    var value_register_value = Blockly.JavaScript.valueToCode(block, 'register value', Blockly.JavaScript.ORDER_ATOMIC);
    var code = machine + 'setLeds(' + value_register_value + ');\n';
    return code;
};



Blockly.JavaScript['dc_motor'] = function (block) {
    var value_channel = Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC);
    var value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
    //start motor
    var code = machine + 'startDcMotor(' + value_channel + ', ' + value_speed + ');\n';
    return code;
};

Blockly.JavaScript.dwenguino_delay = function() {
  var delay_time = Blockly.JavaScript.valueToCode(this, 'DELAY_TIME', Blockly.JavaScript.ORDER_ATOMIC) || '1000';
  var code = machine + 'sleep(' + delay_time + ');\n';
  return code;
};

Blockly.JavaScript['dwenguino_lcd'] = function (block) {
    var value_text = Blockly.JavaScript.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ATOMIC);
    var value_line_number = Blockly.JavaScript.valueToCode(block, 'line_number', Blockly.JavaScript.ORDER_ATOMIC);
    var value_character_number = Blockly.JavaScript.valueToCode(block, 'character_number', Blockly.JavaScript.ORDER_ATOMIC);
    // Assemble JavaScript into code variable.
    var code = machine + 'writeLcd(' + value_text + ', '+ value_line_number + ', '+ value_character_number + ');\n';
    return code;
};

Blockly.JavaScript['clear_lcd'] = function (block) {
    //  Assemble JavaScript into code variable.
    var code = machine + 'clearLcd();\n';
    return code;
};

Blockly.JavaScript['sonar_sensor'] = function (block) {
    var value_trig = Blockly.JavaScript.valueToCode(block, 'trig', Blockly.JavaScript.ORDER_NONE);
    var value_echo = Blockly.JavaScript.valueToCode(block, 'echo', Blockly.JavaScript.ORDER_NONE);
    //define sonar settings

    //  Assemble JavaScript into code variable.
    var code = machine + "sonar(" + value_trig +', ' + value_echo + ')';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['pir_sensor'] = function (block) {
  var value_trig = Blockly.JavaScript.valueToCode(block, 'trig', Blockly.JavaScript.ORDER_NONE);
  //define pir settings

  //  Assemble JavaScript into code variable.
  var code = machine + "pir(" + value_trig + ')';

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['dwenguino_servo'] = function (block) {
    var value_channel = Blockly.JavaScript.valueToCode(block, 'channel', Blockly.JavaScript.ORDER_ATOMIC);
    var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
    // Assemble JavaScript into code variable.
    var code = machine + 'servo(' + value_channel + ', ' + value_angle + ');\n';
    return code;
};

Blockly.JavaScript['dwenguino_controls_while'] = function (block) {
    var value_condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_looped_code = Blockly.JavaScript.statementToCode(block, 'LOOPED_CODE');
    //  Assemble JavaScript into code variable.
    var code = 'while(' + value_condition + '){\n'
            + statements_looped_code + '\n}';
    return code;
};


/*Blockly.JavaScript['dwenguino_constants'] = function (block) {
    var constant_value = block.getFieldValue('DWENGUINO_CONSTANT');
    return [constant_value, Blockly.JavaScript.ORDER_ATOMIC];
};*/

Blockly.JavaScript.dwenguino_pins = function() {
  var dropdown_value = this.getFieldValue('PIN');
  return [dropdown_value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_tone_on_pin = function() {
  var value_pin = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
  var value_num = Blockly.JavaScript.valueToCode(this, "NUM", Blockly.JavaScript.ORDER_ATOMIC);
  //Blockly.JavaScript.setups_['setup_output'+value_pin] = 'pinMode('+value_pin+', OUTPUT);\n';
  var code = machine + "tone(\"" + value_pin + "\", " + value_num + ");\n";
  return code;
};

Blockly.JavaScript.dwenguino_no_tone_on_pin = function() {
  var dropdown_pin = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
  //Blockly.JavaScript.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);\n';
  var code = machine + "noTone(\"" + dropdown_pin + "\");\n";
  return code;
};

Blockly.JavaScript.dwenguino_digital_read = function() {
  var dropdown_pin = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
  Blockly.JavaScript.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);\n';
  var code = machine + 'digitalRead("' + dropdown_pin + '")';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_digital_write = function() {
  var value_pin = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
  var value_num = Blockly.JavaScript.valueToCode(this, "NUM", Blockly.JavaScript.ORDER_ATOMIC);
  Blockly.JavaScript.setups_['setup_output'+value_pin] = 'pinMode('+value_pin+', OUTPUT);\n';
  var code = machine + "digitalWrite(\"" + value_pin + "\", " + value_num + ");\n";
  return code;
};

Blockly.JavaScript.dwenguino_highlow = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('BOOL') === 'HIGH') ? 1 : 0;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_pressed = function() {
  // Boolean values PRESSED and NOT PRESSED.
  var code = (this.getFieldValue('BOOL') === 'PRESSED') ? 0 : 1;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_on_off = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('LED_ON_OFF') === 'ON') ? 1 : 0;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_led_pins = function() {
  var dropdown_value = this.getFieldValue('LED_NUMBER');
  if (dropdown_value !== '13'){
      dropdown_value = parseInt(dropdown_value) + 32;
  }
  return [dropdown_value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.dwenguino_set_led = function(){
    var pin_number = Blockly.JavaScript.valueToCode(this, "LED", Blockly.JavaScript.ORDER_ATOMIC);
    var led_state = Blockly.JavaScript.valueToCode(this, "LED_STATE", Blockly.JavaScript.ORDER_ATOMIC);
    //Blockly.JavaScript.setups_['setup_output_'+pin_number] = 'pinMode('+pin_number+', OUTPUT);';

    var code = machine + 'digitalWrite(' + pin_number + ', ' + led_state + ');\n';
    return code;
};

Blockly.JavaScript.dwenguino_analog_write = function(){
    var pin_number = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
    var pin_value = Blockly.JavaScript.valueToCode(this, "VAL", Blockly.JavaScript.ORDER_ATOMIC);
    //Blockly.JavaScript.setups_['setup_output_' + pin_number] = 'pinMode(' + pin_number + ', OUTPUT);';

    var code = machine + 'analogWrite("' + pin_number + '", ' + pin_value + ');\n';
    return code;
};

Blockly.JavaScript.dwenguino_analog_read = function(){
    var pin_number = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
    //Blockly.JavaScript.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);';

    var code = machine + 'analogRead("' + pin_number + '")';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript.dwenguino_digital_read_switch = function(){
    var switch_number = this.getFieldValue('SWITCH');
    var code = machine + 'digitalRead("' + switch_number + '")';

    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript.dwenguino_wait_for_switch = function(){
    var switch_number = this.getFieldValue('SWITCH');
    var code = 'while(' + machine + 'digitalRead("' + switch_number + '")){}\n';

    return code
};


Blockly.JavaScript.dwenguino_leds_reg = function(){
    var bitmask = Blockly.JavaScript.valueToCode(this, "MASK", Blockly.JavaScript.ORDER_ATOMIC);
    var code = "";
    code = machine + 'setLeds(' + bitmask + ');\n';
    
    return code;
};

