import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"
import TutorialAnswer from "../../js/src/tutorials/TutorialAnswer.js"
import TutorialMultipleChoiceQuestion from "../../js/src/tutorials/TutorialMultipleChoiceQuestion.js"
import { EVENT_NAMES } from "../../js/src/logging/EventNames.js"


/**
 * Implementation of this tour with Hopscotch
 */

tutorials.introductionSocialRobot = {
    category: "socialrobot",
    targets: [
      document.body,
      tutorialTargets.simulatorButton,
      tutorialTargets.simulatorScenarioSocialRobot,
      tutorialTargets.robotComponentsMenuLedPlusButton,
      tutorialTargets.simulatorBottomPane,
      tutorialTargets.robotComponentsMenuLedMinusButton,
      tutorialTargets.toolbox,
      tutorialTargets.workspaceArea,
      document.body
    ],
    placements: [
      "top", 
      "left", 
      "left", 
      "left", 
      "right", 
      "left", 
      "right", 
      "right", 
      "top"
    ],
    nrOfSteps: 9,
    xOffsets: [
      500, 
      0, 
      -10, 
      0, 
      -600, 
      0, 
      0, 
      -500, 
      500 
    ],
    yOffsets: [
      500, 
      0, 
      90, 
      -10, 
      100, 
      0, 
      200, 
      500, 
      500 
    ],
    steps: [],
    // Create the steps array dynamically by using the different arrays
    initSteps: function(){
      var i;
      for (i = 0 ; i < this.nrOfSteps ; i++){
        this.steps.push({
          title: MSG.tutorials.socialrobot['introduction'].stepTitles[i],
          content: MSG.tutorials.socialrobot['introduction'].stepContents[i],
          target: this.targets[i],
          placement: this.placements[i],
          showCloseButton:"true",
          width: 400,
          xOffset: this.xOffsets[i],
          yOffset: this.yOffsets[i],
        });
      }
    },
    id: "introductionSocialRobot",
    label: MSG.tutorials.socialrobot['introduction'].label,
    //label: MSG.tutsLampOnOffWeGoSTEM,
    onStart: function(){
        //Load blocks with xml file
      //DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="ndSZof?3RjcH}j2Lp/XZ" x="-312" y="822"><statement name="SETUP"><block type="dwenguino_set_led" id="JRP=z*2cxmd77C1]%2_j"><value name="LED"><block type="dwenguino_led_pins" id="`6(1#3#Z#$M@Xbq?1Xfd"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="@5tkt/z/jAQ:%,nb:Bb-"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_delay" id="UY`BuwYMQ$Q@W/RBx4W6"><value name="DELAY_TIME"><block type="char_type" id="mj5fa8/DHdN^R`GxC1?-"><field name="BITMASK">500</field></block></value><next><block type="dwenguino_set_led" id=";^M:Bzu.h.,8-bH|((6J"><value name="LED"><block type="dwenguino_led_pins" id="4fPa^^](u@WY76EvFzq3"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Vb]-SSu`gi!r(Jcf[GAP"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_delay" id="b{y].+kK+[2Im*dxbNbG"><value name="DELAY_TIME"><block type="char_type" id="30LY_FvNethd98Kevj|b"><field name="BITMASK">500</field></block></value></block></next></block></next></block></next></block></statement></block></xml>');

    },
    onEnd: function(){
      DwenguinoBlockly.tutorialMenu.endTutorial();
    },
    onNext: function(){
      DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialNextStep, DwenguinoBlockly.logger.tutorialIdSetting));
      console.log(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialNextStep, DwenguinoBlockly.logger.tutorialIdSetting));
    },
    onPrev: function(){
      DwenguinoBlockly.logger.recordEvent(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialPrevStep, DwenguinoBlockly.logger.tutorialIdSetting));
      console.log(DwenguinoBlockly.logger.createEvent(EVENT_NAMES.tutorialPrevStep, DwenguinoBlockly.logger.tutorialIdSetting));
    },

    onShow: function(){
      // Hide arrow on the first and last step
      var curr = hopscotch.getCurrStepNum();
      if(curr == 8 | curr == 0){
        $('.hopscotch-bubble-arrow-container').css('visibility', 'hidden');
      }
    }
};