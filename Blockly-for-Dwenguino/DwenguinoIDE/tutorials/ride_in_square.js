
tutorials.rideInSquare = {
      id: "tutsRideInSquare",
      label: MSG.tutsRideInSquare,
      targets: [tutorialTargets.simulatorButton,
                tutorialTargets.simulatorScenarioTab,
                tutorialTargets.simulatorStartButton,
                tutorialTargets.simulatorStartButton,],
      placements: ["left", "left", "left", "left"],
      nrOfSteps: 4,
      xOffsets: [0, 0, 0, 0 ],
      yOffsets: [0, -20, 0, 0],
      steps: [],
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.rideInSquare.stepTitles[i],
            content: MSG.tutorials.rideInSquare.stepContents[i],
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
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-187" y="-164"><statement name="LOOP"><block type="dc_motor" id="2~!yv!MW{1Hr7=a=q^aT"><value name="channel"><block type="math_number" id="32"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="37"><field name="NUM">100</field></block></value><next><block type="dc_motor" id="k|$W/{v:t)Ri*1iI2c]E"><value name="channel"><block type="math_number" id="wne%a{,$k%a@w,sKH?a]"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="{6ghh[Yn?Jc$jNeC)?wv"><field name="NUM">100</field></block></value><next><block type="dwenguino_delay" id="Un-0xX*gj~d[dzM2VPW{"><value name="DELAY_TIME"><block type="char_type" id="O8V/|K]MghjNUo^;u*Z7"><field name="BITMASK">1500</field></block></value><next><block type="dc_motor" id="#b8ipVpP2%f@GX{1*cEh"><value name="channel"><block type="math_number" id="1Bv@--r|;e:;{Tcs[0sp"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="W9onZYpkG)?oZXg+D.mP"><field name="NUM">-100</field></block></value><next><block type="dc_motor" id="br1l/`ornE`|7lUs0e!v"><value name="channel"><block type="math_number" id="spfET~H),:iUz7wM%7_}"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id=":v_5D%Zxo$8F9#*mn{T["><field name="NUM">172</field></block></value><next><block type="dwenguino_delay" id="fUAytMwz;AODn(w;=(]i"><value name="DELAY_TIME"><block type="char_type" id="N@OUe?*wdU4M64`^4oVM"><field name="BITMASK">100</field></block></value><next><block type="dc_motor" id="hqOS]]B(sc98`z/$0}ll"><value name="channel"><block type="math_number" id="5I?rQjd]q(-CC6U.,cBM"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="HA_k5I*sC`55]E:Y).[["><field name="NUM">100</field></block></value><next><block type="dc_motor" id="`D{WegX*xn@F]K5=@EvF"><value name="channel"><block type="math_number" id="oV,/.U@niXOwlvvM]WpC"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id="9^4I@Scrp(K2+.J7^p0;"><field name="NUM">100</field></block></value><next><block type="dwenguino_delay" id="J2$2d,OC8RV:+T!Re6X0"><value name="DELAY_TIME"><block type="char_type" id="ZM@t|GIBj##i(0vS8r:k"><field name="BITMASK">1500</field></block></value><next><block type="dc_motor" id=";u/@8A47:TKzi6F#%CGb"><value name="channel"><block type="math_number" id="]X@nX0adD06-`$RZ{},G"><field name="NUM">1</field></block></value><value name="speed"><block type="math_number" id="I[_cmLEv4];|ZSX59LdP"><field name="NUM">-100</field></block></value><next><block type="dc_motor" id="|:Sz^|w6bvv%3`ReTx8|"><value name="channel"><block type="math_number" id="ay6tlwL/NUW^@z3Y`,1e"><field name="NUM">2</field></block></value><value name="speed"><block type="math_number" id=")}wry~D^GS~nx+nJ4299"><field name="NUM">172</field></block></value><next><block type="dwenguino_delay" id="}]TPc%CK(bh,WY?va56["><value name="DELAY_TIME"><block type="char_type" id="XV0xogxOQ/+HvYzr}o5k"><field name="BITMASK">200</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>');
      },
    onEnd: function(){
        DwenguinoBlockly.endTutorial();
    }
    };
