
tutorials.introduction =
{
      targets: [tutorialTargets.dwenguino,
                tutorialTargets.workspaceArea,
                "db_blocklyToolboxDiv",
                "db_menu_item_language",
                "db_menu_item_difficulty",
                "books_dropdown",
                "db_menu_item_run",
                "db_menu_item_upload",
                "db_menu_item_download",
                "db_menu_item_simulator"
              ],
      placements: ["left", "right", "right", "left", "left", "left", "left", "left", "left", "left"],
      nrOfSteps: 10,
      xOffsets: [0, "center", 0, 0, 0, 0, 0, 0, 0, 0],
      yOffsets: [0, "center", 0, 0, 0, 0, 0, 0, 0, 0],
      steps: [],
      id: "tutsIntroduction",
      label: MSG.tutsIntroduction,
      initSteps: function(){
        var i;
        for (i = 0 ; i < this.nrOfSteps ; i++){
          this.steps.push({
            title: MSG.tutorials.introduction.stepTitles[i],
            content: MSG.tutorials.introduction.stepContents[i],
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
        DwenguinoBlockly.loadFileXmlIntoWorkspace('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="setup_loop_structure" id="yMwUfZQ@p0kW8udJ1vEa" x="-88" y="-382"></block></xml>');
      },
      onEnd: function(){
          DwenguinoBlockly.endTutorial();
      }
    };
