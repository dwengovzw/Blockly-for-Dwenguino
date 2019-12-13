/**
 * This class builds and displays the logging menu on the screen.
 * It is used by the DwenguinoEventLogger to gather data about the user.
 * 
 */
function LoggingMenu() {
    // Make sure there is no duplicate logging menu
    $('div').remove('#loggingModal');

    $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
    $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');

    $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');

    $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
    $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
    $('#loggingModalContent').append('<div id="loggingModalFooter" class="modal-footer"></div>');

    $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    $('#loggingModalHeader').append('<h4 class="modal-title">'+MSG.logging['setup']+'</h4>');

    $('#loggingModalBody').append('<p id="loggingModalBody1"></p>');
    $('#loggingModalBody1').append('<h4>'+MSG.logging['agegroup']+'</h4>');
    $('#loggingModalBody1').append('<div id="loggingModalBodyCol1" class="col-md-6"></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p1">'+MSG.logging['primary1']+'</label></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p2">'+MSG.logging['primary2']+'</label></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p3">'+MSG.logging['primary3']+'</label></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p4">'+MSG.logging['primary4']+'</label></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p5">'+MSG.logging['primary5']+'</label></div>');
    $('#loggingModalBodyCol1').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="p6">'+MSG.logging['primary6']+'</label></div>');
    $('#loggingModalBody1').append('<div id="loggingModalBodyCol2" class="col-md-6"></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s1">'+MSG.logging['secondary1']+'</label></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s2">'+MSG.logging['secondary2']+'</label></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s3">'+MSG.logging['secondary3']+'</label></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s4">'+MSG.logging['secondary4']+'</label></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s5">'+MSG.logging['secondary5']+'</label></div>');
    $('#loggingModalBodyCol2').append('<div class="row"><label class="radio-inline"><input type="radio" name="agegroupRadio" value="s6">'+MSG.logging['secondary6']+'</label></div>');

    $('#loggingModalBody').append('<p id="loggingModalBody2" class="pt-1"></p>');
    $('#loggingModalBody2').append('<h4>'+MSG.logging['gender']+'</h4>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="f">'+MSG.logging['gender1']+'</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="m">'+MSG.logging['gender2']+'</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="x">'+MSG.logging['gender3']+'</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="na">'+MSG.logging['gender4']+'</label>');

    $('#loggingModalBody').append('<p id="loggingModalBody3">');
    $('#loggingModalBody3').append('<h4>'+MSG.logging['activity']+'</h4>');
    $('#loggingModalBody3').append('<div id="loggingModalFormGroup" class="form-group"></div>');
    $('#loggingModalFormGroup').append(' <label for="activity_identifier">'+MSG.logging['name']+'</label>');
    $('#loggingModalFormGroup').append('<input type="text" class="form-control" id="activity_identifier">');
    $('#loggingModalFormGroup').append('<label for="activity_date">'+MSG.logging['date']+'</label>');
    $('#loggingModalFormGroup').append('<input type="date" class="form-control" id="activity_date">');

    $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">'+MSG.logging['ok']+'</button>');
}

/**
 * Show the menu on the screen
 */
LoggingMenu.prototype.showMenu = function(){
    $("#loggingModal").modal('show');
}