import { LoggingModal } from './logging_modal.js'
import ServerConfig from '../server_config.js'
import { LoginMenu } from './login_menu.js'
export { UserSettingsModal } 

class UserSettingsModal {

    constructor(loginMenu) {
        this._loginMenu = loginMenu;
    }

    showUserSettings(){
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user"}
        ).done(function(data){
            LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['settings']));

            $('#loggingModalBody').append('<div id="nameRow" class="ui-widget row mb-4"></div>');
            $('#nameRow').append('<div class="col-md-3"><p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['firstname']) +'</p></div>');
            $('#nameRow').append('<div class="col-md-8"><p>'+ data.firstname +'</p></div>');

            $('#loggingModalBody').append('<div id="emailRow" class="ui-widget row mb-4"></div>');
            $('#emailRow').append('<div class="col-md-3"><p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['email']) +'</p></div>');
            $('#emailRow').append('<div class="col-md-8"><p>'+ data.email +'</p></div>');

            $('#loggingModalBody').append('<div id="roleRow" class="ui-widget row mb-4"></div>');
            $('#roleRow').append('<div class="col-md-3"><p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['role']) +'</p></div>');
            $('#roleRow').append('<div class="col-md-8"><p>'+ data.role +'</p></div>');

            $('#loggingModalBody').append('<div id="deleteAccountRow" class="ui-widget row mb-4"></div>');
            $('#deleteAccountRow').append('<div class="col-md-4"><button class="btn btn-info" id="deleteAccount">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging',['deleteAccount'])+'</button></div>');
            $('#deleteAccount').on('click', function(event){
                self.deleteAccount();
            })

            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['back'])+'</button>');
            $("#back_modal_dialog_button").click(function(){
                self._loginMenu.createInitialMenu();
            })

            LoggingModal.showDialog();
        }).fail(function(response, status)  {
            LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging',['settings']));
            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
            $("#back_modal_dialog_button").click(function(){
                self._loginMenu.createInitialMenu();
            })
            LoggingModal.showDialog();
        });      
    }

    deleteAccount(){
        let self = this;
        let ajaxSettings = {
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/delete",
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone() {
            self._loginMenu.createInitialMenu();
        };

        function onFail(response, status) {
            if(ajaxSettings.retryLimit > 0){
                ajaxSettings.retryLimit--;
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"
                }).done(function(data){
                    $.ajax(ajaxSettings).done(onDone).fail(onFail);
                }).fail(function(response, status)  {
                    console.log(status);
                });
            } 
        };  
    }
}