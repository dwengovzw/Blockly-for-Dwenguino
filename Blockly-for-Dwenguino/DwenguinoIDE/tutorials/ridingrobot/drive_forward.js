import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


tutorials.driveForward = {
      category: "ridingrobot",
      targets: [tutorialTargets.simulatorButton,
                tutorialTargets.simulatorScenarioTab,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.dwenguino,],
      placements: ["left", "left", "left"],
      nrOfSteps: 3,
      xOffsets: [0, 0, 0 ],
      yOffsets: [0, -20, 0],
      steps: [],
      id: "tutsDriveForward",
      label: MSG.tutsDriveForward,
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.driveForward.stepTitles[i],
            content: MSG.tutorials.driveForward.stepContents[i],
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
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-88" y="-382"><statement name="LOOP"><block type="dc_motor" id="}m$#-.GS5+AKD-gI}OY,"><value name="channel"><block type="math_number" id="32"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="37"><field name="NUM">100</field></block></value><next><block type="dc_motor" id="cgSFVxrXN$Sgeiy15T;?"><value name="channel"><block type="math_number" id="oA@j2Jdo#=lH`r:+![%K"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="a[y,hG3rY^+Pk+cjv=8m"><field name="NUM">-100</field></block></value><next><block type="dwenguino_delay" id="to!Bxm`]gQzEi;K`Bx%s"><value name="DELAY_TIME"><block type="char_type" id="FsFIj~`KNGMlcHhp^^gj"><field name="BITMASK">100</field></block></value></block></next></block></next></block></statement></block></xml>');
      },
      onEnd: function(){
        DwenguinoBlockly.tutorialMenu.endTutorial();
      }
    };
