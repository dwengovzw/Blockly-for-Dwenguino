import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


tutorials.blinkLED = {
      category: "dwenguino",
      id: "tutsBlinkLED",
      label: MSG.tutsBlinkLED,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="V9/6@;rsE|D#Da%TQ1aq" x="-79" y="184"><statement name="LOOP"><block type="dwenguino_set_led" id="A3;Oe#`21h$3anGKD`/I"><value name="LED"><block type="dwenguino_led_pins" id="mgoP*)nf8J1G0)~RCt16"><field name="LED_NUMBER">13</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="OtK%yuM_G;$Yg%-6q/v?"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_delay" id="TV;},_G/n7[ELib+iC9H"><value name="DELAY_TIME"><block type="char_type" id="y~;E@(W^EWXh4?u6rDwk"><field name="BITMASK">1000</field></block></value><next><block type="dwenguino_set_led" id="fY98!Uh1L2IDCv}IwXR%"><value name="LED"><block type="dwenguino_led_pins" id="C{eJKof,K~@qpY7fXg36"><field name="LED_NUMBER">13</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Sb}ja;Ij-nigmBr:vHiT"><field name="LED_ON_OFF">OFF</field></block></value></block></next></block></next></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.blinkLED.step1Title,
          content: MSG.tutorials.blinkLED.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.blinkLED.step2Title,
          content: MSG.tutorials.blinkLED.step2Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
      {
        title: MSG.tutorials.blinkLED.step3Title,
        content: MSG.tutorials.blinkLED.step3Content,
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
