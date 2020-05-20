export { EventsEnum, ScenarioEvent }

const EventsEnum = {
    SAVE: 'save'
  };
  Object.freeze(EventsEnum);

class ScenarioEvent{
    constructor(name){
        this.name = name;
        this.callbacks = [];
    }

    registerCallback(callback){
        this.callbacks.push(callback);
    }
}



