/**
 * TutorialMenu builds a tutorial menu overlay and handles all interactions within 
 * the menu.
 */
var TutorialMenu = {

    /**
     * Initialize the tutorial menu.
     */
    initTutorialMenu: function(){
        $("#db_tutorials").click(function(){
            TutorialMenu.loadTutorialDialog();
            TutorialMenu.addTutorialDialogEventHandlers();
            TutorialMenu.showTutorialDialog();
        });
    },

    /**
     * Loads the general tutorial menu user interface displaying all tutorial categories.
     */
    loadTutorialDialog: function(){
        $("#tutorialModal .modal-header").text(MSG.tutorialMenu.header);
        $("#tutorialModal .modal-body .message").empty();
        $("#tutorialModal .modal-body .message").append('<div class="tutorial_label">'+ MSG.tutorialMenu.chooseCategory +'</div>');
        $("#tutorialModal .modal-body .message").append('<div id="tutorialModal_categories_menu" class="tutorial_categories_wrapper"></div>');
        
        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_wegostem" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_wegostem").append('<div class="category_tag">'+ MSG.tutorialMenu.catWeGoStem +'</div>');
        $("#tutorial_category_wegostem").append('<div id="tutorial_categories_wegostem_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_dwenguino" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_dwenguino").append('<div class="category_tag">'+ MSG.tutorialMenu.catDwenguino +'</div>');
        $("#tutorial_category_dwenguino").append('<div id="tutorial_categories_dwenguino_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_riding_robot" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_riding_robot").append('<div class="category_tag">'+ MSG.tutorialMenu.catRidingRobot +'</div>');
        $("#tutorial_category_riding_robot").append('<div id="tutorial_categories_riding_robot_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_social_robot" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_social_robot").append('<div class="category_tag">'+ MSG.tutorialMenu.catSocialRobot +'</div>');
        $("#tutorial_category_social_robot").append('<div id="tutorial_categories_social_robot_img"></div>');      
        
        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');
    },

    /**
     * Adds event handlers for the general tutorial menu user interface.
     */
    addTutorialDialogEventHandlers: function(){
        $("#tutorial_category_wegostem").click(function() {
            TutorialMenu.loadTutorialsMenu("wegostem");
        });

        $("#tutorial_category_dwenguino").click(function() {
            TutorialMenu.loadTutorialsMenu("dwenguino");
        });
    
        $("#tutorial_category_riding_robot").click(function() {
            TutorialMenu.loadTutorialsMenu("ridingrobot");
        });
    
        $("#tutorial_category_social_robot").click(function() {
            TutorialMenu.loadTutorialsMenu("socialrobot");
        });

        $('.close').click(function() {
            TutorialMenu.hideTutorialDialog();
        });
    },

    /**
     * Makes the tutorial menu visible
     */
    showTutorialDialog: function(){
        $("#tutorialModal").modal('show');
    },

    /**
     * Makes the tutorial menu hidden
     */
    hideTutorialDialog: function(){
        $('#tutorialModal').modal("hide");
    },

    /**
     * Loads a list of tutorials from a specific category.
     * @param {String} category The tutorial category to load tutorials from 
     */
    loadTutorialsMenu: function(category){
        $("#tutorialModal .modal-body .message").empty();
        $("#tutorialModal .modal-body .message").append('<div class="tutorial_label">Kies een tutorial</div>');
        $("#tutorialModal .modal-body .message").append('<div id="tutorialModal_tutorials_menu"></div>');

        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="previous_tutorial_dialog" type="button" class="btn btn-default">'+ MSG.tutorialMenu.previous +'</button>');
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');
        
        $("#previous_tutorial_dialog").click(function() {
            TutorialMenu.loadTutorialDialog();
            TutorialMenu.addTutorialDialogEventHandlers();
        });

        $.each(tutorials, function(index, tutorial){
            if(tutorial.category == category){
                TutorialMenu.addTutorial(tutorial);
            }
        });
    },

    /**
     * Add a specific tutorial to the tutorial list interface
     * @param {Tutorial} tutorial The tutorial object to add to the list
     */
    addTutorial: function(tutorial){
        var newLi = $("<div>").attr("class", "tutorial_item").attr("id", tutorial.id).attr("role", "presentation").html(tutorial.label);
            $("#tutorialModal_tutorials_menu").append(newLi);
            newLi.click(function(){
                DwenguinoBlockly.tutorialId = tutorial.id;
                DwenguinoBlockly.tutorialIdSetting = DwenguinoBlockly.tutorialId;
                tutorial.initSteps();
                hopscotch.configure({showPrevButton: "true"}); //configure tutorial views
                TutorialMenu.hideTutorialDialog(); // hide the tutorial dialog before starting the tutorial
                hopscotch.startTour(tutorial);
                DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("startTutorial", DwenguinoBlockly.tutorialIdSetting));
            });
    },

    /**
     * Event handler for endig a tutorial. Triggers the 'endTutorial' event for logging.
     */
    endTutorial: function(){
        DwenguinoBlockly.tutorialId = "";
        DwenguinoBlockly.tutorialIdSetting = "";
        DwenguinoBlockly.recordEvent(DwenguinoBlockly.createEvent("endTutorial", ""));
        TutorialMenu.showTutorialDialog();
    },
}

$(document).ready(function() {
    TutorialMenu.initTutorialMenu();
});

