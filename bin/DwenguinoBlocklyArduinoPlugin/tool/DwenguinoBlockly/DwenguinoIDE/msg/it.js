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
  setLedState: "Cambia %1 %2",
  setLedStateTooltip: "Accendi o spegni un LED sulla scheda Dwenguino",
  ledPinsTooltip: "Seleziona un led che vuoi controllare",
  dwenguinoOn: "ON",
  dwenguinoOff: 'OFF',
  dwenguinoOnOffTooltip: "Seleziona un valore per cambiare lo stato del LED ON o OFF",
  dwenguinoServoBlock: "Motore servo %1 %2 %3 canale # %4 angolo %5",
  dwenguinoServoBlockTooltip: "Posiziona uno dei servomotori connessi a Dwenguino a un angolo compreso fra 0 e 180 gradi",
  dwenguinoDCMotorBlock: "Motore DC %1 %2 %3 canale %4 veleocità %5",
  dwenguinoDCMotorBlockTooltip: "Imposta la velocità dei due motori collegabili alla scheda. Velocità = valori compresi fra -255 (massima velocità all'indietro) e 255 (massima velocità in avanti)",
  dwenguinoAnalogWrite: "Scrivi su %1 il valore analogico %2",
  dwenguinoAnalogWriteTooltip: "Scrivi una valore analogico compreso fra 0 e 255 su un pic specificato",
  dwenguinoAnalogRead: "Leggi un valore analogico dal pin %1",
  dwenguinoAnalogWriteTooltip: "Leggi un valore compreso fra 0 e 255 dal pin specificato.",
  digitalReadSwitch: "Leggi dal pulsante %1",
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
};


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
