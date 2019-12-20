/**
 *  Validator to check various settings before they are configured 
 *  in the DwenguinoEventLogger and put into the database.
 *  
 */
function Validator() {
    
}

Validator.prototype.validateSchool = function(school){
    if(school !== ""){
        return null;
    } else {
        return new Error(MSG.validator['errSchool']);
    }
};

Validator.prototype.validateId = function(id){
    for(let k = 0; k < 4; k++){
        if(id[k] == null){
            return new Error(MSG.validator['errId']);

        }
    }
    return null;
};

Validator.prototype.validateAgeGroup = function(ageGroup){
    if(typeof ageGroup !== 'undefined'){
        return null;
    } else {
        return new Error(MSG.validator['errAgeGroup']);
    }
};


Validator.prototype.validateGender = function(gender){
    if(typeof gender !== 'undefined'){
        return null;
    } else {
        return new Error(MSG.validator['errGender']);
    }
};

Validator.prototype.validateActivityId = function(activityId){
    if(activityId !== ""){
        return null;
    } else {
        return new Error(MSG.validator['errActivityId']);
    }
};

Validator.prototype.hasErrors = function(errors){
    var arrayLength = errors.length;
    for (var i = 0; i < arrayLength; i++) {
        if(errors[i] != null){
            return true;
        }
    }
    return false;
}