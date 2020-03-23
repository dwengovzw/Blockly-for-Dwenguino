import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"

tutorials.helloDwenguino = {
  category: "dwenguino",
  id: "tutsHelloDwenguino",
  label: MSG.tutsHelloDwenguino,
  steps: [
    {
      title: MSG.tutorials.hello_dwenguino.step1Title,
      content: MSG.tutorials.hello_dwenguino.step1Content,
      target: tutorialTargets.dwenguino,
      placement: "bottom",
      arrowOffset: "390",
      xOffset: "-375",
      showCloseButton:"true",
      yOffset: -5,
      width: 400,
    },
    {
      title: MSG.tutorials.hello_dwenguino.step2Title,
      content: MSG.tutorials.hello_dwenguino.step2Content,
      target: tutorialTargets.simulatorButton,
      showCloseButton:"true",
      placement: "bottom",
      arrowOffset: "370",
      xOffset: "-365",
      width: 400,
    },
    {
      title: MSG.tutorials.hello_dwenguino.step3Title,
      content: MSG.tutorials.hello_dwenguino.step3Content,
      target: tutorialTargets.dwenguino,
      placement: "bottom",
      arrowOffset: "390",
      xOffset: "-375",
      showCloseButton:"true",
      width: 400,
    },
    {
      title: MSG.tutorials.hello_dwenguino.step4Title,
      content: MSG.tutorials.hello_dwenguino.step4Content,
      target: tutorialTargets.simulatorStartButton,
      yOffset: -20,
      placement: "left",

    },
    {
      title: MSG.tutorials.hello_dwenguino.step5Title,
      content: MSG.tutorials.hello_dwenguino.step5Content,
      target: tutorialTargets.workspaceArea,
      placement: "bottom",
      xOffset: "center",
      yOffset: "center"
    },
    {
      title: MSG.tutorials.hello_dwenguino.step6Title,
      content: MSG.tutorials.hello_dwenguino.step6Content,
      target: tutorialTargets.workspaceArea,
      placement: "bottom",
      xOffset: "center",
      yOffset: "center"
    },
  ],
  onEnd: function(){
    console.log("introduction tutorial ended");
    DwenguinoBlockly.tutorialMenu.endTutorial();
  }
};
