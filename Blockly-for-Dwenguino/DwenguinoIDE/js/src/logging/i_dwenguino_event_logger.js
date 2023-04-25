class IDwenguinoEventLogger {
    constructor() {
        if (new.target === IDwenguinoEventLogger) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }
    init(){
        throw new TypeError("Do not call abstract method init from child.");
    }
    createNewSessionId(){
        throw new TypeError("Do not call abstract method createNewSessionId from child.");
    }
    createEvent(eventName, data, difficultyLevel = 0, simulatorState = -1){
        throw new TypeError("Do not call abstract method createEvent from child.");
    }
    recordEvent(event){
        throw new TypeError("Do not call abstract method recordEvent from child.");
    }
}

export { IDwenguinoEventLogger }