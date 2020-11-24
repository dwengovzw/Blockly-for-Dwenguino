var MSG = {
  title: "DwenguinoBlockly",
  blocks: "Blocchi",
  linkTooltip: "Salva e collega ai blocchi.",
  runTooltip: "Lancia il programma definito dai blocchi.",
  loadBlocksFileTooltip: "Carica un file salvato in precedenza",
  saveBlocksFileTooltip: "Salva un file sul tuo computer",
  toggleSimulator: "Attiva o disattiva la vista simulatore",
  badCode: "Errore:\n%1",
  timeout: "Numero massimo di iterazioni superato.",
  trashTooltip: "Elimina tutti i blocchi.",
  catLogic: "Logica",
  catLoops: "Loop",
  catMath: "Matematica",
  catText: "Testo",
  catLists: "Liste",
  catColour: "Colore",
  catArduino: "Arduino",
  catVariables: "Variabili",
  catFunctions: "Funzioni",
  catDwenguino: "Dwenguino",
  catSocialRobot: "Social robot",
  catBoardIO: "IO",
  listVariable: "lista",
  textVariable: "testo",
  httpRequestError: "C'è stato un problema con questa richiesta.",
  linkAlert: "Condividi il tuo programma a blocchi a questo link:\n\n%1",
  hashError: "Spiancente, '%1' non corrisponde a nessun programma salvato.",
  xmlError: "Non posso caricare questo file. Forse è stato creato con una versione differente di Blockly?",
  badXml: "Errore nell'analisi dell'XML:\n%1\n\n Seleziona'OK' per eliminare i tuoi cambiamenti 'Cancella' per continuare a editare l'XML.",
  pressed: "PREMUTO",
  setup: "setup",
  loop: "loop",
  dwenguino_main_program_structure: "Le istruzioni contenute nel blocco setup sono eseguite una volta soltanto, all'avvio del programma. Il codice contenuto nel blocco loop è ripetuto continuamente, fino a quando il programma non viene arrestato.",
  catDwenguino: "Dwenguino",
  delay_help: "Attendi per una quantità stabilita di millisecondi (1 millisecondo = 1000 secondi)",
  delay: "delay",
  clearLCD: "Pulisci LCD",
  dwenguinoLCD: "Dwenguino LCD %1 %2 %3 Scrivi testo: %4 Sulla riga: %5 A partire dalla colonna: %6",
  pin: "pin",
  toneOnPin: "Suona una nota su ",
  frequency: "con frequenza",
  noToneOnPin: "Ferma la nota su",
  toneOnPinTooltip: "Riproduce una nota con una frequenza specifica su un pin specificato",
  noToneOnPinTooltip: "Ferma la nota sul pin",
  trig: "Invia un segnale attraverso il pin numero",
  echo: "fa un echo sul pin numero",
  sonarTooltip: "Questo sensore sonar misura una distanza",
  miliseconds: "ms",
  digitalRead: "Leggi un valore digitale da",
  digitalWriteToPin: "Scrivi su",
  digitalWriteValue: "valore digitale",
  digitalWriteTooltip: "Scrivi un valore high o low su un pin digitale della scheda Dwenguino",
  digitalReadTooltip: "Leggi un valore digitale (1/high o 0/low) da un pin specifico",
  high: "HIGH",
  low: "LOW",
  highLowTooltip: "Rapresenta un valore high (1) o low (0) su un pin.",
  tutsIntroduction: "Introduzione",
  tutsTheremin: "Theremin",
  tutsRobot: "Robot",
  tutsHelloDwenguino: "Hello Dwenguino!",
  simulator: "Simulatore",
  setLedState: "Cambia",
  setLedStateTooltip: "Accendi o spegni un LED sulla scheda Dwenguino",
  ledPinsTooltip: "Seleziona un led che vuoi controllare",
  dwenguinoOn: "ON",
  dwenguinoOff: 'OFF',
  dwenguinoOnOffTooltip: "Seleziona un valore per cambiare lo stato del LED ON o OFF",
  dwenguinoLedBlock: "LED",
  dwenguinoSonarBlock: "Sonar",
  channel: "canale",
  angle: "angolo",
  speed: "veleocità",
  dwenguinoServoBlock: "Motore servo",
  dwenguinoServoBlockTooltip: "Posiziona uno dei servomotori connessi a Dwenguino a un angolo compreso fra 0 e 180 gradi",
  dwenguinoDCMotorBlock: "Motore DC",
  dwenguinoDCMotorBlockTooltip: "Imposta la velocità dei due motori collegabili alla scheda. Velocità = valori compresi fra -255 (massima velocità all'indietro) e 255 (massima velocità in avanti)",
  dwenguinoAnalogWriteBlock: "Scrivi su",
  dwenguinoAnalogValue: "il valore analogico",
  dwenguinoAnalogWriteTooltip: "Scrivi una valore analogico compreso fra 0 e 255 su un pic specificato",
  dwenguinoAnalogReadBlock: "Leggi un valore analogico dal pin",
  dwenguinoAnalogWriteTooltip: "Leggi un valore compreso fra 0 e 255 dal pin specificato.",
  digitalReadSwitch: "Leggi dal pulsante %1",
  waitForSwitch: "attendere fino a quando si preme %1 il pulsante",
  digitalReadSwitchTooltip: "Leggi un valore da uno dei pulsanti di Dwenguino",
  north: "Nord",
  east:"Est",
  south: "Sud",
  west: "Ovest",
  center: "Centro",
  ledsReg: "LEDS",
  dwenguinoLedsRegTooltip: "Puoi accendere o spegnere i led da 0 a 7 usando un numero binario. Per esempio 0b00001111 accenderà i led da 0 a 3, mantenendo gli altri spenti.",
  pressed: "PREMUTO",
  notPressed: "NON PREMUTO",
  pressedTooltip: "Rappresenta lo stato del pulsante. Usa questi valori per confrontare lo stato attuale di uno o più pulsanti.",
  create_global: "Create global",
  socialrobotPirBlock: "Pir",
  socialrobotSetPinBlock: "Set",
  socialrobotReadPinBlock: "Read value of pin",
  socialrobotServoBlock: "Servo motor",
  socialrobotWaveArmesBlock: "Wave arms",
  socialRobotArmsDownBlock: "Put arms down",
  socialRobotArmsUpBlock: "Put arms up",
  socialRobotEyesLeftBlock: "Turn eyes left",
  socialRobotEyesRightBlock: "Turn eyes right",
  socialRobotServoRightHand: "Servo pin right hand",
  socialRobotServoLeftHand: "Servo pin left hand",
  socialRobotServoRightEye: "Servo pin right eye",
  socialRobotServoLeftEye: "Servo pin left eye", 
  sonarSliderLabel: "Sonar distance",
  pirButtonLabel: "PIR button",
  soundButtonLabel: "Sound button",
  lightButtonLabel: "Light sensor button",
  servoCostume: "Costume",
  servoOptions: "Servo motor options",
  sonarOptions: "Sonar sensor options",
  lcdOptions: "LCD screen options",
  pirOptions: "PIR sensor options",
  soundOptions: "Sound sensor options",
  lightOptions: "Light sensor options",
  ledOptions: "LED options",
  runError: "<h3>Sorry, I was unable to upload the code to the board</h3>",
  uploadError: "Follow these steps to restart the Dwenguino board: \n    1. Disconnect the USB cable \n    2. Connect the computer and Dwenguino board with the USB cable \n    3. Simultaneously press the RESET and the SOUTH button of the Dwenguino board \n    4. Then first release the RESET button \n    5. Then release the SOUTH button \n    6. Upload the program again via the <span id='db_menu_item_run' class='glyphicon glyphicon-play' alt='Upload code to Dwenguino board'></span> button in the main menu",
  cleanError: "The previous code could not be removed.\nPlease check if another application is using any .cpp files.\n Close the application.",
  compileError: "The code could not be compiled.\nYou should check your code, did you forget a block someware?",

  //TODO: translate
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
  clear: "Clear",
  save: "Save",
  
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
  start: "Avvia",
  stop: "Ferma",
  pause: "Pausa",
  step: "1 Step",
  speed: "Velocità",
  speedVerySlow: "40 volte più lento",
  speedSlow: "20 volte più lento",
  speedMedium: "10 volte più lento",
  speedFast: "5 volte più lento",
  speedVeryFast: "2 volte più lento",
  speedRealTime: "Real-time",
  components: "Seleziona i componenti",
  servo: "Servo",
  motor: "Motore",
  scope: "Variabili",
  alertDebug: "Arresta la simulazione prima di tornare al programma",
  distance: "distanza",
  scenario: "Scenario",
  scenario_default: "Scheda normale",
  scenario_moving: "Robot mobile",
  scenario_wall: "Robot mobile con muro",
  code: "Codice",
  pir: "PIR sensor",
  pirDescription: "A passif infrared (PIR) sensor allows you to <b>sense motion</b>, because it detects changes of infrared radiation in its environment",
  sonar: "Sonar",
  led: "LED",
  ledDescription: "A light-emitting diode (LED) is a semiconductor device that <b>emits light</b> when an electric current passes through it. Different semiconductor materials produce <b>different colors of light</b>. ",
  lcd: "LCD screen",
  lcdDescription: "The LCD display on the Dwengo board is a 16x2 character display with backlight.",
  button: "Button",
  sound: "Sound sensor",
  light: "Light sensor",
  buzzer: "Buzzer",
  buzzerDescription: "The buzzer on the Dwengo board can be used to <b>play a series of tones</b> or short sound fragments. The height of each tone is controlled by defining the <b>frequency</b> of the buzzer. Use a delay block to change the length of a tone.",
  decoration: "Decoration"
};
MSG.tutorials = {
    introduction: {},
};

MSG.tutorials.general = {
  sureTitle: "Are you sure?",
  sureText: "When you click 'Next' all blocks in the workspace will be removed.",
};

MSG.tutorials.introduction = {
  step1Title: "Benvenuto in DwenguinoBlockly",
  step1Content: "Ciao! Il mio nome è Dwenguino! Ti aiuterò a conoscere questa interfaccia di programmazione!",
  step2aTitle: "Area del codice Blockly",
  step2aContent: "In quest'area puoi aggiungere blocchi di codice. Affinché siano eseguiti devi metterli all'interno dei blocchi setup o loop.",
  step2bTitle: "La toolbox Blockly",
  step2bContent: "Questa è la scatola degli attrezzi: contiene i blocchi che puoi usare per comporre il tuo programma. I blocchi sono raccolti in diverse categorie, utili per aiutarti a orientarti fra le possibilità della scheda Dwenguino.",
  step3Title: "Seleziona la lingua",
  step3Content: "Usa questo menu per selezionare la lingua",
  step4Title: "Difficoltà",
  step4Content: "Con questo slider puoi selezionare il livello di difficoltà, scegliendo fra livello base e avanzato.",
  step5Title: "Dwengobook",
  step5Content: "I Dwengobook sono tutorial interattivi che ti guidano attraverso diverse sfide di robotica e programmazione.",
  step6Title: "Carica il programma",
  step6Content: "Quando hai terminato di comporre il tuo codice, puoi caricarlo sulla scheda Dwenguino usando questo pulsante. Assicurati di aver selezionato nella IDE Arduino la scheda corretta e la porta corrispondente prima di effettuare il caricamento.",
  step7Title: "Apri",
  step7Content: "Questo pulsante ti permette di aprire un programma salvato in precedenza.",
  step8Title: "Salva",
  step8Content: "Con questo pulsante puoi salvere il tuo codice in un file locale.",
  step9Title: "Simulatore",
  step9Content: "In futuro potrai usare questo pulsante per aprire il simulatore. Per ora puoi usarlo per testare il tuo codice!"

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