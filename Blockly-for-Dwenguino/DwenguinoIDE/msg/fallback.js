var MSG_FALLBACK = {
  arduinoCodeCopied: "Arduino code copied to clipboard",
  title: "DwenguinoBlockly",
  blocks: "Blocks",
  linkTooltip: "Save and link to blocks.",
  runTooltip: "Run the program defined by the blocks in the workspace.",
  loadBlocksFileTooltip: "Load a blocks file you saved before",
  saveBlocksFileTooltip: "Save the blocks to a local file",
  toggleSimulator: "Toggle simulator view.",
  badCode: "Program error:\n%1",
  timeout: "Maximum execution iterations exceeded.",
  trashTooltip: "Discard all blocks.",
  catLogic: "Logic",
  catLoops: "Loops",
  catMath: "Math",
  catText: "Text",
  catLists: "Lists",
  catColour: "Colour",
  catArduino: "Arduino",
  catVariables: "Variables",
  catFunctions: "Functions",
  catDwenguino: "Dwenguino",
  catSocialRobot: "Social robot",
  catComments: "Comments",
  catBoardIO: "IO",
  createVar: "Create variable",
  listVariable: "list",
  textVariable: "text",
  httpRequestError: "There was a problem with the request.",
  linkAlert: "Share your blocks with this link:\n\n%1",
  hashError: "Sorry, '%1' doesn't correspond with any saved program.",
  xmlError: "Could not load your saved file. Perhaps it was created with a different version of Blockly?",
  badXml: "Error parsing XML:\n%1\n\nSelect 'OK' to abandon your changes or 'Cancel' to further edit the XML.",
  setup: "setup",
  loop: "loop",
  dwenguino_main_program_structure: "The code in the setup block is executed once at the start of the program. The code in the loop is repeated until the program stops.",
  catDwenguino: "Dwenguino",
  delay_help: "Wait a specified amount of milliseconds (1 second = 1000 milliseconds)",
  delay: "delay",
  clearLCD: "Clear LCD",
  dwenguinoLCD: "Dwenguino LCD %1 %2 %3 Write text: %4 On row: %5 Starting from column: %6",
  pin: "pin",
  toneOnPin: "Play tone on ",
  frequency: "with frequency",
  noToneOnPin: "Stop tone on",
  toneOnPinTooltip: "Play tone with specific frequency on specified pin",
  noToneOnPinTooltip: "Stop tone on pin",
  sonarTooltip: "This sensor reads the distance from a sonar sensor",
  pirTooltip: "This sensor can detect motion",
  miliseconds: "ms",
  digitalRead: "Read digital value from",
  digitalWriteToPin: "Write on",
  digitalWriteValue: "digital value",
  digitalWriteTooltip: "Write high or low value to a digital pin of the Dwenguino board",
  digitalReadTooltip: "Read a digital value (1/high or 0/low) from a specified pin",
  high: "HIGH",
  low: "LOW",
  highLowTooltip: "Represents a high (1) or low (0) value on a pin.",
  tutsIntroduction: "Introduction",
  tutsTheremin: "Theremin",
  tutsRobot: "Robot",
  tutsHelloDwenguino: "Hello Dwenguino!",
  tutsNameOnLcd: "Name on LCD",
  tutsBlinkLED: "Blink LED",
  tutsLedOnButtonPress: "LED on button press",
  tutsBitPatternOnLeds: "Bit pattern on LEDs",
  tutsAllButtons: "All buttons",
  tutsDriveForward: "Drive forward",
  tutsRideInSquare: "Ride a square",
  tutsRideToWall: "Ride to wall",
  tutsAvoidWall: "Avoid wall",
  tutsNameOnLcdBasic: "Your name on LCD",
  simulator: "Simulator",
  setLedState: "Turn %1 %2",
  setLedStateTooltip: "Turn an LED on the Dwenguino board on or off",
  ledPinsTooltip: "Pick a LED you want to control",
  dwenguinoOn: "ON",
  dwenguinoOff: 'OFF',
  dwenguinoOnOffTooltip: "Select a value to turn an LED ON or OFF",
  dwenguinoLedBlock: "LED",
  dwenguinoSonarBlock: "sonar %1 %2 %3 trig pin number %4 echo pin number %5",
  dwenguinoServoBlock: "Servo motor %1 %2 %3 pin %4 angle %5",
  dwenguinoServoDropdownBlock: "Servo motor %1",
  dwenguinoServoBlockTooltip: "Set one of the servos connected to the Dwenguino to a specified angle between 0 and 180 degrees",
  dwenguinoServoDropdownTooltip: "Select one of the two internal servo motors",
  dwenguinoServoOne: "1",
  dwenguinoServoTwo: "2",
  dwenguinoDCMotorBlock: "DC Motor %1 %2 %3 channel %4 speed %5",
  dwenguinoDCMotorBlockTooltip: "Set the speed of one of the two Dwenguino motors. Speed = value between -255 (full speed backwards) and 255 (full speed forwards)",
  dwenguinoAnalogWrite: "Write to %1 analog value %2",
  dwenguinoAnalogWriteTooltip: "Write an analog value between 0 and 255 to the specified pin",
  dwenguinoAnalogRead: "Read analog value from %1",
  dwenguinoAnalogWriteTooltip: "Read a value between 0 and 255 from the specified pin",
  digitalReadSwitch: "Read switch %1",
  digitalReadSwitchTooltip: "Read value from one of the Dwenguino switches",
  waitForSwitch: "wait until button %1 is pressed",
  north: "North",
  east:"East",
  south: "South",
  west: "West",
  center: "Center",
  ledsReg: "LEDS",
  dwenguinoLedsRegTooltip: "You can turn leds 0 to 7 on using a binary number. For example 0b00001111 will turn leds 0 to 3 on and the rest off",
  pressed: "PRESSED",
  notPressed: "NOT PRESSED",
  pressedTooltip: "Represents the state of a button. Use these values to compare to the actual button state",
  sureYouWantToChangeTutorial: "Are you sure you want to start this tutorial?\n All the blocks in the current workspace will be removed.",
  create: "Create",
  with_type: "with type",
  create_global: "Create global",
  socialRobotRgbLedBlock: "RGB LED",
  socialRobotPinRed: "pin red",
  socialRobotPinGreen: "pin green",
  socialRobotPinBlue: "pin blue",
  socialRobotRgbLedOffBlock: "Turn the RGB LED off with",
  socialRobotRgbColorBlock: "RGB color %1",
  socialRobotRgbColor: "red %1 green %2 blue %3",
  socialRobotLedmatrixImageBlock: "Display pattern on LED matrix segment",
  socialRobotLedmatrixImageBlockTooltip: "Show the given led pattern on the LED matrix display.",
  socialRobotLedmatrixEyePatternBlock: "Display eye pattern",
  socialRobotLedmatrixEyePatternBlockTooltip: 'Show the given eye pattern on the LED matrix display.',
  socialRobotLedmatrixEyePatternSegmentBlock: "on LED matrix segment",
  socialRobotLedmatrixClearSegmentBlock: "Clear LED matrix segment",
  socialRobotLedmatrixClearSegmentBlockTooltip: 'Clear a segment of the LED matrix display.',
  socialRobotLedmatrixClearDisplayBlock: "Clear LED matrix",
  socialRobotLedmatrixClearDisplayBlockTooltip: 'Clear the complete LED matrix display.',
  socialRobotPirBlock: "Pir %1 %2 %3 trig pin number %4",
  socialRobotSoundSensorBlock: "Sound sensor %1 %2 %3 pin %4",
  socialRobotSoundSensorBlockTooltip: "",
  socialRobotTouchSensorBlock: "Touch sensor %1 %2 %3 pin %4",
  socialRobotTouchSensorBlockTooltip: "",
  socialRobotButtonSensorBlock: "Button %1 %2 %3 pin %4",
  socialRobotButtonSensorBlockTooltip: "",
  socialrobotSetPinState: "Set %1 %2",
  socialrobotServoBlock: "Servo motor %1 %2 %3 pin %4 angle %5",
  socialrobotWaveArmesBlock: "Wave arms %1 %2 Servo pin right arm %3 %4 Servo left arm %5 %6",
  socialRobotArmsDownBlock: "Put arms down %1 %2 %3 Servo pin right arm %4 %5 Servo pin left arm %6 %7",
  socialRobotArmsUpBlock: "Put arms up %1 %2 %3 Servo pin right arm %4 %5 Servo pin left arm %6 %7",
  socialRobotEyesLeftBlock: "Turn eyes left %1 %2 %3 Servo pin left eye %4 %5 Servo pin right eye %6 %7",
  socialRobotEyesRightBlock: "Turn eyes right %1 %2 %3 Servo pin left eye %4 %5 Servo pin right eye %6 %7",
  socialrobotReadPinBlock: "Read value of pin %1 %2",
  socialRobotServoRightHand: "Servo pin right hand",
  socialRobotServoLeftHand: "Servo pin left hand",
  sonarSliderLabel: "Sonar distance",
  pirButtonLabel: "PIR button",
  soundButtonLabel: "Sound button",
  touchButtonLabel: "Touch button",
  lightSensorSliderLabel: "Light sensor slider",
  servoCostume: "Costume",
  servoOptions: "Servo motor options",
  sonarOptions: "Sonar sensor options",
  lcdOptions: "LCD screen options",
  pirOptions: "PIR sensor options",
  soundOptions: "Sound sensor options",
  touchOptions: "Touch sensor options",
  buttonOptions: "Button options",
  lightOptions: "Light sensor options",
  rgbLedOptions: "RGB LED options",
  ledmatrixOptions: 'Led  Matrix Options',
  ledOptions: "LED options",
  pinOptions: "Pin",
  colorOptions: "Color",
  runError: "<h3>Sorry, I was unable to upload the code to the board</h3>",
  uploadError: "Follow these steps to restart the Dwenguino board: \n    1. Disconnect the USB cable \n    2. Connect the computer and Dwenguino board with the USB cable \n    3. Simultaneously press the RESET and the SOUTH button of the Dwenguino board \n    4. Then first release the RESET button \n    5. Then release the SOUTH button \n    6. Upload the program again via the <span id='db_menu_item_run' class='fas fa-play-circle' alt='Upload code to Dwenguino board'></span> button in the main menu",
  cleanError: "The previous code could not be removed.\nPlease check if another application is using any .cpp files.\n Close the application.",
  compileError: "The code could not be compiled.\nYou should check your code, did you forget a block somewhere?",
  clear: "Clear",
  save: "Save",

  // TODO: Translate:
  dwenguinoStepperMotorBlock: "stepper-motor %1 %2 %3 nummer %4 aantal stappen %5",
  dwenguinoStepperMotorBlockTooltip: "TODO",
  drawingrobotMove:"Verplaats de stift onder een van hoek %1 graden met %2 stappen",
  drawingrobotMoveXY:"Verplaats de stift %1 naar rechts en %2 naar links",
  drawingrobotLine:"Teken een lijn naar x: %1 y: %2",
  drawingrobotCircle:"Teken een cirkel met straal: %1",
  drawingrobotRectangle:"Teken een rechthoek met breedte: %1 en hoogte: %2",
  drawingrobotLiftStylus: "Stift opheffen",
  drawingrobotLowerStylus: "Stift neerzetten",
  drawingrobotChangeColor: "Kleur %1",
  up:"omhoog",
  down:"omlaag",
  left:"links",
  right:"rechts",
  bounds:"Opgelet\nJe probeert buiten het papier te tekenen",
  drawingrobotgrid: "raster",
  colorpicker:"Kleur",
  drawingrobotSaveImage:"Tekening opslaan",
  drawingrobotDrawing:"Tekening",
  stepperMotorOne: "STEPPER1", 
  stepperMotorTwo: "STEPPER2",
  stepperMotorTooltip: "Select which stepper motor from the plotter robot you want to use."

};

MSG_FALLBACK.cookieConsent = {
  close: "Close",
  cookieConsent: "We use functional cookies to set up the Dwenguino simulator. ",
  cookieInfo: "More info on how we use cookies.",
  whatAreCookiesTitle: "Wat zijn cookies?",
  whatAreCookiesDescription1: "Cookies zijn kleine tekstbestanden die lokaal worden opgeslagen op uw computer. Deze cookies dienen voor tal van doeleinden: het onthouden van instellingen (login, taalkeuzes), het vergaren van informatie en het bijhouden van het bezoekgedrag van de gebruikers.",
  whatAreCookiesDescription2: "De cookies die wij gebruiken zijn veilig: zij hebben geen toegang tot persoonlijke informatie op uw computer en kunnen deze niet beschadigen of besmetten met virussen. De cookies geven op geen enkele manier persoonlijke informatie aan ons door. De informatie die we via cookies verzamelen helpt ons om je van specifieke diensten te laten genieten.",
  whatAreNecessaryCookiesTitle: "Wat zijn noodzakelijke cookies?",
  whatAreNecessaryCookiesDescription: "Noodzakelijke cookies zijn cookies die je nodig hebt om te surfen op de website en gebruik te maken van de functionaliteit die we aanbieden. Bovendien zijn de cookies noodzakelijk om de beveiligde onderdelen van de website te kunnen zien.",
  whichCookiesTitle: "Welke cookies gebruikt deze website?",
  dwengoCookieTitle: "Aanmelden als gebruiker (Dwengo cookie)",
  dwengoCookieDescription: "Bij het aanmelden op de website wordt een tijdelijke cookie gebruikt waardoor je herkend wordt als gebruiker. Met behulp van deze cookie wordt onder andere je taalinstelling en vooruitgang bewaard. De cookie zorgt er voor dat je toegang hebt tot de beveiligde delen van de website. Deze cookie is slechts geldig tot aan het einde van de sessie en is enkel beschikbaar voor en gemaakt door Dwengo vzw.",
  jenkinsCookieTitle: "Jenkins configuratie (Jenkins cookie)",
  jenkinsCookieDescription: "De Jenkins cookie is voor ons noodzakelijk om de Dwenguino simulator online op een server te kunnen installeren. Jenkins is software waarvan we gebruik maken om onze simulator te updaten. Die cookie bevat informatie over de instellingen van Jenkins en bevat dus ook geen enkele informatie over jou als gebruiker.",
};

MSG_FALLBACK.dropzone = {
  dictSelectFile: "Select a file.",
  dictChooseFile: "Choose file",
  dictDefaultMessage: "Drop files here to upload",
  dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
  dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
  dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
  dictInvalidFileType: "You can't upload files of this type.",
  dictResponseError: "Server responded with {{statusCode}} code.",
  dictCancelUpload: "Cancel upload",
  dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
  dictRemoveFile: "Remove file",
  dictMaxFilesExceeded: "You can not upload any more files.",
  dictUploadBlocks: "Upload blocks",
  dictFileNotSupported: "This file is not supported.",
};

MSG_FALLBACK.ledmatrix = {
  restPosition: 'Rest position', 
  blink1: 'Blink 1',
  blink2: 'Blink 2',
  blink3: 'Blink 3',
  blink4: 'Blink 4',
  blink5: 'Blink 5',
  right1: 'Right 1',
  right2: 'Right 2',
  left1: 'Left 1',
  left2: 'Left 2',
  up1: 'Up 1',
  up2: 'Up 2',
  up3: 'Up 3',
  down1: 'Down 1',
  down2: 'Down 2',
  down3: 'Down 3',
  angryLeft1: 'Angry left 1',
  angryLeft2: 'Angry left 2',
  angryLeft3: 'Angry left 3',
  angryLeft4: 'Angry left 4',
  angryRight1: 'Angry right 1',
  angryRight2: 'Angry right 2',
  angryRight3: 'Angry right 3',
  angryRight4: 'Angry right 4',
  sadLeft1: 'Sad left 1',
  sadLeft2: 'Sad left 2',
  sadLeft3: 'Sad left 3',
  sadRight1: 'Sad right 1',
  sadRight2: 'Sad right 2',
  sadRight3: 'Sad right 3',
  evilLeft1: 'Evil left 1',
  evilLeft2: 'Evil left 2',
  evilRight1: 'Evil right 1',
  evilRight2: 'Evil right 2',
  scanHorizontal1: 'Scan horizontal 1',
  scanHorizontal2: 'Scan horizontal 2',
  scanHorizontal3: 'Scan horizontal 3',
  scanHorizontal4: 'Scan horizontal 4',
  scanVertical1: 'Scan vertical 1',
  scanVertical2: 'Scan vertical 2',
  scanVertical3: 'Scan vertical 3',
  scanVertical4: 'Scan vertical 4',
  scanVertical5: 'Scan vertical 5',
  scanVertical6: 'Scan vertical 6',
  rip1: 'RIP 1',
  rip2: 'RIP 2',
  peering1: 'Peering 1',
  peering2: 'Peering 2',
  peering3: 'Peering 3',
  peering4: 'Peering 4'
};

MSG_FALLBACK.simulator = {
  start: "Start",
  stop: "Stop",
  pause: "Pause",
  step: "Step",
  speed: "Speed",
  speedVerySlow: "40 times as slow",
  speedSlow: "20 times as slow",
  speedMedium: "10 times as slow",
  speedFast: "5 times as slow",
  speedVeryFast: "2 times as slow",
  speedRealTime: "Real-time",
  components: "Select components",
  servo: "Servo",
  servoDescription: "A servo motor is an actuator that can <b>rotate an object over a certain angle</b>. In the simulator servo motors can be rotated over an angle of 0 to 180 degrees. Servo motors can easily be decorated and are thus ideal to make periodically moving components. With plain servo motor blocks the rotation angle needs to be specified. If you use other predefined blocks such as \"wave hands\" or \"turn eyes\" you don't have to specify the angle because it is preprogrammed.",
  motor: "Motor",
  DCMotorDescription: "A DC motor rotates completely. You can use it for instance to make your robot drive around on wheels. You have to specify the rotation speed of the motor and the direction of rotation in your program by using numbers between -255 and 255.",
  scope: "Variables",
  alertDebug: "The simulation stops when you resume programming.",
  distance: "distance",
  scenario: "Scenario",
  scenario_default: "Normal board",
  scenario_moving: "Moving robot",
  scenario_wall: "Moving robot with wall",
  scenario_socialrobot:"Social robot",
  code: "Code",
  pir: "PIR sensor",
  pirDescription: "A passif infrared (PIR) sensor allows you to <b>sense motion</b>, because it detects changes of infrared radiation in its environment. In the simulator you will find a button to simulate these changes of infrared radiation. By pushing the button, you simulate that there is movement, so the PIR sensor will receive the value 1. By releasing the button, the PIR sensor will receive its default value 0.",
  sonar: "Sonar",
  sonarDescription: "Use this sensor to detect the presence of a person or object and to estimate how far that person or object is from the sensor. In the simulator you will find a slider to simulate the distance between the object and the sensor. The sensor will output the distance in centimeters.",
  led: "LED",
  ledDescription: "A light-emitting diode (LED) is a semiconductor device that <b>emits light</b> when an electric current passes through it. Different semiconductor materials produce <b>different colors of light</b>. If the pin is in state HIGHT, the LED will emit light. If the corresponding pin is in state LOW, the LED will be turned off.",
  rgbled: "RGB LED",
  rgbledDescription: "",
  ledmatrix: "LED matrix",
  ledmatrixDescription: "",
  ledmatrixsegment: "LED matrix segment",
  ledmatrixsegmentDescription: "",
  touch: "Touch sensor",
  touchDescription: "Use the touch sensor to detect if the robot is being touched. In the simulator you will find a button to simulate touching the robot. When the robot is being touched, the touch sensor will output the value '1', otherwise the value '0'.",
  lcd: "LCD screen",
  lcdDescription: "The LCD display on the Dwengo board is a 16x2 character display with backlight. The text to be displayed should be specified in your program.",
  button: "Button",
  buttonDescription: "",
  sound: "Sound sensor",
  soundDescription: "Use the sound sensor to <b>detect sound</b>. In the simulator you will find a button to simulate the presence of sound. When the sound sensor detects sound it will output the value 1, otherwise it will output the value 0.",
  light: "Light sensor",
  lightDescription: "",
  buzzer: "Buzzer",
  buzzerDescription: "The buzzer on the Dwengo board can be used to <b>play a series of tones</b> or short sound fragments. The height of each tone is controlled by defining the <b>frequency</b> of the buzzer. Use a delay block to change the length of a tone.",
  decoration: "Decoration",
};

MSG_FALLBACK.socialrobot = {
  plain: "Default",
  eye: "Eye",
  mouth: "Mouth",
  righthand: "Right hand",
  lefthand: "Left hand",
};


MSG_FALLBACK.tutorialMenu = {
  header: "Tutorials",
  catDwenguino: "Learn to program<br>with DwenguinoBlockly",
  catDwenguinoComponents: "Handy overview of<br>the Dwenguino components",
  catDwenguinoConnector: "Pin mapping &<br>Expansion connector",
  catRidingRobot: "Riding robot",
  catSocialRobot: "Social robot",
  catWeGoStem: "WeGoSTEM",
  chooseCategory: "Select a tutorial category",
  chooseTutorial: "Select a tutorial",
  previous: "Previous",
  close: "Close",
  checkAnswer: "Check answer",
  correctAnswer: "The answer was correct!",
  wrongAnswer: "The answer was not correct. Try again!",
  dwenguinoComponents: "Dwenguino components",
  sensors: "Sensors",
  actuators: "Actuators",
  movement: "Movement",
  audio: "Audio",
  display: "Display"
};

MSG_FALLBACK.tutorials = {
  introduction: {},
  /*theremin: {},
  robot: {},
  hello_dwenguino: {},*/
};


MSG_FALLBACK.tutorials.general = {
  sureTitle: "Are you sure?",
  sureText: "When you click 'Next' all blocks in the workspace will be removed.",
};


MSG_FALLBACK.tutorials.introduction = {
  step1Title: "Welcome to DwenguinoBlockly",
  step1Content: "Hi, my name is Dwenguino! I will help you to get to know the interface!",
  step2aTitle: "The Blockly code area",
  step2aContent: "In this area you put your code blocks. You should put your blocks inside the setup-loop block if you want them to be executed.",
  step2bTitle: "The Blockly toolbox",
  step2bContent: "This is the toolbox, it contains all the blocks you can use to create your program. You can explore the different categories to find out what your Dwenguino can do.",
  step3Title: "Language selection",
  step3Content: "Use this to change the language",
  step4Title: "Difficulty",
  step4Content: "This slider lets you set the difficulty level. For now we only provide beginner and advanced levels.",
  step5Title: "Dwengobooks",
  step5Content: "Dwengobooks are interactive tutorials which guide you through the different physical computing challenges.",
  step6Title: "Upload code",
  step6Content: "When your code is complete, you can upload it to the Dwenguino board by clicking this button. Make sure you fist select the right board and port inside the Arduino ide.",
  step7Title: "Open",
  step7Content: "This button lets you open a previously saved program.",
  step8Title: "Save",
  step8Content: "With this button you can save your code to a local file.",
  step9Title: "The simulator",
  step9Content: "With this button to open the simulator. You can use it to test your code before uploading."
};


MSG_FALLBACK.tutorials.nameOnLcd = {
  step1Title: "Name on LCD-screen",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Name on LCD-screen",
  step2Content: "Change the program so your name appears on the first line of the LCD-screen.",
};


MSG_FALLBACK.tutorials.blinkLED = {
  step1Title: "Blink LED",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Blink LED",
  step2Content: "Change the program so the LED turns on for one second and then turns off the LED for one second. This sequence is repeated indefinitely.",
  step3Title: "Extra",
  step3Content: "Make another LED turn on and off.",
};


MSG_FALLBACK.tutorials.ledOnButtonPress = {
  step1Title: "LED on button press",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "LED on button press",
  step2Content: "Change the program so the LED turns on when you press the north button.",
  step3Title: "Extra",
  step3Content: "Make sure the LED turns off when you release the north button.",
};


MSG_FALLBACK.tutorials.bitPatternOnLeds = {
  step1Title: "Pattern on LEDs",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Pattern on LEDs",
  step2Content: "The code you have is very long. Can you get the same result using less blocks? Try to get the same result by using less blocks!",
  step3Title: "Pattern on LEDs",
  step3Content: "When you succeeded in reducing the number of blocks, call one of the tutors to get feedback on your solution.",
};


MSG_FALLBACK.tutorials.allButtons = {
  step1Title: "All buttons",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "All buttons",
  step2Content: "This code should turn on a LED when one of the buttons is pressed. Look at the program. Do all buttons work? Try to correct the code for the buttons that do not work.",
  step3Title: "Extra",
  step3Content: "Change the code so the LED turns off when the button is released.",
};


MSG_FALLBACK.tutorials.driveForward = {
  step1Title: "Drive forward",
  step1Content: "Open the simulator view.",
  step2Title: "Drive forward",
  step2Content: "Select the scenario view and test the code. What do you see?",
  step3Title: "Drive forward",
  step3Content: "Does the car drive forward? Correct the code so the car drives forward.",
};


MSG_FALLBACK.tutorials.rideInSquare = {
  step1Title: "Ride into square",
  step1Content: "Open the simulator view.",
  step2Title: "Ride into square",
  step2Content: "Select the scenario view and test the code. What do you see?",
  step3Title: "Ride into square",
  step3Content: "Does the car ride in a square? Correct the code so the car ride in a square.",
  step4Title: "Extra",
  step4Content: "The code is long, can you make it shorter while maintaining the same behaviour?",
};


MSG_FALLBACK.tutorials.rideToWall = {
  step1Title: "Ride to wall",
  step1Content: "Open the simulator view.",
  step2Title: "Ride to wall",
  step2Content: "Select the scenario view.",
  step3Title: "Ride to wall",
  step3Content: "Change the scenario to «Moving robot with wall» and test the code. What do you see?",
  step4Title: "Ride to wall",
  step4Content: "Does the car ride to the wall? Does it stop at the wall? Change the code so the car stop near the wall.",
};


MSG_FALLBACK.tutorials.avoidWall = {
  step1Title: "Avoid wall",
  step1Content: "Open the simulator view.",
  step2Title: "Avoid wall",
  step2Content: "Select the scenario view.",
  step3Title: "Avoid wall",
  step3Content: "Change the scenario to moving robot with wall and test the code. What do you see?",
  step4Title: "Avoid wall",
  step4Content: "Does the car avoid the wall by turning before it reaches it? Change the code so the car keeps driving but never hits a wall.",
};


//TODO: Translate
MSG_FALLBACK.tutorials.nameOnLcdBasic = {
  step0Title: "Ben je zeker?",
  step0Content: "Ben je zeker? Waneer je op volgende klikt zullen de blokken op het werkblad vervangen worden.",
  step1Title: "Naam op LCD-scherm",
  step1Content: "In deze tutorial plaats je je naam op het LCD-scherm. Je ziet een voorbeeld van hoe dat moet.",
  step2Title: "Testen op het bord",
  step2Content: "Test de code door het Dwenguino bord aan de computer te schakelen met de usb-kabel en op de play knop te drukken.",
  step3Title: "Je eigen naam",
  step3Content: "Momenteel zie je de naam 'Tom' op het scherm verschijnen. Pas de code aan zodat je jouw naam ziet.",
  step4Title: "Twee rijen",
  step4Content: "Het LCD-scherm heeft twee rijen. Verander de rij waarop je naam staat van 0 naar 1.",
  step5Title: "Test",
  step5Content: "Test je code.",
  step6Title: "Great!",
  step6Content: "Well done! Now you know how to display your name on the LCD-screen.",
};


/*MSG_FALLBACK.tutorials.hello_dwenguino = {
  label: "Hello World!",
};*/

MSG_FALLBACK.logging = {
  setup: "Test setup",
  login: "Login",
  logout: "Log out",
  firstname: "First name",
  newuser: "New user",
  email: "Email address",
  enterEmail: "Enter email address",
  forgotPassword: "I forgot my password",
  userDoesNotExist: "This user does not exist. Try a different email address.",
  resetPassword: "Reset your password",
  back: "Back",
  enterFirstname: "Enter your first name",
  password: "Password",
  repeatedPassword: "Repeat password",
  enterPassword: "Enter password",
  enterRepeatedPassword: "Repeat your password",
  choosePassword: "Select 4 personal icons as your password. You need to be able to remember these in the right order.",
  currentlySelected: "Currently selected: ",
  language: "Language",
  english: "English",
  dutch: "Dutch",
  role: "Role",
  student: "Student",
  teacher: "Teacher",
  verification: "Verify your email address",
  verificationSentTo: "A verification message has been sent to your email address. Click the link in the email to verify your account.",
  birth: "Date of birth",
  school: "School",
  selectSchool: "Search by name of school...",
  agegroup: "Age group:",
  primary1: "Primary grade 1",
  primary2: "Primary grade 2",
  primary3: "Primary grade 3",
  primary4: "Primary grade 4",
  primary5: "Primary grade 5",
  primary6: "Primary grade 6",
  secondary1: "Secondary grade 1",
  secondary2: "Secondary grade 2",
  secondary3: "Secondary grade 3",
  secondary4: "Secondary grade 4",
  secondary5: "Secondary grade 5",
  secondary6: "Secondary grade 6",
  gender: "Gender: ",
  gender1: "F",
  gender2: "M",
  gender3: "X",
  gender4: "I\'d rather not say",
  activity: "Activity: ",
  name: "Name ",
  date: "Date ",
  ok: "Ok",
  continue: "Continue",
  reset: "Reset",
  person: "Person",
  dog: "Dog",
  car: "Car",
  camera: "Camera",
  heart: "Heart",
  plane: "Plane",
  house: "House",
  umbrella: "Umbrella",
  star: "Star",
  money: "Money",
  gift: "Gift",
  keys: "Keys",
  music: "Music",
  snowflake: "Snowflake",
  fire: "Fire",
  envelope: "Envelope",
  conditions: "Voorwaarden",
  conditions1: "Om de app te gebruiken, moet je akkoord gaan met de <b>gebruiksvoorwaarden</b> en het <b>privacybeleid</b>.",
  generalConditions: "de gebruiksvoorwaarden",
  privacyStatement: "het privacybeleid",
  conditions2: "Daar staat onder andere in dat je moet inloggen om te beschikken over functionaliteit zoals het bewaren van je programma's of het bijhouden van je voortgang, dat je data anoniem wordt gelogd en verwerkt, en dat je ons mag mailen met vragen over privacy.",
  conditions3: "Ben je <b>13 jaar of ouder?</b> Dan mag je hieronder <b>zelf bevestigen</b> dat je de info hebt gelezen en akkoord gaat.",
  conditions4: "Ben je <b>12 jaar of jonger?</b> Dan moet een van je ouders of voogden toestemming geven.",
  acceptConditions: "Ik ga akkoord met de gebruiksvoorwaarden en het privacybeleid van de Dwengo-simulator",
  acceptResearch: "Ik geef toestemming aan Dwengo vzw om de gegevens die de simulator verzamelt, voor <b>wetenschappelijk onderzoek</b> te gebruiken, geanonimiseerd en volgens het privacybeleid.",
  anonymized: "* <b>\'Geanonimiseerd\'</b> wil zeggen dat er geen link is tussen je persoonsgegevens en je data. Niemand weet dus wat je deed in de simulator."
};

MSG_FALLBACK.validator = {
  errSchool: "Select a school.",
  errId: "You didn't select enough icons.",
  errAgeGroup: "Select your age group.",
  errGender: "Select your gender.",
  errFirstname: "Je voornaam is niet ingevuld.",
  errLastname: "Je achternaam is niet ingevuld.",
  errPassword: "Je paswoord voldoet niet aan de voorwaarden.",
  errPasswordNotIdentical: "Je paswoorden zijn niet identiek.",
  errEmail: "Je email is niet geldig",
  errActivityId: "Your activity title cannot be empty.",
  errAcceptConditions: "Je hebt de gebruiksvoorwaarden en het privacybeleid nog niet geaccepteerd.",
  errAcceptResearch: "Je hebt nog geen toestemming gegeven om de gegevens voor wetenschappelijk onderzoek te laten gebruiken.",
  errRequiredFields: "Je hebt niet alle velden ingevuld.",
  errRoleInvalid: "De opgegeven rol is niet geldig."
};