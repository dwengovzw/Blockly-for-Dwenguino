import { LoggingModal } from './logging_modal.js'
import ServerConfig from '../server_config.js'
import { LoginMenu } from './login_menu.js'
export { UserProgramsModal } 
import DwenguinoBlockly from "../dwenguino_blockly.js"

class UserProgramsModal {

    constructor(loginMenu) {
        this._loginMenu = loginMenu;
    }

    showUserPrograms(){
        let self = this;

        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translate(['myPrograms']));

        $('#loggingModalBody').append('<form id="saveProgram"></form>');

        $('#saveProgram').append('<div id="saveProgramHeader" class="ui-widget row mb-4"></div>');
        $('#saveProgramHeader').append('<div class="col-11">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['saveCurrentProgram'])+'</div>');

        $('#saveProgram').append('<div id="nameInput" class="ui-widget row mb-4"></div>');
        $('#nameInput').append('<label for="nameTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['programName'])+'</label>');
        $('#nameInput').append('<input id="nameTag" name="nameTag" class="col-md-4" placeholder="'+ 'myprogram' +'">');
        $('#nameInput').append('<button id="save_program_button" type="button" class="btn btn-primary col-md-2">'+DwenguinoBlocklyLanguageSettings.translate(['save']) +'</button>');

        $("#save_program_button").click(function(){
            self.saveCurrentProgram();
        });

        let ajaxSettings = {
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/programs",
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(userPrograms) {
            $('#loggingModalBody').append('<div id="programsRow" class="ui-widget row mb-4"></div>');
            $('#programsRow').append('<div class="col-md-4"><p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['programName']) +'</p></div>');
            $('#programsRow').append('<div class="col-md-3"><p>'+ DwenguinoBlocklyLanguageSettings.translate(['delete']) +'</p></div>');
            $('#programsRow').append('<div class="col-md-3"><p>'+ DwenguinoBlocklyLanguageSettings.translate(['restore']) +'</p></div>');
            self._userPrograms = userPrograms;

            $.each(userPrograms, function(i, program){
                $('#loggingModalBody').append('<div id="programsRow'+i+'" class="ui-widget row"></div>');
                $('#programsRow'+i).append('<div class="col-md-4"><p>'+ program.program_name +'</p></div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button id="deleteProgram'+i+'">'+DwenguinoBlocklyLanguageSettings.translate(['delete'])+'</button></div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button id="restoreProgram'+i+'">'+DwenguinoBlocklyLanguageSettings.translate(['open'])+'</button></div>');

                $("#restoreProgram"+i).on('click', function(event) {
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.restoreProgram(index);
                });

                $("#deleteProgram"+i).on('click', function(event){
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.deleteProgram(index);
                });
            });

            $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['back'])+'</button>');
            $("#back_modal_dialog_button").click(function(){
                self._loginMenu.createInitialMenu();
            })
            LoggingModal.showDialog();
        };

        function onFail(response, status) {
            if(ajaxSettings.retryLimit > 0){
                this.retryLimit--;
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"
                }).done(function(data){
                    $.ajax(ajaxSettings).done(onDone).fail(onFail);
                }).fail(function(response, status)  {
                    console.log(status);
                    console.warn('Failed to log in:', response);

                    $('#loggingModalFooter').append('<button id="back_modal_dialog_button" type="button" class="btn btn-default">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['back'])+'</button>');
                    $("#back_modal_dialog_button").click(function(){
                        self._loginMenu.createInitialMenu();
                    })
                    LoggingModal.showDialog();
                });
            } 
        };  
    }

    saveCurrentProgram(){
        let self = this;

        let programName = $( "input[name=nameTag]").val();
        let xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        let data = Blockly.Xml.domToText(xml);

        let serverSubmission = {
            "program_name": programName,
            "program": data,
        };

        let ajaxSettings = {
            type: "POST",
            url: ServerConfig.getServerUrl() + "/user/saveProgram",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(serverSubmission),
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(response) {
            self.showUserPrograms();
        };

        function onFail(response, status) {
            if(ajaxSettings.retryLimit > 0){
                this.retryLimit--;
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"
                }).done(function(data){
                    $.ajax(ajaxSettings).done(onDone).fail(onFail);
                }).fail(function(response, status)  {
                    console.log(status);
                    console.warn('Failed to save program:', response);

                    self.showUserPrograms();
                });
            } 
        };  
    }

    restoreProgram(index){
        let xml = Blockly.Xml.textToDom(this._userPrograms[index].program);
        Blockly.Xml.domToWorkspace(xml, DwenguinoBlockly.workspace);
    }

    deleteProgram(index){
        let self = this;

        let ajaxSettings = {
            type: "POST",
            url: ServerConfig.getServerUrl() + "/user/deleteProgram",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(this._userPrograms[index]),
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(response) {
            self.showUserPrograms();
        };

        function onFail(response, status) {
            if(ajaxSettings.retryLimit > 0){
                this.retryLimit--;
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"
                }).done(function(data){
                    $.ajax(ajaxSettings).done(onDone).fail(onFail);
                }).fail(function(response, status)  {
                    console.log(status);
                    console.warn('Failed to save program:', response);

                    self.showUserPrograms();
                });
            } 
        };  
    }
}