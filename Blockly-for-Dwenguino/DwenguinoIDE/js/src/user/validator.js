export { Validator } 

class Validator{

    constructor(){

    }

    static validateSchool(school){
        if(school !== ""){
            return null;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errSchool']));
        }
    }
    
    static validateId(id){
        for(let k = 0; k < 4; k++){
            if(id[k] == null){
                return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errId']));
    
            }
        }
        return null;
    }

    static validateFirstname(firstname){
        if(firstname == ""){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errFirstname']));
        }
    }

    static validateSecretCode(secretCode){
        if(secretCode == ""){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errSecretCode']));
        }
    }

    static validatePassword(password, email){
        if(password == ""){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPassword']));
        }
    }

    static validatePassword(password, email){
        if(password == ""){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPasswordRequirements']));
        }

        if (password.includes(email)) {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPasswordRequirements']));
        }

        if (password.length < 8){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPasswordRequirements']));
        }

        var matchedCase = new Array();
        matchedCase.push("[$@$!%*#?&]"); // Special Charector
        matchedCase.push("[A-Z]"); // Uppercase Alpabates
        matchedCase.push("[0-9]"); // Numbers
        matchedCase.push("[a-z]"); // Lowercase Alphabates
      
        // Check the conditions
        var conditionsValidated = 0;
        for (var i = 0; i < matchedCase.length; i++) {
          if (new RegExp(matchedCase[i]).test(password)) {
            conditionsValidated++;
          }
        }

        if(!(conditionsValidated == 4)){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPasswordRequirements']));
        }
    }

    static validatePasswords(password, repeated_password){
        if(password != repeated_password){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errPasswordNotIdentical']));
        }
    }

    static validateEmail(email){
        if(email == ""){
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errEmail']))
        }
    }
    
    static validateAgeGroup(ageGroup){
        if(typeof ageGroup !== 'undefined'){
            return null;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errAgeGroup']));
        }
    };
    
    
    static validateGender(gender){
        if(typeof gender !== 'undefined'){
            return null;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errGender']));
        }
    }
    
    static validateActivityId(activityId){
        if(activityId !== ""){
            return null;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errActivityId']));
        }
    };

    static validateAcceptConditions(acceptConditions) {
        if(acceptConditions[0].checked){
            return;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errAcceptConditions']));
        }
    }

    static validateResearchConditions(researchConditions) {
        if(researchConditions[0].checked){
            return;
        } else {
            return new Error(DwenguinoBlocklyLanguageSettings.translateFrom('validator', ['errAcceptResearch']));
        }
    }
    
    static hasErrors(errors){
        var arrayLength = errors.length;
        for (var i = 0; i < arrayLength; i++) {
            if(errors[i] != null){
                return true;
            }
        }
        return false;
    }
}

export default Validator;