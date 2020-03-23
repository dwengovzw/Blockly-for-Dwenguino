import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


tutorials.nameOnLcdBasic = {
      category: "dwenguino",
      id: "tutsNameOnLcdBasic",
      label: MSG.tutsNameOnLcdBasic,
      onStart: function(){
        /*var result = window.confirm(MSG.sureYouWantToChangeTutorial);
        //Clear workspace or stop tutorial
        if (result){
          DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id=":PfZAG0t/p@JAjM;TDm5" x="0" y="0"><statement name="SETUP"><block type="dwenguino_lcd" id="yU-V*5LqB`ZywWt$enVk"><value name="text"><block type="text" id="48"><field name="TEXT">Tom</field></block></value><value name="line_number"><block type="char_type" id="53"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="58"><field name="BITMASK">0</field></block></value></block></statement></block></xml>');
        }else{
          hopscotch.endTour(true);
        }*/
      },
      steps: [
        {
          title: MSG.tutorials.general.sureTitle,
          content: MSG.tutorials.general.sureText,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
          onNext: function(){
            DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id=":PfZAG0t/p@JAjM;TDm5" x="0" y="0"><statement name="SETUP"><block type="dwenguino_lcd" id="yU-V*5LqB`ZywWt$enVk"><value name="text"><block type="text" id="48"><field name="TEXT">Tom</field></block></value><value name="line_number"><block type="char_type" id="53"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="58"><field name="BITMASK">0</field></block></value></block></statement></block></xml>');
          },
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step1Title,
          content: MSG.tutorials.nameOnLcdBasic.step1Content,
          target: tutorialTargets.workspaceArea,
          placement: "left",
          showCloseButton:"true",
          width: 400,
          placement: "bottom",
          xOffset: "center",
          yOffset: "center"
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step2Title,
          content: MSG.tutorials.nameOnLcdBasic.step2Content,
          target: tutorialTargets.playButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step3Title,
          content: MSG.tutorials.nameOnLcdBasic.step3Content,
          target: tutorialTargets.workspaceArea,
          placement: "left",
          showCloseButton:"true",
          width: 400,
          placement: "bottom",
          xOffset: "center",
          yOffset: "center"
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step4Title,
          content: MSG.tutorials.nameOnLcdBasic.step4Content,
          target: tutorialTargets.workspaceArea,
          placement: "left",
          showCloseButton:"true",
          width: 400,
          placement: "bottom",
          xOffset: "center",
          yOffset: "center"
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step5Title,
          content: MSG.tutorials.nameOnLcdBasic.step5Content,
          target: tutorialTargets.playButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.nameOnLcdBasic.step6Title,
          content: MSG.tutorials.nameOnLcdBasic.step6Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      }
    ],
    onEnd: function(){
      DwenguinoBlockly.tutorialMenu.endTutorial();
    }
  };
