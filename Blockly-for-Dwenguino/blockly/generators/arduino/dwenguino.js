/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.dwenguino');

goog.require('Blockly.Arduino');


// This is now integrated in the setup loop structure so children don't have to know about the initialisation step and can just start coding
Blockly.Arduino['initdwenguino'] = function (block) {

//    Blockly.Arduino.definitions_['define_wire_h'] = '#include <Wire.h>\n';
//    Blockly.Arduino.definitions_['define_dwenguino_h'] = '#include <Dwenguino.h>\n';
//    Blockly.Arduino.definitions_['define_lcd_h'] = '#include <LiquidCrystal.h>\n';

    //Blockly.Arduino.setups_['initDwenguino'] = 'initDwenguino();';
    //var code = 'initDwenguino();';
    return code;
};

Blockly.Arduino['setup_loop_structure'] = function (block) {
    Blockly.Arduino.definitions_['define_wire_h'] = '#include <Wire.h>\n';
    Blockly.Arduino.definitions_['define_dwenguino_h'] = '#include <Dwenguino.h>\n';
    Blockly.Arduino.definitions_['define_lcd_h'] = '#include <LiquidCrystal.h>\n';

    var statements_setup = Blockly.Arduino.statementToCode(block, 'SETUP');
    var statements_loop = Blockly.Arduino.statementToCode(block, 'LOOP');
    // Assemble Arduino into code variable.
    Blockly.Arduino.setups_['userSetupCode'] = 'initDwenguino();\n' + statements_setup + "\n";

    return statements_loop;


};


Blockly.Arduino['set_leds'] = function (block) {
    var value_register_value = Blockly.Arduino.valueToCode(block, 'register value', Blockly.Arduino.ORDER_ATOMIC);
    var code = 'LEDS = ' + value_register_value + ';\n';
    return code;
};



Blockly.Arduino['dc_motor'] = function (block) {
    var value_channel = Blockly.Arduino.valueToCode(block, 'channel', Blockly.Arduino.ORDER_ATOMIC);
    var value_speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_ATOMIC);
    //import dwenguino motors
    Blockly.Arduino.definitions_['define_dwenguinomotor_h'] = "#include <DwenguinoMotor.h>\n";
    // declare motor on chosen channel
    Blockly.Arduino.definitions_['declare_dc_motor_on_channel_' + value_channel] = 'DCMotor dcMotor' + value_channel + '(MOTOR_' + value_channel + '_0, MOTOR_' + value_channel + '_1);\n';
    //start motor
    var code = 'dcMotor' + value_channel + '.setSpeed(' + value_speed + ');\n';
    return code;
};

Blockly.Arduino.dwenguino_delay = function() {
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
  var code = 'delay(' + delay_time + ');\n';
  return code;
};

Blockly.Arduino['dwenguino_lcd'] = function (block) {
    var value_text = Blockly.Arduino.valueToCode(block, 'text', Blockly.Arduino.ORDER_ATOMIC);
    var value_line_number = Blockly.Arduino.valueToCode(block, 'line_number', Blockly.Arduino.ORDER_ATOMIC);
    var value_character_number = Blockly.Arduino.valueToCode(block, 'character_number', Blockly.Arduino.ORDER_ATOMIC);
    // Assemble JavaScript into code variable.
    //import dwenguino lcd
    Blockly.Arduino.definitions_['define_lcd_h'] = "#include <LiquidCrystal.h>\n";
    var code = 'dwenguinoLCD.setCursor(' + value_character_number + ',' + value_line_number + ');\n';
    code = code + 'dwenguinoLCD.print(' + value_text + ');\n'
    return code;
};

Blockly.Arduino['clear_lcd'] = function (block) {
    //  Assemble JavaScript into code variable.
    var code = 'dwenguinoLCD.clear();\n';
    return code;
};

Blockly.Arduino['sonar_sensor'] = function (block) {
    var value_trig = Blockly.Arduino.valueToCode(block, 'trig', Blockly.Arduino.ORDER_NONE);
    var value_echo = Blockly.Arduino.valueToCode(block, 'echo', Blockly.Arduino.ORDER_NONE);
    //define sonar settings
    Blockly.Arduino.definitions_['define_newping_h'] = "#include <NewPing.h>\n";
    Blockly.Arduino.definitions_['define_sonar_trig_' + value_trig] = "#define TRIGGER_PIN_" + value_trig + " " + value_trig + "\n";
    Blockly.Arduino.definitions_['define_sonar_echo_ ' + value_echo] = "#define ECHO_PIN_" + value_echo + " " + value_echo + "\n";
    Blockly.Arduino.definitions_['define_sonar_max_distance'] = "#define MAX_DISTANCE 200 \n";
    //define sonar sensor
    Blockly.Arduino.definitions_['define_sonar_sensor_' + value_trig + value_echo] = "NewPing sonar"
            + value_trig + value_echo + "(TRIGGER_PIN_" + value_trig + ", ECHO_PIN_" + value_echo + ", MAX_DISTANCE);\n";
    //  Assemble Arduino into code variable.
    var code = "sonar" + value_trig + value_echo + '.ping_cm()';

    return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['dwenguino_servo'] = function (block) {
    var value_channel = Blockly.Arduino.valueToCode(block, 'channel', Blockly.Arduino.ORDER_ATOMIC);
    var value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

    //define sonar settings
    Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";
    Blockly.Arduino.definitions_['define_servo_' + value_channel] = "Servo servo" + value_channel + ";\n";

    Blockly.Arduino.setups_['define_dwenguino_servo' + value_channel] = 'servo' + value_channel + '.attach(SERVO_' + value_channel + ');\n';

    // Assemble JavaScript into code variable.
    var code = 'servo' + value_channel + '.write(' + value_angle + ');\n';
    return code;
};

Blockly.Arduino['dwenguino_controls_while'] = function (block) {
    var value_condition = Blockly.Arduino.valueToCode(block, 'CONDITION', Blockly.Arduino.ORDER_ATOMIC);
    var statements_looped_code = Blockly.Arduino.statementToCode(block, 'LOOPED_CODE');
    //  Assemble Arduino into code variable.
    var code = 'while(' + value_condition + '){\n'
            + statements_looped_code + '\n}\n';
    return code;
};


/*Blockly.Arduino['dwenguino_constants'] = function (block) {
    var constant_value = block.getFieldValue('DWENGUINO_CONSTANT');
    return [constant_value, Blockly.Arduino.ORDER_ATOMIC];
};*/

Blockly.Arduino.dwenguino_pins = function() {
  var dropdown_value = this.getFieldValue('PIN');
  return [dropdown_value, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_tone_on_pin = function() {
  var value_pin = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  var value_num = Blockly.Arduino.valueToCode(this, "NUM", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output_'+value_pin] = 'pinMode('+value_pin+', OUTPUT);';
  var code = "tone(" + value_pin + ", " + value_num + ");\n";
  return code;
};

Blockly.Arduino.dwenguino_no_tone_on_pin = function() {
  var dropdown_pin = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output_'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = "noTone(" + dropdown_pin + ");\n";
  return code;
};

Blockly.Arduino.dwenguino_digital_read = function() {
  var dropdown_pin = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
  var code = 'digitalRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_digital_write = function() {
  var value_pin = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  var value_num = Blockly.Arduino.valueToCode(this, "NUM", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output_'+value_pin] = 'pinMode('+value_pin+', OUTPUT);';
  var code = "digitalWrite(" + value_pin + ", " + value_num + ");\n";
  return code;
};


Blockly.Arduino.dwenguino_highlow = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_pressed = function() {
  // Boolean values PRESSED and NOT PRESSED.
  var code = (this.getFieldValue('BOOL') == 'PRESSED') ? 'PRESSED' : '!PRESSED';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_on_off = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('LED_ON_OFF') == 'ON') ? 'HIGH' : 'LOW';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_led_pins = function() {
  var dropdown_value = this.getFieldValue('LED_NUMBER');
  if (dropdown_value != '13'){
      dropdown_value = parseInt(dropdown_value) + 32;
  }
  return [dropdown_value, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_set_led = function(){
    var pin_number = Blockly.Arduino.valueToCode(this, "LED", Blockly.Arduino.ORDER_ATOMIC);
    var led_state = Blockly.Arduino.valueToCode(this, "LED_STATE", Blockly.Arduino.ORDER_ATOMIC);
    //All led pins are set to output in the initDwenguino method
    /*Blockly.Arduino.setups_['setup_output_'+pin_number] = 'pinMode('+pin_number+', OUTPUT);';*/ // This 

    var code = 'digitalWrite(' + pin_number + ', ' + led_state + ');\n'
    return code;
};

Blockly.Arduino.dwenguino_analog_write = function(){
    var pin_number = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
    var pin_value = Blockly.Arduino.valueToCode(this, "VAL", Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_output_' + pin_number] = 'pinMode(' + pin_number + ', OUTPUT);';

    var code = 'analogWrite(' + pin_number + ', ' + pin_value + ');\n';
    return code;
};

Blockly.Arduino.dwenguino_analog_read = function(){
    var pin_number = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);';

    var code = 'analogRead(' + pin_number + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_digital_read_switch = function(){
    var switch_number = this.getFieldValue('SWITCH');
    var code = 'digitalRead(' + switch_number + ')';

    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dwenguino_leds_reg = function(){
    var bitmask = Blockly.Arduino.valueToCode(this, "MASK", Blockly.Arduino.ORDER_ATOMIC);
    var code = 'LEDS = ' + bitmask + ';\n';

    return code;
};


Blockly.Arduino.dwenguino_wait_for_switch = function(){
    var switch_number = this.getFieldValue('SWITCH');
    var code = 'while(digitalRead(' + switch_number + ')){}';

    return code;
};
