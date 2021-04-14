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

        LoggingModal.createLoggingModalDialog(DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['myPrograms']));

        $('#loggingModalBody').append('<div id="saveProgramsGrid" class="container"></div>');

        $('#saveProgramsGrid').append('<form id="saveProgram"></form>');

        $('#saveProgram').append('<div id="saveProgramHeader" class="ui-widget row row-header pt-2 pb-2 mt-2 mb-2"></div>');
        $('#saveProgramHeader').append('<div class="col-auto">'+DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['saveCurrentProgram'])+'</div>');

        $('#saveProgram').append('<div id="nameInput" class="ui-widget row mb-4"></div>');
        $('#nameInput').append('<label for="nameTag" class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging', ['programName'])+'</label>');
        $('#nameInput').append('<input id="nameTag" name="nameTag" class="col-md-4" placeholder="'+ 'myprogram' +'">');
        $('#nameInput').append('<button id="save_program_button" type="button" class="btn btn-info col-md-2">'+DwenguinoBlocklyLanguageSettings.translate(['save']) +'</button>');

        $("#save_program_button").click(function(){
            self.saveCurrentProgram();
        });

        $('#loggingModalBody').append('<div id="programsGrid" class="container"></div>');

        let ajaxSettings = {
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/programs",
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(userPrograms) {
            
            $('#programsGrid').append('<div id="programsRow" class="ui-widget row row-header pt-2 pb-2 mt-2 mb-2"></div>');
            $('#programsRow').append('<div class="col-md-5">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['programName']) +'</div>');
            $('#programsRow').append('<div class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translate(['delete']) +'</div>');
            $('#programsRow').append('<div class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translate(['restore']) +'</div>');
            $('#programsRow').append('<div class="col-md-1"><i class="fa fa-download"></i></div>');
            self._userPrograms = userPrograms;

            $.each(userPrograms, function(i, program){
                $('#programsGrid').append('<div id="programsRow'+i+'" class="ui-widget row row-striped pt-2 pb-2"></div>');
                $('#programsRow'+i).append('<div class="col-md-5"><i class="fa fa-edit pr-1"></i><div id="nameProgram'+i+'" contenteditable="true" class="nameProgram">'+ program.program_name +'</div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button class="btn btn-info" id="deleteProgram'+i+'">'+DwenguinoBlocklyLanguageSettings.translate(['delete'])+'</button></div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button  class="btn btn-info" id="restoreProgram'+i+'">'+DwenguinoBlocklyLanguageSettings.translate(['open'])+'</button></div>');                
                $('#programsRow'+i).append('<div class="col-md-1"><i id="downloadProgram'+i+'" class="fa fa-download button text-info"></i></div>');

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

                $("#editProgram"+i).on('click', function(event) {
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.editProgram(index);
                });

                $("#downloadProgram"+i).on('click', function(event){
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.downloadProgram(index);
                });

                $("#nameProgram"+i).on('keydown', function(event) {  
                    if(event.keyCode == 13)
                    {
                        let id = event.target.id
                        let index = id.replace(/\D/g,'');
                        let newName = $("#"+id).html();
                        self.updateProgramName(index, newName);
                        e.preventDefault();
                    }
                });

                $("#nameProgram"+i).on('blur', function(event) {  
                    let id = event.target.id
                    let index = id.replace(/\D/g,'');
                    let newName = $("#"+id).html();
                    self.updateProgramName(index, newName);
                    e.preventDefault();
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
                ajaxSettings.retryLimit--;
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

    updateUserPrograms(){
        let self = this;
        let ajaxSettings = {
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/programs",
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(userPrograms) {
            $('#programsGrid').empty();
            $('#programsGrid').append('<div id="programsRow" class="ui-widget row row-header pt-2 pb-2 mt-2 mb-2"></div>');
            $('#programsRow').append('<div class="col-md-5">'+ DwenguinoBlocklyLanguageSettings.translateFrom('logging',['programName']) +'</div>');
            $('#programsRow').append('<div class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translate(['delete']) +'</div>');
            $('#programsRow').append('<div class="col-md-3">'+ DwenguinoBlocklyLanguageSettings.translate(['restore']) +'</div>');
            $('#programsRow').append('<div class="col-md-1"><i class="fa fa-download"></i></div>');
            self._userPrograms = userPrograms;

            $.each(userPrograms, function(i, program){
                $('#programsGrid').append('<div id="programsRow'+i+'" class="ui-widget row row-striped pt-2 pb-2"></div>');
                $('#programsRow'+i).append('<div class="col-md-5"><i class="fa fa-edit pr-1"></i><div id="nameProgram'+i+'" contenteditable="true" class="nameProgram">'+ program.program_name +'</div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button id="deleteProgram'+i+'" class="btn btn-info">'+DwenguinoBlocklyLanguageSettings.translate(['delete'])+'</button></div>');
                $('#programsRow'+i).append('<div class="col-md-3"><button id="restoreProgram'+i+'"  class="btn btn-info">'+DwenguinoBlocklyLanguageSettings.translate(['open'])+'</button></div>');                
                $('#programsRow'+i).append('<div class="col-md-1"><i id="downloadProgram'+i+'" class="fa fa-download button text-info"></i></div>');

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

                $("#editProgram"+i).on('click', function(event) {
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.editProgram(index);
                });

                $("#downloadProgram"+i).on('click', function(event){
                    let id = event.target.id;
                    let index = id.replace(/\D/g,'');
                    self.downloadProgram(index);
                });

                $("#nameProgram"+i).on('keydown', function(event) {  
                    if(event.keyCode == 13)
                    {
                        let id = event.target.id
                        let index = id.replace(/\D/g,'');
                        let newName = $("#"+id).html();
                        self.updateProgramName(index, newName);
                        e.preventDefault();
                    }
                });

                $("#nameProgram"+i).on('blur', function(event) {  
                    let id = event.target.id
                    let index = id.replace(/\D/g,'');
                    let newName = $("#"+id).html();
                    self.updateProgramName(index, newName);
                    e.preventDefault();
                });

            });
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
                    console.warn('Failed to log in:', response);
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
                ajaxSettings.retryLimit--;
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
                ajaxSettings.retryLimit--;
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

    updateProgramName(index, name){
        let self = this;
        this._userPrograms[index].program_name = name;

        let ajaxSettings = {
            type: "POST",
            url: ServerConfig.getServerUrl() + "/user/updateProgramName",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(this._userPrograms[index]),
            retryLimit: 1
        };

        $.ajax(ajaxSettings).done(onDone).fail(onFail);
        
        function onDone(response) {
            self.updateUserPrograms();
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
                    console.warn('Failed to save program:', response);

                    self.updateUserPrograms();
                });
            } 
        };  
    }

    editProgram(index){

    }

    downloadProgram(index){
        let xml = Blockly.Xml.workspaceToDom(DwenguinoBlockly.workspace);
        let data = Blockly.Xml.domToText(xml);
          
        localStorage.workspaceXml = data;
        let program_name = this._userPrograms[index].program_name;
        let filename = program_name.replace(/[/\\?%*:|"<> ]/g, '_');  
        DwenguinoBlockly.download(filename + ".xml", data);
    }
}