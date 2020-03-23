import DwenguinoBlockly from "../../js/src/DwenguinoBlockly.js"


var DwengoBotId = "db_menu_item_dwengo_robot_teacher_image";
tutorials.theremin =    {
    category: "dwenguino",
    id: "theremin",
    label: MSG.tutsTheremin,
    steps: [
        {
            title: MSG.tutorials.theremin.step1Title,
            content: MSG.tutorials.theremin.step1Content,
            target: DwengoBotId,
            placement: "left"
        },
        {
            title: MSG.tutorials.theremin.step2Title,
            content: MSG.tutorials.theremin.step2Content,
            target: DwengoBotId,
            placement: "left"
        },
        {
            title: MSG.tutorials.theremin.stepEndTitle,
            content: '<img src="img/theremin/dwenguino_board.png" alt="Image of the Dwenguino board" style="max-width:100%"/>',
            target: DwengoBotId,
            placement: "left"
        },
    ],
    onEnd: function(){
        console.log("Basic test ended");
        DwenguinoBlockly.tutorialMenu.endTutorial();
        DwenguinoBlockly.workspace.clear();
    }
};
