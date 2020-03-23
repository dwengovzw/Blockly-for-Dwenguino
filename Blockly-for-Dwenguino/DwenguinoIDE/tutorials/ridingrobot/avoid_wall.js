import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


tutorials.avoidWall = {
      category: "ridingrobot",
      id: "tutsAvoidWall",
      label: MSG.tutsAvoidWall,
      targets: [tutorialTargets.simulatorButton,
                tutorialTargets.simulatorScenarioTab,
                 tutorialTargets.simulatorScenarioSelection,
                tutorialTargets.simulatorStartButton,],
      placements: ["left", "left", "left", "left"],
      nrOfSteps: 4,
      xOffsets: [0, 0, 0, 0 ],
      yOffsets: [0, -20, -20, 0],
      steps: [],
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.avoidWall.stepTitles[i],
            content: MSG.tutorials.avoidWall.stepContents[i],
            target: this.targets[i],
            placement: this.placements[i],
            showCloseButton:"true",
            width: 400,
            xOffset: this.xOffsets[i],
            yOffset: this.yOffsets[i],
          });
        }
      },
      onStart: function(){
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-152" y="43"><statement name="LOOP"><block type="controls_if" id="@5_v({:-p!8Gi,2CfS*2"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="pO3`z[KM7dM91a$uJnV="><field name="OP">GTE</field><value name="A"><block type="char_type" id="r)z[m@Nos2|cpm^(MovD"><field name="BITMASK">30</field></block></value><value name="B"><block type="sonar_sensor" id="%Ha2KSwLpWq]5!^?mUn?"><value name="trig"><block type="char_type" id="t3zJd~XLa:~hNsD11;$("><field name="BITMASK">11</field></block></value><value name="echo"><block type="char_type" id="Ohz-(RX2RI34`HQmDv,s"><field name="BITMASK">12</field></block></value></block></value></block></value><statement name="DO0"><block type="dc_motor" id="7S)A(0|1NJY$trtQzX,3"><value name="channel"><block type="math_number" id="32"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="37"><field name="NUM">100</field></block></value><next><block type="dc_motor" id="mvt87=#!=N4y.]LDT2Tm"><value name="channel"><block type="math_number" id="H0_b%l*{mJ45Li+J+87l"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="Zt+djA7XMOi9Zp/%]??C"><field name="NUM">-100</field></block></value></block></next></block></statement><statement name="ELSE"><block type="dc_motor" id="{|*6o9^%o+R~*cTn_CfU"><value name="channel"><block type="math_number" id="P#QoZo*y11wAim[,gWvA"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="nB/xoT!1$Slx0jAKrT;n"><field name="NUM">255</field></block></value><next><block type="dc_motor" id="IENQp`U=)/.K^:61n`3K"><value name="channel"><block type="math_number" id="K[n0u(V:ugdW?t1.p!le"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="YDYgsSjexNArI#`f:@#V"><field name="NUM">255</field></block></value></block></next></block></statement><next><block type="dwenguino_delay" id="Ve-hN}})E6#/rWFaP`be"><value name="DELAY_TIME"><block type="char_type" id="W^^#Oxga@%ncB=Vi:coG"><field name="BITMASK">50</field></block></value></block></next></block></statement></block></xml>');
      },
    onEnd: function(){
      DwenguinoBlockly.tutorialMenu.endTutorial();
    }
    };
