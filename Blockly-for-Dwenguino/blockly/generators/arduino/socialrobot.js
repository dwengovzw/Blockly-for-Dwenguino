/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.socialrobot');

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

Blockly.Arduino['socialrobot_arms_down'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";
  Blockly.Arduino.definitions_['define_servo_' + value_servo_right_hand] = "Servo servo" + value_servo_right_hand + ";\n";
  Blockly.Arduino.definitions_['define_servo_' + value_servo_left_hand] = "Servo servo" + value_servo_left_hand + ";\n";

  Blockly.Arduino.setups_['define_dwenguino_servo' + value_servo_right_hand] = 'servo' + value_servo_right_hand + '.attach(SERVO_' + value_servo_right_hand + ');\n';
  Blockly.Arduino.setups_['define_dwenguino_servo' + value_servo_left_hand] = 'servo' + value_servo_left_hand + '.attach(SERVO_' + value_servo_left_hand + ');\n';

    // Assemble JavaScript into code variable.
    var code = 'servo' + value_servo_right_hand + '.write(' + '180' + ');\n'
    + 'servo' + value_servo_left_hand + '.write(' + '0' + ');\n';
    return code;

}

Blockly.Arduino['socialrobot_wave_arms'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";
  Blockly.Arduino.definitions_['define_servo_' + value_servo_right_hand] = "Servo servo" + value_servo_right_hand + ";\n";
  Blockly.Arduino.definitions_['define_servo_' + value_servo_left_hand] = "Servo servo" + value_servo_left_hand + ";\n";

  Blockly.Arduino.setups_['define_dwenguino_servo' + value_servo_right_hand] = 'servo' + value_servo_right_hand + '.attach(SERVO_' + value_servo_right_hand + ');\n';
  Blockly.Arduino.setups_['define_dwenguino_servo' + value_servo_left_hand] = 'servo' + value_servo_left_hand + '.attach(SERVO_' + value_servo_left_hand + ');\n';

  // Assemble JavaScript into code variable.
  var code = 'servo' + value_servo_right_hand + '.write(' + '0' + ');\n'
  + 'servo' + value_servo_left_hand + '.write(' + '180' + ');\n'
  + 'delay(' + '1000' + ');\n'
  + 'servo' + value_servo_right_hand + '.write(' + '180' + ');\n'
  + 'servo' + value_servo_left_hand + '.write(' + '0' + ');\n'
  + 'delay(' + '1000' + ');\n';
  console.log(code);
  return code;

}

Blockly.Arduino['socialrobot_read_pin'] = function(block){
    var pin_number = Blockly.Arduino.valueToCode(this, "PIN", Blockly.Arduino.ORDER_ATOMIC);
    //Blockly.Arduino.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);';

    var code = 'DigitalRead(' + pin_number + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};