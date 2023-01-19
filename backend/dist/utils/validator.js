export { Validator };
class Validator {
    constructor() {
    }
    static validateLoggingFields(timestamp, eventName) {
        let errors = [];
        if (!timestamp || !eventName) {
            errors.push({ msg: "errRequiredFields" });
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
        if (!Object.values(EVENT_NAMES).includes(eventName)) {
            errors.push({ msg: "errEventNameInvalid" });
        }
        return errors;
    }
}
export default Validator;
//# sourceMappingURL=validator.js.map