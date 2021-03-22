/**
 *
 */
class CookiesInformation {

    constructor(){
        this.initCookiesInformation();
    }

    /**
     * Initialize
     */
    initCookiesInformation(){
        $("#cookie-info").click(() => {
            this.loadCookiesInformationDialog();
            this.addCookiesInformationDialogEventHandlers();
            this.showCookiesInformationDialog();
        });
    }

    /**
     * 
     */
    loadCookiesInformationDialog(){
        $("#cookiesModal .modal-header").text(DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whatAreCookiesTitle']));
        let closeButton = '<button type="button" class="close" data-dismiss="modal" aria-label="'+DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['close'])+'"><span aria-hidden="true">&times;</span></button>';
        $("#cookiesModal .modal-header").append(closeButton);
        $("#cookiesModal .modal-body .message").empty();
        $("#cookiesModal .modal-body .message").append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whatAreCookiesDescription1'])+'</p>');
        $("#cookiesModal .modal-body .message").append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whatAreCookiesDescription2'])+'</p>');
        $("#cookiesModal .modal-body .message").append('<h2>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whatAreNecessaryCookiesTitle'])+'</h2>');
        $("#cookiesModal .modal-body .message").append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whatAreNecessaryCookiesDescription'])+'</p>');
        $("#cookiesModal .modal-body .message").append('<h2>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['whichCookiesTitle'])+'</h2>');
        $("#cookiesModal .modal-body .message").append('<h3>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['dwengoCookieTitle'])+'</h3>');
        $("#cookiesModal .modal-body .message").append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['dwengoCookieDescription'])+'</p>');
        $("#cookiesModal .modal-body .message").append('<h3>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['jenkinsCookieTitle'])+'</h3>');
        $("#cookiesModal .modal-body .message").append('<p>'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['jenkinsCookieDescription'])+'</p>');
        
        $("#cookiesModal .modal-footer").empty();
        $("#cookiesModal .modal-footer").append('<button id="close_tutorial_dialog" type="button" class="btn btn-default" data-dismiss="modal">'+ DwenguinoBlocklyLanguageSettings.translateFrom('cookieConsent',['close']) +'</button>');
    }

    /**
     * Adds event handlers
     */
    addCookiesInformationDialogEventHandlers(){
        $('.close').click(() => {
            this.hideTutorialDialog();
        });
    }

    /**
     * 
     */
    showCookiesInformationDialog(){
        $("#cookiesModal").modal('show');
    }

    /**
     * 
     */
    hideCookiesInformationDialog(){
        $('#cookiesModal').modal("hide");
    }
}

export default CookiesInformation;