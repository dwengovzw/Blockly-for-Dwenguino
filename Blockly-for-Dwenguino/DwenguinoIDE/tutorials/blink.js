tutorials.blink = {

  id: "tutsBlink",
  label: MSG.tutsBlink,
  steps: [
    {
      title: MSG.tutorials.blink.step1Title,
      content: MSG.tutorials.blink.step1Content,
      target: tutorialTargets.dwenguino,
      placement: "bottom",
      arrowOffset: "390",
      xOffset: "-375",
      showCloseButton:"true",
      yOffset: -5,
      width: 400,
    },
    {
      title: MSG.tutorials.blink.step2Title,
      content: MSG.tutorials.blink.step2Content,
      target: tutorialTargets.simulatorButton,
      showCloseButton:"true",
      placement: "bottom",
      arrowOffset: "370",
      xOffset: "-365",
      width: 400,
    },
    {
      title: MSG.tutorials.blink.step3Title,
      content: MSG.tutorials.blink.step3Content,
      target: tutorialTargets.dwenguino,
      placement: "bottom",
      arrowOffset: "390",
      xOffset: "-375",
      showCloseButton:"true",
      width: 400,
    },
    {
      title: MSG.tutorials.blink.step4Title,
      content: MSG.tutorials.blink.step4Content,
      target: tutorialTargets.simulatorStartButton,
      yOffset: -20,
      placement: "left",

    },
    {
      title: MSG.tutorials.blink.step5Title,
      content: MSG.tutorials.blink.step5Content,
      target: tutorialTargets.simulatorStartButton,
      yOffset: -20,
      placement: "left",
    },
    {
      title: MSG.tutorials.blink.step6Title,
      content: MSG.tutorials.blink.step6Content,
      target: tutorialTargets.workspaceArea,
      placement: "bottom",
      xOffset: "center",
      yOffset: "center"
    },
  ],
  onEnd: function(){
    console.log("introduction tutorial ended");
    DwenguinoBlockly.endTutorial();
  }
};
