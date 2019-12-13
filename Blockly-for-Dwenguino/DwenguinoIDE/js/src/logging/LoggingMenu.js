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
    $('#loggingModalHeader').append('<h4 class="modal-title">Test setup</h4>');

    $('#loggingModalBody').append('<p id="loggingModalBody1"></p>');
    $('#loggingModalBody1').append('<h4>Age group:</h4>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p1">Primary 1</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p2">Primary 2</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p3">Primary 3</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p4">Primary 4</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p5">Primary 5</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="p6">Primary 6</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s1">Secondary 1</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s2">Secondary 2</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s3">Secondary 3</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s4">Secondary 4</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s5">Secondary 5</label>');
    $('#loggingModalBody1').append('<label class="radio-inline"><input type="radio" name="agegroupRadio" value="s6">Secondary 6</label>');

    $('#loggingModalBody').append('<p id="loggingModalBody2"></p>');
    $('#loggingModalBody2').append('<h4>Gender:</h4>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="f">Female</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="m">Male</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="x">X</label>');
    $('#loggingModalBody2').append('<label class="radio-inline"><input type="radio" name="genderRadio" value="na">I\'d rather not say</label>');

    $('#loggingModalBody').append('<p id="loggingModalBody3">');
    $('#loggingModalBody3').append('<h4>Activity:</h4>');
    $('#loggingModalBody3').append('<div id="loggingModalFormGroup" class="form-group"></div>');
    $('#loggingModalFormGroup').append(' <label for="activity_identifier">Name:</label>');
    $('#loggingModalFormGroup').append('<input type="text" class="form-control" id="activity_identifier">');
    $('#loggingModalFormGroup').append('<label for="activity_date">Date:</label>');
    $('#loggingModalFormGroup').append('<input type="date" class="form-control" id="activity_date">');

    $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default" data-dismiss="modal">Ok</button>');
}

/**
 * Show the menu on the screen
 */
LoggingMenu.prototype.showMenu = function(){
    $("#loggingModal").modal('show');
}