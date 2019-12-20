/* global Blockly, goog */

/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 * @author juta.staes@UGent.be     (Juta Staes)
 */
'use strict';
var machine = "DwenguinoSimulation.";

goog.provide('Blockly.JavaScript.socialrobot');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['initdwenguino'] = function (block) {
    return "";
};

Blockly.JavaScript['socialrobot_arms_down'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine 
  + 'servo(' + value_servo_right_hand + ', ' + '180' + ');\n' 
  + machine + 'servo(' + value_servo_left_hand + ', ' + '0' + ');\n';
  console.log(code);
  return code;
}


Blockly.JavaScript['socialrobot_arms_up'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand2', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand2', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine 
  + 'servo(' + value_servo_right_hand + ', ' + '0' + ');\n' 
  + machine + 'servo(' + value_servo_left_hand + ', ' + '180' + ');\n';
  console.log(code);
  return code;
}

Blockly.JavaScript['socialrobot_wave_arms'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine 
  + 'servo(' + value_servo_right_hand + ', ' + '0' + ');\n' 
  + machine + 'servo(' + value_servo_left_hand + ', ' + '180' + ');\n'
  + machine + 'sleep(' + '1000' + ');\n'
  + machine + 'servo(' + value_servo_right_hand + ', ' + '180' + ');\n'
  + machine + 'servo(' + value_servo_left_hand + ', ' + '0' + ');\n'
  + machine + 'sleep(' + '1000' + ');\n';
  console.log(code);
  return code;
}

Blockly.JavaScript['socialrobot_eyes_left'] = function(block) {
  var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine 
  + 'servo(' + value_servo_right_eye + ', ' + '0' + ');\n' 
  + machine + 'servo(' + value_servo_left_eye + ', ' + '0' + ');\n';
  return code;
}

Blockly.JavaScript['socialrobot_eyes_right'] = function(block) {
  var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye1', Blockly.JavaScript.ORDER_ATOMIC);
  
  var code = machine 
  + 'servo(' + value_servo_right_eye + ', ' + '120' + ');\n' 
  + machine + 'servo(' + value_servo_left_eye + ', ' + '120' + ');\n';
  return code;
}

Blockly.JavaScript['socialrobot_read_pin'] = function(block){
  // var pin_number = Blockly.JavaScript.valueToCode(this, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
  var pin_number = this.getFieldValue('PIN');
  //Blockly.JavaScript.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);';

  var code = machine + 'digitalRead("' + pin_number + '")';
  console.log(pin_number);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};


