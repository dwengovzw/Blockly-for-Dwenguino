/**
 * @fileoverview Generating Dwenguino blocks.
 */
 'use strict';

 goog.provide('Blockly.Arduino.output');
 
 goog.require('Blockly.Arduino');

 Blockly.Arduino.output.pinMappings = {
  "RGBLED1": 
      {
         "red": 11,
         "green": 14,
         "blue": 15
      },
  "SERVO1":
      {
        "pin": 40
      },
  "SERVO2":
      {
        "pin": 41
      },
  "SERVO3":
      {
        "pin": 19
      },
  "SERVO4":
      {
        "pin": 18
      },
  "SERVO5":
      {
        "pin": 17
      },
  "SERVO6":
      {
        "pin": 16
      }
};
 
 // This is now integrated in the setup loop structure so children don't have to know about the initialisation step and can just start coding
 Blockly.Arduino['initdwenguino'] = function (block) {
    return code;
 };

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
  [ ], // 21
  [ 0, 126, 129, 177, 177, 130, 124, 0],  // 22 - 'Angry R 1'
  [ 0, 126, 129, 177, 178, 132, 120, 0],  // 23 - 'Angry R 2'
  [ 0, 126, 129, 178, 164, 136, 112, 0],  // 24 - 'Angry R 3'
  [ 0, 127, 130, 180, 168, 144, 96, 0], // 25 - 'Angry R 4'
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

Blockly.Arduino['output_show_ledmatrix_image'] = function(block) {
      Blockly.Arduino.definitions_['define_ledcontroller'] = '#include <LedController.hpp>';
      Blockly.Arduino.definitions_['define_ledcontroller_object'] = 'auto led_matrix = LedController<4,1>();';
      Blockly.Arduino.definitions_['define_ledcontroller_byteblock'] = 'ByteBlock pattern = {};';
    
      Blockly.Arduino.setups_['define_ledcontroller_configuration'] = 'auto conf = controller_configuration<4,1>();';
      Blockly.Arduino.setups_['define_ledcontroller_spi'] = 'conf.useHardwareSpi = false;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_clk'] = 'conf.SPI_CLK = 13;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_mosi'] = 'conf.SPI_MOSI = 2;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_cs'] = 'conf.SPI_CS = 10;';
      Blockly.Arduino.setups_['define_ledcontroller_conf_init'] = 'led_matrix.init(conf);';
      Blockly.Arduino.setups_['define_ledcontroller_activate'] = 'led_matrix.activateAllSegments();';
      Blockly.Arduino.setups_['define_ledcontroller_intensity'] = 'led_matrix.setIntensity(8);';
      Blockly.Arduino.setups_['define_ledcontroller_clear'] = 'led_matrix.clearMatrix();';
      
      let code = '';
    
      let segment = block.getFieldValue('NUMBERDISPLAY');
      let matrix = '{';
      for (var row = 0; row <= 7; row++) {
          matrix += 'B'
          for (var column = 0; column <= 7; column++) {
              if (block.getFieldValue('LED' + column + row) === 'TRUE') {
                  matrix += '1';
              } else {
                  matrix += '0';
              }
          }
          if(!(row == 7)){
            matrix += ',';
          }
      }
      matrix += '}';
    
      code += 'pattern = ';
      code += matrix;
      code += ';\n';
      code += 'led_matrix.displayOnSegment(';
      code += segment;
      code += ', pattern);\n';
    
      return code;
    }
    
Blockly.Arduino['output_show_ledmatrix_eye_pattern'] = function(block) {
      Blockly.Arduino.definitions_['define_ledcontroller'] = '#include <LedController.hpp>';
      Blockly.Arduino.definitions_['define_ledcontroller_object'] = 'auto led_matrix = LedController<4,1>();';
      Blockly.Arduino.definitions_['define_ledcontroller_byteblock'] = 'ByteBlock pattern = {};';
    
      Blockly.Arduino.setups_['define_ledcontroller_configuration'] = 'auto conf = controller_configuration<4,1>();';
      Blockly.Arduino.setups_['define_ledcontroller_spi'] = 'conf.useHardwareSpi = false;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_clk'] = 'conf.SPI_CLK = 13;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_mosi'] = 'conf.SPI_MOSI = 2;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_cs'] = 'conf.SPI_CS = 10;';
      Blockly.Arduino.setups_['define_ledcontroller_conf_init'] = 'led_matrix.init(conf);';
      Blockly.Arduino.setups_['define_ledcontroller_activate'] = 'led_matrix.activateAllSegments();';
      Blockly.Arduino.setups_['define_ledcontroller_intensity'] = 'led_matrix.setIntensity(8);';
      Blockly.Arduino.setups_['define_ledcontroller_clear'] = 'led_matrix.clearMatrix();';
      
      let code = '';
    
      let segment = block.getFieldValue('NUMBERDISPLAY');
      let eyePatternIndex = block.getFieldValue('EYEPATTERN');
      let eyePattern = eyePatterns[parseInt(eyePatternIndex)];
    
      let columns  = ['', '', '', '', '', '', '', ''];
      let rows = ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'];
    
      let matrix = '{';
      for (var column = 0; column < 8; column++) {
          let columnBinary = eyePattern[column].toString(2);
          columnBinary = columnBinary.padStart(8, "0");
          //columnBinary = columnBinary.split("").reverse().join("");
          columns[column] = columnBinary;
      }
    
      for (var i = 0; i < 8; i++){
        for(var column = 0; column < 8; column++) {
          rows[i] += columns[7-column].substring(i,i+1);
        }
        matrix += rows[i];
        if (!(i == 7)){
          matrix += ',';
        }
      }
      matrix += '}';
    
      code += 'pattern = ';
      code += matrix;
      code += ';\n';
      code += 'led_matrix.displayOnSegment(';
      code += segment;
      code += ', pattern);\n';
    
      return code;
    }
    
Blockly.Arduino['output_clear_ledmatrix_segment'] = function(block) {
      Blockly.Arduino.definitions_['define_ledcontroller'] = '#include <LedController.hpp>';
      Blockly.Arduino.definitions_['define_ledcontroller_object'] = 'auto led_matrix = LedController<4,1>();';
      Blockly.Arduino.definitions_['define_ledcontroller_byteblock'] = 'ByteBlock pattern = {};';
    
      Blockly.Arduino.setups_['define_ledcontroller_configuration'] = 'auto conf = controller_configuration<4,1>();';
      Blockly.Arduino.setups_['define_ledcontroller_spi'] = 'conf.useHardwareSpi = false;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_clk'] = 'conf.SPI_CLK = 13;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_mosi'] = 'conf.SPI_MOSI = 2;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_cs'] = 'conf.SPI_CS = 10;';
      Blockly.Arduino.setups_['define_ledcontroller_conf_init'] = 'led_matrix.init(conf);';
      Blockly.Arduino.setups_['define_ledcontroller_activate'] = 'led_matrix.activateAllSegments();';
      Blockly.Arduino.setups_['define_ledcontroller_intensity'] = 'led_matrix.setIntensity(8);';
      Blockly.Arduino.setups_['define_ledcontroller_clear'] = 'led_matrix.clearMatrix();';
      
      let code = '';
      let segment = block.getFieldValue('NUMBERDISPLAY');
    
      code += 'led_matrix.clearSegment(';
      code += segment;
      code += ');\n';
    
      return code;
    }
    
Blockly.Arduino['output_clear_ledmatrix'] = function(block) {
      Blockly.Arduino.definitions_['define_ledcontroller'] = '#include <LedController.hpp>';
      Blockly.Arduino.definitions_['define_ledcontroller_object'] = 'auto led_matrix = LedController<4,1>();';
      Blockly.Arduino.definitions_['define_ledcontroller_byteblock'] = 'ByteBlock pattern = {};';
    
      Blockly.Arduino.setups_['define_ledcontroller_configuration'] = 'auto conf = controller_configuration<4,1>();';
      Blockly.Arduino.setups_['define_ledcontroller_spi'] = 'conf.useHardwareSpi = false;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_clk'] = 'conf.SPI_CLK = 13;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_mosi'] = 'conf.SPI_MOSI = 2;';
      Blockly.Arduino.setups_['define_ledcontroller_spi_cs'] = 'conf.SPI_CS = 10;';
      Blockly.Arduino.setups_['define_ledcontroller_conf_init'] = 'led_matrix.init(conf);';
      Blockly.Arduino.setups_['define_ledcontroller_activate'] = 'led_matrix.activateAllSegments();';
      Blockly.Arduino.setups_['define_ledcontroller_intensity'] = 'led_matrix.setIntensity(8);';
      Blockly.Arduino.setups_['define_ledcontroller_clear'] = 'led_matrix.clearMatrix();';
      
      let code = '';
    
      code += 'led_matrix.clearMatrix();\n';
    
      return code;
};

Blockly.Arduino['output_rgbled_select'] = function(block) {
  var number = this.getFieldValue('number');
  var pin_red = Blockly.Arduino.output.pinMappings[number]["red"];
  var pin_green = Blockly.Arduino.output.pinMappings[number]["green"]; 
  var pin_blue = Blockly.Arduino.output.pinMappings[number]["blue"]; 
  var color = Blockly.Arduino.valueToCode(block, 'color', Blockly.Arduino.ORDER_NONE);

  //Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += 'pinMode(' + pin_red + ', OUTPUT);\n';
  code += 'pinMode(' + pin_green + ', OUTPUT);\n';
  code += 'pinMode(' + pin_blue + ', OUTPUT);\n';
  code += color + '\n';
  code += 'analogWrite(' + pin_red + ', ' + 'red_value' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + 'green_value' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + 'blue_value' + ');\n';
  return code;
}

Blockly.Arduino['output_rgbled'] = function(block) {
  var pin_red = Blockly.Arduino.valueToCode(block, 'pin_red', Blockly.Arduino.ORDER_NONE);
  var pin_green = Blockly.Arduino.valueToCode(block, 'pin_green', Blockly.Arduino.ORDER_NONE);
  var pin_blue = Blockly.Arduino.valueToCode(block, 'pin_blue', Blockly.Arduino.ORDER_NONE);
  var color = Blockly.Arduino.valueToCode(block, 'color', Blockly.Arduino.ORDER_NONE);

  //Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += 'pinMode(' + pin_red + ', OUTPUT);\n';
  code += 'pinMode(' + pin_green + ', OUTPUT);\n';
  code += 'pinMode(' + pin_blue + ', OUTPUT);\n';
  code += color + "\n";
  code += 'analogWrite(' + pin_red + ', ' + 'red_value' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + 'green_value' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + 'blue_value' + ');\n';
  return code;
}

Blockly.Arduino['output_rgbled_select_off'] = function(block) {
  var number = this.getFieldValue('number');
  var pin_red = Blockly.Arduino.output.pinMappings[number]["red"];
  var pin_green = Blockly.Arduino.output.pinMappings[number]["green"]; 
  var pin_blue = Blockly.Arduino.output.pinMappings[number]["blue"]; 
  
  //Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += 'pinMode(' + pin_red + ', OUTPUT);\n';
  code += 'pinMode(' + pin_green + ', OUTPUT);\n';
  code += 'pinMode(' + pin_blue + ', OUTPUT);\n';
  code += 'analogWrite(' + pin_red + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + '0' + ');\n';
  return code;
}

Blockly.Arduino['output_rgbled_off'] = function(block) {
  var pin_red = Blockly.Arduino.valueToCode(block, 'pin_red', Blockly.Arduino.ORDER_NONE);
  var pin_green = Blockly.Arduino.valueToCode(block, 'pin_green', Blockly.Arduino.ORDER_NONE);
  var pin_blue = Blockly.Arduino.valueToCode(block, 'pin_blue', Blockly.Arduino.ORDER_NONE);

  //Blockly.Arduino.setups_['setup_output_' + pin_red] = 'pinMode(' + pin_red + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_green] = 'pinMode(' + pin_green + ', OUTPUT);';
  //Blockly.Arduino.setups_['setup_output_' + pin_blue] = 'pinMode(' + pin_blue + ', OUTPUT);';

  var code = '';
  code += 'pinMode(' + pin_red + ', OUTPUT);\n';
  code += 'pinMode(' + pin_green + ', OUTPUT);\n';
  code += 'pinMode(' + pin_blue + ', OUTPUT);\n';
  code += 'analogWrite(' + pin_red + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_green + ', ' + '0' + ');\n';
  code += 'analogWrite(' + pin_blue + ', ' + '0' + ');\n';
  return code;
}

Blockly.Arduino['output_rgb_color'] = function(block) {
  Blockly.Arduino.definitions_['define_rgb_color'] = "int red_value;\n int green_value;\n int blue_value;\n";
  var redComponent = block.getFieldValue('RED');
  var greenComponent = block.getFieldValue('GREEN');
  var blueComponent = block.getFieldValue('BLUE');

  var code = '';
  code += 'red_value = ' + redComponent + ';\n';
  code += 'green_value = ' + greenComponent + ';\n';
  code += 'blue_value = ' + blueComponent + ';\n';

  return [code, Blockly.Arduino.ORDER_ATOMIC];
}

Blockly.Arduino['output_rgb_color_with_numbers'] = function(block) {
  Blockly.Arduino.definitions_['define_rgb_color'] = "int red_value;\n int green_value;\n int blue_value;\n";

  var redComponent = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_NONE);
  var greenComponent = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_NONE);
  var blueComponent = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_NONE);

  var code = '';
  code += 'red_value = ' + redComponent + ';\n';
  code += 'green_value = ' + greenComponent + ';\n';
  code += 'blue_value = ' + blueComponent + ';\n';

  return code;
}

Blockly.Arduino['output_servo_with_dropdown'] = function (block) {
  let value_pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_ATOMIC);
  let value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_pin] = "int servoPin" + value_pin + " = " + value_pin +";\n" 
                                                                      + "Servo servoOnPin" + value_pin + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_pin] = 'servoOnPin' + value_pin + '.attach(servoPin' + value_pin + ');';
  code = 'servoOnPin' + value_pin + '.write(' + value_angle + ');\n';
  
  return code;
};

Blockly.Arduino['output_servo_dropdown'] = function(block){
  var servo = this.getFieldValue('SERVO_DROPDOWN');
  var pin_servo = Blockly.Arduino.output.pinMappings[servo]["pin"];

  var code = pin_servo;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
}

Blockly.Arduino['output_servo'] = function (block) {
  let value_pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_ATOMIC);
  let value_angle = Blockly.Arduino.valueToCode(block, 'angle', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_pin] = "int servoPin" + value_pin + " = " + value_pin +";\n" 
                                                                      + "Servo servoOnPin" + value_pin + ";\n";
  //Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_pin] = 'servoOnPin' + value_pin + '.attach(servoPin' + value_pin + ');';
  code += 'servoOnPin' + value_pin + '.attach(servoPin' + value_pin + ');\n'
  code += 'servoOnPin' + value_pin + '.write(' + value_angle + ');\n';
  
  return code;
};

Blockly.Arduino['output_arms_down'] = function(block) {
  var value_servo_right_hand = Blockly.Arduino.valueToCode(block, 'servo_right_hand1', Blockly.Arduino.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.Arduino.valueToCode(block, 'servo_left_hand1', Blockly.Arduino.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');';
  code += 'servoOnPin' + value_servo_right_hand + '.write(0);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');';
  code += 'servoOnPin' + value_servo_left_hand + '.write(0);\n';

  return code;
};

Blockly.Arduino['output_arms_up'] = function(block) {
  var value_servo_right_hand = Blockly.Arduino.valueToCode(block, 'servo_right_hand2', Blockly.Arduino.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.Arduino.valueToCode(block, 'servo_left_hand2', Blockly.Arduino.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');';
  code += 'servoOnPin' + value_servo_right_hand + '.write(180);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');';
  code += 'servoOnPin' + value_servo_left_hand + '.write(180);\n';

  return code;
};

Blockly.Arduino['output_wave_arms'] = function(block) {
  var value_servo_right_hand = Blockly.Arduino.valueToCode(block, 'servo_right_hand', Blockly.Arduino.ORDER_ATOMIC);
  var value_servo_left_hand = Blockly.Arduino.valueToCode(block, 'servo_left_hand', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';
  
  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_hand] = "int servoPin" + value_servo_right_hand + " = " + value_servo_right_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_hand] = 'servoOnPin' + value_servo_right_hand + '.attach(servoPin' + value_servo_right_hand + ');';
  code += 'servoOnPin' + value_servo_right_hand + '.write(0);\n';


  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_hand] = "int servoPin" + value_servo_left_hand + " = " + value_servo_left_hand +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_hand + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_hand] = 'servoOnPin' + value_servo_left_hand + '.attach(servoPin' + value_servo_left_hand + ');';
  code += 'servoOnPin' + value_servo_left_hand + '.write(180);\n';

  code += 'delay(' + '1000' + ');\n';

  code += 'servoOnPin' + value_servo_right_hand + '.write(180);\n';
  code += 'servoOnPin' + value_servo_left_hand + '.write(0);\n';

  code += 'delay(' + '1000' + ');\n';

  return code;
};

Blockly.Arduino['output_eyes_left'] = function(block) {
  var value_servo_right_eye = Blockly.Arduino.valueToCode(block, 'servo_right_eye', Blockly.Arduino.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.Arduino.valueToCode(block, 'servo_left_eye', Blockly.Arduino.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_eye] = "int servoPin" + value_servo_right_eye + " = " + value_servo_right_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_eye] = 'servoOnPin' + value_servo_right_eye + '.attach(servoPin' + value_servo_right_eye + ');';
  code += 'servoOnPin' + value_servo_right_eye + '.write(0);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_eye] = "int servoPin" + value_servo_left_eye + " = " + value_servo_left_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_eye] = 'servoOnPin' + value_servo_left_eye + '.attach(servoPin' + value_servo_left_eye + ');';
  code += 'servoOnPin' + value_servo_left_eye + '.write(0);\n';

  return code;
};

Blockly.Arduino['output_eyes_right'] = function(block) {
  var value_servo_right_eye = Blockly.Arduino.valueToCode(block, 'servo_right_eye1', Blockly.Arduino.ORDER_ATOMIC);
  var value_servo_left_eye = Blockly.Arduino.valueToCode(block, 'servo_left_eye1', Blockly.Arduino.ORDER_ATOMIC);
  
  Blockly.Arduino.definitions_['define_servo_h'] = "#include <Servo.h>\n";

  var code = '';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_right_eye] = "int servoPin" + value_servo_right_eye + " = " + value_servo_right_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_right_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_right_eye] = 'servoOnPin' + value_servo_right_eye + '.attach(servoPin' + value_servo_right_eye + ');';
  code += 'servoOnPin' + value_servo_right_eye + '.write(120);\n';

  Blockly.Arduino.definitions_['define_servo_on_pin' + value_servo_left_eye] = "int servoPin" + value_servo_left_eye + " = " + value_servo_left_eye +";\n" 
                                                                      + "Servo servoOnPin" + value_servo_left_eye + ";\n";
  Blockly.Arduino.setups_['define_dwenguino_servo_on_pin' + value_servo_left_eye] = 'servoOnPin' + value_servo_left_eye + '.attach(servoPin' + value_servo_left_eye + ');';
  code += 'servoOnPin' + value_servo_left_eye + '.write(120);\n';

  return code;
};

Blockly.Arduino['output_set_pin'] = function(block){
  var pin_number = Blockly.Arduino.valueToCode(block, "PIN", Blockly.Arduino.ORDER_ATOMIC);
  var led_state = Blockly.Arduino.valueToCode(block, "PIN_STATE", Blockly.Arduino.ORDER_ATOMIC);

  //Blockly.Arduino.setups_['setup_output_'+pin_number] = 'pinMode('+pin_number+', OUTPUT);\n';
  var code = 'pinMode('+pin_number+', OUTPUT);\n';
  code += 'digitalWrite(' + pin_number + ', ' + led_state + ');\n'
  return code;
};