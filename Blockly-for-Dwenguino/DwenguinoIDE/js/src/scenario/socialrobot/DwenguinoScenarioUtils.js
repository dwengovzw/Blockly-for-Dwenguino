//import { DwenguinoBlockly } from "../../DwenguinoBlockly.js"

import FileIOController from "../../FileIoController.js";
import { EVENT_NAMES } from "../../logging/EventNames.js"
import { EventsEnum } from "./ScenarioEvent.js";
export { DwenguinoScenarioUtils }

/**
 * The different states robot components can be in. 
 * Not all states are supported for each robot component.
 */

class DwenguinoScenarioUtils{
    ioController = null;
    constructor(scenario, eventBus){
        this.scenario = scenario;
        this._eventBus = eventBus;
        this.ioController = new FileIOController();
    }

    /**
     * Clear all canvases in the simulator that are part
     * of the "sim_canvas" class.
     */
    saveScenario(data){
        console.log('save scenario');
        this.ioController.download("scenario.xml", data);
        //DwenguinoBlockly.download("scenario.xml", data);
        this.scenario.logger.recordEvent(this.scenario.logger.createEvent(EVENT_NAMES.downloadScenarioClicked, ""));
    }

    async loadScenario(){
        try{
            let xml = await this.ioController.uploadXml();
            this.scenario.xmlToRobot(xml);
            this._eventBus.dispatchEvent(EventsEnum.SAVE);

        }catch(err){
            console.error(err);
        }
    }

    textToDom(text){
        var oParser = new DOMParser();
        var dom = oParser.parseFromString(text, 'text/xml');
        // The DOM should have one and only one top-level node, an XML tag.
        if (!dom || !dom.firstChild ||
            dom.firstChild.nodeName.toLowerCase() != 'xml' ||
            dom.firstChild !== dom.lastChild) {
        // Whatever we got back from the parser is not XML.
        goog.asserts.fail('Blockly.Xml.textToDom did not obtain a valid XML tree.');
        }
        return dom.firstChild;
    }
}

