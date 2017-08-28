var DwengoBotId = "db_menu_item_dwengo_robot_teacher_image";
tutorials.basic_test =    {
    id: "db_basic_test",
    label: MSG.tutsBasicTest,
    steps: [
        {
            title: MSG.tutorials.basic_test.step1Title,
            content: MSG.tutorials.basic_test.step1Content,
            target: DwengoBotId,
            placement: "left",
            onNext: function(){
                console.log($('#basic_test_input_question_1').val());
                setWorkspaceBlockFromXml('<xml xmlns="http://www.w3.org/1999/xhtml"><block type="variables_declare_set" id="`y=%Z@S4SJ=UiCxE[$N]" x="-24" y="46"><field name="VAR">a</field><value name="VALUE"><block type="char_type" id="`]d?45(Kl)D^`b63wz/T"><field name="BITMASK">1</field></block></value><next><block type="variables_declare_set" id="hcQaUUC6`g2o9-e;vM:A"><field name="VAR">b</field><value name="VALUE"><block type="char_type" id="72o,@xb$liy@J06:]Y*F"><field name="BITMASK">8</field></block></value><next><block type="variables_declare_set" id="`B(/ZAKvV,^w|u8d(v=3"><field name="VAR">a</field><value name="VALUE"><block type="variables_get" id="e/t%Qk]Yx}Iu6.3x6:Wx"><field name="VAR">b</field></block></value><next><block type="variables_declare_set" id=")LKO6aQVE*;:#.HGC},S"><field name="VAR">b</field><value name="VALUE"><block type="variables_get" id="Dfif*jovaqYb!=)F,pv-"><field name="VAR">a</field></block></value></block></next></block></next></block></next></block></xml>');
            }
        },
        {
            title: MSG.tutorials.basic_test.step2Title,
            content: MSG.tutorials.basic_test.step2ContentA + '<br/><input type="text" class="db_question_input_field form-control" id="basic_test_input_question_1a">' + MSG.tutorials.basic_test.step2ContentB + '</br><input type="text" class="db_question_input_field form-control" id="basic_test_input_question_1b">',
            target: DwengoBotId,
            placement: "left",
            onNext: function(){
                console.log($('#basic_test_input_question_1a').val());
                console.log($('#basic_test_input_question_1b').val());
            }
        },
        {
            title: MSG.tutorials.basic_test.stepEndTitle,
            content: MSG.tutorials.basic_test.stepEndContent,
            target: DwengoBotId,
            placement: "left"
        },
    ],
    onEnd: function(){
        console.log("Basic test ended");
        DwenguinoBlockly.endTutorial();
        DwenguinoBlockly.workspace.clear();
    }
};
