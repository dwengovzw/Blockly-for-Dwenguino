import { EVENT_NAMES } from "../logging/event_names.js"
import ServerConfig from "../server_config.js"
import { Buzzer } from "./components/Buzzer.js";
import { Lcd } from "./components/Lcd.js";
import { Led } from "./components/Led.js";
import { LightSensor } from "./components/LightSensor.js";
import { Pir } from "./components/Pir.js";
import { Servo } from "./components/Servo.js";
import { Sonar } from "./components/Sonar.js";
import { SoundSensor } from "./components/SoundSensor.js";
import { TouchSensor } from "./components/touch_sensor.js";
import { RgbLed } from "./components/rgb_led.js";
import { DCMotor } from "./components/dc_motor.js";
import { tutorials } from "../../../tutorials/tutorials.js";
import { User } from "../logging/user.js";

/**
 * TutorialMenu builds a tutorial menu overlay and handles all interactions within 
 * the menu.
 */
class TutorialMenu {

    tutorialId = "";
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
        let closeButton = '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        $("#tutorialModal .modal-header").append(closeButton);
        $("#tutorialModal .modal-body .message").empty();
        $("#tutorialModal .modal-body .message").append('<div class="tutorial_label">'+ MSG.tutorialMenu.chooseCategory +'</div>');
        $("#tutorialModal .modal-body .message").append('<div id="tutorialModal_categories_menu" class="tutorial_categories_wrapper"></div>');
        
        $('#tutorialModal_categories_menu').append('<div id="tutorial_category_dwenguino_components" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_dwenguino_components").append('<div class="category_tag">' + MSG.tutorialMenu.catDwenguinoComponents + '</div>');
        $("#tutorial_category_dwenguino_components").append('<div id="tutorial_categories_dwenguino_components_img" class="tutorial_categories_img"></div>');

        $('#tutorialModal_categories_menu').append('<div id="tutorial_category_dwenguino_connector" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_dwenguino_connector").append('<div class="category_tag">' + MSG.tutorialMenu.catDwenguinoConnector + '</div>');
        $("#tutorial_category_dwenguino_connector").append('<div id="tutorial_categories_dwenguino_connector_img" class="tutorial_categories_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_wegostem" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_wegostem").append('<div class="category_tag">'+ MSG.tutorialMenu.catWeGoStem +'</div>');
        $("#tutorial_category_wegostem").append('<div id="tutorial_categories_wegostem_img" class="tutorial_categories_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_dwenguino" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_dwenguino").append('<div class="category_tag">'+ MSG.tutorialMenu.catDwenguino +'</div>');
        $("#tutorial_category_dwenguino").append('<div id="tutorial_categories_dwenguino_img" class="tutorial_categories_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_riding_robot" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_riding_robot").append('<div class="category_tag">'+ MSG.tutorialMenu.catRidingRobot +'</div>');
        $("#tutorial_category_riding_robot").append('<div id="tutorial_categories_riding_robot_img" class="tutorial_categories_img"></div>');

        $("#tutorialModal_categories_menu").append('<div id="tutorial_category_social_robot" class="tutorial_categories_item card"></div>');
        $("#tutorial_category_social_robot").append('<div class="category_tag">'+ MSG.tutorialMenu.catSocialRobot +'</div>');
        $("#tutorial_category_social_robot").append('<div id="tutorial_categories_social_robot_img" class="tutorial_categories_img"></div>');      
        
        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');
    }

    /**
     * Adds event handlers for the general tutorial menu user interface.
     */
    addTutorialDialogEventHandlers(){
        $('#tutorial_category_dwenguino_components').click(() => {
            this.loadComponentsOverview();
        });

        $('#tutorial_category_dwenguino_connector').click(() => {
            this.loadConnectorOverview();
        });

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
        $("#tutorialModal .modal-header").text(MSG.tutorialMenu.header);
        $("#tutorialModal .modal-body .message").empty();
        $("#tutorialModal .modal-body .message").append('<div class="tutorial_label">'+ MSG.tutorialMenu.chooseTutorial +'</div>');
        $("#tutorialModal .modal-body .message").append('<div id="tutorialModal_tutorials_menu"></div>');

        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="previous_tutorial_dialog" type="button" class="btn btn-default">'+ MSG.tutorialMenu.previous +'</button>');
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');
        
        $("#previous_tutorial_dialog").click(() => {
            this.loadTutorialDialog();
            this.addTutorialDialogEventHandlers();
        });

        let serverSubmission = { };
        if(this.eventLogger.loggingModal.user != null){
            serverSubmission = {
                "username": this.eventLogger.loggingModal.user.username,
                "password": JSON.stringify(this.eventLogger.loggingModal.user.password),
                "category": category
            }; 
        } else {
            serverSubmission = {
                "username": "",
                "password": "",
                "category": category
            }
        }
        console.log(serverSubmission);
    
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

    loadComponentsOverview(){
        $("#tutorialModal .modal-header").text(MSG.tutorialMenu.dwenguinoComponents);
        $("#tutorialModal .modal-body .message").empty();

        $("#tutorialModal .modal-body .message").append('<div class="container"></div>');

        $("#tutorialModal .modal-body .message .container").append('<div id="row1" class="row"></div>');
        $("#row1").append('<h2>'+MSG.tutorialMenu.sensors+'</h2>');
        
        $("#tutorialModal .modal-body .message .container").append('<ul id="tutorialModal_sensors_menu" class=" row components_overview_cards"></ul>');

        let sensorsArray = [Sonar, LightSensor, SoundSensor, Pir, TouchSensor];

        for (let i = 0; i < sensorsArray.length; i++) {
            $('#tutorialModal_sensors_menu').append('<li id="tutorial_sensors_item_'+ sensorsArray[i].getType() +'" class="components_overview_cards_item"></li>');
            $('#tutorial_sensors_item_'+ sensorsArray[i].getType()).append('<div id="tutorial_sensors_card_'+ sensorsArray[i].getType() +'" class="components_overview_card bg-c-4"></div>');
            $('#tutorial_sensors_card_' + sensorsArray[i].getType()).append('<div id="tutorial_sensors_'+ sensorsArray[i].getType() +'" class="components_overview_card_content"></div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div class="components_overview_card_title">' + MSG.simulator[sensorsArray[i].getType()] + '</div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div id="tutorial_categories_dwenguino_components_img"></div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div class="components_overview_card_text">'+sensorsArray[i].getDescription()+'</div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div id="input_pins' + sensorsArray[i].getType() + '" class="components_overview_card_label">in: </div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div id="output_pins' + sensorsArray[i].getType() + '" class="components_overview_card_label">out: </div>');
            $('#tutorial_sensors_'+sensorsArray[i].getType()).append('<div id="circuit_pins' + sensorsArray[i].getType() + '" class="components_overview_card_label">circuit: </div>');
        }

        $("#tutorialModal .modal-body .message .container").append('<div id="row2" class="row"></div>');
        $("#row2").append('<h2>'+MSG.tutorialMenu.actuators+'</h2>');

        $("#tutorialModal .modal-body .message .container").append('<div id="row3" class="row"></div>');
        $("#row3").append('<h3>'+MSG.tutorialMenu.movement+'</h3>');
        $("#tutorialModal .modal-body .message .container").append('<ul id="tutorialModal_movement_menu" class=" row components_overview_cards"></ul>');

        let movementArray = [Servo, DCMotor];

        for (let i = 0; i < movementArray.length; i++) {
            $('#tutorialModal_movement_menu').append('<li id="tutorial_movement_item_'+ movementArray[i].getType() +'" class="components_overview_cards_item"></li>');
            $('#tutorial_movement_item_'+ movementArray[i].getType()).append('<div id="tutorial_movement_card_'+ movementArray[i].getType() +'" class="components_overview_card bg-c-11"></div>');
            $('#tutorial_movement_card_' + movementArray[i].getType()).append('<div id="tutorial_movement_'+ movementArray[i].getType() +'" class="components_overview_card_content"></div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div class="components_overview_card_title">' + MSG.simulator[sensorsArray[i].getType()] + '</div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div id="tutorial_categories_dwenguino_components_img"></div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div class="components_overview_card_text">'+movementArray[i].getDescription()+'</div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div id="input_pins' + movementArray[i].getType() + '" class="components_overview_card_label">in: </div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div id="output_pins' + movementArray[i].getType() + '" class="components_overview_card_label">out: </div>');
            $('#tutorial_movement_'+movementArray[i].getType()).append('<div id="circuit_pins' + movementArray[i].getType() + '" class="components_overview_card_label">circuit: </div>');
        }

        $("#tutorialModal .modal-body .message .container").append('<div id="row4" class="row"></div>');
        $("#row4").append('<h3>'+MSG.tutorialMenu.display+'</h3>');
        $("#tutorialModal .modal-body .message .container").append('<ul id="tutorialModal_display_menu" class=" row components_overview_cards"></ul>');

        
        let displayArray = [Lcd, Led, RgbLed];

        for (let i = 0; i < displayArray.length; i++) {
            $('#tutorialModal_display_menu').append('<li id="tutorial_display_item_'+ displayArray[i].getType() +'" class="components_overview_cards_item"></li>');
            $('#tutorial_display_item_'+ displayArray[i].getType()).append('<div id="tutorial_display_card_'+ displayArray[i].getType() +'" class="components_overview_card bg-c-6"></div>');
            $('#tutorial_display_card_' + displayArray[i].getType()).append('<div id="tutorial_display_'+ displayArray[i].getType() +'" class="components_overview_card_content"></div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div class="components_overview_card_title">' + MSG.simulator[displayArray[i].getType()] + '</div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div id="tutorial_categories_dwenguino_components_img"></div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div class="components_overview_card_text">'+displayArray[i].getDescription()+'</div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div id="input_pins' + displayArray[i].getType() + '" class="components_overview_card_label">in: </div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div id="output_pins' + displayArray[i].getType() + '" class="components_overview_card_label">out: </div>');
            $('#tutorial_display_'+displayArray[i].getType()).append('<div id="circuit_pins' + displayArray[i].getType() + '" class="components_overview_card_label">circuit: </div>');
        }

        $("#tutorialModal .modal-body .message .container").append('<div id="row5" class="row"></div>');
        $("#row5").append('<h3>'+MSG.tutorialMenu.audio+'</h3>');
        $("#tutorialModal .modal-body .message .container").append('<div id="tutorialModal_audio_menu" class="components_overview row"></div>');
    
        let audioArray = [Buzzer];

        for (let i = 0; i < audioArray.length; i++) {
            $('#tutorialModal_audio_menu').append('<li id="tutorial_audio_item_'+ audioArray[i].getType() +'" class="components_overview_cards_item"></li>');
            $('#tutorial_audio_item_'+ audioArray[i].getType()).append('<div id="tutorial_audio_card_'+ audioArray[i].getType() +'" class="components_overview_card bg-c-3"></div>');
            $('#tutorial_audio_card_' + audioArray[i].getType()).append('<div id="tutorial_audio_'+ audioArray[i].getType() +'" class="components_overview_card_content"></div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div class="components_overview_card_title">' + MSG.simulator[audioArray[i].getType()] + '</div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div id="tutorial_categories_dwenguino_components_img"></div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div class="components_overview_card_text">'+audioArray[i].getDescription()+'</div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div id="input_pins' + audioArray[i].getType() + '" class="components_overview_card_label">in: </div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div id="output_pins' + audioArray[i].getType() + '" class="components_overview_card_label">out: </div>');
            $('#tutorial_audio_'+audioArray[i].getType()).append('<div id="circuit_pins' + audioArray[i].getType() + '" class="components_overview_card_label">circuit: </div>');
        }

        let allComponents = sensorsArray.concat(movementArray).concat(displayArray).concat(audioArray);

        for(let i = 0; i < allComponents.length; i++){
            let inputPins = allComponents[i].getInputPins();
            for(let j = 0; j < inputPins.length; j++){
                $('#input_pins' + allComponents[i].getType()).append('<span class="badge badge-pill">'+inputPins[j]+'</span> ');
            }
        
            let outputPins = allComponents[i].getOutputPins();
            for(let j = 0; j < outputPins.length; j++){
                $('#output_pins' + allComponents[i].getType()).append('<span class="badge badge-pill">'+outputPins[j]+'</span> ');
            }
            
            $('#circuit_pins' + allComponents[i].getType()).append('<span class="badge badge-pill">5V</span> ');
            $('#circuit_pins' + allComponents[i].getType()).append('<span class="badge badge-pill">GND</span> ');
        }

        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="previous_tutorial_dialog" type="button" class="btn btn-default">'+ MSG.tutorialMenu.previous +'</button>');
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');

        $("#previous_tutorial_dialog").click(() => {
            this.loadTutorialDialog();
            this.addTutorialDialogEventHandlers();
        });
    }

    loadConnectorOverview(){
        $("#tutorialModal .modal-header").text(MSG.tutorialMenu.catDwenguinoConnector);
        $("#tutorialModal .modal-body .message").empty();

        $("#tutorialModal .modal-body .message").append('<div class="container"></div>');

        $("#tutorialModal .modal-body .message .container").append('<div id="row1" class="row"></div>');
        $('#tutorialModal .modal-body .message .container').append('<div id="row2" class="row"></div>');
        $('#tutorialModal .modal-body .message .container').append('<div id="row3" class="row"></div>');

        $("#row2").append('<div id="pin_mapping" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>');
        $('#pin_mapping').append('<img src="DwenguinoIDE/img/tutorials/pin_mapping.svg" class="img-fluid">');

        $("#row3").append('<div id="connector_overview" class="col-lg-10 col-md-10 col-sm-10 col-xs-10"></div>');
        $('#connector_overview').append('<img src="DwenguinoIDE/img/tutorials/expansion_connector.svg" class="img-fluid">');

        $("#tutorialModal .modal-footer").empty();
        $("#tutorialModal .modal-footer").append('<button id="previous_tutorial_dialog" type="button" class="btn btn-default">'+ MSG.tutorialMenu.previous +'</button>');
        $("#tutorialModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ MSG.tutorialMenu.close +'</button>');

        $("#previous_tutorial_dialog").click(() => {
            this.loadTutorialDialog();
            this.addTutorialDialogEventHandlers();
        });
    }


    /**
     * Add a specific tutorial to the tutorial list interface
     * @param {Tutorial} tutorial The tutorial object to add to the list
     */
    addTutorial(tutorial, isCompleted){

        let newLi = $("<div>").attr("class", "tutorial_item row").attr("id", tutorial.id).attr("role", "presentation");
        $("#tutorialModal_tutorials_menu").append(newLi);
        newLi.click(() => {
            this.eventLogger.tutorialId = tutorial.id;
            this.tutorialId = tutorial.id;
            this.tutorialCategory = tutorial.category;
            this.eventLogger.tutorialIdSetting = tutorial.id;
            tutorial.initSteps();
            hopscotch.configure({showPrevButton: "true"}); //configure tutorial views
            this.hideTutorialDialog(); // hide the tutorial dialog before starting the tutorial
            hopscotch.startTour(tutorial);
            this.eventLogger.recordEvent(this.eventLogger.createEvent(EVENT_NAMES.startTutorial, tutorial.id));
        });

        if(isCompleted){
            $("#" + tutorial.id).append('<div class="fas fa-check c-6 col-auto"></div>'); 
            $("#" + tutorial.id).append('<div class="col-auto">'+ tutorial.label + '</div>'); 
        } else {
            $("#" + tutorial.id).append('<div class="fas fa-times c-1 col-auto"></div>'); 
            $("#" + tutorial.id).append('<div class="col-auto">'+ tutorial.label + '</div>'); 
        }
  
    }

    /**
     * Event handler for endig a tutorial. Triggers the 'endTutorial' event for logging.
     */
    endTutorial(){
        let currentCategory = this.tutorialCategory;
        this.saveCompleteTutorial(this.tutorialId, this.tutorialCategory);
        this.eventLogger.tutorialId = "";
        this.eventLogger.tutorialIdSetting = "";
        this.tutorialId = "";
        this.tutorialCategory = "";
        this.eventLogger.recordEvent(this.eventLogger.createEvent(EVENT_NAMES.endTutorial, ""));
        this.loadTutorialsMenu(currentCategory);
        this.showTutorialDialog();
    }

    saveCompleteTutorial(tutorialId, category){
        if(this.eventLogger.loggingModal.user != null){
            let serverSubmission = {
                "username": this.eventLogger.loggingModal.user.username,
                "password": JSON.stringify(this.eventLogger.loggingModal.user.password),
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
}

export default TutorialMenu;