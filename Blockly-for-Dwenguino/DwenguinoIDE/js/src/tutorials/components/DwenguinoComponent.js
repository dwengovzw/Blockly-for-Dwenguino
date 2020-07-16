export { DwenguinoComponent, DwenguinoComponentTypesEnum }

/**
 * The supported robot component types
 */
const DwenguinoComponentTypesEnum = {
  SERVO: 'servo',
  LED: 'led',
  PIR: 'pir',
  SONAR: 'sonar',
  LCD: 'lcd',
  SOUND: 'sound',
  LIGHT: 'light',
  BUZZER: 'buzzer',
};
Object.freeze(DwenguinoComponentTypesEnum);

class DwenguinoComponent{
    constructor(){
      
        if (this.toString === undefined) {
          throw new Error('You have to implement the method toString');
        }

        if (this.getType === undefined) {
          throw new Error('You have to implement the method getType');
        }

    }
}