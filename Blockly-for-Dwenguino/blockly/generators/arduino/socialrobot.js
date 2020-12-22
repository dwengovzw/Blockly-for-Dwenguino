/**
 * @fileoverview Generating Dwenguino blocks.
 * @author tom.neutens@UGent.be     (Tom Neutens)
 */
'use strict';

goog.provide('Blockly.Arduino.socialrobot');

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
  Blockly.Arduino.setups_['define_dwenguino_pir_' + value_trig] = "pinMode(TRIGGER_PIN_" + value_trig + ", INPUT)\n";
  var code = "digitalRead(TRIGGER_PIN_" + value_trig + ")";

  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['sound_sensor'] = function (block) {
  var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
  Blockly.Arduino.definitions_['define_sound_sensor_' + pin] = "#define SOUND_SENSOR_PIN_" + pin + " " + pin + "\n";

  Blockly.Arduino.setups_['define_dwenguino_sound_sensor_' + pin] = "pinMode(SOUND_SENSOR_PIN_" + pin + ", INPUT)\n";
  var code = "digitalRead(SOUND_SENSOR_PIN_" + pin + ")";

  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['touch_sensor'] = function (block) {
  var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
  Blockly.Arduino.definitions_['define_touch_sensor_' + pin] = "#define TOUCH_SENSOR_PIN_" + pin + " " + pin + "\n";

  Blockly.Arduino.setups_['define_dwenguino_touch_sensor_' + pin] = "pinMode(TOUCH_SENSOR_PIN_" + pin + ", INPUT)\n";
  var code = "digitalRead(TOUCH_SENSOR_PIN_" + pin + ")";

  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino['button'] = function (block) {
  var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
  Blockly.Arduino.definitions_['define_button_' + pin] = "#define BUTTON_PIN_" + pin + " " + pin + "\n";

  Blockly.Arduino.setups_['define_dwenguino_button_' + pin] = "pinMode(BUTTON_PIN_" + pin + ", INPUT)\n";
  var code = "digitalRead(BUTTON_PIN_" + pin + ")";

  return [code, Blockly.Arduino.ORDER_NONE];
};


Blockly.Arduino['socialrobot_rgbled'] = function(block) {
  var pin_red = Blockly.Arduino.valueToCode(block, 'pin_red', Blockly.Arduino.ORDER_NONE);
  var pin_green = Blockly.Arduino.valueToCode(block, 'pin_green', Blockly.Arduino.ORDER_NONE);
  var pin_blue = Blockly.Arduino.valueToCode(block, 'pin_blue', Blockly.Arduino.ORDER_NONE);
  var color = Blockly.Arduino.valueToCode(block, 'color', Blockly.Arduino.ORDER_NONE);

  // var pin_value = Blockly.Arduino.valueToCode(this, "VAL", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += color;
  code += 'analogWrite(' + pin_red + ', ' + 'rgb[0]' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + 'rgb[1]' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + 'rgb[2]' + ');\n';
  return code;
}

Blockly.Arduino['socialrobot_rgbled_off'] = function(block) {
  var pin_red = Blockly.Arduino.valueToCode(block, 'pin_red', Blockly.Arduino.ORDER_NONE);
  var pin_green = Blockly.Arduino.valueToCode(block, 'pin_green', Blockly.Arduino.ORDER_NONE);
  var pin_blue = Blockly.Arduino.valueToCode(block, 'pin_blue', Blockly.Arduino.ORDER_NONE);

  // var pin_value = Blockly.Arduino.valueToCode(this, "VAL", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += 'analogWrite(' + pin_red + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + '0' + ');\n';
  return code;
}

Blockly.Arduino['socialrobot_rgb_color'] = function(block) {

  Blockly.Arduino.definitions_['define_rgb_color'] = "int rgb[3];\n";
  var redComponent = block.getFieldValue('RED');
  var greenComponent = block.getFieldValue('GREEN');
  var blueComponent = block.getFieldValue('BLUE');

  var code = '';
  code += 'rgb[0] = ' + redComponent + ';\n';
  code += 'rgb[1] = ' + greenComponent + ';\n';
  code += 'rgb[2] = ' + blueComponent + ';\n';

  return [code, Blockly.Arduino.ORDER_ATOMIC];
}

Blockly.Arduino['socialrobot_rgb_color_with_numbers'] = function(block) {
  Blockly.Arduino.definitions_['define_rgb_color'] = "int rgb[3];\n";

  var redComponent = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_NONE);
  var greenComponent = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_NONE);
  var blueComponent = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_NONE);

  var code = '';
  code += 'rgb[0] = ' + redComponent + ';\n';
  code += 'rgb[1] = ' + greenComponent + ';\n';
  code += 'rgb[2] = ' + blueComponent + ';\n';

  return code;
}

Blockly.Arduino['socialrobot_servo'] = function (block) {
  let value_pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_ATOMIC);
  let value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_pin] = "int servoPin" + value_pin + " = " + value_pin +";\n" 
                                                                      + "Servo servoOnPin" + value_pin + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_pin] = 'servoOnPin' + value_pin + '.attach(servoPin' + value_pin + ');\n';
  code = 'servoOnPin' + value_pin + '.write(' + value_angle + ');\n';
  
  return code;
};

Blockly.Arduino['socialrobot_arms_down'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand1', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');\n';
  code += 'servoOnPin' + value_servo_right_hand + '.write(180);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');\n';
  code += 'servoOnPin' + value_servo_left_hand + '.write(0);\n';

  return code;
};

Blockly.Arduino['socialrobot_arms_up'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand2', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand2', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');\n';
  code += 'servoOnPin' + value_servo_right_hand + '.write(0);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');\n';
  code += 'servoOnPin' + value_servo_left_hand + '.write(180);\n';

  return code;
};

Blockly.Arduino['socialrobot_wave_arms'] = function(block) {
  var value_servo_right_hand = Blockly.JavaScript.valueToCode(block, 'servo_right_hand', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.JavaScript.valueToCode(block, 'servo_left_hand', Blockly.JavaScript.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';
  
  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');\n';
  code += 'servoOnPin' + value_servo_right_hand + '.write(0);\n';


  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');\n';
  code += 'servoOnPin' + value_servo_left_hand + '.write(180);\n';

  code += 'delay(' + '1000' + ');\n';

  code += 'servoOnPin' + value_servo_right_hand + '.write(180);\n';
  code += 'servoOnPin' + value_servo_left_hand + '.write(0);\n';

  code += 'delay(' + '1000' + ');\n';

  return code;
}

Blockly.Arduino['socialrobot_eyes_left'] = function(block) {
  var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_eye] = "int servoPin" + value_servo_right_eye + " = " + value_servo_right_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_eye] = 'servoOnPin' + value_servo_right_eye + '.attach(servoPin' + value_servo_right_eye + ');\n';
  code += 'servoOnPin' + value_servo_right_eye + '.write(0);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_eye] = "int servoPin" + value_servo_left_eye + " = " + value_servo_left_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_eye] = 'servoOnPin' + value_servo_left_eye + '.attach(servoPin' + value_servo_left_eye + ');\n';
  code += 'servoOnPin' + value_servo_left_eye + '.write(0);\n';


  return code;
}

Blockly.Arduino['socialrobot_eyes_right'] = function(block) {
  var value_servo_right_eye = Blockly.JavaScript.valueToCode(block, 'servo_right_eye1', Blockly.JavaScript.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.JavaScript.valueToCode(block, 'servo_left_eye1', Blockly.JavaScript.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_eye] = "int servoPin" + value_servo_right_eye + " = " + value_servo_right_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_eye] = 'servoOnPin' + value_servo_right_eye + '.attach(servoPin' + value_servo_right_eye + ');\n';
  code += 'servoOnPin' + value_servo_right_eye + '.write(120);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_eye] = "int servoPin" + value_servo_left_eye + " = " + value_servo_left_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_eye] = 'servoOnPin' + value_servo_left_eye + '.attach(servoPin' + value_servo_left_eye + ');\n';
  code += 'servoOnPin' + value_servo_left_eye + '.write(120);\n';

  return code;
}

Blockly.Arduino['socialrobot_set_pin'] = function(block){
  var pin_number = Blockly.Arduino.valueToCode(block, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  var led_state = Blockly.Arduino.valueToCode(block, "PIN_STATE", Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.setups_['setup_output_'+pin_number] = 'pinMode('+pin_number+', OUTPUT);';
  
  var code = 'digitalWrite(' + pin_number + ', ' + led_state + ');\n'
  return code;
};

Blockly.Arduino['socialrobot_read_pin'] = function(block){
    var pin_number = Blockly.Arduino.valueToCode(block, "PIN", Blockly.Arduino.ORDER_ATOMIC);
    Blockly.Arduino.setups_['setup_input_' + pin_number] = 'pinMode(' + pin_number + ', INPUT);\n';

    var code = 'digitalRead(' + pin_number + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};