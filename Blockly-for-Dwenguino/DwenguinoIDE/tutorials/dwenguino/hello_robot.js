import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"

tutorials.helloRobot = {
  category: "dwenguino",
  id: "tutsHelloRobot",
  label: MSG.tutsHelloRobot,
  steps: [
    {
      title: MSG.tutorials.hello_robot.step1Title,
      content: MSG.tutorials.hello_robot.step1Content,
      target: tutorialTargets.dwenguino,
      placement: "bottom",
      arrowOffset: "390",
      xOffset: "-375",
      showCloseButton:"true",
      yOffset: -5,
      width: 400,
    },
    {
      title: MSG.tutorials.hello_robot.step2Title,
      content: MSG.tutorials.hello_robot.step2Content,
      target: tutorialTargets.simulatorButton,
      showCloseButton:"true",
      placement: "bottom",
      arrowOffset: "370",
      xOffset: "-365",
      width: 400,
    },
    {
      title: MSG.tutorials.hello_robot.step3Title,
      content: MSG.tutorials.hello_robot.step3Content,
      target: tutorialTargets.simulatorScenarioTag,
      placement: "left",
      yOffset: -20,
      showCloseButton:"true",
      width: 400,
    },
    {
      title: MSG.tutorials.hello_robot.step4Title,
      content: MSG.tutorials.hello_robot.step4Content,
      target: tutorialTargets.simulatorBottomPane,
      yOffset: -350,
      arrowOffset: "380",
      placement: "left",

    },
    {
      title: MSG.tutorials.hello_robot.step5Title,
      content: MSG.tutorials.hello_robot.step5Content,
      target: tutorialTargets.workspaceArea,
      placement: "bottom",
      xOffset: "center",
      yOffset: "center"
    },
    {
      title: MSG.tutorials.hello_robot.step6Title,
      content: MSG.tutorials.hello_robot.step6Content,
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
