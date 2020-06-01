import {ScenarioEvent} from './ScenarioEvent.js'
export { EventBus }

class EventBus {
    constructor(){
        this.events = {};
    }

    registerEvent(eventName){
        let event = new ScenarioEvent(eventName);
        this.events[eventName] = event;
    };
    
    dispatchEvent(eventName, eventArgs){
        this.events[eventName].callbacks.forEach(callback => {
            callback(eventArgs);
        });
    };
    
    addEventListener(eventName, callback){
        this.events[eventName].registerCallback(callback);
    };
}