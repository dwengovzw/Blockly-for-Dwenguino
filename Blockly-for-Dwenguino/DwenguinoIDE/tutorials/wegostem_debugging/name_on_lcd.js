import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"
import { EVENT_NAMES } from "../../js/src/logging/EventNames.js"

tutorials.nameOnLcd = {
      category: "wegostem",
      targets: [tutorialTargets.simulatorButton,
                tutorialTargets.workspaceArea,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.simulatorStopButton,
                tutorialTargets.workspaceArea,
                tutorialTargets.workspaceArea,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.dwenguino],
      placements: ["left", "top", "left", "left", "top", "top", "left", "left"],
      nrOfSteps: 7,
      xOffsets: [0, "center", 0, 0, "center", "center", 0],
      yOffsets: [0, "top", 0, 0, "top", "top", 0],
      steps: [],
      // Create the steps array dynamically by using the different arrays
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.nameOnLcdWeGoSTEM.stepTitles[i],
            content: MSG.tutorials.nameOnLcdWeGoSTEM.stepContents[i],
            target: this.targets[i],
            placement: this.placements[i],
            showCloseButton:"true",
            width: 400,
            xOffset: this.xOffsets[i],
            yOffset: this.yOffsets[i],
          });
        }
      },
      id: "tutsNameOnLcdWeGoSTEM",
      label: MSG.tutsNameOnLcdWeGoSTEM,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="V9/6@;rsE|D#Da%TQ1aq" x="-79" y="184"><statement name="SETUP"><block type="dwenguino_lcd" id="4[oLkNw/z5;Ou4dn-zdD"><value name="text"><block type="text" id="48"><field name="TEXT">Tom</field></block></value><value name="line_number"><block type="char_type" id="53"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="58"><field name="BITMASK">0</field></block></value></block></statement></block></xml>');
      },
      onEnd: function(){
        DwenguinoBlockly.tutorialMenu.endTutorial();
      },
      onNext: function(){
        DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialNextStep, DwenguinoBlockly.logger.tutorialIdSetting));
        console.log(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialNextStep, DwenguinoBlockly.logger.tutorialIdSetting));
      },
      onPrev: function(){
        DwenguinoBlockly.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialPrevStep, DwenguinoBlockly.logger.tutorialIdSetting));
        console.log(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialPrevStep, DwenguinoBlockly.logger.tutorialIdSetting));
      },
  };
