export { Validator } 

class Validator{

    constructor(){

    }

    static validateUserFields(firstname, email, password, repeated_password, role, accept_conditions, accept_research){
        let errors = [];

        if (!firstname || !email || !password || !role || !accept_conditions || !accept_research ) {
            errors.push({msg: "errRequiredFields"});
        }

        if( role !== 'student' && role !== 'teacher' ){
            errors.push({msg: "errRoleInvalid"});
        }

        if( accept_conditions !== true ){
            errors.push({msg: "errAcceptconditions"});
        }

        if( accept_research !== true ){
            errors.push({msg: "errResearchConditions"});
        }

        if( Validator.validateFirstname(firstname) ){
            errors.push({msg: Validator.validateFirstname(firstname)});
        }

        if( Validator.validatePassword(password) ){
            errors.push({msg: Validator.validatePassword(password)});
        }

        if( Validator.validatePassword(password, email) ){
            errors.push({msg: Validator.validatePassword(password, email)});
        }

        if( Validator.validatePasswords(password, repeated_password) ){
            errors.push({msg: Validator.validatePassword(password, repeated_password)});
        }

        if( Validator.validateEmail(email) ){
            errors.push({msg: Validator.validateEmail(email)});
        }

        return errors;
    }


    static validateFirstname(firstname){
        if(firstname == ""){
            return 'errFirstname';
        } else {
            return false;
        }
    }

    static validatePassword(password){
        if(password == ""){
            'errPassword';
        } else {
            return false;
        }
    }

    static validatePassword(password, email){
        if(password == ""){
            return 'errPasswordRequirements';
        }

        if (password.includes(email)) {
            return 'errPasswordRequirements';
        }

        if (password.length < 8){
            return 'errPasswordRequirements';
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
            return 'errPasswordRequirements';
        }

        return false;
    }

    static validatePasswords(password, repeated_password){
        if(password != repeated_password){
            return 'errPasswordNotIdentical';
        } else {
            return false;
        }
    }

    static validateEmail(email){
        if(email == ""){
            return 'errEmail';
        } else {
            return false;
        }
    }
}

export default Validator;