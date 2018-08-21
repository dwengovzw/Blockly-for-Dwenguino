var MSG = {
  title: "DwenguinoBlockly",
  blocks: "Blokken",
  linkTooltip: "Opslaan en koppelen naar blokken.",
  runTooltip: "Voer het programma uit dat met de blokken in de werkruimte is gemaakt.",
  loadBlocksFileTooltip: "Laad een block bestand in dat je eerder hebt opgeslagen.",
  saveBlocksFileTooltip: "Sla de blokken op naar een lokaal bestand.",
  toggleSimulator: "Open of sluit het simulatorvenster.",
  badCode: "Programmafout:\n%1",
  timeout: "Het maximale aantal iteraties is overschreden.",
  trashTooltip: "Alle blokken verwijderen",
  catLogic: "Logica",
  catLoops: "Lussen",
  catMath: "Formules",
  catText: "Tekst",
  catLists: "Lijsten",
  catColour: "Kleur",
  catVariables: "Variabelen",
  catFunctions: "Functies",
  catArduino: "Arduino",
  catDwenguino: "Dwenguino",
  catBoardIO: "IO",
  listVariable: "lijst",
  textVariable: "tekst",
  httpRequestError: "Er is een probleem opgetreden tijdens het verwerken van het verzoek.",
  linkAlert: "Deel uw blokken via deze koppeling:\n\n%1",
  hashError: "\"%1\" komt helaas niet overeen met een opgeslagen bestand.",
  xmlError: "Uw opgeslagen bestand kan niet geladen worden. Is het misschien gemaakt met een andere versie van Blockly?",
  badXml: "Fout tijdens het verwerken van de XML:\n%1\n\nSelecteer \"OK\" om uw wijzigingen te negeren of \"Annuleren\" om de XML verder te bewerken.",
  pressed: "INGEDRUKT",
  setup: "zet klaar",
  loop: "herhaal",
  dwenguino_main_program_structure: "Het eerste stukje code wordt maar een keer uitgevoerd bij het starten van het programma. De code in de 'herhaal' wordt steeds opnieuw herhaalt tot het programma stopt (bv. wanneer je de stekker uit het bordje trekt).",
  catDwenguino: "Dwenguino",
  delay_help: "Wacht een opgegeven aantal miliseconden. (1 seconde = 1000 miliseconden)",
  delay: "wacht",
  clearLCD: "maak lcd-scherm leeg",
  dwenguinoLCD: "lcd-scherm %1 %2 %3 schrijf tekst: %4 op rij %5 vanaf kolom %6",
  pin: "pin",
  toneOnPin: "speel toon af op ",
  frequency: "met frequentie",
  noToneOnPin: "stop toon op",
  toneOnPinTooltip: "Speel een toon met een specifieke frequentie af op een pin",
  noToneOnPinTooltip: "stop toon op bepaalde pin",
  trig: "trig pin nummer",
  echo: "echo pin nummer",
  sonarTooltip: "Deze blok leest de afstand in van een sonar sensor",
  miliseconds: "ms",
  digitalRead: "lees digitale waarde van",
  digitalWriteToPin: "schrijf op",
  digitalWriteValue: "de digitale waarde",
  digitalWriteTooltip: "schrijf hoog of laag naar een pin van de Dwenguino",
  digitalReadTooltip: "lees een digitale waarde (1/hoog of 0/laag) vanaf een bepaalde pin",
  high: "HOOG",
  low: "LAAG",
  highLowTooltip: "Komt overeen met een hoge (1) of lage (0) waarde op een pin.",
  tutsIntroduction: "Introductie",
  tutsTheremin: "Theremin",
  tutsRobot: "Robot",
  tutsBasicTest: "Basis test",
  tutsHelloDwenguino: "Hallo Dwenguino!",
  tutsBlinkLED: "Knipperlicht",
  tutsHelloRobot: "Rijdende Robot",
  tutsLedOnButtonPress: "LED bij knop ingedrukt",
  tutsBitPatternOnLeds: "Bit patroon op leds",
  tutsAllButtons: "Alle knoppen",
  tutsDriveForward: "Vooruit rijden",
  tutsRideInSquare: "In vierkant rijden",
  tutsRideToWall: "Naar muur rijden",
  tutsAvoidWall: "Muur ontwijken",
  tutsNameOnLcdBasic: "Je naam op het LCD-scherm",
  tutsNameOnLcdWeGoSTEM: "Naam op LCD-scherm",
  tutsIntroduceYourselfWeGoSTEM: "Jezelf voorstellen",
  tutsShowNameAndDisappearWeGoSTEM: "Naam doen verdwijnen",
  tutsLampOnOffWeGoSTEM: "Knipperlicht",
  tutsPoem1: "Gedicht 1",
  tutsPoem2: "Gedicht 2",
  simulator: "Simulator",
  setLedState: "zet %1 %2",
  setLedStateTooltip: "Zet een LEdwenguinoDCMotorBlock op het arduino bord aan of uit",
  ledPinsTooltip: "Kies een LED die je aan of af wil zetten",
  dwenguinoOn: "AAN",
  dwenguinoOff: 'UIT',
  dwenguinoOnOffTooltip: "Selecteer AAN of UIT",
  dwenguinoServoBlock: "servo motor %1 %2 %3 nummer %4 hoek %5",
  dwenguinoServoBlockTooltip: "Stel servo 1 of 2 in op een door jou gekozen hoek tussen 0 en 180 graden",
  dwenguinoDCMotorBlock: "dc-motor %1 %2 %3 nummer %4 snelheid %5",
  dwenguinoDCMotorBlockTooltip: "Stel de snelheid in van een van de twee motoren aangesloten op de Dwenguino. De snelheid is een waarde tussen -255 (volledige snelheid achteruit) en 255 (volledige snelheid vooruit)",
  dwenguinoAnalogWrite: "schrijf naar %1 de analoge waarde %2",
  dwenguinoAnalogWriteTooltip: "Schrijf een analoge waarde tussen 0 en 255 naar de opgegeven pin",
  dwenguinoAnalogRead: "lees analoge waarde van %1",
  dwenguinoAnalogWriteTooltip: "Lees een analoge waarde tussen 0 en 255 van de opgegeven pin",
  digitalReadSwitch: "lees waarde knop %1",
  waitForSwitch: "wacht tot knop %1 wordt ingedrukt",
  digitalReadSwitchTooltip: "lees de waarde van een van de dwenguino knoppen",
  north: "NOORD",
  east:"OOST",
  south: "ZUID",
  west: "WEST",
  center: "CENTER",
  ledsReg: "leds",
  dwenguinoLedsRegTooltip: "Met deze blok kan je leds 0 tot 7 met één binair getal aan of af zetten. Bijvoorbeeld: 0b00001111 zal leds 0 tot 3 aanzetten en de rest uit.",
  pressed: "INGEDRUKT",
  notPressed: "NIET INGEDRUKT",
  pressedTooltip: "Stelt de waarde van de knop voor. Vergelijk deze waarde met de waarde die je leest van een bepaalde knop.",
  sureYouWantToChangeTutorial: "Ben je zeker dat je dit boek wil starten?\n De blokken op het huidige werkblad zullen vervangen worden!",
  create: "Maak",
  with_type: "met type",
  create_global: "Maak globaal",
};


MSG.simulator = {
  start: "Start",
  stop: "Stop",
  pause: "Pauze",
  step: "1 Stap",
  speed: "Snelheid",
  speedVerySlow: "40 keer trager",
  speedSlow: "20 keer trager",
  speedMedium: "10 keer trager",
  speedFast: "5 keer trager",
  speedVeryFast: "2 keer trager",
  speedRealTime: "Real-time",
  components: "Selecteer onderdelen",
  servo: "Servo",
  motor: "Motor",
  scope: "Waarden",
  alertDebug: "Stop de simulatie voordat je terug kan programmeren",
  distance: "afstand",
  scenario: "Scenario",
  scenario_default: "Normale bord",
  scenario_moving: "Bewegende robot",
  scenario_wall: "Bewegende robot met muur",
  scenario_spyrograph: "Spyrograaf",
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
  sureTitle: "Ben je zeker?",
  sureText: "Wanneer je op 'Volgende' klikt dan worden de blokken op het werkblad vervangen.",
};


MSG.tutorials.introduction = {
  stepTitles: [
    "Welkom bij DwenguinoBlockly",
    "Het Blockly codegebied",
    "De Blockly toolbox",
    "Taal instellen",
    "De moeilijkheidsgraad",
    "Dwengobooks",
    "Je code uploaden naar het Dwenguino-bord",
    "Openen",
    "Opslaan",
    "De simulator"
  ],
  stepContents: [
    "Hoi, ik ben Dwenguino! Ik zal je helpen om de interface te leren kennen!",
    "Dit is het Blockly codegebied. Hier komt het programma dat je gaat schrijven.",
    "Dit is de toolbox. Deze bevat alle blokken die je kan gebruiken om jouw programma te schrijven. Afhankelijk van het niveau dat je gekozen hebt zie je meer of minder blokken. Ga eens op verkenning en bekijk welke blokken er allemaal zijn.",
    "Hier kan je een andere taal selecteren.",
    "Deze schuifbalk kan je gebruiken om de moeilijkheidsgraad in te stellen. Op hogere niveaus heb je meer geavanceerde blokken. Om deze te gebruiken beheers je best eerst de blokken op lagere niveaus. Voorlopig zijn er maar twee niveaus die blokjes bevatten, in de toekomst komen er meer.",
    "Dwengobooks zijn interactieve tutorials die je stap voor stap uitleggen hoe je een programma moet schrijven.",
    "Als je denkt dat je programma af is kan je het uploaden naar het Dwenguino-bord door op deze knop te drukken. (Vergeet niet om eerst het bord aan te sluiten op de computer met de usb-kabel.) <br/><em>Opgelet! Dit werkt enkel in als je dit programma in de Arduino IDE uitvoert en dus niet online in de browser.</em>",
    "Deze knop geeft je de mogelijkheid om een bestand dat je eerder hebt opgeslagen te openen in de editor.",
    "Met deze knop kan je de blokken opslaan naar een lokaal bestand.",
    "Met deze knop kan je de simulator openen. Deze kan je gebruiken om je code eerst te testen voor je hem naar het bord uploadt."
  ],
};


MSG.tutorials.basic_test = {
  step1Title: "Test je basiskennis van Dwenguino",
  step1Content: "Wanneer je nog nooit een programma hebt geschreven voor de Dwenguino kan je deze test gebruiken om te kijken hoe ver je al staat",
  step2Title: "Sequentie",
  step2ContentA: "Bekijk de code die je ziet de blockly workspace. Wat is na het uitvoeren van de code de waarde die in a zit?",
  step2ContentB: "Wat is de waarde die in b zit?",
  stepEndTitle: "Goed zo!",
  stepEndContent: "Je hebt de quiz successvol afgelegd, op naar de volgende!"
};


MSG.tutorials.theremin = {
  step1Title: "Voorwoord",
  step1Content: "Vandaag de dag zijn elektronische apparaten niet meer weg te denken. Veel van deze apparaten worden aangestuurd door microcontrollers. In dit boekje verkennen we stap voor stap de prachtige wereld van de microcontrollers. Op het einde van dit boekje kan je zelf jouw eigen digitale piano programmeren. Hiermee heb je jouw eerste ingebed systeem ontwikkeld: een digitaal systeem dat in staat is te interageren met zijn omgeving.\
We doen dit met behulp van de Dwenguino, een eenvoudig, multi-functioneel microcontrollerplatform. De Dwenguino is voorzien van tal van handigheidjes zodat jouw eerste stappen vlot verlopen. Dankzij de compatibiliteit met Arduino IDE gebeurt dit met behulp van goed doordachte tools die zowel grafisch als tekstueel programmeren mogelijk maken.\
Experimenteren met microcontrollers kan zowel thuis als in de klas. Dit boekje is in de eerste plaats bedoeld voor leerkrachten die in het kader van hun lessen omgaan met informatica, elektronica of techniek. Maar jongeren kunnen dit boekje ook zelfstandig ontdekken. Dat maakt hun leer-ervaring nog intenser.\
Veel succes!",
  step2Title: "Overal microcontrollers",
  step2Content: "De voorbije decennia nam het aantal digitale apparaten in huis, tuin en werkomgeving exponentieel toe. Het begon met de introductie van eenvoudige zaken zoals wekkerradio's en elektrische tandenborstels maar ondertussen is zo goed als elk apparaat intelligent. Misschien heb je thuis wel een grasmaai- of stofzuigrobot, of zelfs een zelfrijdende auto, deze zijn de dag van vandaag zeker geen science fiction meer!\
Sterker nog, al deze apparaten worden steeds meer verbonden met het internet en vormen zo samen het Internet of Things (IoT). Studies schatten dat tegen 2020 meer dan 50 miljard apparaten verbonden zullen zijn met het internet. We spreken dan niet alleen over smartphones en tablets maar ook over bijvoorbeeld slimme rookmelders, intelligente koelkasten en robots.\
De basis van al deze apparaten zijn digitale rekensystemen die instaan voor de nodige intelligentie. Een voorbeeld hiervan is de microcontroller, deze omvat al het nodige om sensorgegevens te verwerken, berekeningen uit te voeren en acties te ondernemen.",
  step3Title: "Het bord",
};


MSG.tutorials.hello_dwenguino = {
  step1Title: "Hallo Dwenguino!",
  step1Content: "In deze tutorial schrijf je je eerste Dwenguino-programma. Dit programma schrijft de tekst 'Hallo Dwenguino' naar het lcd-scherm van het bord.",
  step2Title: "De simulator",
  step2Content: "Klik op de simulator-knop om deze te openen.",
  step3Title: "Blokjes slepen uit de toolbox",
  step3Content: "Neem nu onderstaande blok uit de toolbox en plaats deze onder de tekst <em><b>zet klaar bij start</b></em>. </br><img src='img/helloDwenguino/dwenguinoLCD.png' alt='Image of the dwenguino LCD block' style='max-width:100%'/>",
  step4Title: "Je code uitvoeren",
  step4Content: "Om je code uit te voeren in de simulator druk je op de <em><b>Start</b></em>-knop.</br>Wat zie je ?</br>Met de <em><b>Stop</b></em>-knop kan je de uitvoering in de simulator stoppen.</br>Merk op dat je de code niet kan aanpassen terwijl deze wordt uitgevoerd.",
  step5Title: "Het 'zet klaar, herhaal'-blok",
  step5Content: "De code die onder het tekstje <em><b>zet klaar bij start</b></em> staat zal één keer uitgevoerd worden bij het begin van het programma. De code onder het tekstje <em><b>herhaal</b></em> blijft wordt oneindig keer herhaald.</br>Is er een verschil wanneer je het <em><b>lcd</b></em>-blok in het gedeelte <em><b>zet klaar bij start</b></em> of het gedeelte <em><b>herhaal</b></em> zet?",
  step6Title: "Nu zelf!",
  step6Content: "Probeer het nu zelf! Verander de tekst die op het scherm komt eens in je eigen naam. </br> Probeer ook eens om de tekst op de tweede lijn van het scherm te laten verschijnen.",
};


MSG.tutorials.blink = {
  step1Title: "Knipperlicht",
  step1Content: "In deze tutorial schrijven we een programma dat LD13 afwisselend aan- en uitzet. We zorgen ervoor dat de led twee keer per seconde aan- en uitgaat.",
  step2Title: "De simulator",
  step2Content: "Klik op de simulator-knop om deze te openen.",
  step3Title: "Blokjes slepen uit de toolbox",
  step3Content: "Gebruik de volgende blokken om je programma te schrijven: </br><img src='img/blink/requiredBlocks.png' alt='Image of the blocks required for the blink exercise' style='max-width:100%'/></br><b>Tip:</b> de tijd in het <em><b>wacht</b></em>blokje staat in milliseconden.</br> 1 seconde = 1000 milliseconden.",
  step4Title: "Je code uitvoeren",
  step4Content: "Om je code uit te voeren in de simulator druk je op de <em><b>Start</b></em>-knop.</br>Wat zie je ?</br>Met de <em><b>Stop</b></em>-knop kan je de uitvoering in de simulator stoppen.</br>Merk op dat je de code niet kan aanpassen terwijl deze wordt uitgevoerd.",
  step5Title: "Werkt je code correct?",
  step5Content: "Als je code nog niet correct werkt, kan je de fout proberen achterhalen door blokje voor blokje door je code te stappen. Dit doe je door in de simulator op de knop <em><b>1 stap</b></em> te drukken.</br>Als je code nu al correct werkt, dikke duim!",
  step6Title: "Nu zelf!",
  step6Content: "Probeer het nu zelf!</br><ul><li>Verander de knippersnelheid zodat de led 1 keer per seconde aan- en uitgaat.</li><li>Kies eens een andere led om aan en uit te zetten.</li><li>Probeer eens meerdere leds aan en uit te zetten.</li></ul>",
};


MSG.tutorials.hello_robot = {
  step1Title: "Rijdende robot",
  step1Content: "In deze tutorial programmeer je een tweewielige rijdende robot. Je zal de opdracht krijgen om de robot verschillende patronen te laten rijden.",
  step2Title: "De simulator",
  step2Content: "Klik op de simulator-knop om deze te openen.",
  step3Title: "Scenario kiezen",
  step3Content: "Om onze rijdende robot te kunnen programmeren moet je in de simulator kiezen voor het scenario <em><b>Bewegende robot</b></em>.",
  step4Title: "Vooruit rijden",
  step4Content: "Als eerste opdracht moet je de robot gewoon rechtdoor laten rijden. Elk wiel van de robot is verbonden met een dc-motor. Om deze motoren te programmeren gebruik je het volgende blok:</br><img src='img/helloRobot/DCMotor.png' alt='Motor block' style='max-width:100%'/></br>Door het <em><b>nummer</b></em> te veranderen kan je motor 1 of 2 laten draaien.</br>De <em><b>snelheid</b></em> wordt bepaald door een getal tussen -255 en 255. (-255 = maximale snelheid achteruit, 0 = niet draaien, 255 = maximale snelheid vooruit.)",
  step5Title: "Een bocht",
  step5Content: "Denk na hoe je je robot een rechte hoek kan laten maken. </br><b>Tip:</b> laat de wielen in tegengestelde richting draaien om de robot een bocht te laten nemen.",
  step6Title: "Een vierkant",
  step6Content: "Nu je erin geslaagd bent om de robot een bocht van 90° te laten nemen, kan je eens proberen om hem in een vierkant te laten rijden.",
};


//TODO: translate
MSG.tutorials.nameOnLcd = {
  step1Title: "Name on lcd-screen",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Name on lcd-screen",
  step2Content: "Change the program so your name appears on the first line of the lcd-screen.",
};


//TODO: translate
MSG.tutorials.blinkLED = {
  step1Title: "Blink LED",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Blink LED",
  step2Content: "Change the program so the LED turns on for one second and then turns off the LED for one second. This sequence is repeated indefinitely.",
  step3Title: "Extra",
  step3Content: "Make another LED turn on and off.",
};


//TODO: translate
MSG.tutorials.ledOnButtonPress = {
  step1Title: "LED on button press",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "LED on button press",
  step2Content: "Change the program so the LED turns on when you press the north button.",
  step3Title: "Extra",
  step3Content: "Make sure the LED turns off when you release the north button.",
};


//TODO: translate
MSG.tutorials.bitPatternOnLeds = {
  step1Title: "Pattern on LEDs",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "Pattern on LEDs",
  step2Content: "The code you have is very long. Can you get the same result using less blocks? Try to get the same result by using less blocks!",
  step3Title: "Pattern on LEDs",
  step3Content: "When you succeeded in reducing the number of blocks, call one of the tutors to get feedback on your solution.",
};


//TODO: translate
MSG.tutorials.allButtons = {
  step1Title: "All buttons",
  step1Content: "Open the simulator view and test the code. What do you see?",
  step2Title: "All buttons",
  step2Content: "This code should turn on a led when one of the buttons is pressed. Look at the program. Do all buttons work? Try to correct the code for the buttons that do not work.",
  step3Title: "Extra",
  step3Content: "Change the code so the LED turns off when the button is released.",
};


//TODO: trnalsate
MSG.tutorials.driveForward = {

  stepTitles: [
    "Vooruit rijden",
    "Vooruit rijden",
    "Vooruit rijden",
  ],
  stepContents: [
    "Open de simulator",
    "Selecteer het scenario 'rijdende robot' en test de code in de simulator. Wat zie je?",
    "Gaat de auto vooruit?",
  ],
};


//TODO: translate
MSG.tutorials.rideInSquare = {
  stepTitles: [
    "In vierkant rijden",
    "In vierkant rijden",
    "In vierkant rijden",
    "Extra",
  ],
  stepContents: [
    "Open de simulator",
    "Selecteer het scenario 'rijdende robot' en test de code in de simulator. Wat zie je?",
    "Rijdt de auto in een vierkant? Probeer de fout te vinden en deze te verbeteren. Gebruik hiervoor de debugger.",
    "De code is heel lang. Kan je de code korter maken?",
  ],
};


//TODO: translate
MSG.tutorials.rideToWall = {
  stepTitles: [
    "Naar de muur rijden",
    "Naar de muur rijden",
    "Naar de muur rijden",
    "Naar de muur rijden",
  ],
  stepContents: [
    "Open de simulator",
    "Selecteer het scenario 'rijdende robot' en test de code in de simulator. Wat zie je?",
    "Verander het scenario type naar 'rijdende robt met muur'?",
    "Rijdt de robot tot aan de muur? Probeer de fout te vinden en deze te verbeteren. Gebruik hiervoor de debugger.",
  ],
};


//TODO: translate
MSG.tutorials.avoidWall = {
  stepTitles: [
    "Muur ontwijken",
    "Muur ontwijken",
    "Muur ontwijken",
    "Muur ontwijken",
  ],
  stepContents: [
    "Open de simulator.",
    "Selecteer de scenario tab.",
    "Verander het scenario type naar 'rijdende robt met muur'?",
    "Ontwijkt de robot tot aan de muur? Probeer de fout te vinden en deze te verbeteren. Gebruik hiervoor de debugger.",
  ],
};


MSG.tutorials.nameOnLcdBasic = {
  step1Title: "Naam op LCD-scherm",
  step1Content: "In deze tutorial plaats je je naam op het LCD-scherm. Je ziet een voorbeeld van hoe dat moet.</br> Bekijk de code en probeer te begrijpen wat het doet.",
  step2Title: "Testen op het bord",
  step2Content: "Test de code door het Dwenguino bord aan de computer te schakelen met de usb-kabel en op de play knop te drukken.",
  step3Title: "Je eigen naam",
  step3Content: "Momenteel zie je de naam 'Tom' op het scherm verschijnen. Pas de code aan zodat je jouw naam ziet.",
  step4Title: "Twee rijen",
  step4Content: "Het LCD-scherm heeft twee rijen. Verander de rij waarop je naam staat van 0 naar 1.",
  step5Title: "Test",
  step5Content: "Test je code.",
  step6Title: "Proficiat",
  step6Content: "Goed zo! Je weet nu hoe je tekst op het LCD-scherm kan plaatsen.",
};


MSG.tutorials.nameOnLcdWeGoSTEM = {
  stepTitles: [
    "Open Simulatorvenster",
    "Naam op LCD-scherm",
    "Testen in de simulator",
    "Stop simulatie",
    "Je eigen naam",
    "Twee rijen",
    "Test",
    "Proficiat",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "In deze oefening plaats je je naam op het LCD-scherm. Je ziet een voorbeeld van hoe dat moet.</br> Bekijk de codeblokken en probeer te begrijpen wat het doet.",
    "Test je code door in de simulator op <e>Start</e> te drukken.</br>Wat zie je?",
    "Stop je test door op <e>Stop</e> te drukken",
    "Momenteel zie je de naam 'Tom' op het scherm verschijnen. Pas de code aan zodat je jouw naam ziet.",
    "Het LCD-scherm heeft twee rijen. Verander de rij waarop je naam staat van 0 naar 1.",
    "Test je code.",
    "Goed zo! Je weet nu hoe je tekst op het LCD-scherm kan plaatsen.",
  ],
};


MSG.tutorials.introduceYourself = {
  stepTitles: [
    "Open Simulatorvenster",
    "Jezelf voorstellen",
    "Testen in de simulator",
    "Stop simulatie",
    "Pas de code aan",
    "Gelukt?",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "In deze oefening stel je jezelf voor via het lcd-scherm. </br> Bekijk de code en probeer te achterhalen wat die doet.",
    "Test de code door in de simulator op <e>Start</e> te drukken.</br>Wat zie je?",
    "Stop je test door op <i>Stop</i> te drukken. </br>Wat doet het programma? Noteer dit!",
    "Er zijn een aantal verschillen tussen de tekst die dit programma toont en wat je wil dat het programma toont.</br>Pas het programma aan zodat de juiste tekst getoond wordt.",
    "Is het gelukt om de code te verbeteren?",
  ],
};


MSG.tutorials.showNameAndDisappear = {
  stepTitles: [
    "Open Simulatorvenster",
    "Naam tonen",
    "Testen in de simulator",
    "Stop simulatie",
    "Pas de code aan",
    "Gelukt?",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "In deze oefening toon je je naam voor 2 seconden op het lcd-scherm en laat je hem dan opnieuw verdwijnen.",
    "Test de code door in de simulator op <e>Start</e> te drukken.</br>Wat zie je?",
    "Stop je test door op <i>Stop</i> te drukken. </br>Wat doet het programma? Noteer dit!",
    "Wat zijn de verschillen tussen dit programma en het programma dat je wil? </br> Verbeter je code!",
    "Is het gelukt om de code te verbeteren?",
  ],
};


MSG.tutorials.poem1 = {
  stepTitles: [
    "Open Simulatorvenster",
    "Gedicht",
    "Testen in de simulator",
    "Stop simulatie",
    "Pas de code aan",
    "Gelukt?",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "Dit programma zou het gedicht dat je op het bord ziet moeten tonen op het lcd-scherm.",
    "Test de code door in de simulator op <e>Start</e> te drukken.</br>Wat zie je?",
    "Stop je test door op <i>Stop</i> te drukken. </br>Wat doet het programma? Noteer dit!",
    "Wat zijn de verschillen tussen dit programma en het programma dat je wil?</br>Dit programma bevat twee fouten.</br>Je kan de code zoveel als je wil uitproberen om de fouten te vinden.</br><b>Probeer de fouten in het programma te verbeteren.</b>",
    "Is het gelukt om de code te verbeteren?",
  ],
};


MSG.tutorials.poem2 = {
  stepTitles: [
    "Open Simulatorvenster",
    "Gedicht",
    "Testen in de simulator",
    "Stop simulatie",
    "Pas de code aan",
    "Gelukt?",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "Dit programma toont het gedicht dat je op het bord kan zien op het lcd-scherm.",
    "Test de code door in de simulator op <e>Start</e> te drukken.",
    "Stop je test door op <i>Stop</i> te drukken. </br>Wat doet het programma? Noteer dit!",
    "Het programma werkt correct maar is heel groot. Probeer de code korter te krijgen door gebruik te maken van een <b>rekenen met</b>-blok.",
    "Is het gelukt om de code te verbeteren?",
  ],
};


MSG.tutorials.lampOnOffWeGoSTEM = {
  stepTitles: [
    "Open Simulatorvenster",
    "Gedicht",
    "Testen in de simulator",
    "Stop simulatie",
    "Pas de code aan",
    "Gelukt?",
  ],
  stepContents: [
    "Open het simulatorvenster door op de simulator knop te drukken.",
    "Dit programma zou lampje nummer 3 elke seconde 1 keer moeten laten knipperen.",
    "Test de code door in de simulator op <e>Start</e> te drukken.",
    "Stop je test door op <i>Stop</i> te drukken. </br>Wat doet het programma? Noteer dit!",
    "Werkt het programma zoals het zou moeten?.</br>Pas het programma aan zodat het wel correct werkt.",
    "Is het gelukt om de code te verbeteren?",
  ],
};
