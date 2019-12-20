/**
 * This class builds and displays the logging menu on the screen.
 * It is used by the DwenguinoEventLogger to gather data about the user.
 * 
 */
function LoggingMenu() {
    this.currentlySelectedIcons= [null,null,null,null];
    this.SIZE = 4;
    this.icons = [
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
    this.schools = null;
    this.validator = new Validator();
    this.createLoggingModalDialogWithoutFooter(MSG.logging['login']);

    $('#loggingModalBody').append('<p id="loggingModalBody1"></p>')
    $("#loggingModalBody").append('<div id="authentication_menu" class="tutorial_categories_wrapper"></div>');

    $("#authentication_menu").append('<div id="authentication_new_user" class="tutorial_categories_item card"></div>');
    $("#authentication_new_user").append('<div class="category_tag">'+ MSG.logging['newuser'] +'</div>');
    $("#authentication_new_user").append('<div id="new_user_img"></div>');

    $("#authentication_menu").append('<div id="authentication_existing_user" class="tutorial_categories_item card"></div>');
    $("#authentication_existing_user").append('<div class="category_tag">'+ MSG.logging['login'] +'</div>');
    $("#authentication_existing_user").append('<div id="school_user_img"></div>');
}

/**
 * Show the menu on the screen
 */
LoggingMenu.prototype.showMenu = function(){
    $("#loggingModal").modal('show');

    var self = this;
    $("#authentication_new_user").click(function(){
        $('.modal-backdrop').remove();
        self.createIdMenu();
        self.showIdMenu();
    });

    $("#authentication_existing_user").click(function(){
        $('.modal-backdrop').remove();
        self.createLoginMenu();
        self.showLoginMenu();
    });
}

LoggingMenu.prototype.createLoginMenu = function(){
    var self = this;
        this.createLoggingModalDialog(MSG.logging['login']);
        $('#loggingModalBody').append('<div id="inputUsername" class="ui-widget row mb-4">');
        $('#inputUsername').append('<label for="myusernametag" class="col-md-2">Username </label>');
        $('#inputUsername').append('<input id="myusernametag" name="myusernametag" class="col-md-8" placeholder="Enter username">');

        $('#loggingModalBody').append('<div class="row"><div class="col-md-12 mt-4"><b>Select your 4 personal icons</b></div></div>');
        $('#loggingModalBody').append('<div class="row"><div class="col-md-3 mt-4 mb-4">Currently selected:</div><div class="col-md-8 mt-4 mb-4"><div id="currentlySelected" class="row"></div></div>');

        $('#currentlySelected').append('<div id="currentlySelected0" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected1" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected2" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected3" class="col-2"></div>');

        this.createIdGrid();

        $('#loggingModalBody').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
        
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');
        this.showLoginMenu();

        for(let i=1; i<5; i++){
            for(let j=1; j<5; j++){
                $("#r" + i +"c" + j).click(function(){
                    self.addIconToId(i,j);
                });    
            }
        }

        $("#reset_modal_dialog_button").click(function(){
            self.resetId();
        });

        $("#submit_modal_dialog_button").click(function(){
            var errors = [];
            let username = $( "input[name=myusernametag]").val();
            console.log(username);
            console.log(self.currentlySelectedIcons);
            errors.push(self.validator.validateId(self.currentlySelectedIcons));

            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                var serverSubmission = {
                    "userId": username,
                    "password": JSON.stringify(self.currentlySelectedIcons)
                };

                $.ajax({
                    type: "POST",
                    url: window.serverUrl + "/authentication/authenticate",
                    data: serverSubmission,
                }).done(function(data){
                    DwenguinoEventLogger.setUserId(self.currentlySelectedIcons);
                    $('div').remove('#loggingModal');
                    $('.modal-backdrop').remove();
                    self.showSettingsMenu();
                    console.debug('Registered', data);
                }).fail(function(response, status)  {
                    console.warn('Failed to login:', status);
                });
            }
        });
};

LoggingMenu.prototype.showLoginMenu = function(){
    $("#loggingModal").modal('show');
}

LoggingMenu.prototype.createIdMenu = function(){
    var self = this;
    $.ajax({
        type: "GET",
        url: window.serverUrl + "/schools/"}
    ).done(function(data){
        self.schools = data;
        self.createLoggingModalDialog(MSG.logging['newuser']);

        $('#loggingModalBody').append('<div id="inputUsername" class="ui-widget row mb-4">');
        $('#inputUsername').append('<label for="myusernametag" class="col-md-2">Username </label>');
        $('#inputUsername').append('<input id="myusernametag" name="myusernametag" class="col-md-8" placeholder="Choose a username">');

        $('#loggingModalBody').append('<div class="row"><div class="col-md-12 mt-4"><b>Select your 4 personal icons</b></div></div>');
        $('#loggingModalBody').append('<div class="row"><div class="col-md-3 mt-4 mb-4">Currently selected:</div><div class="col-md-8 mt-4 mb-4"><div id="currentlySelected" class="row"></div></div>');

        $('#currentlySelected').append('<div id="currentlySelected0" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected1" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected2" class="col-2"></div>');
        $('#currentlySelected').append('<div id="currentlySelected3" class="col-2"></div>');

        self.createIdGrid();

        $('#loggingModalBody').append('<button id="reset_modal_dialog_button" type="button" class="btn btn-default mt-4">'+MSG.logging['reset']+'</button>');   
        
        $('#loggingModalFooter').append('<button id="submit_modal_dialog_button" type="button" class="btn btn-default">'+MSG.logging['ok']+'</button>');
        self.showIdMenu();

        for(let i=1; i<5; i++){
            for(let j=1; j<5; j++){
                $("#r" + i +"c" + j).click(function(){
                    self.addIconToId(i,j);
                });    
            }
        }

        $("#reset_modal_dialog_button").click(function(){
            self.resetId();
        });

        $("#submit_modal_dialog_button").click(function(){
            var errors = [];
            let username = $( "input[name=myusernametag]").val();
            console.log(username);
            errors.push(self.validator.validateId(self.currentlySelectedIcons));

            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                var serverSubmission = {
                    "userId": username,
                    "password": JSON.stringify(self.currentlySelectedIcons)
                };

                $.ajax({
                    type: "POST",
                    url: window.serverUrl + "/authentication/new",
                    data: serverSubmission,
                }).done(function(data){
                    DwenguinoEventLogger.setUserId(username);
                    $('div').remove('#loggingModal');
                    $('.modal-backdrop').remove();
                    self.showSettingsMenu();
                    console.debug('Registered', data);
                }).fail(function(response, status)  {
                    console.warn('Failed to register:', status);
                });
            }
        });

    }).fail(function(response, status)  {
        console.warn('Failed to fetch schools:', status);
    });
}

LoggingMenu.prototype.resetId = function(){
    for(let k = 0; k < 4; k++){
        this.currentlySelectedIcons[k] = null;
        $('#currentlySelected'+k).html("");
    }
}

LoggingMenu.prototype.addIconToId = function(i,j){
    for(let k = 0; k < 4; k++){
        if(this.currentlySelectedIcons[k] == null){
            let n = ((i-1)*4)+j;
            let icon = this.icons[n-1];
            this.currentlySelectedIcons[k] = icon.id;
            $('#currentlySelected'+k).html(icon.name + '<p>' + icon.html + '</p>');
            break;
        }
    }
}

LoggingMenu.prototype.createIdGrid = function(){
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

LoggingMenu.prototype.showIdMenu = function(){
    $("#loggingModal").modal('show');
}

/**
 * Show the menu on the screen
 */
LoggingMenu.prototype.showSettingsMenu = function(){
    var self = this;
    $.ajax({
        type: "GET",
        url: window.serverUrl + "/schools/"}
    ).done(function(data){
        self.schools = data;
        self.createLoggingModalDialog(MSG.logging['setup']);

        $('#loggingModalBody').append('<div id="inputSchool" class="ui-widget row mb-4">');
        $('#inputSchool').append('<label for="myschooltags" class="col-md-2">School </label>');
        $('#inputSchool').append('<input id="myschooltags" name="myschooltags" class="col-md-8" placeholder="Zoek op naam van de school...">');

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

        // Set date to today
        var db_now = new Date();
        var db_day = ("0" + db_now.getDate()).slice(-2);
        var db_month = ("0" + (db_now.getMonth() + 1)).slice(-2);
        var db_today = db_now.getFullYear()+"-"+(db_month)+"-"+(db_day) ;
        $('#activity_date').val(db_today);

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
                for (i=0; i<choices.length; i++)
                    if (~choices[i]['naam'].toLowerCase().indexOf(term)) matches.push(choices[i]['naam']+ ", " + choices[i]['gemeente']);
                suggest(matches);
            }
        });

        $("#submit_modal_dialog_button").click(function(){

            var errors = [];
            let school = $( "input[name=myschooltags]" ).val();
            let ageGroup = $("input[name=agegroupRadio]:checked").val();
            let gender = $("input[name=genderRadio]:checked").val();
            let activityId = $("#activity_identifier").val();
            let activityDate = $("#activity_date").val();

            // TODO validate settings on server side

            errors.push(self.validator.validateSchool(school));
            errors.push(self.validator.validateAgeGroup(ageGroup));
            errors.push(self.validator.validateGender(gender));
            errors.push(self.validator.validateActivityId(activityId));

            if(self.validator.hasErrors(errors)){
                self.showErrors(errors);
            } else {
                DwenguinoEventLogger.setSchool(school);
                DwenguinoEventLogger.setAgegroup(ageGroup);
                DwenguinoEventLogger.setGender(gender);
                DwenguinoEventLogger.setActivityId(activityId);
                DwenguinoEventLogger.setActivityDate(activityDate);
                $('div').remove('#loggingModal');
                $('.modal-backdrop').remove();

                console.log("[act;" + (DwenguinoEventLogger.agegroupSetting || "")
                                + ";" + (DwenguinoEventLogger.activityIdSetting || "")
                                + ";" + (DwenguinoEventLogger.activityDate || "") 
                                + ";" + (DwenguinoEventLogger.userId || "")
                                + ";" + (DwenguinoEventLogger.school || "")
                                + "]");
            }
        });

    }).fail(function(response, status)  {
        console.warn('Failed to fetch schools:', status);
    });
}

LoggingMenu.prototype.loadInitialMenu = function(){

}

LoggingMenu.prototype.createLoggingModalDialog = function(headerTitle){
    // Make sure there is no duplicate logging menu
    $('div').remove('#loggingModal');

    $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
    $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');

    $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');

    $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
    $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');
    $('#loggingModalContent').append('<div id="loggingModalFooter" class="modal-footer"></div>');

    $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
}

LoggingMenu.prototype.createLoggingModalDialogWithoutFooter = function(headerTitle){
    // Make sure there is no duplicate logging menu
    $('div').remove('#loggingModal');

    $('#db_body').append('<div id="loggingModal" class="modal fade" role="dialog"></div>');
    $('#loggingModal').append('<div id="loggingModalDialog" class="modal-dialog"></div>');

    $('#loggingModalDialog').append('<div id="loggingModalContent" class="modal-content"></div>');

    $('#loggingModalContent').append('<div id="loggingModalHeader" class="modal-header"></div>');
    $('#loggingModalContent').append('<div id="loggingModalBody" class="modal-body"></div>');

    $('#loggingModalHeader').append('<button type="button" class="close" data-dismiss="modal">&times;</button>');
    $('#loggingModalHeader').append('<h4 class="modal-title">'+ headerTitle +'</h4>');
}

LoggingMenu.prototype.showErrors = function(errors){
    $('div').remove('#loggingModalErrors');
    $('#loggingModalBody').append('<div id="loggingModalErrors" class="mt-4"></div>');
    var arrayLength = errors.length;
    for (var i = 0; i < arrayLength; i++) {
        if(errors[i] != null){
            $('#loggingModalErrors').append('<p>' + errors[i].message + '</p>');
        }
    }
}