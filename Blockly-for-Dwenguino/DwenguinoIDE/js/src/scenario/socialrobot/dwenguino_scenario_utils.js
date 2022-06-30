import FileIOController from "../../utils/file_io_controller.js"
import { EVENT_NAMES } from "../../logging/event_names.js"
import { EventsEnum } from "./scenario_event.js";
export { DwenguinoScenarioUtils }

/**
 * This class is responsible to download or upload the current social robot scenario components configuration
 * to disk as an XML file. 
 */
class DwenguinoScenarioUtils{
    ioController = null;

    /**
     * @constructs
     * @param {Object} scenario - The social robot scenario from which the XML file is composed or uploaded to.
     * @param {Object} eventBus - The eventBus that can be used to monitor certain events in the simulator.
     */
    constructor(scenario, eventBus){
        this.scenario = scenario;
        this._eventBus = eventBus;
        this.ioController = new FileIOController();
    }

    /**
     * This function will download the XML file to the client and record a downloadScenario event.
     * @param {string} data - The XML data to be downloaded to the client.
     */
    saveScenario(data){
        console.log('save scenario');
        FileIOController.download("scenario.xml", data);
        let eventToRecord = this.scenario.logger.createEvent(EVENT_NAMES.downloadScenarioClicked, "");
        this.scenario.logger.recordEvent(eventToRecord);
    }

    /**
     * This function loads the XML file selected by the client and converts it to 
     * social robot components in the social robot scenario. It also dispatches a 
     * save event to save the current scenario state to local storage.
     * @async
     */
    async loadScenario(){
        try {
            let xml = await FileIOController.uploadTextFile();
            this.scenario.xmlToRobot(xml);
            this._eventBus.dispatchEvent(EventsEnum.SAVE);

        } catch(err){
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

export default DwenguinoScenarioUtils;