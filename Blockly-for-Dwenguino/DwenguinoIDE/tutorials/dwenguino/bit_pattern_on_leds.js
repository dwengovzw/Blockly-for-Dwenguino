import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


tutorials.bitPatternOnLeds = {
      category: "dwenguino",
      id: "tutsBitPatternOnLeds",
      label: MSG.tutsBitPatternOnLeds,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="8qEL1tV%pg]/@7{;!wEn" x="0" y="0"><statement name="SETUP"><block type="dwenguino_set_led" id="dm~1_.Uk?)h4Mu0{56m~"><value name="LED"><block type="dwenguino_led_pins" id="x~Tm7)RiYeZ=ZV8iz7Ha"><field name="LED_NUMBER">0</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="_$d:3f8GJn3)fy4pE,uC"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_set_led" id=":Kvq~Wp{eh|DGr]CCw^b"><value name="LED"><block type="dwenguino_led_pins" id="4!@ltt|ve/zM#1?~b^66"><field name="LED_NUMBER">1</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="xWHtJQR]%(w]`^#C#:`u"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_set_led" id="T/LAz`d8@6rc.S.q?883"><value name="LED"><block type="dwenguino_led_pins" id="h%v6`1bVT3tC[$3.9J/z"><field name="LED_NUMBER">2</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="QM2Q?^U_#UKDkK.*tMEO"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_set_led" id="9tV]eOhq~_aB0NOa.YG:"><value name="LED"><block type="dwenguino_led_pins" id="h8a@h?GhS)@DF+]4LTAq"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="lD%lmYc8b/RFoVIgF|BN"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_set_led" id="p2zqfy|Ele`i[276%duj"><value name="LED"><block type="dwenguino_led_pins" id="#;^5iJ!7A08(=[!8`ae1"><field name="LED_NUMBER">4</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="NAW])DE=q_h9|?tru7J_"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_set_led" id="E/cXb$daN(m!JHQUdPmH"><value name="LED"><block type="dwenguino_led_pins" id="xU.PG,DIv`|%fU[5X_v{"><field name="LED_NUMBER">5</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Q`hq!lX({uXY-875Odv#"><field name="LED_ON_OFF">ON</field></block></value><next><block type="dwenguino_set_led" id="y^(25?_+SH)Ybuapz+Er"><value name="LED"><block type="dwenguino_led_pins" id="W6:!0LB^e-GSeRSX,0K:"><field name="LED_NUMBER">6</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="?~`s%F:(qp/fg)F5%*q^"><field name="LED_ON_OFF">OFF</field></block></value><next><block type="dwenguino_set_led" id="5S6g37hiGGi+J`pj{U|y"><value name="LED"><block type="dwenguino_led_pins" id="J4,p?[Tcg*f[/S66cMx-"><field name="LED_NUMBER">7</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="rJEZeCyZ_X,}C$si@+ip"><field name="LED_ON_OFF">ON</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.bitPatternOnLeds.step1Title,
          content: MSG.tutorials.bitPatternOnLeds.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.bitPatternOnLeds.step2Title,
          content: MSG.tutorials.bitPatternOnLeds.step2Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
      {
        title: MSG.tutorials.bitPatternOnLeds.step3Title,
        content: MSG.tutorials.bitPatternOnLeds.step3Content,
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
