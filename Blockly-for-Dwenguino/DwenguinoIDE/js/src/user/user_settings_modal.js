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
            LoggingModal.createLoggingModalDialog(MSG.logging['settings']);

            $('#loggingModalBody').append('<form id="loginUser"></form>');

            $('#loggingModalBody').append('<div id="nameRow" class="ui-widget row mb-4"></div>');
            $('#nameRow').append('<div class="col-md-3"><p>'+ MSG.logging['firstname'] +'</p></div>');
            $('#nameRow').append('<div class="col-md-8"><p>'+ data.firstname +'</p></div>');

            $('#loggingModalBody').append('<div id="emailRow" class="ui-widget row mb-4"></div>');
            $('#emailRow').append('<div class="col-md-3"><p>'+ MSG.logging['email'] +'</p></div>');
            $('#emailRow').append('<div class="col-md-8"><p>'+ data.email +'</p></div>');

            $('#loggingModalBody').append('<div id="roleRow" class="ui-widget row mb-4"></div>');
            $('#roleRow').append('<div class="col-md-3"><p>'+ MSG.logging['role'] +'</p></div>');
            $('#roleRow').append('<div class="col-md-8"><p>'+ data.role +'</p></div>');

            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
            $("#back_modal_dialog_button").click(function(){
                self._loginMenu.createInitialMenu();
            })
            LoggingModal.showDialog();
        }).fail(function(response, status)  {
            LoggingModal.createLoggingModalDialog(MSG.logging['settings']);
            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['back']+'</button>');
            $("#back_modal_dialog_button").click(function(){
                self._loginMenu.createInitialMenu();
            })
            LoggingModal.showDialog();
        });      
    }
}