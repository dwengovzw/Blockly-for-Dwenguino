
tutorials.introduceYourself = {
      targets: [tutorialTargets.simulatorButton,
                tutorialTargets.workspaceArea,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.simulatorStopButton,
                tutorialTargets.workspaceArea,
                tutorialTargets.workspaceArea,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.dwenguino],
      placements: ["left", "top", "left", "left", "top", "top", "left", "left"],
      nrOfSteps: 6,
      xOffsets: [0, "center", 0, 0, "center", "center", 0],
      yOffsets: [0, "top", 0, 0, "top", "top", 0],
      steps: [],
      // Create the steps array dynamically by using the different arrays
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.introduceYourself.stepTitles[i],
            content: MSG.tutorials.introduceYourself.stepContents[i],
            target: this.targets[i],
            placement: this.placements[i],
            showCloseButton:"true",
            width: 400,
            xOffset: this.xOffsets[i],
            yOffset: this.yOffsets[i],
          });
        }
      },
      id: "tutsIntroduceYourselfWeGoSTEM",
      label: MSG.tutsIntroduceYourselfWeGoSTEM,
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="ndSZof?3RjcH}j2Lp/XZ" x="0" y="0"><statement name="LOOP"><block type="dwenguino_lcd" id="P~z0QTD+UA%Wvi-1|pJi"><value name="text"><block type="text" id="48"><field name="TEXT">Hallo ik ben</field></block></value><value name="line_number"><block type="char_type" id="53"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="58"><field name="BITMASK">0</field></block></value><next><block type="dwenguino_delay" id="8^{{=Y9|}Yjf}J~*A}Ug"><value name="DELAY_TIME"><block type="char_type" id="TO?6iQPh}HsK1u6/()KQ"><field name="BITMASK">1000</field></block></value><next><block type="clear_lcd" id="mZ@64g4j].F$R?6I2;|e"><next><block type="dwenguino_lcd" id=",9zhGR,lzKr175:cPC*_"><value name="text"><block type="text" id="w8Id%a/kU}P]3_TQV1V^"><field name="TEXT">Tom</field></block></value><value name="line_number"><block type="char_type" id="VruQbfPoZ[O~4VG#:`[v"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="-7M*Tw!{?A}JvmAw(0_X"><field name="BITMASK">0</field></block></value><next><block type="dwenguino_delay" id="$W3lceEvUBsyDFFMM-Rf"><value name="DELAY_TIME"><block type="char_type" id="F-`0yf?Z6xT^qV5x(YV@"><field name="BITMASK">1000</field></block></value><next><block type="clear_lcd" id="a5X=ZhxL5lziaL[@+1q6"><next><block type="dwenguino_lcd" id="l`pv.^G_BTi%EpsWCp3d"><value name="text"><block type="text" id="L+/nc=~kAE0A)8hYW^b|"><field name="TEXT">en ik ben</field></block></value><value name="line_number"><block type="char_type" id=",9#]]M|vVX:X`i2FLYk9"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="IgSB;tv7Q63a*I/8c9xO"><field name="BITMASK">0</field></block></value><next><block type="clear_lcd" id="bV|!1IpEB|pF6zyTGedz"><next><block type="dwenguino_lcd" id="V_ap+n0Ve.h;yqUOiap]"><value name="text"><block type="text" id="FW[UnvsP|RyxEeB)*sw?"><field name="TEXT">27 jaar oud.</field></block></value><value name="line_number"><block type="char_type" id="?0+(u3VHL7RwnU6roe8o"><field name="BITMASK">0</field></block></value><value name="character_number"><block type="char_type" id="g7)%Ze+Q`)7(XB?2H1g/"><field name="BITMASK">0</field></block></value><next><block type="dwenguino_delay" id="t*AwHh}[O0Oa:iWRf=Bi"><value name="DELAY_TIME"><block type="char_type" id="MT%/M(V*Sh@Lq?2s~|@C"><field name="BITMASK">1000</field></block></value><next><block type="clear_lcd" id="B*^u3w%Jw`6F^5V~RI?!"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>');
      },
      onEnd: function(){
          DwenguinoBlockly.endTutorial();
      },
      onNext: function(){
        DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("tutorialNextStep", DwenguinoBlockly.tutorialIdSetting));
        console.log(DwenguinoBlockly.createEvent("tutorialNextStep", DwenguinoBlockly.tutorialIdSetting));
      },
      onPrev: function(){
        DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("tutorialPrevStep", DwenguinoBlockly.tutorialIdSetting));
        console.log(DwenguinoBlockly.createEvent("tutorialPrevStep", DwenguinoBlockly.tutorialIdSetting));
      },
  };
