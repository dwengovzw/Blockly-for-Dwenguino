import { EVENT_NAMES } from "../logging/EventNames.js"
import ServerConfig from "../ServerConfig.js"

/**
 * TutorialMenu builds a tutorial menu overlay and handles all interactions within 
 * the menu.
 */
export default class TutorialMenu {

    tutorialCategory = "";
    eventLogger = null;

    constructor(eventLogger){
        this.eventLogger = eventLogger;
        this.initTutorialMenu();
    }

    /**
     * Initialize the tutorial menu.
     */
    initTutorialMenu(){
        $("#db_tutorials").click(() => {
            this.loadTutorialDialog();
            this.addTutorialDialogEventHandlers();
            this.showTutorialDialog();
        });
    }

    /**
     * Loads the general tutorial menu user interface displaying all tutorial categories.
     */
    loadTutorialDialog(){
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
    }

    /**
     * Adds event handlers for the general tutorial menu user interface.
     */
    addTutorialDialogEventHandlers(){
        $("#tutorial_category_wegostem").click(() => {
            this.loadTutorialsMenu("wegostem");
        });

        $("#tutorial_category_dwenguino").click(() => {
            this.loadTutorialsMenu("dwenguino");
        });
    
        $("#tutorial_category_riding_robot").click(() => {
            this.loadTutorialsMenu("ridingrobot");
        });
    
        $("#tutorial_category_social_robot").click(() => {
            this.loadTutorialsMenu("socialrobot");
        });

        $('.close').click(() => {
            this.hideTutorialDialog();
        });
    }

    /**
     * Makes the tutorial menu visible
     */
    showTutorialDialog(){
        $("#tutorialModal").modal('show');
    }

    /**
     * Makes the tutorial menu hidden
     */
    hideTutorialDialog(){
        $('#tutorialModal').modal("hide");
    }

    /**
     * Loads a list of tutorials from a specific category.
     * @param {String} category The tutorial category to load tutorials from 
     */
    loadTutorialsMenu(category){
        $("#tutorialModal .modal-body .message").empty();
        $("#tutorialModal .modal-body .message").append('<div class="tutorial_label">Kies een tutorial</div>');
        $("#tutorialModal .modal-body .message").append('<div id="tutorialModal_tutorials_menu"></div>');

        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="previous_tutorial_dialog" type="button" class="btn btn-default">'+ MSG.tutorialMenu.previous +'</button>');
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');
        
        $("#previous_tutorial_dialog").click(() => {
            this.loadTutorialDialog();
            this.addTutorialDialogEventHandlers();
        });

        var serverSubmission = {
            "username": User.username,
            "password": User.password,
            "category": category
        };

        let self = this;
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/tutorials/completedTutorials",
            data: serverSubmission,
        }).done(function(completedTutorials){

            $.each(tutorials, function(index, tutorial){
                if(tutorial.category == category){
                    var isCompleted = false;
                    $.each(completedTutorials, function(i, completedTutorial){
                        if(tutorial.id == completedTutorial['tutorial_id']){
                            isCompleted = true;
                        }
                    });
                    self.addTutorial(tutorial, isCompleted);
                }
            });
        }).fail(function(response, status)  {
            console.warn('Failed to get completed tutorials:', status);
            $.each(tutorials, function(index, tutorial){
                if(tutorial.category == category){
                    var isCompleted = false;
                    self.addTutorial(tutorial, isCompleted);
                }
            });
        });

    }

    /**
     * Add a specific tutorial to the tutorial list interface
     * @param {Tutorial} tutorial The tutorial object to add to the list
     */
    addTutorial(tutorial, isCompleted){

        var newLi = $("<div>").attr("class", "tutorial_item row").attr("id", tutorial.id).attr("role", "presentation");
        $("#tutorialModal_tutorials_menu").append(newLi);
        newLi.click(() => {
            this.eventLogger.tutorialId = tutorial.id;
            this.tutorialCategory = tutorial.category;
            this.eventLogger.tutorialIdSetting = tutorial.id;
            tutorial.initSteps();
            hopscotch.configure({showPrevButton: "true"}); //configure tutorial views
            this.hideTutorialDialog(); // hide the tutorial dialog before starting the tutorial
            hopscotch.startTour(tutorial);
            this.eventLogger.recordEvent(this.eventLogger.createEvent(EVENT_NAMES.startTutorial, tutorial.id));
        });

        if(isCompleted){
            $("#" + tutorial.id).append('<div class="glyphicon glyphicon-ok icon-completed col-auto"></div>'); 
            $("#" + tutorial.id).append('<div class="col-auto">'+ tutorial.label + '</div>'); 
        } else {
            $("#" + tutorial.id).append('<div class="glyphicon glyphicon-remove icon-not-completed col-auto"></div>'); 
            $("#" + tutorial.id).append('<div class="col-auto">'+ tutorial.label + '</div>'); 
        }
  
    }

    /**
     * Event handler for endig a tutorial. Triggers the 'endTutorial' event for logging.
     */
    endTutorial(){
        this.saveCompleteTutorial(this.tutorialId, this.tutorialCategory);
        this.eventLogger.tutorialId = "";
        this.eventLogger.tutorialIdSetting = "";
        this.tutorialCategory = "";
        this.eventLogger.recordEvent(this.eventLogger.createEvent(EVENT_NAMES.endTutorial, ""));
        this.showTutorialDialog();
    }

    saveCompleteTutorial(tutorialId, category){
        console.log(tutorialId, category);
        var serverSubmission = {
            "username": User.username,
            "password": User.password,
            "tutorialId": tutorialId,
            "category": category,
        };

        if (this.eventLogger.sessionId !== undefined){
            $.ajax({
                type: "POST",
                url: ServerConfig.getServerUrl() + "/tutorials/completeTutorial",
                data: serverSubmission,
            }).done(function(data){
                console.debug('Recording submitted', data);
            }).fail(function(response, status)  {
                console.warn('Failed to submit recording:', status);
            });
        }
    }
}

