# DwenguinoBlocklyArduinoPlugin

This folder contains the netbeans project, source code, libraries and binaries for the Arduino tool.
The Arduino ide is based on the processing ide which allows plugin development through the Tool interface. This interface enables communication between the Arduino ide and this plugin.


## Implementation notes

* The plugin uses a JavaFX WebView to render Google Blockly.
* The DwenguinoBlocklyServer.java file contains a special class which handles calls from Google Blockly (Upload, save, open).
