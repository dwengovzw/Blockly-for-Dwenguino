
tutorials.allButtons = {
      id: "tutsAllButtons",
      label: MSG.tutsAllButtons,
      onStart: function(){
        //DwenguinoBlockly.loadBlocksFile("./exercise_templates/Workshop1/all_buttons_led.xml");
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="8qEL1tV%pg]/@7{;!wEn" x="-312" y="173"><statement name="LOOP"><block type="controls_if" id="fj,uF0gL8n^C#q+:wbVu"><mutation elseif="4" else="1"></mutation><value name="IF0"><block type="logic_compare" id="/8v$a1e@~FW/[fc]9dw."><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="gLbd-:ZFg;OOyd)a%t+-"><field name="SWITCH">SW_N</field></block></value><value name="B"><block type="dwenguino_pressed" id="Y2F,1%{YaLgRF_jB(0_e"><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO0"><block type="dwenguino_set_led" id="%#rKCAjqx,YxJqu?gS{L"><value name="LED"><block type="dwenguino_led_pins" id="_naADxer#78R,)0{7DTO"><field name="LED_NUMBER">0</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="G^`6AJg+_Xo,zG(=$E3t"><field name="LED_ON_OFF">ON</field></block></value></block></statement><value name="IF1"><block type="logic_compare" id="u6w@?~CsVZp;y0a:@N~f"><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="b93be7/vAm7})F;R##p`"><field name="SWITCH">SW_E</field></block></value><value name="B"><block type="dwenguino_pressed" id="5#E|j]`H/,o_iBMw_=aL"><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO1"><block type="dwenguino_set_led" id="2v52.*`tJ39EO:qMsVBu"><value name="LED"><block type="dwenguino_led_pins" id="*2up9P3X6N1.WvOneqCS"><field name="LED_NUMBER">1</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="p=cEk%ZpS}h9%J7/UhpA"><field name="LED_ON_OFF">OFF</field></block></value></block></statement><value name="IF2"><block type="logic_compare" id="7Mq+0ME;:a/x-q#38on!"><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="L[i{fhR0H#aD8_4SEyuJ"><field name="SWITCH">SW_S</field></block></value><value name="B"><block type="dwenguino_pressed" id="59KTT0wW@srqE)hOe56:"><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO2"><block type="dwenguino_set_led" id="U?kV4c@lzb^1qryEW~/-"><value name="LED"><block type="dwenguino_led_pins" id="1ri0W!ObNQCc5mYw`C)-"><field name="LED_NUMBER">2</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="5qkQ2,BWv$gCT-pl9qw;"><field name="LED_ON_OFF">ON</field></block></value></block></statement><value name="IF3"><block type="logic_compare" id="}(NqZ:+*fp~I?mU@[@fq"><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="+~#H@2KdTRe8L{bfA)d0"><field name="SWITCH">SW_W</field></block></value><value name="B"><block type="dwenguino_pressed" id="g7@$}Gbc1HP^]ocV)/y."><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO3"><block type="dwenguino_set_led" id="0FA^iW~8]/SpQ=~y!D@:"><value name="LED"><block type="dwenguino_led_pins" id="DQqa(0@|G:bM=ExrUx}b"><field name="LED_NUMBER">3</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id=";}e0BV37=79Zc[%3WJlc"><field name="LED_ON_OFF">OFF</field></block></value></block></statement><value name="IF4"><block type="logic_compare" id="}VG+ZBcw{[aP-Fgw,vrD"><field name="OP">EQ</field><value name="A"><block type="dwenguino_digital_read_switch" id="3MUq/f+R5uWcRzQk4[Si"><field name="SWITCH">SW_C</field></block></value><value name="B"><block type="dwenguino_pressed" id="{~:uqV%RaOgf}-dL^.,?"><field name="BOOL">PRESSED</field></block></value></block></value><statement name="DO4"><block type="dwenguino_set_led" id="JN4RN?.t%@AX2@1c,?``"><value name="LED"><block type="dwenguino_led_pins" id="+=``m)]:z@v084S9k/Wj"><field name="LED_NUMBER">4</field></block></value><value name="LED_STATE"><block type="dwenguino_on_off" id="Ep5G3L^4!QR2Q!s.)_ii"><field name="LED_ON_OFF">ON</field></block></value></block></statement><next><block type="dwenguino_delay" id="?CJb+$s4JrzI0C2JtIj5"><value name="DELAY_TIME"><block type="char_type" id="Iv$a.T.E}(GT02nE9SYG"><field name="BITMASK">100</field></block></value></block></next></block></statement></block></xml>');
      },
      steps: [
        {
          title: MSG.tutorials.allButtons.step1Title,
          content: MSG.tutorials.allButtons.step1Content,
          target: tutorialTargets.simulatorButton,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
        {
          title: MSG.tutorials.allButtons.step2Title,
          content: MSG.tutorials.allButtons.step2Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
      {
        title: MSG.tutorials.allButtons.step3Title,
        content: MSG.tutorials.allButtons.step3Content,
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
