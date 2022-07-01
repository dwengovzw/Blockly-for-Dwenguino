import BindMethods from "../../../utils/bindmethods.js"
export { AbstractRobotComponent }

/**
 * RobotComponent is an abstract class representing a robot component in the simulation pane 
 * of the social robot scenario. 
 * 
 * All inheriting classes must provide an implementation for the following methods: 
 * toString, toggleVisiblity, reset, insertHtml, removeHtml, initComponentFromXml, and toXml.
 * 
 * @abstract
 */

class AbstractRobotComponent{
    _isSimulationRunning = true;
    constructor(){};


    initComponent(eventBus, htmlClasses) {
      BindMethods(this);
      this._eventBus = eventBus;
      this._htmlClasses = htmlClasses;
    }

    initComponentFromXml(eventBus){
      this._eventBus = eventBus;
    }

    /**
     * Add a string containting a concatination of css classes to the robot component.
     * @param {string} htmlClasses 
     */
    setHtmlClasses(htmlClasses) {
      this._htmlClasses = htmlClasses;
    }
    
    /**
     * @returns {string} a concatination of css classes of the robot component devided by spaces.
     */
    getHtmlClasses() {
      return this._htmlClasses;
    }

    /**
    * Sets the state of the simulation
    * @param {*} isSimulationRunning true or false depending on if simulation is running or not.
    */
    setIsSimulationRunning(isSimulationRunning){
      console.log(`Simulation running ?: ${isSimulationRunning}`)
      this._isSimulationRunning = isSimulationRunning;
    }
}