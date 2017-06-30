Dwenguino graphical programming IDE!
===================


Hey! This repository contains the source code and binaries for our graphical programming environment for the [Dwenguino microcontroller](http://www.dwengo.org/tutorials/dwenguino) board. The IDE is based on Google Blockly and provides built in tutorials, a simulator and debugger. 

----------


Using the environment
-------------

The environment has to be run as a plugin for the Arduino IDE. To install the plugin download the the .zip archive located in the *bin* folder and extract it into the Arduino tools directory. The *tools* directory should be present in the default arduino sketchbook location. If the *tools* directory is not present, you should create it. To locate your Arduino sketchbook location, open the Arduino IDE and go to **File** > **Preferences** this opens a new window. At the top of this window you can see the default sketch location. To work correctly, the directory:

*YOUR_ARDUINO_SKETCHBOOK_LOCATION*/tools/DwenguinoBlocklyArduinoPlugin

should contain a folder named *DwenguinoBlockly* and a file named *DwenguinoBlocklyArduinoPlugin.jar*

To run the plugin, open the Arduino IDE and open **Tools** > **DwenguinoBlockly2.0**.

Contributing
-------------

**To the java plugin**

The java plugin performs the communication between the Arduino IDE and the DwenguinoIDE. It renders the IDE inside a JavaFX webview and performs the communication between Javascript and Java. It allows users to: upload code to the microcontroller board through the IDE, save block code to an xml file and load a saved file.
All code is located in the *DwenguinoBlocklyArduino* folder. 

**To the IDE**

The IDE is written in JavaScript, html and css. It is contained inside the *DwenguinoIDE* folder. It has a dependency on a adapted version of the Google Blockly library located inside the *blockly* folder. The blockly library depends on the closure library so the folder *closure-library* should be included together with the IDE. 
