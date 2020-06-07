var MSG = {
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
  trig: "trig pin number",
  echo: "echo pin number",
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
  dwenguinoServoBlock: "Servo motor %1 %2 %3 channel # %4 angle %5",
  dwenguinoServoBlockTooltip: "Set one of the servos connected to the Dwenguino to a specified angle between 0 and 180 degrees",
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
  socialrobotSetPinState: "Set %1 %2",
  socialrobotServoBlock: "Servo motor %1 %2 %3  channel %4 pin %5 angle %6",
  socialrobotWaveArmesBlock: "Wave arms %1 %2 Servo right arm %3 %4 Servo left arm %5 %6",
  socialRobotArmsDownBlock: "Put arms down %1 %2 %3 Servo right arm %4 %5 Servo left arm %6 %7",
  socialRobotArmsUpBlock: "Put arms up %1 %2 %3 Servo right arm %4 %5 Servo left arm %6 %7",
  socialRobotEyesLeftBlock: "Turn eyes left %1 %2 %3 Servo left eye %4 %5 Servo right eye %6 %7",
  socialRobotEyesRightBlock: "Turn eyes right %1 %2 %3 Servo left eye %4 %5 Servo right eye %6 %7",
  socialrobotReadPinBlock: "Read value of pin %1 %2",
  socialRobotServoRightHand: "Servo right hand",
  socialRobotServoLeftHand: "Servo left hand",
  sonarSliderLabel: "Sonar distance",
  pirButtonLabel: "PIR button",
  soundButtonLabel: "Sound button",
  runError: "Oops there was an error when trying to run your code on the board.",
  uploadError: "The code could not be uploaded to the board. \nPlease check if the board is connected with the usb cable.\n If it is connected try unplugging it and plugging it back in.",
  cleanError: "The previous code could not be removed.\nPlease check if another application is using any .cpp files.\n Close the application.",
  compileError: "The code could not be compiled.\nYou should check your code, did you forget a block someware?",

};

MSG.dropzone = {
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
}

MSG.simulator = {
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
  motor: "Motor",
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
  sonar: "Sonar",
  led: "LED",
  lcd: "LCD screen",
  button: "Button",
  sound: "Sound sensor",
  decoration: "Decoration",
};

MSG.socialrobot = {
  plain: "Default",
  eye: "Eye",
  mouth: "Mouth",
  righthand: "Right hand",
  lefthand: "Left hand",
};

MSG.tutorialMenu = {
  header: "Tutorials",
  catDwenguino: "Learn to program<br>with DwenguinoBlockly",
  catRidingRobot: "Riding robot",
  catSocialRobot: "Social robot",
  catWeGoStem: "WeGoSTEM",
  chooseCategory: "Select a tutorial category",
  chooseTutorial: "Select a tutorial",
  previous: "Previous",
  close: "Close",
  checkAnswer: "Check answer",
  correctAnswer: "The answer was correct!",
  wrongAnswer: "The answer was not correct. Try again!"
}

MSG.tutorials = {
  introduction: {},
  /*theremin: {},
  robot: {},
  hello_dwenguino: {},*/
};


MSG.tutorials.general = {
  sureTitle: "Are you sure?",
  sureText: "When you click 'Next' all blocks in the workspace will be removed.",
};


MSG.tutorials.introduction = {
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


MSG.tutorials.nameOnLcd = {
  step1Title: "Name on LCD-screen",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Name on LCD-screen",
  step2Content: "Change the program so your name appears on the first line of the LCD-screen.",
};


MSG.tutorials.blinkLED = {
  step1Title: "Blink LED",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Blink LED",
  step2Content: "Change the program so the LED turns on for one second and then turns off the LED for one second. This sequence is repeated indefinitely.",
  step3Title: "Extra",
  step3Content: "Make another LED turn on and off.",
};


MSG.tutorials.ledOnButtonPress = {
  step1Title: "LED on button press",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "LED on button press",
  step2Content: "Change the program so the LED turns on when you press the north button.",
  step3Title: "Extra",
  step3Content: "Make sure the LED turns off when you release the north button.",
};


MSG.tutorials.bitPatternOnLeds = {
  step1Title: "Pattern on LEDs",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Pattern on LEDs",
  step2Content: "The code you have is very long. Can you get the same result using less blocks? Try to get the same result by using less blocks!",
  step3Title: "Pattern on LEDs",
  step3Content: "When you succeeded in reducing the number of blocks, call one of the tutors to get feedback on your solution.",
};


MSG.tutorials.allButtons = {
  step1Title: "All buttons",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "All buttons",
  step2Content: "This code should turn on a LED when one of the buttons is pressed. Look at the program. Do all buttons work? Try to correct the code for the buttons that do not work.",
  step3Title: "Extra",
  step3Content: "Change the code so the LED turns off when the button is released.",
};


MSG.tutorials.driveForward = {
  step1Title: "Drive forward",
  step1Content: "Open the simulator view.",
  step2Title: "Drive forward",
  step2Content: "Select the scenario view and test the code. What do you see?",
  step3Title: "Drive forward",
  step3Content: "Does the car drive forward? Correct the code so the car drives forward.",
};


MSG.tutorials.rideInSquare = {
  step1Title: "Ride into square",
  step1Content: "Open the simulator view.",
  step2Title: "Ride into square",
  step2Content: "Select the scenario view and test the code. What do you see?",
  step3Title: "Ride into square",
  step3Content: "Does the car ride in a square? Correct the code so the car ride in a square.",
  step4Title: "Extra",
  step4Content: "The code is long, can you make it shorter while maintaining the same behaviour?",
};


MSG.tutorials.rideToWall = {
  step1Title: "Ride to wall",
  step1Content: "Open the simulator view.",
  step2Title: "Ride to wall",
  step2Content: "Select the scenario view.",
  step3Title: "Ride to wall",
  step3Content: "Change the scenario to «Moving robot with wall» and test the code. What do you see?",
  step4Title: "Ride to wall",
  step4Content: "Does the car ride to the wall? Does it stop at the wall? Change the code so the car stop near the wall.",
};


MSG.tutorials.avoidWall = {
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
MSG.tutorials.nameOnLcdBasic = {
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


/*MSG.tutorials.hello_dwenguino = {
  label: "Hello World!",
};*/

MSG.logging = {
  setup: "Test setup",
  login: "Login",
  newuser: "New user",
  username: "Username",
  chooseUsername: "Choose a username",
  choosePassword: "Select 4 personal icons as your password. You need to be able to remember these in the right order.",
  currentlySelected: "Currently selected: ",
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
  envelope: "Envelope"
};

MSG.validator = {
  errSchool: "Select a school.",
  errId: "You didn't select enough icons.",
  errAgeGroup: "Select your age group.",
  errGender: "Select your gender.",
  errActivityId: "Your activity title cannot be empty."
};