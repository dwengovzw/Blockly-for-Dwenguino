import { IDwenguinoEventLogger } from "./i_dwenguino_event_logger.js";

class DummyDwenguinoEventLogger extends IDwenguinoEventLogger {
    sessionId = 0
    tutorialId = 0
    tutialIdSetting = ""
    computerId = "-1"
    workshopId = "-1"
    constructor() {
        super()
        this.log = [];
    }

    init() {
        // Do nothing
    }

    createNewSessionId() {
        // Do nothing
    }

    createEvent(eventName, data, difficultyLevel = 0, simulatorState = -1) {
        return {}
    }


    recordEvent(event) {
        // Do nothing
    }
}

export { DummyDwenguinoEventLogger }