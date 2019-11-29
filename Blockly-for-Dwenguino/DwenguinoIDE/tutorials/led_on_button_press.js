
tutorials.ledOnButtonPress = {
      id: "tutsLedOnButtonPress",
      label: MSG.tutsLedOnButtonPress,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="8qEL1tV%pg]/@7{;!wEn" x="0" y="0"><statement name="LOOP"><block type="controls_if" id="@c`]OW+b)D#(];het*:{"><value name="IF0"><block type="logic_compare" id="njF/dm02#$Nk.-d*:7Bb"><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="}8@X1HaQ,n-=g{ss,DST"><field name="SWITCH">SW_N</field></block></value><value name="B"><block type="dwenguino_pressed" id="|5GX}.gr%)=.?i!)n4lb"><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO0"><block type="dwenguino_set_led" id="dm~1_.Uk?)h4Mu0{56m~"><value name="LED"><block type="dwenguino_led_pins" id="x~Tm7)RiYeZ=ZV8iz7Ha"><field name="LED_NUMBER">13</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="_$d:3f8GJn3)fy4pE,uC"><field name="LED_ON_OFF">OFF</field></block></value></block></statement></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.ledOnButtonPress.step1Title,
          content: MSG.tutorials.ledOnButtonPress.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.ledOnButtonPress.step2Title,
          content: MSG.tutorials.ledOnButtonPress.step2Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
      {
        title: MSG.tutorials.ledOnButtonPress.step3Title,
        content: MSG.tutorials.ledOnButtonPress.step3Content,
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
