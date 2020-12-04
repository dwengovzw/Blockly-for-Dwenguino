var MSG = {

  title: "DwenguinoBlockly",

  blocks: "Blöcke",

  linkTooltip: "Speichern und Verknüpfen mit Blöcken",

  runTooltip: "Führe das Programm aus, das mit den Blöcken im Arbeitsbereich erstellt wurde",

  loadBlocksFileTooltip: "Lade eine zuvor gespeicherte Datei",

  saveBlocksFileTooltip: "Speichere die Blöcke in einer lokalen Datei",

  toggleSimulator: "Öffne oder schließe das Simulatorfenster",

  badCode: "Programmfehler:\n%1",

  timeout: "Die maximale Anzahl von Iterationen wurde überschritten",

  trashTooltip: "Lösche alle Blöcke",

  catLogic: "Logik",

  catLoops: "Schleifen",

  catMath: "Mathematik",

  catText: "Text",

  catLists: "Listen",

  catColour: "Farben",

  catVariables: "Variablen",

  catFunctions: "Funktionen",

  catArduino: "Arduino",

  catDwenguino: "Dwenguino",

  catBoardIO: "IO",
  
  catComments: "Comments",

  listVariable: "Liste",

  textVariable: "Text",

  httpRequestError: "Bei der Bearbeitung deiner Anfrage ist ein Problem aufgetreten",

  linkAlert: "Teile deine Blöcke mit diesem Link:\n\n%1",

  hashError: "\"%1\" stimmt nicht mit einer gespeicherten Datei überein.",

  xmlError: "Deine gespeicherte Datei konnte nicht geladen werden. Wurde es mit einer anderen version von Blockly erstellt?",

  badXml: "Fehler beim Verarbeiten der XML-Datei:\n%1\n\nWähle \"OK\" um deine Änderungen zu ignorieren oder  \"Abbrechen\" um die XML-Datei weiter zu bearbeiten.",

  pressed: "Gedrückt",

  setup: "Bereite vor",

  loop: "Wiederhole",

  dwenguino_main_program_structure: "Der erste Code wird beim Programmstart nur einmal ausgeführt. Der Code in der 'Wiederhole' wird immer wieder wiederholt, bis das Programm stoppt (zB wenn du den Stecker aus der Platine ziehst).",

  catDwenguino: "Dwenguino",

  catSocialRobot: "sozialer Roboter",

  delay_help: "Warte einige Millisekunden (1 Sekunde = 1000 Millisekunden)",

  delay: "Warte",

  clearLCD: "Klare LCD-Anzeige",

  dwenguinoLCD: "LCD-Anzeige %1 %2 %3 Schreibe Text: %4 in Zeile %5 von Spalte %6",

  pin: "Stift",

  toneOnPin: "Spiele den Ton an ",

  frequency: "mit der Frequenz",

  noToneOnPin: "Hör auf den Ton zu spielen an",

  toneOnPinTooltip: "Spielen Sie einen Ton mit einer bestimmten Frequenz an einem Stift",

  noToneOnPinTooltip: "Hör auf den Ton zu spielen an einem bestimmten Stift",

  trig: "trig Stift Nummer",

  echo: "echo Stift Nummer",

  sonarTooltip: "Dieser Block liest die Entfernung eines Sonarsensors",

  miliseconds: "ms",

  digitalRead: "Lese den digitalen Wert", 

  digitalWriteToPin: "Schreibe an",

  digitalWriteValue: "der digitale Wert",

  digitalWriteTooltip: "Schreibe hoch oder niedrig an eine Stecknadel des Dwenguino",

  digitalReadTooltip: "Lese einen digitalen Wert von einem Stift des Dwenguino",

  high: "HOCH",

  low: "NIEDRIG",

  highLowTooltip: "Entspricht einem hohen (1) oder niedrigen (0) Wert an eine Stecknadel",

  tutsIntroduction: "Einführung",

  tutsTheremin: "Theremin",

  tutsRobot: "Roboter",

  tutsBasicTest: "Grundtest",

  tutsHelloDwenguino: "Hallo Dwenguino!",

  tutsBlinkLED: "blinkende Lichter",

  tutsHelloRobot: "fahrender Roboter",

  tutsLedOnButtonPress: "LED wenn eine Taste gedrückt wird",

  tutsBitPatternOnLeds: "Bitmuster auf LEDs",

  tutsAllButtons: "Alle Tasten",

  tutsDriveForward: "vorwärts fahren",

  tutsRideInSquare: "in einem Rechteck fahren",

  tutsRideToWall: "an eine Wand fahren",

  tutsAvoidWall: "eine Mauer meiden",

  tutsNameOnLcdBasic: "Deine Name auf dem LCD-Bildschirm",

  tutsNameOnLcdWeGoSTEM: "Name auf dem LCD-Bildschirm",

  tutsIntroduceYourselfWeGoSTEM: "Sich vorstellen",

  tutsShowNameAndDisappearWeGoSTEM: "Lass deinen Namen verschwinden",

  tutsLampOnOffWeGoSTEM: "blinkende Lichter",

  tutsPoem1: "Gedicht 1",

  tutsPoem2: "Gedicht 2",

  simulator: "Simulator",

  setLedState: "Setz %1 %2",

  setLedStateTooltip: "Schalte einen DwenguinoDCMotorBlock auf der Platine ein oder aus.",

  ledPinsTooltip: "Wähle eine LED, die du ein- oder ausschalten möchtest",

  dwenguinoOn: "AN",

  dwenguinoOff: 'AUS',
  dwenguinoLedBlock: "LED",
  dwenguinoOnOffTooltip: "Wähle AN oder AUS",
  dwenguinoSonarBlock: "sonar %1 %2 %3 trig pin number %4 echo pin number %5",
  dwenguinoServoBlock: "Servomotor %1 %2 %3 Nummer %4 Winkel %5",
  dwenguinoServoDropdownBlock: "Servo motor %1",
  dwenguinoServoBlockTooltip: "Servomotor 1 oder 2 auf einen Winkel zwischen 0 und 180 Grad einstellen",
  dwenguinoServoDropdownTooltip: "Select one of the two internal servo motors",
  dwenguinoServoOne: "1",
  dwenguinoServoTwo: "2",
  dwenguinoDCMotorBlock: "DC Motor %1 %2 %3 Nummer %4 Geschwindigkeit %5",
  dwenguinoDCMotorBlockTooltip: "Stell die Geschwindigkeit eines an die Platine angeschlossenen Motors ein. Die Geschwindigkeit ist ein Wert zwischen -255 (volle Geschwindigkeit rückwärts) und 255 (volle Geschwindigkeit vorwärts).",
  dwenguinoAnalogWrite: "Schreibe an %1 der analoge Wert %2",
  dwenguinoAnalogWriteTooltip: "Schreibe einen analogen Wert zwischen 0 und 255 an einem bestimmten Stift",
  dwenguinoAnalogRead: "Lese den analogen Wert %1",

  dwenguinoAnalogWriteTooltip: "Lese einen analogen Wert zwischen 0 und 255 vom angegebenen Stift",

  digitalReadSwitch: "Lese den Wert der Taste %1",

  waitForSwitch: "Warte bis Taste %1 gedrückt wird",

  digitalReadSwitchTooltip: "Lese den Wert einer der Dwenguino Tasten",

  north: "NORD", 

  east:"SUED",

  south: "OST",

  west: "WEST",

  center: "ZENTRUM",

  ledsReg: "LEDs",

  dwenguinoLedsRegTooltip: "Mit diesem Block können Sie die LEDs 0 bis 7 mit einer Binärzahl ein- oder ausschalten. Beispiel: 0b00001111 schaltet die LEDs 0 bis 3 ein und der Rest aus.",

  pressed: "GEDRUECKT",

  notPressed: "NICHT GEDRUECKT",

  pressedTooltip: "Stellt den Wert einer Taste dar. Vergleiche diesen Wert mit dem Wert, den du von einer bestimmten Taste gelesen hast.",

  sureYouWantToChangeTutorial: "Bist du sicher, dass du das Tutorial starten möchtest?\n Alle Blöcke im momentanen Arbeitsbereich werden entfernt.",
  create: "Erstellen",
  with_type: "mit Typ",
  create_global: "Erstellen (Global)",

  dwenguinoStepperMotorBlock: "Schrittmotor %1 %2 %3 Nummer %4 Anzahl Schritte %5",
  dwenguinoStepperMotorBlockTooltip: "TODO",
  drawingrobotMove:"Bewege den Stift im Winkel von %1 Grad in %2 Schritten",
  drawingrobotMoveXY:"Bewege den Stift %1 nach rechts und %2 nach links",
  drawingrobotLine:"Zeichne eine Linie nach x: %1 y: %2",
  drawingrobotCircle:"Zeichne einen Kreis mit Radius: %1",
  drawingrobotRectangle:"Zeichne ein Rechteck mit Breite: %1 und Höhe: %2",
  drawingrobotLiftStylus: "Stift heben",
  drawingrobotLowerStylus: "Stift senken",
  drawingrobotChangeColor: "Farbe %1",
  up:"Nach oben",
  down:"Nach unten",
  left:"Links",
  right:"Rechts",
  bounds:"Achtung\nDu versuchst außerhalb des Papieres zu zeichnen",
  drawingrobotgrid: "Raster",
  colorpicker:"Farbe",
  drawingrobotSaveImage:"Zeichnung speichern",
  drawingrobotDrawing:"Zeichnung",
  stepperMotorOne: "SCHRITTMOTOR1", 
  stepperMotorTwo: "SCHRITTMOTOR2",
  stepperMotorTooltip: "Wähle welchen Schrittmotor des Zeichenroboters du verwenden möchtest.",
  socialrobotSetPinBlock: "Set",
  socialrobotReadPinBlock: "Lies Wert von Pin aus",
  socialRobotRgbLedBlock: "RGB LED",
  socialRobotPinRed: "pin red",
  socialRobotPinGreen: "pin green",
  socialRobotPinBlue: "pin blue",
  socialRobotRgbLedOffBlock: "Turn the RGB LED off with",
  socialRobotRgbColorBlock: "RGB color",
  socialRobotPirBlock: "Pir %1 %2 %3 trig pin number %4",
  socialRobotSoundSensorBlock: "Sound sensor %1 %2 %3 pin %4",
  socialRobotSoundSensorBlockTooltip: "",
  socialrobotSetPinState: "Setz %1 %2",
  socialrobotServoBlock: "Servo %1 %2 %3 Pin %4 Winkel %5",
  socialrobotWaveArmesBlock: "Winke mit beiden Armen %1 %2 Servo rechter Arm %3 %4 Servo linker Arm %5 %6",
  socialRobotArmsDownBlock: "Arme nach unten %1 %2 %3 Servo rechter Arm %4 %5 Servo linker Arm %6 %7",
  socialRobotArmsUpBlock: "Arme nach oben %1 %2 %3 Servo rechter Arm %4 %5 Servo linker Arm %6 %7",
  socialRobotEyesLeftBlock: "Augen nach links %1 %2 %3 Servo linkes Auge %4 %5 Servo rechtes Auge %6 %7",
  socialRobotEyesRightBlock: "Augen nach rechts %1 %2 %3 Servo linkes Auge %4 %5 Servo rechtes Auge %6 %7",
  socialrobotReadPinBlock: "Lies Wert von Pin aus %1 %2",
  socialRobotServoRightHand: "Servo rechtes Auge",
  socialRobotServoLeftHand: "Servo linkes Auge",
  sonarSliderLabel: "Sonarabstand",
  pirButtonLabel: "PIR Button",
  soundButtonLabel: "Sound button",
  lightSensorSliderLabel: "Light sensor slider",
  servoCostume: "Costume",
  servoOptions: "Servo motor options",
  sonarOptions: "Sonar sensor options",
  lcdOptions: "LCD screen options",
  pirOptions: "PIR sensor options",
  soundOptions: "Sound sensor options",
  lightOptions: "Light sensor options",
  rgbLedOptions: "RGB LED options",
  ledOptions: "LED options",
  pinOptions: "Pin",
  colorOptions: "Color",
  clear: "Löschen",
  save: "Speichern",
  runError: "Ups, beim Ausführen deines Codes am Board ist ein Fehler aufgetreten.",
  uploadError: "Code konnte nicht aufs Board geladen werden. \nBitte überprüfe ob das Board mit dem USB-Kabel verbunden ist.\n Sollte das Kabel mit dem Board verbunden sein, versuch es abzustecken, und gleich darauf wieder einzustecken.",
  cleanError: "Entfernen von vorherigem Code fehlgeschlagen.\nBitte überprüfe, ob .cpp files eventuell von einer anderen Applikation verwendet werden.\n Schließe diese Applikation.",
  compileError: "Code konnte nicht kompiliert werden.\nÜberprüfe deinen Code, hast du vielleicht einen Block vergessen?",


  
  };

MSG.logging = {
  setup: "Testkonfiguration",
  login: "Login",
  newuser: "Neuer Benutzer",
  username: "Benutzername",
  chooseUsername: "Wähle einen Benutzernamen",
  choosePassword: "Wähle 4 persönliche Symbole (Zeichen) als Passwort. Merke sie dir in der richtigen Reihenfolge.",
  currentlySelected: "Ausgewählt: ",
  birth: "Geburtsdatum",
  school: "Schule",
  selectSchool: "Suche nach Schulnamen...",
  agegroup: "Altersgruppe:",
  primary1: "Primärstufe 1",
  primary2: "Primärstufe 2",
  primary3: "Primärstufe 3",
  primary4: "Primärstufe 4",
  primary5: "Sekundärstufe 1",
  primary6: "Sekundärstufe 2",
  secondary1: "Sekundärstufe 3",
  secondary2: "Sekundärstufe 4",
  secondary3: "Sekundärstufe 5",
  secondary4: "Sekundärstufe 6",
  secondary5: "Sekundärstufe 7",
  secondary6: "Sekundärstufe 8",
  gender: "Geschlecht: ",
  gender1: "F",
  gender2: "M",
  gender3: "X",
  gender4: "Das möchte ich nicht sagen",
  activity: "Aktivität: ",
  name: "Name ",
  date: "Datum ",
  ok: "Ok",
  reset: "Reset (Zurücksetzen)",
  person: "Person",
  dog: "Hund",
  car: "Katze",
  camera: "Kamera",
  heart: "Herz",
  plane: "Flugzeug",
  house: "Haus",
  umbrella: "Regenschirm",
  star: "Stern",
  money: "Geld",
  gift: "Geschenk",
  keys: "Schlüssel",
  music: "Musik",
  snowflake: "Schneeflocke",
  fire: "Feuer",
  envelope: "Umschlag"
};

MSG.validator = {
  errSchool: "Wähle eine Schule.",
  errId: "Du hast nicht genug Symbole ausgewählt.",
  errAgeGroup: "Wähle deine Altersgruppe.",
  errGender: "Wähle dein Geschlecht.",
  errActivityId: "Deine Aktivität muss einen Namen haben. Der Titel darf nicht leer sein."
};

MSG.socialrobot = {
  plain: "Standard",
  eye: "Auge",
  mouth: "Mund",
  righthand: "Rechte Hand",
  lefthand: "Linke Hand",
};

MSG.tutorialMenu = {
  header: "Tutorials",
  catDwenguino: "Lerne programmieren<br>mit DwenguinoBlockly",
  catRidingRobot: "reitender Roboter",
  catSocialRobot: "sozialer Roboter",
  catWeGoStem: "WeGoSTEM",
  chooseCategory: "Wähle eine Tutorial-Kategorie aus",
  chooseTutorial: "Wähle ein Tutorial aus",
  previous: "Zurück",
  close: "Schließen",
  checkAnswer: "Antwort überprüfen",
  correctAnswer: "Die Antwort war richtig!",
  wrongAnswer: "Die Antwort war nicht richtig. Versuch es nochmal!"
};

MSG.simulator = {
  start: "Start",
  stop: "Stopp",
  pause: "Pause",
  step: "1 Schritt",
  speed: "Geschwindigkeit",
  speedVerySlow: "40-mal so langsam",
  speedSlow: "20-mal so langsam",
  speedMedium: "10-mal so langsam",
  speedFast: "5-mal so langsam",
  speedVeryFast: "2-mal so langsam",
  speedRealTime: "Echtzeit",
  components: "Wähle Komponenten aus",
  servo: "Servo",
  motor: "Motor",
  scope: "Variablen",
  alertDebug: "Die Simulation stoppt wenn du weiter programmierst.",
  distance: "Abstand",
  scenario: "Szenario",
  scenario_default: "Normales Board",
  scenario_moving: "Bewegender Roboter",
  scenario_wall: "Bewegender Roboter mit Wand",
  scenario_socialrobot:"Sozialer Roboter",
  code: "Code",
  pir: "PIR Sensor",
  pirDescription: "A passif infrared (PIR) sensor allows you to <b>sense motion</b>, because it detects changes of infrared radiation in its environment",
  sonar: "Sonar %1 %2 %3 trig pin number %4 echo pin number %5",
  led: "LED",
  ledDescription: "A light-emitting diode (LED) is a semiconductor device that <b>emits light</b> when an electric current passes through it. Different semiconductor materials produce <b>different colors of light</b>. ",
  lcd: "LCD Schirm",
  lcdDescription: "The LCD display on the Dwengo board is a 16x2 character display with backlight.",
  button: "Button",
  sound: "Sound sensor",
  light: "Light sensor",
  buzzer: "Buzzer",
  buzzerDescription: "The buzzer on the Dwengo board can be used to <b>play a series of tones</b> or short sound fragments. The height of each tone is controlled by defining the <b>frequency</b> of the buzzer. Use a delay block to change the length of a tone.",
  decoration: "Dekoration",
};

MSG.dropzone = {
  dictSelectFile: "Wähle eine Datei aus",
  dictChooseFile: "Wähle eine Datei",
  dictDefaultMessage: "Ziehe deine Files hier her um den Upload zu starten",
  dictFallbackMessage: "Dateien hochladen mittels Drag'n'Drop wird von deinem Browser nicht unterstützt.",
  dictFileTooBig: "Datei ist zu groß ({{filesize}}MiB). Maximale Dateigröße: {{maxFilesize}}MiB.",
  dictFallbackText: "Bitte verwende das Ersatzformular um deine Dateien hochzuladen, wie in alten Zeiten.",
  dictInvalidFileType: "Dateien dieses Typs können nicht hochgeladen werden.",
  dictResponseError: "Server antwortet mit Code {{statusCode}}.",
  dictCancelUpload: "Upload abbrechen",
  dictCancelUploadConfirmation: "Bist du dir sicher dass du den Upload abbrechen möchtest?",
  dictRemoveFile: "Datei entfernen",
  dictMaxFilesExceeded: "Du kannst keine weiteren Dateien hochladen.",
};



MSG.tutorials = {

    introduction: {},

    theremin: {},

    robot: {},

    basic_test: {},

    hello_dwenguino: {},

    blink: {},

    hello_robot: {},

};



MSG.tutorials.general = {

  sureTitle: "Bist du sicher?",

  sureText: "Wenn du auf 'Weiter' klickst, werden die Blöcke im Arbeitsblatt ersetzt.",

};



MSG.tutorials.introduction = {

  stepTitles: [

    "Willkommen bei DwenguinoBlockly",

    "Der Blockly Codebereich",

    "Die Blockly Toolbox",

    "Sprache wählen",

    "Die Schwierigkeit",

    "Dwengobooks",

    "Deine Code hochladen auf die Dwenguino",

    "Öffnen",

    "Speichern",

    "Der Simulator"

  ],

  stepContents: [

    "Hallo, ich bin Dwenguino! Ich werde dir helfen, das Interface kennenzulernen!",

    "Dies ist der Blockly-Code-Bereich. Hier kommt das Programm, das du schreiben würdest.",

    "Dies ist die Toolbox. Sie enthält alle Blöcke, mit denen du dein Programm schreiben kannst. Je nach gewähltem Level siehst du mehr oder weniger Blöcke. Schau mal, welche Blöcke alle vorhanden sind.",

    "Hier kannst du eine andere Sprache auswählen.",

    "Mit diesem Schieberegler kannst du den Schwierigkeitsgrad einstellen. Auf höheren Ebenen hast du fortgeschrittenere Blöcke. Um diese zu verwenden, musst du zuerst die Blöcke auf niedrigeren Ebenen verstehen. Derzeit gibt es nur zwei Ebenen.",

    "Dwengobooks sind interaktive Tutorials, die Schritt für Schritt erklären, wie man ein Programm schreibt.",

    "Wenn du der Meinung bist, dass dein Programm fertig ist, kannst du es durch Drücken dieser Taste auf die Dwenguino hochladen. (Vergesse nicht, die Dwenguino zuerst mit dem USB-Kabel an den Computer anzuschließen.) <br/> < em> Achtung! Dies funktioniert nur, wenn du dieses Programm in der Arduino IDE ausführst und nicht online im Browser. </ em> ",

    "Mit dieser Taste kannst du eine Datei öffnen, die du zuvor im Editor gespeichert hast.",

    "Mit dieser Taste kannst du die Blöcke in einer lokalen Datei speichern.",

    "Mit dieser Taste kannst du den Simulator öffnen. Damit kannst du deine Code testen."


  ],

};

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