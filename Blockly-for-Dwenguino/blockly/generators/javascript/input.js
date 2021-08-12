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

 Blockly.JavaScript.input.pinMappings = {
  "SONAR1": 
      {
         "trig": 25,
         "echo": 24
      },
  "SONAR2": {
          "trig": 27,
          "echo": 26
      }, 
  "SOUND1": {
        "analog": 29,
        "digital": 28
  }
};
 
 Blockly.JavaScript['initdwenguino'] = function (block) {
     return "";
 };
 
 Blockly.JavaScript['input_sonar_sensor_select'] = function (block) {
    var number = this.getFieldValue('number');
    var value_trig = Blockly.JavaScript.input.pinMappings[number]["trig"];
    var value_echo = Blockly.JavaScript.input.pinMappings[number]["echo"]; 

    //  Assemble JavaScript into code variable.
    var code = machine + "sonar(" + value_trig +', ' + value_echo + ')';
  
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['input_sonar_sensor'] = function (block) {
  var value_trig = Blockly.JavaScript.valueToCode(block, 'trig', Blockly.JavaScript.ORDER_NONE);
  var value_echo = Blockly.JavaScript.valueToCode(block, 'echo', Blockly.JavaScript.ORDER_NONE);
  //define sonar settings

  //  Assemble JavaScript into code variable.
  var code = machine + "sonar(" + value_trig +', ' + value_echo + ')';

  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['input_sound_sensor_select'] = function (block) {
  var number = this.getFieldValue('number');
  var pin = Blockly.JavaScript.input.pinMappings[number]["digital"]; 

  var code = machine + "soundSensor(" + pin + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['input_sound_sensor'] = function (block) {
  var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);

  var code = machine + "soundSensor(" + pin + ')';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

 Blockly.JavaScript['input_pir_sensor'] = function (block) {
   var value_trig = Blockly.JavaScript.valueToCode(block, 'trig', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "pir(" + value_trig + ')';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };

 
 Blockly.JavaScript['input_touch_sensor'] = function (block) {
   var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "touchSensor(" + pin + ')';
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 };
 
 Blockly.JavaScript['input_button'] = function(block) {
   var pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_NONE);
 
   var code = machine + "readButton('" + pin + "')";
   return [code, Blockly.JavaScript.ORDER_ATOMIC];
 }
 
 Blockly.JavaScript['input_read_pin'] = function(block){
   var pin_number = Blockly.JavaScript.valueToCode(block, "PIN", Blockly.JavaScript.ORDER_ATOMIC);
 
   //Blockly.JavaScript.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';
 
   var code = machine + 'digitalRead("' + pin_number + '")';
   return [code, Blockly.Arduino.ORDER_ATOMIC];
 };
 
 
 