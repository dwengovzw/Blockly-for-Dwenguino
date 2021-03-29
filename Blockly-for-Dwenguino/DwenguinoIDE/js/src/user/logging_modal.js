export { LoggingModal }

class LoggingModal {
    constructor(){
    }

    static showDialog(){
        $("#loggingModal").modal('show');
    }
    
    static removeDialog(){
        $('div').remove('#loggingModal');
        $('.modal-backdrop').remove();
    }

    static createLoggingModalDialog(headerTitle){
        // Make sure there is no duplicate logging menu
        LoggingModal.removeDialog();
    
        $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
        $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');
    
        $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');
    
        $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
        $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
        $('#loggingModalContent').append('<div id="loggingModalFooter" class="modal-footer"></div>');
    
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    }

    static createLoggingModalDialogWithoutFooter(headerTitle){
        // Make sure there is no duplicate logging menu
        LoggingModal.removeDialog();
    
        $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
        $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');
    
        $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');
    
        $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
        $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
    
        $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
        $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    }

    static showErrors(errors){
        $('div').remove('#loggingModalErrors');
        $('#loggingModalBody').append('<div id="loggingModalErrors" class="mt-4"></div>');
        
        if(errors.length > 0){
            const seen = new Set();

            const filteredErrors = errors.filter(el => {
                if(el !== undefined) {
                    const duplicate = seen.has(el.message);
                    seen.add(el.message);
                    return !duplicate;
                } else {
                    return true;
                }
            });
        
            filteredErrors.forEach(function(error){
                if(error != null){
                    $('#loggingModalErrors').append('<p>' + error.message + '</p>');
                }
            });
        }
    }
} export default LoggingModal;