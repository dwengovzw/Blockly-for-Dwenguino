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
    var col1 = Blockly.Arduino.valueToCode(block, 'color1', Blockly.Arduino.ORDER_NONE);
    var col2 = Blockly.Arduino.valueToCode(block, 'color2', Blockly.Arduino.ORDER_NONE);
    var col3 = Blockly.Arduino.valueToCode(block, 'color3', Blockly.Arduino.ORDER_NONE);
    var col4 = Blockly.Arduino.valueToCode(block, 'color4', Blockly.Arduino.ORDER_NONE);
    var col5 = Blockly.Arduino.valueToCode(block, 'color5', Blockly.Arduino.ORDER_NONE);
    
    Blockly.Arduino.definitions_['include_adafruit_dotstar_h'] = "#include <Adafruit_DotStar.h>\n";
    // Blockly.Arduino.definitions_['define_spi_h'] = "#include <SPI.h>\n";
    Blockly.Arduino.definitions_['define_ledstrip'] = "Adafruit_DotStar ledStrip(25, " + datapin + ", " + clockpin + ", DOTSTAR_BRG);";
    Blockly.Arduino.definitions_['define_leds'] = "int leds[] = {2, 7, 12, 17, 22};\n";

    Blockly.Arduino.setups_['setup_ledstrip_begin'] = "ledStrip.begin();";
    Blockly.Arduino.setups_['setup_ledstrip_show'] = "ledStrip.show();\n";

    console.log(col1);

    var code = `
int colors[][3] = {${col1}, ${col2}, ${col3}, ${col4}, ${col5}};
int strip_index;
for(strip_index = 0; strip_index < 5; strip_index++){
    ledStrip.setPixelColor(leds[strip_index], colors[strip_index][0] > 0 ? colors[strip_index][0] : 0 , colors[strip_index][1] > 0 ? colors[strip_index][1] : 0, colors[strip_index][2] > 0 ? colors[strip_index][2] : 0);
}
ledStrip.show();
    `;
    return code
};


Blockly.Arduino['conveyor_rgb_off'] = function (block) {
    var code = '{-1,-1,-1}';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino['conveyor_rgb_color'] = function (block) {
    var r = block.getFieldValue('RED');
    var g = block.getFieldValue('GREEN');
    var b = block.getFieldValue('BLUE');
    var code = '{' + g + ',' + r + ',' + b + '}';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_rgb_color_with_numbers'] = function (block) {
    var r = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_NONE);
    var g = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_NONE);
    var b = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_NONE);
    var code = '{' + g + ',' + r + ',' + b + '}';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['conveyor_color_sensor'] = function (block) {
    var pin = Blockly.Arduino.valueToCode(block, 'pin', Blockly.Arduino.ORDER_NONE);
    // Because there are only 14 digital pins, 4 analog pins are used as digital pins.
    Blockly.Arduino.definitions_['define_S0'] = "const int S0 = A0;";  // Frequency scaling
    Blockly.Arduino.definitions_['define_S1'] = "const int S1 = A1;";  // Frequency scaling
    Blockly.Arduino.definitions_['define_S2'] = "const int S2 = A2";  // Filter selection
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
int sensorVal(char type, int outPin) {
    int value = 0, frequency = 0;
    if(type == 'r'){
        digitalWrite(S2,LOW);
        digitalWrite(S3,LOW);
        frequency = pulseIn(outPin, LOW);
        value = map(frequency, 60, 280, 255, 0);
    } else if(type == 'g') {
        digitalWrite(S2,HIGH);
        digitalWrite(S3,HIGH);
        frequency = pulseIn(outPin, LOW);
        value = map(frequency, 60, 300, 255, 0);
    } else if(type == 'b') {
        digitalWrite(S2,LOW);
        digitalWrite(S3,HIGH);
        frequency = pulseIn(outPin, LOW);
        value = map(frequency, 60, 240, 255, 0);
    }
    delay(100);
    return value;
}
    `;


    var code = "{sensorVal('g', " + pin + "), sensorVal('r', " + pin + "), sensorVal('b', " + pin + ")}";
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

Blockly.Arduino['logic_compare_color'] = function(block) {
    var operator = block.getFieldValue('OP');
    var order = (operator == 'EQ' || operator == 'NEQ') ?
        Blockly.Arduino.ORDER_EQUALITY : Blockly.Arduino.ORDER_RELATIONAL;
    var colA = Blockly.Arduino.valueToCode(block, 'colorA', order).replace(/(^{)|(}$)/g, "") || '0, 0, 0';
    var colB = Blockly.Arduino.valueToCode(block, 'colorB', order).replace(/(^{)|(}$)/g, "") || '0, 0, 0';

    Blockly.Arduino.definitions_['function_compareColors'] = `
int compareColors(char op, int r1, int g1, int b1, int r2, int g2, int b2) {
    if(op == 'E'){
        return r1 == r2 && g1 == g2 && b1 == b2;
    } else if(op == 'N'){
        return !(r1 == r2 && g1 == g2 && b1 == b2);
    } else {
        return 0;
    }
}
    `;
    var code = "compareColors('" + operator.charAt(0) + "', " + colA + ", " + colB + ")";
    return [code, order];
  };
