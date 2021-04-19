import { Validator } from './validator.js'
import ServerConfig from '../server_config.js'
import { User } from './user.js'
import { LoggingModal } from './logging_modal.js'
import { UserSettingsModal } from './user_settings_modal.js'
import { UserProgramsModal } from './user_programs_modal.js'

/**
 * This class builds and displays the logging menu on the screen.
 * It is used by the DwenguinoEventLogger to gather data about the user.
 * 
 */
class LoginMenu {

    constructor(){
        this._userSettingsModal = new UserSettingsModal(this);
        this._userProgramsModal = new UserProgramsModal(this);
    }

    /**
     * Show the general user menu on the screen
     */
    createInitialMenu(){
        LoggingModal.createLoggingModalDialogWithoutFooter(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['login']));

        let userInfo = 'user_info';
        let authenticationMenu = 'authentication_menu';

        $('#loggingModalBody').append('<div id="'+ userInfo +'"></div>');
        $("#loggingModalBody").append('<div id="'+ authenticationMenu + '" class="tutorial_categories_wrapper"></div>');

        this.addUserInfoPanel(userInfo);
        this.addAuthenticationPanel(authenticationMenu);

        LoggingModal.showDialog();
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
            $('#' + userInfo).append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['hello']) + firstname + '</p>');

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
                        $('#' + userInfo).append('<p>' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['hello']) + firstname + '</p>');
            
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
            $("#" + authenticationMenu).append('<div id="authentication_programs" class="tutorial_categories_item card"></div>');
            $("#authentication_programs").append('<div class="category_tag">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['myPrograms']) + '</div>');
            $("#authentication_programs").append('<div id="authentication_programs_img"></div>');
            $("#authentication_programs").on('click',function(){
                self._userProgramsModal.showUserPrograms();
            });

            $("#" + authenticationMenu).append('<div id="authentication_settings" class="tutorial_categories_item card"></div>');
            $("#authentication_settings").append('<div class="category_tag">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['settings']) + '</div>');
            $("#authentication_settings").append('<div id="authentication_settings_img"></div>');
            $("#authentication_settings").on('click',function(){
                self._userSettingsModal.showUserSettings();
            });

            $("#" + authenticationMenu).append('<div id="authentication_logout" class="tutorial_categories_item card"></div>');
            $("#authentication_logout").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['logout']) +'</div>');
            $("#authentication_logout").append('<div id="logout_img"></div>');
            $("#authentication_logout").on('click', function(){
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
                        $("#" + authenticationMenu).append('<div id="authentication_programs" class="tutorial_categories_item card"></div>');
                        $("#authentication_programs").append('<div class="category_tag">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging',['myPrograms']) + '</div>');
                        $("#authentication_programs").append('<div id="authentication_programs_img"></div>');
                        $("#authentication_programs").click(function(){
                            self._userProgramsModal.showUserPrograms();
                        });

                        $("#" + authenticationMenu).append('<div id="authentication_settings" class="tutorial_categories_item card"></div>');
                        $("#authentication_settings").append('<div class="category_tag">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging',['settings']) + '</div>');
                        $("#authentication_settings").append('<div id="authentication_settings_img"></div>');
                        $("#authentication_settings").click(function(){
                            self._userSettingsModal.showUserSettings();
                        });
                        
                        $("#" + authenticationMenu).append('<div id="authentication_logout" class="tutorial_categories_item card"></div>');
                        $("#authentication_logout").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['logout']) +'</div>');
                        $("#authentication_logout").append('<div id="logout_img"></div>');
            
                        $("#authentication_logout").click(function(){
                            self.logout();
                        });
                    }).fail(function(response, status)  {
                        // New access token invalid so the user is not logged in
                        $("#" + authenticationMenu).append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
                        $("#authentication_new_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['newuser']) +'</div>');
                        $("#authentication_new_user").append('<div id="new_user_img"></div>');
                
                        $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                        $("#authentication_existing_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['login']) +'</div>');
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
                    $("#authentication_new_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['newuser']) +'</div>');
                    $("#authentication_new_user").append('<div id="new_user_img"></div>');
            
                    $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                    $("#authentication_existing_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['login']) +'</div>');
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
                $("#authentication_new_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['newuser']) +'</div>');
                $("#authentication_new_user").append('<div id="new_user_img"></div>');
        
                $("#" + authenticationMenu).append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
                $("#authentication_existing_user").append('<div class="category_tag">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['login']) +'</div>');
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
        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['login']));

        $('#loggingModalBody').append('<form id="loginUser"></form>');

        $('#loginUser').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['email'])+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" class="col-md-8" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterEmail'])+'">');

        $('#loginUser').append('<div id="inputPassword" class="ui-widget row mb-4"></div>');
        $('#inputPassword').append('<label for="passwordTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['password'])+'</label>');
        $('#inputPassword').append('<input id="passwordTag" name="passwordTag" type="password" autocomplete="current-password" class="col-md-8" maxLength="64" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterPassword'])+'">');

        $('#loggingModalBody').append('<button id="forgot_password_modal_dialog_button" type="button" class="btn btn-default mt-4">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['forgotPassword'])+'</button>');

        $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['back'])+'</button>');
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['ok'])+'</button>');

        LoggingModal.showDialog();

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

            errors.push(Validator.validateEmail(email));
            errors.push(Validator.validatePassword(password));
            //errors.push(this.validator.validateId(this.currentlySelectedIcons));
        
            if(Validator.hasErrors(errors)){
                LoggingModal.showErrors(errors);
            } else {
                self.login();
            }
        });
    }

    forgotPassword(){
        var self = this;
        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['forgotPassword']));

        $('#loggingModalBody').append('<form id="forgotPassword"></form>');

        $('#forgotPassword').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['email'])+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" class="col-md-8" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterEmail'])+'">');

        $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['back'])+'</button>');
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['ok'])+'</button>');

        LoggingModal.showDialog();

        $("#back_modal_dialog_button").click(function(){
            self.createLoginMenu();
        })

        $("#submit_modal_dialog_button").click(function(){
            let errors = [];
            let email = $( "input[name=emailTag]").val();
    
            errors.push(Validator.validateEmail(email));

            if(Validator.hasErrors(errors)){
                LoggingModal.showErrors(errors);
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
            self.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['forgotPassword']));
            $('#loggingModalBody').append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['userDoesNotExist']) +'</p>');

            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['back'])+'</button>');
            $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['ok'])+'</button>');
    
            $("#loggingModal").modal('show');

            $("#back_modal_dialog_button").click(function() {
                self.sendPasswordResetCode();
            })
    
            $("#submit_modal_dialog_button").click(function(){
                LoggingModal.removeDialog();
            });
        });
    }

    showResetPasswordScreen(){
        var self = this;
        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['resetPassword']));
        $('#loggingModalBody').append('<form id="resetPassword"></form>');

        $('#resetPassword').append('<div id="inputEmail" class="ui-widget row mb-4"></div>');
        $('#inputEmail').append('<label for="emailTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['email'])+'</label>');
        $('#inputEmail').append('<input id="emailTag" name="emailTag" autocomplete="username" class="col-md-8" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterEmail'])+'">');

        $('#resetPassword').append('<div id="inputSecretCode" class="ui-widget row mb-4"></div>');
        $('#inputSecretCode').append('<label for="secretCodeTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['secretCode'])+'</label>');
        $('#inputSecretCode').append('<input id="secretCodeTag" name="secretCodeTag" class="col-md-8" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterSecretCode'])+'">');

        $('#resetPassword').append('<div id="inputPassword1" class="ui-widget row mb-4"></div>');
        $('#inputPassword1').append('<label for="passwordTag1" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['password'])+'</label>');
        $('#inputPassword1').append('<input id="passwordTag1" name="passwordTag1" type="password" autocomplete="new-password" class="col-md-8" maxLength="64" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterPassword'])+'">');

        $('#resetPassword').append('<div id="inputPassword2" class="ui-widget row mb-4"></div>');
        $('#inputPassword2').append('<label for="passwordTag2" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['password'])+'</label>');
        $('#inputPassword2').append('<input id="passwordTag2" name="passwordTag2" type="password" autocomplete="new-password" class="col-md-8" maxLength="64" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['enterPassword'])+'">');
 
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['ok'])+'</button>');

        LoggingModal.showDialog();

        $("#submit_modal_dialog_button").click(function(){
            let errors = [];

            let email = $( "input[name=emailTag]").val();
            let secretCode = $( "input[name=secretCodeTag]").val()
            let password = $( "input[name=passwordTag1]").val();
            let password_repeated = $( "input[name=passwordTag2]").val();

            errors.push(Validator.validateEmail(email));
            errors.push(Validator.validateSecretCode(secretCode));
            errors.push(Validator.validatePasswords(password, password_repeated));
            errors.push(Validator.validatePassword(password, email));
            errors.push(Validator.validatePassword(password_repeated, email));
            
            if(Validator.hasErrors(errors)){
                LoggingModal.showErrors(errors);
            } else {
                self.resetPassword();
            }
        });
    }

    resetPassword(){
        let email = $( "input[name=emailTag]").val();
        let secretCode = $( "input[name=secretCodeTag]").val()
        let password = $( "input[name=passwordTag1]").val();
        let password_repeated = $( "input[name=passwordTag2]").val();

        let serverSubmission = {
            "email": email,
            "secretCode": secretCode,
            "password": password,
            "repeated_password": password_repeated
        };
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/resetPassword",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission)
        }).done(function(data){
            LoggingModal.removeDialog();
        }).fail(function(response, status)  {
            console.log('Failed to register:', status);
            console.log(response);
        });
    }

    login(){
        let self = this;
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
            data: JSON.stringify(serverSubmission)
        }).done(function(data){
            // LoggingModal.removeDialog();
            self.createInitialMenu();
        }).fail(function(response, status)  {
            console.warn('Failed to log in:', status);
            var errors = [];
            errors = response.responseJSON.error.map(function (error) {
                if(error == "userNotActive"){
                    return { message: '<a id="resendLink" href="#">' + DwenguinoBlocklyLanguageSettings.translateFrom('logging', [error]) + '</a>'};
                } else {
                    return { message: '<p>'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', [error])+'</p>'}
                }
            });
            LoggingModal.showErrors(errors);

            $('#resendLink').click(function(){
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/resendActivationLink",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(serverSubmission),
                }).done(function(data){
                    let confirmation = [{ message: DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['verificationSentTo']) }];

                    LoggingModal.showErrors(confirmation);
                }).fail(function(response, status)  {
                    console.log(response);
                });
            });
        });
    }

    logout(){
        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/logout"
        }).done(function(data){
            LoggingModal.removeDialog();
        }).fail(function(response, status) {
            LoggingModal.removeDialog();
        })
    }

    createUserMenu(){
        var self = this;
        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['newuser']));

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

        $('#loggingModalFooter').append('<button id="continue_logging_modal" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['continue'])+'</button>');

        LoggingModal.showDialog();

        $('#continue_logging_modal').click(function(){
            let errors = [];
            let acceptConditions = $("input[name=acceptConditionsCheckbox]");
            let acceptResearch = $("input[name=acceptResearchCheckbox]");
            errors.push(Validator.validateAcceptConditions(acceptConditions));
            errors.push(Validator.validateResearchConditions(acceptResearch));
            if(Validator.hasErrors(errors)){
                LoggingModal.showErrors(errors);
            } else {
                LoggingModal.showErrors([]);
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
         $('#inputPassword1').append('<input id="passwordTag1" name="passwordTag1" type="password" autocomplete="new-password" class="col-md-7" maxLength="64" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterPassword'])+'">');
 
         $('#registerUser').append('<div id="inputPassword2" class="ui-widget row mb-4"></div>');
         $('#inputPassword2').append('<label for="passwordTag2" class="col-md-4">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['repeatedPassword'])+'</label>');
         $('#inputPassword2').append('<input id="passwordTag2" name="passwordTag2" type="password" autocomplete="new-password" class="col-md-7" maxLength="64" placeholder="'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['enterRepeatedPassword'])+'">');
 
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
 
         $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['ok'])+'</button>');
     
         // Register the new user.
         $("#submit_modal_dialog_button").click(function(){
             let errors = [];
             let acceptConditions = $("input[name=acceptConditionsCheckbox]");
             let acceptResearch = $("input[name=acceptResearchCheckbox]");
             let firstname = $("input[name=firstnameTag]").val();
             let email = $( "input[name=emailTag]").val();
             let password = $( "input[name=passwordTag1]").val();
             let password_repeated = $( "input[name=passwordTag2]").val();
 
             errors.push(Validator.validateAcceptConditions(acceptConditions));
             errors.push(Validator.validateResearchConditions(acceptResearch));
             errors.push(Validator.validateFirstname(firstname));
             errors.push(Validator.validateEmail(email));
             errors.push(Validator.validatePasswords(password, password_repeated));
             errors.push(Validator.validatePassword(password, email));
             errors.push(Validator.validatePassword(password_repeated, email));
             
             if(Validator.hasErrors(errors)){
                 LoggingModal.showErrors(errors);
             } else {
                 LoggingModal.showErrors([]);
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
        let role = $("select[name=roleTag]").val();

        let serverSubmission = {
            "firstname": firstname,
            "email": email,
            "password": password,
            "repeated_password": password_repeated,
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
            LoggingModal.removeDialog();
            self.showVerificationScreen();
        }).fail(function(response, status)  {
            console.log('Failed to register:', status);
            if(response.status == 401 && response.responseJSON.error == 'userAlreadyExists'){
                LoggingModal.showErrors([{message: DwenguinoBlocklyLanguageSettings.translateFrom('logging',['userAlreadyExists'])}]);
            }
        });
    }

    showVerificationScreen(){
        LoggingModal.createLoggingModalDialogWithoutFooter(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['verification']));

        $('#loggingModalBody').append('<p id="loggingModalBody1"></p>')
        $('#loggingModalBody1').text(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['verificationSentTo']));

        LoggingModal.showDialog();
    }


    /**
     * Show the menu on the screen
     */
    // showSettingsMenu(){
    //     var self = this;
    //     $.ajax({
    //         type: "GET",
    //         url: ServerConfig.getServerUrl() + "/schools/"}
    //     ).done(function(data){
    //         self.schools = data;
    //         self.createLoggingModalDialog(MSG.logging['setup']);

    //         $('#loggingModalBody').append('<div id="inputSchool" class="ui-widget row mb-4">');
    //         $('#inputSchool').append('<label for="myschooltags" class="col-md-2">'+MSG.logging['school']+'</label>');
    //         $('#inputSchool').append('<input id="myschooltags" name="myschooltags" class="form-control col-md-8" placeholder="'+MSG.logging['selectSchool']+'">');

    //         $('#loggingModalBody').append('<div id="inputAge" class="ui-widget row mb-4"></div>');
    //         $('#inputAge').append('<label for="birth" class="col-md-3">'+MSG.logging['birth']+'</label>');
    //         $('#inputAge').append('<input type="date" class="form-control col-md-7" id="birth">');

    //         $('#loggingModalBody').append('<div id="inputGender" class="ui-widget row mb-4"></div>');
    //         $('#inputGender').append('<label for="birth" class="col-md-3">'+MSG.logging['gender']+'</label>');
    //         $('#inputGender').append('<div id="genderOptions" class="col-md-7">');

    //         $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="f">'+MSG.logging['gender1']+'</label>');
    //         $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="m">'+MSG.logging['gender2']+'</label>');
    //         $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="x">'+MSG.logging['gender3']+'</label>');
    //         $('#genderOptions').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="na">'+MSG.logging['gender4']+'</label>');

    //         // Set date to today
    //         var db_now = new Date();
    //         var db_day = ("0" + db_now.getDate()).slice(-2);
    //         var db_month = ("0" + (db_now.getMonth() + 1)).slice(-2);
    //         var db_today = db_now.getFullYear()+"-"+(db_month)+"-"+(db_day) ;
    //         $('#birth').val(db_today);

    //         $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');

    //         $("#loggingModal").modal('show');

    //         // Schools autocomplete
    //         self.schoolsAutocomplete = new autoComplete({
    //             selector: 'input[name="myschooltags"]',
    //             minChars: 2,
    //             source: function(term, suggest){
    //                 term = term.toLowerCase();
    //                 var choices = data;
    //                 var matches = [];
    //                 for (let i=0; i<choices.length; i++)
    //                     if (~choices[i]['naam'].toLowerCase().indexOf(term)) matches.push(choices[i]['naam']+ ", " + choices[i]['gemeente']);
    //                 suggest(matches);
    //             }
    //         });

    //         $("#submit_modal_dialog_button").click(function(){

    //             let errors = [];
    //             let school = $( "input[name=myschooltags]" ).val();
    //             let dateOfBirth = $("#birth").val();
    //             let gender = $("input[name=genderRadio]:checked").val();

    //             // TODO validate settings on server side
    //             errors.push(Validator.validateSchool(school));
    //             //errors.push(Validator.validateAgeGroup(ageGroup));
    //             errors.push(Validator.validateGender(gender));
                
    //             if(Validator.hasErrors(errors)){
    //                 LoggingModal.showErrors(errors);
    //             } else {
    //                 self.eventLogger.setSchool(school);
    //                 self.eventLogger.setDateOfBirth(dateOfBirth);
    //                 self.eventLogger.setGender(gender);

    //                 let serverSubmission = {
    //                     "school": school,
    //                     "dateOfBirth": dateOfBirth,
    //                     "gender": gender
    //                 };
    //                 $.ajax({
    //                     type: "POST",
    //                     url: ServerConfig.getServerUrl() + "/user/update",
    //                     headers: {
    //                         "Content-Type": "application/json"
    //                     },
    //                     data: JSON.stringify(serverSubmission),
    //                 }).done(function(data){
    //                     self.removeDialog();
    //                 }).fail(function(response, status)  {
    //                     console.warn('Failed to log in:', status);

    //                 });
    //             }
    //         });

    //     }).fail(function(response, status)  {
    //         console.warn('Failed to fetch schools:', status);
    //     });
    // }
}

export default LoginMenu;