/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';

goog.provide('Blockly.Arduino');

goog.require('Blockly.Generator');


/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Arduino = new Blockly.Generator('Arduino');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Arduino.addReservedWords(
  // http://arduino.cc/en/Reference/HomePage
  'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts'
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly.Arduino.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4;       // + -
Blockly.Arduino.ORDER_SHIFT = 5;          // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6;     // is is! >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8;    // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10;    // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_NONE = 99;          // (...)


Blockly.Arduino.TYPES = [
                  [
                      "int",
                      "int"
                  ],
                  [
                      "double",
                      "double"
                  ],
                  [
                      "String",
                      "String"
                  ],
                  [
                      "char",
                      "char"
                  ],
                  [
                      "unsigned int",
                      "unsigned int"
                  ],
                  [
                      "unsigned char",
                      "unsigned char"
                  ]
             ];

/*
 * Arduino Board profiles
 *
 */
var profile = {
  arduino: {
    description: "Arduino standard-compatible board",
    digital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    analog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    serial: 9600
  },
  dwenguino: {
    description: "Dwenguino: A multifunctional and Arduino-compatible micro-controllerboard",
    digital: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"],
              ["11", "11"], ["12", "12"], ["13", "13"], ["15", "15"], ["16", "16"], ["17", "17"], ["18", "18"], ["19", "19"], ["20", "20"],
              ["21", "21"], ["22", "22"], ["23", "23"],
              ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"],
              ["SW_N", "SW_N"], ["SW_E", "SW_E"], ["SW_S", "SW_S"], ["SW_W", "SW_W"], ["SW_C", "SW_C"], ["BUZZER", "BUZZER"]],
    analog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    serial: 9600,
    leds: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]
        , ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["13", "13"]],
    switches: [["SW_N", "SW_N"], ["SW_E", "SW_E"], ["SW_S", "SW_S"], ["SW_W", "SW_W"], ["SW_C", "SW_C"]]

  },
  arduino_mega: {
    description: "Arduino Mega-compatible board"
    //53 digital
    //15 analog
  }
};
//set default profile to arduino standard-compatible board
profile["default"] = profile["dwenguino"];
//alert(profile.default.digital[0]);

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function(workspace) {
  //save reference to workspace
  Blockly.Arduino.workspace = workspace;
  // Create a dictionary of definitions to be printed before setups.
  Blockly.Arduino.definitions_ = Object.create(null);
  // Create a dictionary of setups to be printed before the code.
  Blockly.Arduino.setups_ = Object.create(null);

  //Create a dictionary for variable types and names
    if (!Blockly.Arduino.variableDB_) {
            Blockly.Arduino.variableDB_ =
                            new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
    } else {
            Blockly.Arduino.variableDB_.reset();
    }

    Blockly.Arduino.variableDB_.setVariableMap(workspace.getVariableMap());

};



/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function(code) {
  //If code is empty and no function definitions, don't return any code
  /*if (code == '' && Object.keys(Blockly.Arduino.definitions_).length === 0 ){
      return "";
  }*/
  // Indent every line.
  code = '  ' + code.replace(/\n/g, '\n  ');
  code = code.replace(/\n\s+$/, '\n');
  code = 'void loop() \n{\n' + code + '\n}';

  // The hardware setting that the user selected
 // let hardwareViewCheckbox = document.querySelector('input[id="hardware_checkbox"]');

  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Arduino.definitions_) {
    var def = Blockly.Arduino.definitions_[name];

    if (def.match(/^#include/)) {

      //if (!hardwareViewCheckbox.checked) {
        imports.push(def);
      /*} else {
        if(name != 'define_dwenguino_h'){
          imports.push(def);
        }
      }*/
      
    } else {
      definitions.push(def);
    }
  }

  // Convert the setups dictionary into a list.
  var setups = [];

  // Ensure that initDwenguino() is always on the first command in setup() if Dwenguino (and not Arduino) is checked
  //if (!hardwareViewCheckbox.checked) {
    if('userSetupCode' in Blockly.Arduino.setups_){
      setups.push(Blockly.Arduino.setups_['userSetupCode']);
    }
  //}

  for (var name in Blockly.Arduino.setups_) {
    if(name != 'userSetupCode')
      setups.push(Blockly.Arduino.setups_[name]);
  }

  var allDefs = imports.join('\n') + '\n\n' + definitions.join('\n') + '\nvoid setup() \n{\n  '+setups.join('\n  ') + '\n}'+ '\n\n';
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function(line) {
  console.log(line);
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly.Arduino.scrub_ = function(block, code) {
    //Do not translate non connectet top bocks except for the setup_loop block and the function definition blocks.
    if (block === block.getRootBlock()
        && !(block.type == 'setup_loop_structure'
            || block.type == 'setup_loop_structure_arduino'
            || block.type == 'procedures_defnoreturn'
            || block.type == 'procedures_defreturn')){
        return "";
    }
  //alert(block === block.getRootBlock() && !(block.));
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Arduino.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Arduino.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Arduino.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Arduino.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Empties the Arduino setups array to remove unused setup definitions.
 * This function needs to be called before generating the code for the workspace.
 */
Blockly.Arduino.emptySetup = function(){
  Blockly.Arduino.definitions_ = Object.create(null);
  Blockly.Arduino.setups_ = Object.create(null);
}