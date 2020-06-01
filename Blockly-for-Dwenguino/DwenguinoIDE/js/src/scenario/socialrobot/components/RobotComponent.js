export { RobotComponent }

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

    setHtmlClasses(htmlClasses){
      this._htmlClasses = htmlClasses;
    }
    
    getHtmlClasses(){
      return this._htmlClasses;
    }
}