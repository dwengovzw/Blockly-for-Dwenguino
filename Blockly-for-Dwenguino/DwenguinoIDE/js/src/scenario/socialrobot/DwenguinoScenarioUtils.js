//import { DwenguinoBlockly } from "../../DwenguinoBlockly.js"

import FileIOController from "../../FileIoController.js";
import { EVENT_NAMES } from "../../logging/EventNames.js"
import { EventsEnum } from "./ScenarioEvent.js";

export { StatesEnum, DwenguinoScenarioUtils }

/**
 * The different states robot components can be in. 
 * Not all states are supported for each robot component.
 */
const StatesEnum = {
    PLAIN: 'plain', 
    EYE: 'eye', 
    MOUTH: 'mouth',
    RIGHTHAND: 'righthand',
    LEFTHAND: 'lefthand'
  };
Object.freeze(StatesEnum);

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

    contextMenuServo(){
        var self = this;
        $(function(){
            $.contextMenu({
                selector: '.sim_element_servo',
                trigger: 'right', 
                callback: function(itemKey, opt, e) {
                    var m = "global: " + itemKey;
                    window.console && console.log(m) || alert(m); 
                },
                items: {
                    "plain": {
                        name: MSG.socialrobot['plain'],
                        callback: function(itemKey, opt, e) {
                            var simServoId = this.attr('id');
                            var i = simServoId.replace(/\D/g,'');
                            self.scenario.setServoState(i, StatesEnum.PLAIN);
                        }
                    },
                    "eye": {
                        name: MSG.socialrobot['eye'], 
                        callback: function(itemKey, opt, e) {
                            var simServoId = this.attr('id');
                            var i = simServoId.replace(/\D/g,'');
                            self.scenario.setServoState(i, StatesEnum.EYE);
                        }
                    },
                    // "mouth": {name: MSG.socialrobot['mouth'],},
                    "righthand": {
                        name: MSG.socialrobot['righthand'],
                        callback: function(itemKey, opt, e) {
                            var simServoId = this.attr('id');
                            var i = simServoId.replace(/\D/g,'');
                            self.scenario.setServoState(i, StatesEnum.RIGHTHAND);
                        }
                    },
                    "lefthand": {
                        name: MSG.socialrobot['lefthand'],
                        callback: function(itemKey, opt, e) {
                            var simServoId = this.attr('id');
                            var i = simServoId.replace(/\D/g,'');
                            self.scenario.setServoState(i, StatesEnum.LEFTHAND);
                        }
                    }//,
                    //"sep1": "---------",
                    //"quit": {name: "Quit"}
                }
            });
        });  
    }

    contextMenuLed(){
        var self = this;
        $(function(){
            $.contextMenu.types.label = function(item, opt, root) {
                // this === item.$node
                $('<span>Color<ul>'
                    + '<li class="label1" title="yellow">yellow'
                    + '<li class="label2" title="red">red'
                    + '<li class="label3" title="blue">blue'
                    + '<li class="label4" title="green">#72f542' +'</ul></span>')
                    .appendTo(this)
                    .on('click', 'li', function() {
                        root.$menu.trigger('contextmenu:hide');
                    });
        
                this.addClass('labels').on('contextmenu:focus', function(e) {

                }).on('contextmenu:blur', function(e) {
    
                }).on('keydown', function(e) {

                });
            };
        
            /**************************************************
             * Context-Menu with custom command "label"
             **************************************************/
            $.contextMenu({
                selector: '.sim_element_led', 
                callback: function(itemKey, opt, rootMenu, originalEvent) {
                },
                items: {
                    label: {
                        type: "label", 
                        customName: "Color",
                        
                        callback: function(itemKey, opt, e) {
                            var simLedId = this.attr('id');
                            var i = simLedId.replace(/\D/g,'');
                            var color = $(e.target).text(); 
                            self.scenario.setLedColor(i, color);
                        }
                    }
                }
            });
        });

    }
}

