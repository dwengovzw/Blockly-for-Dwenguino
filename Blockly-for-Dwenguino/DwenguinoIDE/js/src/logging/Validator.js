export default class Validator{

    constructor(){

    }

    validateSchool(school){
        if(school !== ""){
            return null;
        } else {
            return new Error(MSG.validator['errSchool']);
        }
    }
    
    validateId(id){
        for(let k = 0; k < 4; k++){
            if(id[k] == null){
                return new Error(MSG.validator['errId']);
    
            }
        }
        return null;
    }
    
    validateAgeGroup(ageGroup){
        if(typeof ageGroup !== 'undefined'){
            return null;
        } else {
            return new Error(MSG.validator['errAgeGroup']);
        }
    };
    
    
    validateGender(gender){
        if(typeof gender !== 'undefined'){
            return null;
        } else {
            return new Error(MSG.validator['errGender']);
        }
    }
    
    validateActivityId(activityId){
        if(activityId !== ""){
            return null;
        } else {
            return new Error(MSG.validator['errActivityId']);
        }
    };
    
    hasErrors(errors){
        var arrayLength = errors.length;
        for (var i = 0; i < arrayLength; i++) {
            if(errors[i] != null){
                return true;
            }
        }
        return false;
    }
}