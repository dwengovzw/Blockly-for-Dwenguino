/**
 * @jest-environment jsdom
 */

import {afterEach, afterAll, beforeEach, expect, jest, test, describe, beforeAll} from '@jest/globals'
import { EventBus } from "../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/socialrobot/event_bus.js"
import { RobotComponentsFactory, TypesEnum } from "../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/scenario/socialrobot/robot_components_factory.js"
import { MSG } from "./mocks/msg.mock.js"
import { MSG_FALLBACK } from "./mocks/fallback_msg.mock.js"
import DwenguinoBlocklyLanguageSettings from "./mocks/language_select.mock.js"


const timeout = 5000;

jest.setTimeout(900000) // 15m

describe(
    "Integration tests for adding and removing social robot components",
    () =>{
        let scenarioUtils = null;
        let logger = null;//.mock("../../../Blockly-for-Dwenguino/DwenguinoIDE/js/src/logging/dwenguino_event_logger.js");
        let eventBus = new EventBus();
        let robotComponentsFactory = null;
        beforeAll(()=>{
            global.DwenguinoBlocklyLanguageSettings = DwenguinoBlocklyLanguageSettings;
            global.MSG = MSG;
            global.MSG_FALLBACK = MSG_FALLBACK; 
            global.settings = {
                basepath: "localhost:12032/simulator"
            }
        });
        beforeEach(() => {
            let mockLogger = jest.fn().mockImplementation(() => {
                return {
                    init: () => console.log("Init eventlogger"),
                    createNewSessionId: function(){this.sessionId = "RANDOMTESTID"}, 
                    createEvent: function(eventName, data, difficultyLevel = 0, simulatorState = -1){
                        return {
                            "timestamp": Date.now(),
                            "eventName": "testEvent",
                            "sessionId": this.sessionId,
                            "simulatorState": simulatorState,
                            "selectedDifficulty": difficultyLevel,
                            "activeTutorial": "",
                            "computerId": 0,
                            "workshopId": 0,
                            "data": JSON.stringify(data)
                        };
                    },
                    recordEvent: (eventToRecord) => console.log(eventToRecord)
                }
            })
            logger = new mockLogger()
            robotComponentsFactory = new RobotComponentsFactory(scenarioUtils, logger, eventBus);
        });
        it("Add 1 sonar", () => {
            // Mock sensor_options container
            document.body.innerHTML =
            '<div id="sensor_options">' +
            '</div>';
            robotComponentsFactory.addRobotComponent(TypesEnum.SONAR);
            let sonar = robotComponentsFactory.getRobot()[0];
            expect(sonar.getPin("triggerPin")).toBe("SONAR_1_TRIG");
            expect(sonar.getPin("echoPin")).toBe("SONAR_1_ECHO");
        })
    }
)