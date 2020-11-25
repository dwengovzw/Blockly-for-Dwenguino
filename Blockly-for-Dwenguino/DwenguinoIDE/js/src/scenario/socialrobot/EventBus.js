import {ScenarioEvent} from './ScenarioEvent.js'
export { EventBus }

/**
 * 
 */
class EventBus {
    constructor(){
        this.events = {};
    }

    /**
     * 
     * @param {string} eventName 
     */
    registerEvent(eventName){
        let event = new ScenarioEvent(eventName);
        this.events[eventName] = event;
    };
    
    /**
     * 
     * @param {string} eventName 
     * @param {Object} eventArgs 
     */
    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(callback => {
            callback(eventArgs);
        });
    };
    
    /**
     * 
     * @param {string} eventName 
     * @param {function} callback 
     */
    addEventListener(eventName, callback){
        this.events[eventName].registerCallback(callback);
    };
}