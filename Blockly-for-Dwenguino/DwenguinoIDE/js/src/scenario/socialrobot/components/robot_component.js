export { RobotComponent }

/**
 * RobotComponent is an abstract class representing a robot component in the simulation pane 
 * of the social robot scenario. 
 * 
 * All inheriting classes must provide an implementation for the following methods: 
 * toString, toggleVisiblity, reset, insertHtml, removeHtml and toXml.
 * 
 * @abstract
 */
class RobotComponent{
    constructor(eventBus, htmlClasses){
      this._eventBus = eventBus;
      this._htmlClasses = htmlClasses;
      
        if (this.toString === undefined) {
          throw new Error('You have to implement the method toString');
        }

        if (this.toggleVisibility === undefined) {
          throw new Error('You have to implement the method toggleVisibility');
        }

        if (this.reset === undefined) {
          throw new Error('You have to implement the method reset');
        }
     
        if (this.insertHtml === undefined) {
          throw new Error('You have to implement the method insertHtml to add the component to the simulation container');
        }

        if (this.removeHtml === undefined) {
          throw new Error('You have to implement the method removeHtml to remove the component from the simulation container');
        }

        if (this.toXml === undefined) {
          throw new Error('You have to implement the method toXml to save the robot component to an XML file');
        }
    }

    /**
     * Add a string containting a concatination of css classes to the robot component.
     * @param {string} htmlClasses 
     */
    setHtmlClasses(htmlClasses){
      this._htmlClasses = htmlClasses;
    }
    
    /**
     * @returns {string} a concatination of css classes of the robot component devided by spaces.
     */
    getHtmlClasses(){
      return this._htmlClasses;
    }
}