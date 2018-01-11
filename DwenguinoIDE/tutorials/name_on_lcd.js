
tutorials.nameOnLcd = {
      id: "tutsNameOnLcd",
      label: MSG.tutsNameOnLcd,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="V9/6@;rsE|D#Da%TQ1aq" x="-79" y="184"><statement name="SETUP"><block type="dwenguino_lcd" id="4[oLkNw/z5;Ou4dn-zdD"><value name="text"><block type="text" id="48"><field name="TEXT">Hello Dwenguino!</field></block></value><value name="line_number"><block type="char_type" id="53"><field name="BITMASK">2</field></block></value><value name="character_number"><block type="char_type" id="58"><field name="BITMASK">0</field></block></value></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.nameOnLcd.step1Title,
          content: MSG.tutorials.nameOnLcd.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.nameOnLcd.step2Title,
          content: MSG.tutorials.nameOnLcd.step2Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      }
    ],
    onEnd: function(){
        DwenguinoBlockly.endTutorial();
    }
    };
