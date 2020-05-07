import Validator from './Validator.js'
import ServerConfig from '../ServerConfig.js'
/**
 * This class builds and displays the logging menu on the screen.
 * It is used by the DwenguinoEventLogger to gather data about the user.
 * 
 */

export default class LoggingMenu{
    username = null;
    password = null;
    currentlySelectedIcons= [null,null,null,null];
    SIZE = 4;
    icons = [
        {id: 1, name: MSG.logging['person'], html: '<span class="glyphicon icon-user"></span>'},
        {id: 2, name: MSG.logging['dog'], html: '<span class="glyphicon icon-dog"></span>'},
        {id: 3, name: MSG.logging['car'], html: '<span class="glyphicon icon-car"></span>'},
        {id: 4, name: MSG.logging['camera'], html: '<span class="glyphicon icon-camera"></span>'},
        {id: 5, name: MSG.logging['heart'], html: '<span class="glyphicon icon-heart"></span>'},
        {id: 6, name: MSG.logging['plane'], html: '<span class="glyphicon icon-plane"></span>'},
        {id: 7, name: MSG.logging['house'], html: '<span class="glyphicon icon-house"></span>'},
        {id: 8, name: MSG.logging['umbrella'], html: '<span class="glyphicon icon-umbrella"></span>'},
        {id: 9, name: MSG.logging['star'], html: '<span class="glyphicon icon-star"></span>'},
        {id: 10, name: MSG.logging['money'], html: '<span class="glyphicon icon-money"></span>'},
        {id: 11, name: MSG.logging['gift'], html: '<span class="glyphicon icon-gift"></span>'},
        {id: 12, name: MSG.logging['keys'], html: '<span class="glyphicon icon-keys"></span>'},
        {id: 13, name: MSG.logging['music'], html: '<span class="glyphicon icon-music"></span>'},
        {id: 14, name: MSG.logging['snowflake'], html: '<span class="glyphicon icon-snowflake"></span>'},
        {id: 15, name: MSG.logging['fire'], html: '<span class="glyphicon icon-fire"></span>'},
        {id: 16, name: MSG.logging['envelope'], html: '<span class="glyphicon icon-envelope"></span>'}
    ];
    schools = null;
    validator = null;
    eventLogger = null;
    constructor(eventLogger){
        this.validator = new Validator(); 
        this.eventLogger = eventLogger;
    }

    /**
     * Show the general user menu on the screen
     */
    createInitialMenu(){
        this.createLoggingModalDialogWithoutFooter(MSG.logging['login']);

        $('#loggingModalBody').append('<p id="loggingModalBody1"></p>')
        $("#loggingModalBody").append('<div id="authentication_menu" class="tutorial_categories_wrapper"></div>');

        $("#authentication_menu").append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
        $("#authentication_new_user").append('<div class="category_tag">'+ MSG.logging['newuser'] +'</div>');
        $("#authentication_new_user").append('<div id="new_user_img"></div>');

        $("#authentication_menu").append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
        $("#authentication_existing_user").append('<div class="category_tag">'+ MSG.logging['login'] +'</div>');
        $("#authentication_existing_user").append('<div id="school_user_img"></div>');

        this.showDialog();

        var self = this;
        $("#authentication_new_user").click(function(){
            self.createUserMenu();
        });

        $("#authentication_existing_user").click(function(){
            self.createLoginMenu();
        });
    }

    /**
     * Build and display the login menu as a modal on the screen.
     * The user needs to enter a username and graphical password to log in.
     */
    createLoginMenu(){
        var self = this;
        this.createLoggingModalDialog(MSG.logging['login']);
        $('#loggingModalBody').append('<div id="inputUsername" class="ui-widget row mb-4">');
        $('#inputUsername').append('<label for="myusernametag" class="col-md-3">'+ MSG.logging['username']+'</label>');
        $('#inputUsername').append('<input id="myusernametag" name="myusernametag" class="col-md-8" placeholder="Enter username">');

        self.createIconModule();

        $('#loggingModalBody').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

        this.showDialog();

        self.makeIconsResponsive();

        // Reset the graphical password.
        $("#reset_modal_dialog_button").click(function(){
            self.resetSelectedIcons();
        });

        // Log in.
        $("#submit_modal_dialog_button").click(function(){
            self.login();
        });
    }

    login(){
        var self = this;
        var errors = [];
        User.username = $( "input[name=myusernametag]").val();
        User.password = JSON.stringify(self.currentlySelectedIcons);
    
        errors.push(self.validator.validateId(self.currentlySelectedIcons));
    
        if(self.validator.hasErrors(errors)){
            self.showErrors(errors);
        } else {
            var serverSubmission = {
                "userId": User.username,
                "password": JSON.stringify(self.currentlySelectedIcons)
            };
    
            $.ajax({
                type: "POST",
                url: ServerConfig.getServerUrl() + "/authentication/authenticate",
                data: serverSubmission,
            }).done(function(data){
                self.eventLogger.setUserId(data['id']);
                self.resetSelectedIcons();
                self.removeDialog();
            }).fail(function(response, status)  {
                console.warn('Failed to log in:', status);
                console.log(response);
            });
        }
    }

    createUserMenu(){
        var self = this;
        self.createLoggingModalDialog(MSG.logging['newuser']);
    
        $('#loggingModalBody').append('<div id="inputUsername" class="ui-widget row mb-4">');
        $('#inputUsername').append('<label for="myusernametag" class="col-md-3">'+MSG.logging['username']+'</label>');
        $('#inputUsername').append('<input id="myusernametag" name="myusernametag" class="col-md-8" placeholder="'+ MSG.logging['chooseUsername']+'">');
    
        self.createIconModule();
    
        $('#loggingModalBody').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');
        
        self.showDialog();
    
        self.makeIconsResponsive();
    
        // Reset the graphical password.
        $("#reset_modal_dialog_button").click(function(){
            self.resetSelectedIcons();
        });
    
        // Register the new user.
        $("#submit_modal_dialog_button").click(function(){
            self.registerUser();
        });
    }

    registerUser(){
        var self = this;
        var errors = [];
        User.username = $( "input[name=myusernametag]").val();
        User.password = JSON.stringify(self.currentlySelectedIcons);
    
        errors.push(self.validator.validateId(self.currentlySelectedIcons));
    
        if(self.validator.hasErrors(errors)){
            self.showErrors(errors);
        } else {
            var serverSubmission = {
                "userId": User.username,
                "password": JSON.stringify(self.currentlySelectedIcons)
            };
    
            $.ajax({
                type: "POST",
                url: ServerConfig.getServerUrl() + "/authentication/new",
                data: serverSubmission,
            }).done(function(data){
                self.eventLogger.setUserId(self.username);
                self.resetSelectedIcons();
                self.removeDialog();
                self.showSettingsMenu();
            }).fail(function(response, status)  {
                console.log('Failed to register:', status);
            });
        }
    }

    /**
     * Show the menu on the screen
     */
    showSettingsMenu(){
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/schools/"}
        ).done(function(data){
            self.schools = data;
            self.createLoggingModalDialog(MSG.logging['setup']);

            $('#loggingModalBody').append('<div id="inputSchool" class="ui-widget row mb-4">');
            $('#inputSchool').append('<label for="myschooltags" class="col-md-2">'+MSG.logging['school']+'</label>');
            $('#inputSchool').append('<input id="myschooltags" name="myschooltags" class="form-control col-md-8" placeholder="'+MSG.logging['selectSchool']+'">');

            $('#loggingModalBody').append('<div id="inputAge" class="ui-widget row mb-4"></div>');
            $('#inputAge').append('<label for="birth" class="col-md-3">'+MSG.logging['birth']+'</label>');
            $('#inputAge').append('<input type="date" class="form-control col-md-7" id="birth">');

            $('#loggingModalBody').append('<div id="inputGender" class="ui-widget row mb-4"></div>');
            $('#inputGender').append('<label for="birth" class="col-md-3">'+MSG.logging['gender']+'</label>');
            $('#inputGender').append('<div id="genderOptions" class="col-md-7">');

            $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="f">'+MSG.logging['gender1']+'</label>');
            $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="m">'+MSG.logging['gender2']+'</label>');
            $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="x">'+MSG.logging['gender3']+'</label>');
            $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="na">'+MSG.logging['gender4']+'</label>');

            // Set date to today
            var db_now = new Date();
            var db_day = ("0" + db_now.getDate()).slice(-2);
            var db_month = ("0" + (db_now.getMonth() + 1)).slice(-2);
            var db_today = db_now.getFullYear()+"-"+(db_month)+"-"+(db_day) ;
            $('#birth').val(db_today);

            $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

            $("#loggingModal").modal('show');

            // Schools autocomplete
            self.schoolsAutocomplete = new autoComplete({
                selector: 'input[name="myschooltags"]',
                minChars: 2,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = data;
                    var matches = [];
                    for (i=0; i<choices.length; i++)
                        if (~choices[i]['naam'].toLowerCase().indexOf(term)) matches.push(choices[i]['naam']+ ", " + choices[i]['gemeente']);
                    suggest(matches);
                }
            });

            $("#submit_modal_dialog_button").click(function(){

                var errors = [];
                let school = $( "input[name=myschooltags]" ).val();
                let dateOfBirth = $("#birth").val();
                let gender = $("input[name=genderRadio]:checked").val();

                // TODO validate settings on server side
                errors.push(self.validator.validateSchool(school));
                //errors.push(self.validator.validateAgeGroup(ageGroup));
                errors.push(self.validator.validateGender(gender));
                
                if(self.validator.hasErrors(errors)){
                    self.showErrors(errors);
                } else {
                    self.eventLogger.setSchool(school);
                    self.eventLogger.setDateOfBirth(dateOfBirth);
                    self.eventLogger.setGender(gender);

                    var serverSubmission = {
                        "userId": User.username,
                        "password": User.password,
                        "school": school,
                        "dateOfBirth": dateOfBirth,
                        "gender": gender
                    };

                    $.ajax({
                        type: "POST",
                        url: ServerConfig.getServerUrl() + "/authentication/updateUser",
                        data: serverSubmission,
                    }).done(function(data){
                        self.removeDialog();
                        console.log("[act;" + (self.eventLogger.dateOfBirth || "") 
                                        + ";" + (self.eventLogger.userId || "")
                                        + ";" + (self.eventLogger.school || "")
                                        + "]");
                    }).fail(function(response, status)  {
                        console.warn('Failed to log in:', status);
                    });
                }
            });

        }).fail(function(response, status)  {
            console.warn('Failed to fetch schools:', status);
        });
    }

    showDialog(){
        $("#loggingModal").modal('show');
    }
    
    removeDialog(){
        $('div').remove('#loggingModal');
        $('.modal-backdrop').remove();
    }

    createLoggingModalDialog(headerTitle){
        // Make sure there is no duplicate logging menu
        this.removeDialog();
    
        $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
        $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');
    
        $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');
    
        $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
        $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
        $('#loggingModalContent').append('<div id="loggingModalFooter" class="modal-footer"></div>');
    
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
    }

    createLoggingModalDialogWithoutFooter(headerTitle){
        // Make sure there is no duplicate logging menu
        this.removeDialog();
    
        $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
        $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');
    
        $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');
    
        $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
        $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
    
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
    }

    showErrors(errors){
        $('div').remove('#loggingModalErrors');
        $('#loggingModalBody').append('<div id="loggingModalErrors" class="mt-4"></div>');
        var arrayLength = errors.length;
        for (var i = 0; i < arrayLength; i++) {
            if(errors[i] != null){
                $('#loggingModalErrors').append('<p>' + errors[i].message + '</p>');
            }
        }
    }

    /**
     * Graphical password grid
     */

    /**
     * Create the module and add the graphical password grid
     */
    createIconModule(){
        $('#loggingModalBody').append('<div class="row"><div class="col-md-12 mt-4"><b>'+MSG.logging['choosePassword']+'</b></div></div>');
        $('#loggingModalBody').append('<div class="row"><div class="col-md-3 mt-4 mb-4">'+MSG.logging['currentlySelected']+'</div><div class="col-md-8 mt-4 mb-4"><div id="currentlySelected" class="row"></div></div>');

        $('#currentlySelected').append('<div id="currentlySelected0" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected1" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected2" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected3" class="col-2"></div>');

        this.createIconGrid();
    }

    /**
     * Make the icons of the graphical password grid responsive to the click event
     */
    makeIconsResponsive(){
        var self = this;
        for(let i=1; i<5; i++){
            for(let j=1; j<5; j++){
                $("#r" + i +"c" + j).click(function(){
                    self.addIconToId(i,j);
                });    
            }
        }
    }

    /**
     * Create the graphical password grid within the modal dialog body.
     * The grid is a 4x4 matrix.
     */
    createIconGrid(){
        $('#loggingModalBody').append('<div id="inputIcons"></div>');

        $('#inputIcons').append('<div id="row1" class="ui-widget row ml-1"></div>');
        $('#inputIcons').append('<div id="row2" class="ui-widget row ml-1"></div>');
        $('#inputIcons').append('<div id="row3" class="ui-widget row ml-1"></div>');
        $('#inputIcons').append('<div id="row4" class="ui-widget row ml-1"></div>');

        for (let i = 1; i < 5; i++) {
            for(let j = 1; j < 5; j++){
                $("#row"+i).append('<div id="r'+i+'c'+j+'" class="col-md-2 authentication_item mr-1 mb-1"></div>');
                var n = ((i-1)*4)+j;
                var icon = this.icons[n-1];
                $("#r"+i+"c"+j).append('<div class="category_tag">'+ icon.name + '</div>');
                $("#r"+i+"c"+j).append('<div id="school_user_img">' + icon.html + '</div>');
            }
        }
    }

    /**
     * Reset the icons that were selected by the user.
     */
    resetSelectedIcons(){
        for(let k = 0; k < 4; k++){
            this.currentlySelectedIcons[k] = null;
            $('#currentlySelected'+k).html("");
        }
    }


    /**
     * Add an icon at position i j to the graphical password grid.
     */
    addIconToId(i,j){
        for(let k = 0; k < 4; k++){
            if(this.currentlySelectedIcons[k] == null){
                let n = ((i-1)*4)+j;
                let icon = this.icons[n-1];
                this.currentlySelectedIcons[k] = icon.id;
                $('#currentlySelected'+k).html(icon.name + '<p>' + icon.html + '</p>');
                break;
            }
        }
    }
}