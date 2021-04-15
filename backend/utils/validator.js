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

    static validateLoggingFields(timestamp, eventName){
        let errors = [];

        if (!timestamp || !eventName ) {
            errors.push({msg: "errRequiredFields"});
        }
        console.log(eventName);

        const EVENT_NAMES = Object.freeze({
            downloadClicked: "downloadClicked",
            blocklyBlockCreate: "blocklyBlockCreate",
            blocklyBlockDelete: "blocklyBlockDelete",
            blocklyBlockMove: "blocklyBlockMove",
            blocklyVarCreate: "blocklyVarCreate",
            blocklyVarDelete: "blocklyVarDelete",
            blocklyVarRename: "blocklyVarRename",
            blocklyUI: "blocklyUI",
            blocklyChange: "blocklyChange",
            difficultyLevel: "setDifficultyLevel",
            undo: "undo",
            uploadClicked: "uploadClicked",
            simButtonStateClicked: "simButtonStateClicked",
            runClicked: "runClicked",
            changedWorkspace: "changedWorkspace",
            downloadScenarioClicked: "downloadScenarioClicked",
            moveRobotComponent: "moveRobotComponent",
            addRobotComponent: "addRobotComponent",
            removeRobotComponent: "removeRobotComponent",
            addRobotComponent: "addRobotComponent",
            changedScenario: "changedScenario",
            simStart: "simStart",
            simResume: "simResume",
            simPause: "simPause",
            simStopButtonClicked: "simStopButtonClicked",
            simStep: "simStep",
            simStop: "simStop",
            setSpeed: "setSpeed",
            startTutorial: "startTutorial",
            endTutorial: "endTutorial",
            tutorialNextStep: "tutorialNextStep", 
            tutorialPrevStep: "tutorialPrevStep",
        });

        if( !Object.values(EVENT_NAMES).includes(eventName) ){
            errors.push({msg: "errEventNameInvalid"});
        }

        return errors;
    }
}

export default Validator;