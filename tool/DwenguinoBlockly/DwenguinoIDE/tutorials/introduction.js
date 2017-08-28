
tutorials.introduction = {
      id: "tutsIntroduction",
      label: MSG.tutsIntroduction,
      steps: [
        {
          title: MSG.tutorials.introduction.step1Title,
          content: MSG.tutorials.introduction.step1Content,
          target: tutorialTargets.dwenguino,
          placement: "left",
          showCloseButton:"true",
          width: 400,
      },
      {
        title: MSG.tutorials.introduction.step2aTitle,
        content: MSG.tutorials.introduction.step2aContent,
        target: tutorialTargets.workspaceArea,
        placement: "top",
        xOffset: "center",
        yOffset: "center"
    },
    {
      title: MSG.tutorials.introduction.step2bTitle,
      content: MSG.tutorials.introduction.step2bContent,
      target: "db_blocklyToolboxDiv",
      placement: "right"
  },
    {
      title: MSG.tutorials.introduction.step3Title,
      content: MSG.tutorials.introduction.step3Content,
      target: "db_menu_item_language",
      placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step4Title,
    content: MSG.tutorials.introduction.step4Content,
    target: "db_menu_item_difficulty",
    placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step5Title,
    content: MSG.tutorials.introduction.step5Content,
    target: "books_dropdown",
    placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step6Title,
    content: MSG.tutorials.introduction.step6Content,
    target: "db_menu_item_run",
    placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step7Title,
    content: MSG.tutorials.introduction.step7Content,
    target: "db_menu_item_upload",
    placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step8Title,
    content: MSG.tutorials.introduction.step8Content,
    target: "db_menu_item_download",
    placement: "left"
  },
  {
    title: MSG.tutorials.introduction.step9Title,
    content: MSG.tutorials.introduction.step9Content,
    target: "db_menu_item_simulator",
    placement: "left"
  }
    ],
    onEnd: function(){
        console.log("introduction tutorial ended");
        DwenguinoBlockly.endTutorial();
    }
    };
