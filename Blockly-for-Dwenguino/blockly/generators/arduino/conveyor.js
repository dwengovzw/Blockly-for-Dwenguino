/**
 * @fileoverview Generating conveyor scenario blocks.
 * @author jari.degraeve@UGent.be     (Jari De Graeve)
 */
'use strict';

goog.provide('Blockly.Arduino.conveyor');

goog.require('Blockly.Arduino');


// This is now integrated in the setup loop structure so children don't have to know about the initialisation step and can just start coding
Blockly.Arduino['initdwenguino'] = function (block) {

    return code;
};

Blockly.Arduino['conveyor_ledstrip'] = function (block) {
    var clockpin = Blockly.Arduino.valueToCode(block, 'clockPin', Blockly.Arduino.ORDER_NONE);
    var datapin = Blockly.Arduino.valueToCode(block, 'dataPin', Blockly.Arduino.ORDER_NONE);

    var code = "";
    for (let i = 1; i < 6; i++){
        var col = parseInt(Blockly.Arduino.valueToCode(block, 'color' + i, Blockly.Arduino.ORDER_NONE) || '0');
        if (isNaN(col)) {
            code += 'int col_value_' + i + ' = '+ Blockly.Arduino.valueToCode(block, 'color' + i, Blockly.Arduino.ORDER_NONE) + ';\n';
        }
    }

    code += "int colors[][3] = {";
    for (let i = 1; i < 6; i++) {
        var col = parseInt(Blockly.Arduino.valueToCode(block, 'color' + i, Blockly.Arduino.ORDER_NONE) || '0');
        if(!isNaN(col)){
            var b = Math.trunc(col / 65536);
            var g = Math.trunc((col - b * 65536)/256);
            var r = Math.trunc(col - b * 65536 - g * 256);
            code += '{' + r + ',' + g + ',' + b + '}';
        } else {
            code += '{col_value_'+ i +' - (col_value_'+ i +' / 65536) * 65536 - ((col_value_'+ i +' - (col_value_'+ i +' / 65536) * 65536)/256) * 256, (col_value_'+ i +' - (col_value_'+ i +' / 65536) * 65536)/256, col_value_'+ i +' / 65536}';
        }
        code += i == 5 ? '};\n' : ', ';
    }

    
    Blockly.Arduino.definitions_['include_adafruit_dotstar_h'] = "#include <Adafruit_DotStar.h>\n";
    // Blockly.Arduino.definitions_['define_spi_h'] = "#include <SPI.h>\n";
    Blockly.Arduino.definitions_['define_ledstrip'] = "Adafruit_DotStar ledStrip(25, " + datapin + ", " + clockpin + ", DOTSTAR_BRG);";
    Blockly.Arduino.definitions_['define_leds'] = "int leds[] = {24, 18, 12, 6, 0};\n";


    Blockly.Arduino.setups_['setup_ledstrip_begin'] = "ledStrip.begin();";
    Blockly.Arduino.setups_['setup_ledstrip_show'] = "ledStrip.show();\n";

    code += `int strip_index;
for(strip_index = 0; strip_index < 5; strip_index++){
    ledStrip.setPixelColor(leds[strip_index], colors[strip_index][0] > 0 ? colors[strip_index][0] : 0 , colors[strip_index][1] > 0 ? colors[strip_index][1] : 0, colors[strip_index][2] > 0 ? colors[strip_index][2] : 0);
}
ledStrip.show();
    `;
    return code
};


// Blockly.Arduino['conveyor_rgb_off'] = function (block) {
//     var code = '{-1,-1,-1}';
//     return [code, Blockly.Arduino.ORDER_ATOMIC];
// };


Blockly.Arduino['conveyor_rgb_color'] = function (block) {
    var r = parseInt(block.getFieldValue('RED'));
    var g = parseInt(block.getFieldValue('GREEN'));
    var b = parseInt(block.getFieldValue('BLUE'));
    var val = r + 256 * g + 65536 * b;
    var code = "" + val;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_rgb_color_with_numbers'] = function (block) {
    var r = parseInt(Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_NONE) || '0');
    var g = parseInt(Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_NONE) || '0');
    var b = parseInt(Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_NONE) || '0');
    var val = r + 256 * g + 65536 * b;
    var code = "" + val;
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_color'] = function (block) {
    let conv_colors = {
        noColor: "0",
        black: "855309",
        white: "16777215",
        gray: "8421504",
        red: "255",
        orange: "42495",
        yellow: "65535",
        greenyellow: "3145645",
        green: "32768",
        cyan: "16776960",
        blue: "16711680",
        purple: "8388736",
        pink: "13353215",
        magenta: "16711935"
    }
    var code = conv_colors[block.getFieldValue("COLOR_DROPDOWN")];
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_color_sensor'] = function (block) {
    var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
    // Because there are only 14 digital pins, 4 analog pins are used as digital pins.
    Blockly.Arduino.definitions_['define_S0'] = "const int S0 = A0;";  // Frequency scaling
    Blockly.Arduino.definitions_['define_S1'] = "const int S1 = A1;";  // Frequency scaling
    Blockly.Arduino.definitions_['define_S2'] = "const int S2 = A2;";  // Filter selection
    Blockly.Arduino.definitions_['define_S3'] = "const int S3 = A3;\n";  // Filter selection

    Blockly.Arduino.setups_['setup_S0'] = "pinMode(S0, OUTPUT);";
    Blockly.Arduino.setups_['setup_S1'] = "pinMode(S1, OUTPUT);";
    Blockly.Arduino.setups_['setup_S2'] = "pinMode(S2, OUTPUT);";
    Blockly.Arduino.setups_['setup_S3'] = "pinMode(S3, OUTPUT);";
    Blockly.Arduino.setups_['setup_outPin_' + pin] = "pinMode(" + pin + ", INPUT);";
    // Setting frequency scaling to 20%, common for Arduion (or Dwenguino)
    Blockly.Arduino.setups_['setup_S0_freq_scaling'] = "digitalWrite(S0, HIGH);";
    Blockly.Arduino.setups_['setup_S1_freq_scaling'] = "digitalWrite(S1, LOW);\n";

    Blockly.Arduino.definitions_['function_sensorVal'] = `
int sensorVal(int outPin) {
    int value = 0, frequency = 0;
    
    digitalWrite(S2,LOW);
    digitalWrite(S3,LOW);
    frequency = pulseIn(outPin, LOW);
    value = map(frequency, 60, 280, 255, 0);
    delay(100);

    digitalWrite(S2,HIGH);
    digitalWrite(S3,HIGH);
    frequency = pulseIn(outPin, LOW);
    value += map(frequency, 60, 300, 255, 0) * 256;
    delay(100);

    digitalWrite(S2,LOW);
    digitalWrite(S3,HIGH);
    frequency = pulseIn(outPin, LOW);
    value += map(frequency, 60, 240, 255, 0) * 65536;
    delay(100);

    return value;
}
    `;


    var code = "sensorVal(" + pin + ")";
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_belt'] = function (block) {
    var value_speed = Blockly.Arduino.valueToCode(block, 'speed', Blockly.Arduino.ORDER_ATOMIC);
    //import dwenguino motors
    Blockly.Arduino.definitions_['define_dwenguinomotor_h'] = "#include <DwenguinoMotor.h>\n";
    // declare motor on chosen channel
    Blockly.Arduino.definitions_['declare_dc_motor_on_channel_1'] = 'DCMotor conveyor' + '(MOTOR_1_0, MOTOR_1_1);\n';
    
    //start motor
    var code = 'conveyor.setSpeed(' + value_speed + ');\n';
    return code;
};


Blockly.Arduino['conveyor_button'] = function (block) {
    var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
    Blockly.Arduino.definitions_['define_buttonpin_' + pin] = "#define BUTTON_PIN_" + pin + " " + pin +"\n";
    Blockly.Arduino.setups_['setup_buttonpin_' + pin] = "pinMode(BUTTON_PIN_" + pin + ", INPUT);";
    var code = 'digitalRead(BUTTON_PIN_' + pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// Blockly.Arduino['logic_compare_color'] = function(block) {
//     var operator = block.getFieldValue('OP');
//     var order = (operator == 'EQ' || operator == 'NEQ') ?
//         Blockly.Arduino.ORDER_EQUALITY : Blockly.Arduino.ORDER_RELATIONAL;
//     var colA = Blockly.Arduino.valueToCode(block, 'colorA', order).replace(/(^{)|(}$)/g, "") || '0, 0, 0';
//     var colB = Blockly.Arduino.valueToCode(block, 'colorB', order).replace(/(^{)|(}$)/g, "") || '0, 0, 0';

//     Blockly.Arduino.definitions_['function_compareColors'] = `
// int compareColors(char op, int r1, int g1, int b1, int r2, int g2, int b2) {
//     if(op == 'E'){
//         return r1 == r2 && g1 == g2 && b1 == b2;
//     } else if(op == 'N'){
//         return !(r1 == r2 && g1 == g2 && b1 == b2);
//     } else {
//         return 0;
//     }
// }
//     `;
//     var code = "compareColors('" + operator.charAt(0) + "', " + colA + ", " + colB + ")";
//     return [code, order];
//   };
