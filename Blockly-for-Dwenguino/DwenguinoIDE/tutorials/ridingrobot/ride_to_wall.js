import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"
import { tutorialTargets } from "../tutorialTargets.js"

let rideToWall = {
      category: "ridingrobot",
      id: "tutsRideToWall",
      label: MSG.tutsRideToWall,
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
            title: MSG.tutorials.rideToWall.stepTitles[i],
            content: MSG.tutorials.rideToWall.stepContents[i],
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
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-48" y="-12"><statement name="LOOP"><block type="controls_if" id="@5_v({:-p!8Gi,2CfS*2"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="pO3`z[KM7dM91a$uJnV="><field name="OP">GTE</field><value name="A"><block type="char_type" id="`pUCfCWqQ-!Y8Hc4DFul"><field name="BITMASK">175</field></block></value><value name="B"><block type="sonar_sensor" id="%Ha2KSwLpWq]5!^?mUn?"><value name="trig"><block type="char_type" id="72"><field name="BITMASK">11</field></block></value><value name="echo"><block type="char_type" id="77"><field name="BITMASK">12</field></block></value></block></value></block></value><statement name="DO0"><block type="dc_motor" id="P4X+*n{_@l|O~^r3M$+P"><value name="channel"><block type="math_number" id="32"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="37"><field name="NUM">100</field></block></value><next><block type="dc_motor" id="b]=`Pdj9m@E^lqhSf+j7"><value name="channel"><block type="math_number" id="-w/)R/{#UU20.gVTQ:n)"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="KWy~7`w*vC_K}G@ma:$H"><field name="NUM">100</field></block></value></block></next></block></statement><statement name="ELSE"><block type="dc_motor" id="WF@SV9}kgwe`Dx1KEdfO"><value name="channel"><block type="math_number" id="p|~*dbxFy-j|.oB!i5$g"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="*Nynrtc$eF,g^0)az}^R"><field name="NUM">0</field></block></value><next><block type="dc_motor" id="oz9a#j`Kv,ZVyL35B{J6"><value name="channel"><block type="math_number" id="okt3fpvN^;FR?TW?wly|"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="vf/?P:IP6mI%GD-!biz~"><field name="NUM">0</field></block></value></block></next></block></statement><next><block type="dwenguino_delay" id="Ve-hN}})E6#/rWFaP`be"><value name="DELAY_TIME"><block type="char_type" id="r)z[m@Nos2|cpm^(MovD"><field name="BITMASK">100</field></block></value></block></next></block></statement></block></xml>');
      },

    onEnd: function(){
      DwenguinoBlockly.tutorialMenu.endTutorial();
    }
    };
export { rideToWall }