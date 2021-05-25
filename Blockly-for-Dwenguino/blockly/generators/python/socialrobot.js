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
 
 var eyePatterns = [
   [ 0, 126, 129, 177, 177, 129, 126, 0],  // 0 - 'Rest Position'
   [ 0, 124, 130, 178, 178, 130, 124, 0],  // 1 - 'Blink 1'
   [ 0, 120, 132, 180, 180, 132, 120, 0],  // 2 - 'Blink 2'
   [ 0, 48, 72, 120, 120, 72, 48, 0],  // 3 - 'Blink 3'
   [ 0, 32, 80, 112, 112, 80, 32, 0],  // 4 - 'Blink 4'
   [ 0, 32, 96, 96, 96, 96, 32, 0],  // 5 - 'Blink 5'
   [ 0, 126, 129, 129, 177, 177, 126, 0],  // 6 - 'Right 1'
   [ 0, 0, 126, 129, 129, 177, 177, 126],  // 7 - 'Right 2'
   [ 0, 126, 177, 177, 129, 129, 126, 0],  // 8 - 'Left 1'
   [ 126, 177, 177, 129, 129, 126, 0, 0],  // 9 - 'Left 2'
   [ ], // 10
   [ 0, 126, 129, 153, 153, 129, 126, 0],  // 11 - 'Up 1'
   [ 0, 126, 129, 141, 141, 129, 126, 0],  // 12 - 'Up 2'
   [ 0, 126, 129, 135, 135, 129, 126, 0],  // 13 - 'Up 3'
   [ 0, 126, 129, 225, 225, 129, 126, 0],  // 14 - 'Down 1'
   [ 0, 126, 129, 193, 193, 129, 126, 0],  // 15 - 'Down 2'
   [ 0, 124, 130, 194, 194, 130, 124, 0],  // 16 - 'Down 3'
   [ 0, 124, 130, 177, 177, 129, 126, 0],  // 17 - 'Angry L 1'
   [ 0, 120, 132, 178, 177, 129, 126, 0],  // 18 - 'Angry L 2'
   [ 0, 112, 136, 164, 178, 129, 126, 0],  // 19 - 'Angry L 3'
   [ 0, 96, 144, 168, 180, 130, 127, 0],  // 20 - 'Angry L 4'
   [  ], // 21
   [ 0, 126, 129, 177, 177, 130, 124, 0],  // 22 - 'Angry R 1'
   [ 0, 126, 129, 177, 178, 132, 120, 0],  // 23 - 'Angry R 2'
   [ 0, 126, 129, 178, 164, 136, 112, 0],  // 24 - 'Angry R 3'
   [ 0, 127, 130, 180, 168, 144, 96, 0],  // 25 - 'Angry R 4'
   [ ], // 26
   [ 0, 62, 65, 153, 153, 130, 124, 0],  // 27 - 'Sad L 1'
   [ 0, 30, 33, 89, 154, 132, 120, 0],  // 28 - 'Sad L 2'
   [ 0, 14, 17, 41, 90, 132, 120, 0],  // 29 - 'Sad L 3'
   [ ], // 30
   [ ], // 31
   [ 0, 124, 130, 153, 153, 65, 62, 0],  // 32 - 'Sad R 1'
   [ 0, 120, 132, 154, 89, 33, 30, 0],  // 33 - 'Sad R 2'
   [ 0, 120, 132, 90, 41, 17, 14, 0],  // 34 - 'Sad R 3'
   [ ], // 35
   [ ], // 36
   [ 0, 124, 194, 177, 177, 193, 126, 0],  // 37 - 'Evil L 1'
   [ 0, 56, 68, 178, 177, 66, 60, 0],  // 38 - 'Evil L 2'
   [ 0, 126, 193, 177, 177, 194, 124, 0],  // 39 - 'Evil R 1'
   [ 0, 60, 66, 177, 178, 68, 56, 0],  // 40 - 'Evil R 2'
   [ 0, 126, 129, 129, 129, 189, 126, 0],  // 41 - 'Scan H 1'
   [ 0, 126, 129, 129, 189, 129, 126, 0],  // 42 - 'Scan H 2'
   [ 0, 126, 129, 189, 129, 129, 126, 0],  // 43 - 'Scan H 3'
   [ 0, 126, 189, 129, 129, 129, 126, 0],  // 44 - 'Scan H 4'
   [ ], // 45
   [ 0, 126, 129, 131, 131, 129, 126, 0],  // 46 - 'Scan V 1'
   [ 0, 126, 129, 133, 133, 129, 126, 0],  // 47 - 'Scan V 2'
   [ 0, 126, 129, 137, 137, 129, 126, 0],  // 48 - 'Scan V 3'
   [ 0, 126, 129, 145, 145, 129, 126, 0],  // 49 - 'Scan V 4'
   [ 0, 126, 129, 161, 161, 129, 126, 0],  // 50 - 'Scan V 5'
   [ 0, 126, 129, 193, 193, 129, 126, 0],  // 51 - 'Scan V 6'
   [ 0, 126, 137, 157, 137, 129, 126, 0],  // 52 - 'RIP 1'
   [ 0, 126, 129, 145, 185, 145, 126, 0],  // 53 - 'RIP 2'
   [ 0, 60, 66, 114, 114, 66, 60, 0],  // 54 - 'Peering 1'
   [ 0, 56, 68, 116, 116, 68, 56, 0],  // 55 - 'Peering 2'
   [ 0, 48, 72, 120, 120, 72, 48, 0],  // 56 - 'Peering 3'
   [ 0, 32, 80, 112, 112, 80, 32, 0],  // 57 - 'Peering 4'
 ];
 
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
 
 Blockly.JavaScript['socialrobot_rgbled'] = function(block){
   var pin_red = Blockly.JavaScript.valueToCode(block, 'pin_red', Blockly.JavaScript.ORDER_NONE);
   var pin_green = Blockly.JavaScript.valueToCode(block, 'pin_green', Blockly.JavaScript.ORDER_NONE);
   var pin_blue = Blockly.JavaScript.valueToCode(block, 'pin_blue', Blockly.JavaScript.ORDER_NONE);
   var color = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE);
   var code = machine + 'rgbLed(["' + pin_red + '", "' + pin_green + '", "' + pin_blue + '"],' + color + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_rgbled_off'] = function(block) {
   var pin_red = Blockly.JavaScript.valueToCode(block, 'pin_red', Blockly.JavaScript.ORDER_NONE);
   var pin_green = Blockly.JavaScript.valueToCode(block, 'pin_green', Blockly.JavaScript.ORDER_NONE);
   var pin_blue = Blockly.JavaScript.valueToCode(block, 'pin_blue', Blockly.JavaScript.ORDER_NONE);
   var code = machine + 'rgbLed(["' + pin_red + '", "' + pin_green + '", "' + pin_blue + '"],' + '[0,0,0])\n';
   console.log(code);
   return code;
 };
 
 Blockly.JavaScript['socialrobot_rgb_color'] = function(block){
   var redComponent = block.getFieldValue('RED');
   var greenComponent = block.getFieldValue('GREEN');
   var blueComponent = block.getFieldValue('BLUE');
 
   var code = '[' + redComponent + ',' + greenComponent + ',' + blueComponent + ']';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };
 
 Blockly.JavaScript['socialrobot_rgb_color_with_numbers'] = function(block){
   var redComponent = Blockly.JavaScript.valueToCode(block, 'RED', Blockly.JavaScript.ORDER_NONE);
   var greenComponent = Blockly.JavaScript.valueToCode(block, 'GREEN', Blockly.JavaScript.ORDER_NONE);
   var blueComponent = Blockly.JavaScript.valueToCode(block, 'BLUE', Blockly.JavaScript.ORDER_NONE);
 
   var code = '[' + redComponent + ',' + greenComponent + ',' + blueComponent + ']';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_show_ledmatrix_image'] = function(block) {
   let segment = block.getFieldValue('NUMBERDISPLAY');
   let matrix = '[';
   for (var row = 0; row < 8; row++) {
       matrix += '['
       for (var column = 0; column < 8; column++) {
           if (block.getFieldValue('LED' + row + column) === 'TRUE') {
               matrix += '1';
           } else {
               matrix += '0';
           }
           if(!(row == 7 && column == 7)) {
             matrix +=',';
           }
       }
       matrix += ']';
       if(!(row == 7)){
         matrix += ',';
       }
   }
   matrix += ']';
   var code = machine + 'ledmatrixDisplaySegment(' + '[' + segment + ',' + matrix + ']' + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_show_ledmatrix_eye_pattern'] = function(block) {
   let segment = block.getFieldValue('NUMBERDISPLAY');
   let eyePatternIndex = block.getFieldValue('EYEPATTERN');
   let eyePattern = eyePatterns[eyePatternIndex];
 
   let matrix = '[';
   for (var column = 0; column < 8; column++) {
       matrix += '['
       let columnBinary = eyePattern[column].toString(2);
       columnBinary = columnBinary.padStart(8, "0");
       columnBinary = columnBinary.split("").reverse().join("");
       columnBinary = columnBinary.replace(/(.{1})/g,"$1,");
       columnBinary = columnBinary.substring(0,columnBinary.length-1);
 
       matrix += columnBinary;
 
       matrix += ']';
       if(!(column == 7)){
         matrix += ',';
       }
   }
   matrix += ']';
 
   var code = machine + 'ledmatrixDisplaySegment(' + '[' + segment + ',' + matrix + ']' + ')\n';
   return code;
 }
 
 Blockly.JavaScript['socialrobot_clear_ledmatrix_segment'] = function(block) {
   let segment = block.getFieldValue('NUMBERDISPLAY');
 
   let code = machine + 'clearLedmatrixDisplaySegment(' + segment + ')\n';
   return code;
 }
 
 Blockly.JavaScript['socialrobot_clear_ledmatrix'] = function(block) {
   let code = machine + 'clearLedmatrixDisplay()\n';
   return code;
 }
 
 Blockly.JavaScript['socialrobot_servo'] = function (block) {
   var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
   var value_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
   // Assemble JavaScript into code variable.
   var code = machine + 'servoWithPin(' + value_pin + ', ' + value_angle + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_arms_down'] = function(block) {
   var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand1', Blockly.JavaScript.ORDER_ATOMIC);
   var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand1', Blockly.JavaScript.ORDER_ATOMIC);
   
   var code = machine 
   + 'servoWithPin(' + value_servo_right_hand + ', ' + '180' + ')\n' 
   + machine + 'servoWithPin(' + value_servo_left_hand + ', ' + '0' + ')\n';
   return code;
 };
 
 
 Blockly.JavaScript['socialrobot_arms_up'] = function(block) {
   var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand2', Blockly.JavaScript.ORDER_ATOMIC);
   var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand2', Blockly.JavaScript.ORDER_ATOMIC);
   
   var code = machine 
   + 'servoWithPin(' + value_servo_right_hand + ', ' + '0' + ')\n' 
   + machine + 'servoWithPin(' + value_servo_left_hand + ', ' + '180' + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_wave_arms'] = function(block) {
   var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand', Blockly.JavaScript.ORDER_ATOMIC);
   var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand', Blockly.JavaScript.ORDER_ATOMIC);
   
   var code = machine 
   + 'servoWithPin(' + value_servo_right_hand + ', ' + '0' + ')\n' 
   + machine + 'servoWithPin(' + value_servo_left_hand + ', ' + '180' + ')\n'
   + machine + 'sleep(' + '1000' + ')\n'
   + machine + 'servoWithPin(' + value_servo_right_hand + ', ' + '180' + ')\n'
   + machine + 'servoWithPin(' + value_servo_left_hand + ', ' + '0' + ')\n'
   + machine + 'sleep(' + '1000' + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_eyes_left'] = function(block) {
   var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye', Blockly.JavaScript.ORDER_ATOMIC);
   var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye', Blockly.JavaScript.ORDER_ATOMIC);
   
   var code = machine 
   + 'servoWithPin(' + value_servo_right_eye + ', ' + '0' + ')\n' 
   + machine + 'servoWithPin(' + value_servo_left_eye + ', ' + '0' + ')\n';
   console.log(code);
   return code;
 };
 
 Blockly.JavaScript['socialrobot_eyes_right'] = function(block) {
   var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye1', Blockly.JavaScript.ORDER_ATOMIC);
   var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye1', Blockly.JavaScript.ORDER_ATOMIC);
   
   var code = machine 
   + 'servoWithPin(' + value_servo_right_eye + ', ' + '120' + ')\n' 
   + machine + 'servoWithPin(' + value_servo_left_eye + ', ' + '120' + ')\n';
   console.log(code);
   return code;
 };
 
 Blockly.JavaScript['socialrobot_set_pin'] = function(block){
   var pin_number = Blockly.JavaScript.valueToCode(block, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
   var pin_state = Blockly.JavaScript.valueToCode(block, "PIN_STATE", Blockly.JavaScript.ORDER_ATOMIC);
 
   var code = machine + 'digitalWrite(' + pin_number + ', ' + pin_state + ')\n';
   return code;
 };
 
 Blockly.JavaScript['socialrobot_read_pin'] = function(block){
   var pin_number = Blockly.JavaScript.valueToCode(block, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
 
   //Blockly.JavaScript.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';
 
   var code = machine + 'digitalRead("' + pin_number + '")';
   return [code, Blockly.Arduino.ORDER_ATOMIC];
 };
 
 
 