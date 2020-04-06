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

  dwenguinoOnOffTooltip: "Wähle AN oder AUS",

  dwenguinoServoBlock: "Servomotor %1 %2 %3 Nummer %4 Winkel %5",

  dwenguinoServoBlockTooltip: "Servomotor 1 oder 2 auf einen Winkel zwischen 0 und 180 Grad einstellen",

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

  sureYouWantToChangeTutorial: "Möchtest du dieses Buch wirklich starten?\n Die Blöcke im aktuellen Arbeitsbereich werden ersetzt!",

  create: "Erstellen",

  with_type: "mit Typ",

  create_global: "Global erstellen",

};



MSG.simulator = {

  start: "Start",

  stop: "Stop",

  pause: "Pause",

  step: "1 Schritt",

  speed: "Geschwindigkeit",

  speedVerySlow: "40 mal langsamer",

  speedSlow: "20 mal langsamer",

  speedMedium: "10 mal langsamer",

  speedFast: "5 mal langsamer",

  speedVeryFast: "2 mal langsamer",

  speedRealTime: "Echtzeit",

  components: "Komponenten auswählen",

  servo: "Servomotor",

  motor: "Motor",

  scope: "Werte",

  alertDebug: "Beende die Simulation, bevor du zurück programmieren kannst",

  distance: "Entfernung",

  scenario: "Szenario",

  scenario_default: "Normal",

  scenario_moving: "beweglicher Roboter",

  scenario_wall: "beweglicher Roboter mit Mauer",

  scenario_spyrograph: "Spirograph",

  code: "Code",

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

