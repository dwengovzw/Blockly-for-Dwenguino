import Validator from './validator.js'
import ServerConfig from '../server_config.js'
import User from './user.js'

/**
 * This class builds and displays the logging menu on the screen.
 * It is used by the DwenguinoEventLogger to gather data about the user.
 * 
 */
class LoginMenu{
    currentlySelectedIcons= ['0','0','0','0'];
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

        let userInfo = 'user_info';
        let authenticationMenu = 'authentication_menu';

        $('#loggingModalBody').append('<div id="'+ userInfo +'"></div>');
        $("#loggingModalBody").append('<div id="'+ authenticationMenu + '" class="tutorial_categories_wrapper"></div>');

        this.addUserInfoPanel(userInfo);
        this.addAuthenticationPanel(authenticationMenu);

        this.showDialog();
    }

    /**
     * Show the user info if the user is logged in (valid Dwengo cookie) or the user 
     * was previously authenticated and the refresh token is still valid (renew access token).
     */
    addUserInfoPanel(userInfo){
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user"}
        ).done(function(data){
            // The user is still logged in
            let firstname = data.firstname;
            $('#' + userInfo).append('<p>Hello ' + firstname + '</p>');

        }).fail(function(response, status)  {
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user"}
                    ).done(function(data){
                        // The user is still logged in
                        let firstname = data.firstname;
                        $('#' + userInfo).append('<p>Hello ' + firstname + '</p>');
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else if(response.status == 401){
                // The user was never logged in so there is no user info.
            } else {
                console.log(status, response);
            }
        });
    }

    addAuthenticationPanel(authenticationMenu){
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user"}
        ).done(function(data){
            // The user is still logged in
            $("#" + authenticationMenu).append('<div id="authentication_logout" class="tutorial_categories_item card"></div>');
            $("#authentication_logout").append('<div class="category_tag">'+ MSG.logging['logout'] +'</div>');
            $("#authentication_logout").append('<div id="logout_img"></div>');

            $("#authentication_logout").click(function(){
                self.logout();
            });
        }).fail(function(response, status)  {
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user"}
                    ).done(function(data){
                        // The user is still logged in
                        $("#" + authenticationMenu).append('<div id="authentication_logout" class="tutorial_categories_item card"></div>');
                        $("#authentication_logout").append('<div class="category_tag">'+ MSG.logging['logout'] +'</div>');
                        $("#authentication_logout").append('<div id="logout_img"></div>');
            
                        $("#authentication_logout").click(function(){
                            self.logout();
                        });
                    }).fail(function(response, status)  {
                        // New access token invalid so the user is not logged in
                        $("#" + authenticationMenu).append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
                        $("#authentication_new_user").append('<div class="category_tag">'+ MSG.logging['newuser'] +'</div>');
                        $("#authentication_new_user").append('<div id="new_user_img"></div>');
                
                        $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                        $("#authentication_existing_user").append('<div class="category_tag">'+ MSG.logging['login'] +'</div>');
                        $("#authentication_existing_user").append('<div id="school_user_img"></div>');
                
                        $("#authentication_new_user").click(function(){
                            self.createUserMenu();
                        });
                
                        $("#authentication_existing_user").click(function(){
                            self.createLoginMenu();
                        });
                    });
                }).fail(function(response, status)  {
                    // Refresh token invalid so the user is not logged in again
                    $("#" + authenticationMenu).append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
                    $("#authentication_new_user").append('<div class="category_tag">'+ MSG.logging['newuser'] +'</div>');
                    $("#authentication_new_user").append('<div id="new_user_img"></div>');
            
                    $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                    $("#authentication_existing_user").append('<div class="category_tag">'+ MSG.logging['login'] +'</div>');
                    $("#authentication_existing_user").append('<div id="school_user_img"></div>');
            
                    $("#authentication_new_user").click(function(){
                        self.createUserMenu();
                    });
            
                    $("#authentication_existing_user").click(function(){
                        self.createLoginMenu();
                    });
                });
            } else {
                // The user was never logged in so there is no user info.
                $("#" + authenticationMenu).append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
                $("#authentication_new_user").append('<div class="category_tag">'+ MSG.logging['newuser'] +'</div>');
                $("#authentication_new_user").append('<div id="new_user_img"></div>');
        
                $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                $("#authentication_existing_user").append('<div class="category_tag">'+ MSG.logging['login'] +'</div>');
                $("#authentication_existing_user").append('<div id="school_user_img"></div>');
        
                $("#authentication_new_user").click(function(){
                    self.createUserMenu();
                });
        
                $("#authentication_existing_user").click(function(){
                    self.createLoginMenu();
                });
            }
        });
    }

    /**
     * Build and display the login menu as a modal on the screen.
     * The user needs to enter a username and graphical password to log in.
     */
    createLoginMenu(){
        var self = this;
        this.createLoggingModalDialog(MSG.logging['login']);

        $('#loggingModalBody').append('<form id="loginUser"></form>');

        $('#loginUser').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ MSG.logging['email']+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" class="col-md-8" placeholder="'+ MSG.logging['enterEmail']+'">');

        $('#loginUser').append('<div id="inputPassword" class="ui-widget row mb-4"></div>');
        $('#inputPassword').append('<label for="passwordTag" class="col-md-3">'+ MSG.logging['password']+'</label>');
        $('#inputPassword').append('<input id="passwordTag" name="passwordTag" type="password" class="col-md-8" placeholder="'+ MSG.logging['enterPassword']+'">');

        $('#loggingModalBody').append('<button id="forgot_password_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['forgotPassword']+'</button>');
        //this.createIconModule();

        //$('#loggingModalBody').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
        $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

        this.showDialog();

        // this.makeIconsResponsive();

        // Reset the graphical password.
        // $("#reset_modal_dialog_button").click(function(){
        //     self.resetSelectedIcons();
        // });

        $("#forgot_password_modal_dialog_button").click(function(){
            self.forgotPassword();
        });

        $("#back_modal_dialog_button").click(function(){
            self.createInitialMenu();
        })

        // Log in.
        $("#submit_modal_dialog_button").click(function(){
            let errors = [];
            let email = $( "input[name=emailTag]").val();
            let password = $( "input[name=passwordTag]").val();

            errors.push(self.validator.validateEmail(email));
            errors.push(self.validator.validatePassword(password));
            //errors.push(this.validator.validateId(this.currentlySelectedIcons));
        
            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                self.login();
            }
        });
    }

    forgotPassword(){
        var self = this;
        this.createLoggingModalDialog(MSG.logging['forgotPassword']);

        $('#loggingModalBody').append('<form id="forgotPassword"></form>');

        $('#forgotPassword').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ MSG.logging['email']+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" class="col-md-8" placeholder="'+ MSG.logging['enterEmail']+'">');

        $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

        this.showDialog();

        $("#back_modal_dialog_button").click(function(){
            self.createLoginMenu();
        })

        $("#submit_modal_dialog_button").click(function(){
            let errors = [];
            let email = $( "input[name=emailTag]").val();
    
            errors.push(self.validator.validateEmail(email));

            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                self.sendPasswordResetCode();
            }
        });
    }

    sendPasswordResetCode(){
        var self = this;

        let email = $( "input[name=emailTag]").val();

        let serverSubmission = {
            "email": email
        };

        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/getPasswordResetCode",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission)
        }).done(function(data){
            self.showResetPasswordScreen();
        }).fail(function(response, status)  { 
            self.createLoggingModalDialog(MSG.logging['forgotPassword']);
            $('#loggingModalBody').append('<p>'+ MSG.logging['userDoesNotExist'] +'</p>');

            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
            $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');
    
            $("#loggingModal").modal('show');

            $("#back_modal_dialog_button").click(function() {
                self.sendPasswordResetCode();
            })
    
            $("#submit_modal_dialog_button").click(function(){
                self.removeDialog();
            });
        });
    }

    showResetPasswordScreen(){
        var self = this;
        this.createLoggingModalDialog(MSG.logging['resetPassword']);
        $('#loggingModalBody').append('<form id="resetPassword"></form>');

        $('#resetPassword').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ MSG.logging['email']+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" autocomplete="username" class="col-md-8" placeholder="'+ MSG.logging['enterEmail']+'">');

        $('#resetPassword').append('<div id="inputSecretCode" class="ui-widget row mb-4"></div>');
        $('#inputSecretCode').append('<label for="secretCodeTag" class="col-md-3">'+ MSG.logging['secretCode']+'</label>');
        $('#inputSecretCode').append('<input id="secretCodeTag" name="secretCodeTag" class="col-md-8" placeholder="'+ MSG.logging['enterSecretCode']+'">');

        $('#resetPassword').append('<div id="inputPassword1" class="ui-widget row mb-4"></div>');
        $('#inputPassword1').append('<label for="passwordTag1" class="col-md-3">'+ MSG.logging['password']+'</label>');
        $('#inputPassword1').append('<input id="passwordTag1" name="passwordTag1" type="password" autocomplete="new-password" class="col-md-8" placeholder="'+ MSG.logging['enterPassword']+'">');

        $('#resetPassword').append('<div id="inputPassword2" class="ui-widget row mb-4"></div>');
        $('#inputPassword2').append('<label for="passwordTag2" class="col-md-3">'+ MSG.logging['password']+'</label>');
        $('#inputPassword2').append('<input id="passwordTag2" name="passwordTag2" type="password" autocomplete="new-password" class="col-md-8" placeholder="'+ MSG.logging['enterPassword']+'">');
 
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

        this.showDialog();

        // Log in.
        $("#submit_modal_dialog_button").click(function(){
            let errors = [];

            let email = $( "input[name=emailTag]").val();
            let secretCode = $( "input[name=secretCodeTag]").val()
            let password = $( "input[name=passwordTag1]").val();
            let password_repeated = $( "input[name=passwordTag2]").val();

            errors.push(self.validator.validateEmail(email));
            errors.push(self.validator.validateSecretCode(secretCode));
            errors.push(self.validator.validatePasswords(password, password_repeated));
            errors.push(self.validator.validatePassword(password));
            errors.push(self.validator.validatePassword(password_repeated));
            
        
            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                self.resetPassword();
            }
        });
    }

    resetPassword(){
        var self = this;
       
        let email = $( "input[name=emailTag]").val();
        let secretCode = $( "input[name=secretCodeTag]").val()
        let password = $( "input[name=passwordTag1]").val();
        let password_repeated = $( "input[name=passwordTag2]").val();

        let serverSubmission = {
            "email": email,
            "secretCode": secretCode,
            "password": password,
            "password_repeated": password_repeated
        };
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/resetPassword",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission)
        }).done(function(data){
            self.removeDialog();
        }).fail(function(response, status)  {
            console.log('Failed to register:', status);
            console.log(response);
        });
    }

    login(){
        var self = this;
        
        let email = $( "input[name=emailTag]").val();
        let password = $( "input[name=passwordTag]").val();

        let serverSubmission = {
            "email": email,
            "password": password,
        };
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/login",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission),
        }).done(function(data){
            self.resetSelectedIcons();
            self.removeDialog();
        }).fail(function(response, status)  {
            console.warn('Failed to log in:', status);
            self.resetSelectedIcons();
        });
    }

    logout(){
        var self = this;
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/logout"
        }).done(function(data){
            self.removeDialog();
        }).fail(function(response, status) {
            self.removeDialog();
        })
    }

    createUserMenu(){
        var self = this;
        this.createLoggingModalDialog(MSG.logging['newuser']);

        $('#loggingModalBody').append('<form id="registerUser"></form>');

        $('#registerUser').append('<div id="registerUserConditions"></div>')
        $('#registerUserConditions').append('<h3>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['conditions']) + '</h3>');
        $('#registerUserConditions').append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['conditions1']) + '</p>');
        $('#registerUserConditions').append('<ul>' 
            + '<li><a href="#">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['generalConditions']) + '</a></li>' 
            + '<li><a href="#">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['privacyStatement']) + '</a></li>' 
            + '</ul>');
        $('#registerUserConditions').append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['conditions2']) + '</p>');
        $('#registerUserConditions').append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['conditions3']) + '</p>');
        $('#registerUserConditions').append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['conditions4']) + '</p>');

        $('#registerUserConditions').append('<div id="acceptConditions" class="ui-widget row mb-4"></div>');
        $('#acceptConditions').append('<input type="checkbox" name="acceptConditionsCheckbox" id="acceptConditionsCheckbox" class="col-md-1">');
        $('#acceptConditions').append('<label id="acceptConditionsLabel" for="acceptConditionsCheckbox" class="col-md-11">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['acceptConditions'])+'</label>');

        $('#registerUserConditions').append('<div id="acceptResearch" class="ui-widget row mb-4"></div>');
        $('#acceptResearch').append('<input type="checkbox" name="acceptResearchCheckbox" id="acceptResearchCheckbox" class="col-md-1">');
        $('#acceptResearch').append('<label id="acceptResearchLabel" for="acceptResearchCheckbox" class="col-md-11">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['acceptResearch'])+'</label>');

        $('#loggingModalFooter').append('<button id="continue_logging_modal" type="button" class="btn btn-default">'+MSG.logging['continue']+'</button>');

        this.showDialog();

        $('#continue_logging_modal').click(function(){
            let errors = [];
            let acceptConditions = $("input[name=acceptConditionsCheckbox]");
            let acceptResearch = $("input[name=acceptResearchCheckbox]");
            errors.push(self.validator.validateAcceptConditions(acceptConditions));
            errors.push(self.validator.validateResearchConditions(acceptResearch));
            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                self.showErrors([]);
                $('#registerUserConditions').hide();
                $('#continue_logging_modal').remove();
                self.showRegistrationForm();
            }
        });
    }

    showRegistrationForm(){
        let self = this;

         // FIRST NAME
         $('#registerUser').append('<div id="inputFirstname" class="ui-widget row mb-4"></div>');
         $('#inputFirstname').append('<label for="firstnameTag" class="col-md-4">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['firstname'])+'</label>');
         $('#inputFirstname').append('<input id="firstnameTag" name="firstnameTag" class="col-md-7" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterFirstname'])+'">');
 
         // EMAIL
         $('#registerUser').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
         $('#inputEmail').append('<label for="emailTag" class="col-md-4">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['email'])+'</label>');
         $('#inputEmail').append('<input id="emailTag" name="emailTag" autocomplete="username" class="col-md-7" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterEmail'])+'">');
 
         // PASSWORDS
         $('#registerUser').append('<div id="inputPassword1" class="ui-widget row mb-4"></div>');
         $('#inputPassword1').append('<label for="passwordTag1" class="col-md-4">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['password'])+'</label>');
         $('#inputPassword1').append('<input id="passwordTag1" name="passwordTag1" type="password" autocomplete="new-password" class="col-md-7" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterPassword'])+'">');
 
         $('#registerUser').append('<div id="inputPassword2" class="ui-widget row mb-4"></div>');
         $('#inputPassword2').append('<label for="passwordTag2" class="col-md-4">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['repeatedPassword'])+'</label>');
         $('#inputPassword2').append('<input id="passwordTag2" name="passwordTag2" type="password" autocomplete="new-password" class="col-md-7" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterRepeatedPassword'])+'">');
         //this.createIconModule();
 
         // LANGUAGE PREFERENCE
         let languageOptions = {
             en: DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['english']), 
             nl: DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['dutch'])
         };
 
         $('#registerUser').append('<div id="inputLanguage" class="ui-widget row mb-4">');
         $('#inputLanguage').append('<label for="languageTag" class="col-md-4">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['language'])+'</label>');
         $('#inputLanguage').append('<select id="languageTag" name="languageTag" class="col-md-7"></select>');
         
         $.each(languageOptions, function(val, text) {
             $('#languageTag').append(
                 $('<option></option>').val(val).html(text)
             );
         });
 
         // USER ROLE
         let roleOptions = {
             student: DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['student']),
             teacher: DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['teacher'])
         };
 
         $('#registerUser').append('<div id="inputRole" class="ui-widget row mb-4">');
         $('#inputRole').append('<label for="roleTag" class="col-md-4">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['role'])+'</label>');
         $('#inputRole').append('<select id="roleTag" name="roleTag" class="col-md-7"></select>');
         
         $.each(roleOptions, function(val, text) {
             $('#roleTag').append(
                 $('<option></option>').val(val).html(text)
             );
         });
 
         //$('#registerUser').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
         $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');
     
         //this.makeIconsResponsive();
     
         // Reset the graphical password.
         // $("#reset_modal_dialog_button").click(function(){
         //     self.resetSelectedIcons();
         // });
     
         // Register the new user.
         $("#submit_modal_dialog_button").click(function(){
             let errors = [];
             let acceptConditions = $("input[name=acceptConditionsCheckbox]");
             let acceptResearch = $("input[name=acceptResearchCheckbox]");
             let firstname = $("input[name=firstnameTag]").val();
             let email = $( "input[name=emailTag]").val();
             let password = $( "input[name=passwordTag1]").val();
             let password_repeated = $( "input[name=passwordTag2]").val();
 
             errors.push(self.validator.validateAcceptConditions(acceptConditions));
             errors.push(self.validator.validateResearchConditions(acceptResearch));
             errors.push(self.validator.validateFirstname(firstname));
             errors.push(self.validator.validateEmail(email));
             errors.push(self.validator.validatePasswords(password, password_repeated));
             errors.push(self.validator.validatePassword(password));
             errors.push(self.validator.validatePassword(password_repeated));
             
             if(self.validator.hasErrors(errors)){
                 self.showErrors(errors);
             } else {
                 self.showErrors([]);
                 self.registerUser();
             }
         });
    }

    /**
     * Register the user in the backend.
     */
    registerUser(){
        var self = this;
        
        let acceptConditions = $("input[name=acceptConditionsCheckbox]")[0].checked;
        let acceptResearch = $("input[name=acceptResearchCheckbox]")[0].checked;
        let firstname = $("input[name=firstnameTag]").val();
        let email = $( "input[name=emailTag]").val();
        let password = $( "input[name=passwordTag1]").val();
        let password_repeated = $( "input[name=passwordTag2]").val();
        let language = $("select[name=languageTag]").val();
        let role = $("select[name=roleTag]").val();

        let serverSubmission = {
            "firstname": firstname,
            "email": email,
            "password": password,
            "password_repeated": password_repeated,
            "language": language,
            "role": role,
            "accept_conditions": acceptConditions,
            "accept_research": acceptResearch,
        };
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/register",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission),
        }).done(function(data){
            //self.resetSelectedIcons();
            self.removeDialog();
            self.showVerificationScreen();
            //self.showSettingsMenu();
        }).fail(function(response, status)  {
            console.log('Failed to register:', status);
            console.log(response);
            //self.resetSelectedIcons();
        });
    }

    showVerificationScreen(){
        this.createLoggingModalDialogWithoutFooter(MSG.logging['verification']);

        $('#loggingModalBody').append('<p id="loggingModalBody1"></p>')
        $('#loggingModalBody1').text(MSG.logging['verificationSentTo']);

        this.showDialog();
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
                    for (let i=0; i<choices.length; i++)
                        if (~choices[i]['naam'].toLowerCase().indexOf(term)) matches.push(choices[i]['naam']+ ", " + choices[i]['gemeente']);
                    suggest(matches);
                }
            });

            $("#submit_modal_dialog_button").click(function(){

                let errors = [];
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

                    let serverSubmission = {
                        "school": school,
                        "dateOfBirth": dateOfBirth,
                        "gender": gender
                    };
                    $.ajax({
                        type: "POST",
                        url: ServerConfig.getServerUrl() + "/user/update",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(serverSubmission),
                    }).done(function(data){
                        self.removeDialog();
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
    
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    }

    createLoggingModalDialogWithoutFooter(headerTitle){
        // Make sure there is no duplicate logging menu
        this.removeDialog();
    
        $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
        $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');
    
        $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');
    
        $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
        $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
    
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
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
            this.currentlySelectedIcons[k] = '0';
            $('#currentlySelected'+k).html("");
        }
    }


    /**
     * Add an icon at position i j to the graphical password grid.
     */
    addIconToId(i,j){
        for(let k = 0; k < 4; k++){
            if(this.currentlySelectedIcons[k] == '0'){
                let n = ((i-1)*4)+j;
                let icon = this.icons[n-1];
                this.currentlySelectedIcons[k] = JSON.stringify(icon.id);
                $('#currentlySelected'+k).html(icon.name + '<p>' + icon.html + '</p>');
                break;
            }
        }
    }
}

export default LoginMenu;