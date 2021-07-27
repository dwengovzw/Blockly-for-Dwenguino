
import { TypesEnum} from "./robot_components_factory.js"
import { EventsEnum } from "./scenario_event.js"
import { EventBus} from "./event_bus.js"
import { DwenguinoSimulationScenarioSocialRobot } from "./dwenguino_simulation_scenario_social_robot.js";

/**
 * This class is responsible for building and maintaining the social robot components menu in 
 * the simulation pane. It allows the user to add social robot components to the scenario. Each 
 * social robot component can only be added a certain number of times. 
 * 
 * @author zimcke@gmail.com
 */
class DwenguinoSimulationRobotComponentsMenu {

  socialRobotScenario = {};

  /**
   * Constructs the social robot components menu object and defines which robot components can be added.
   * Additionally it sets the maximum amount a certain component can be added to the simulation.
   * @constructs
   * @param {EventBus} eventBus - The eventBus that can be used to monitor certain events in the simulator.
   */
  constructor(eventBus){
    this._eventBus = eventBus;
    this._components = [
      {
        type: TypesEnum.SERVO,
        maximumAmount: 6
      }, {
        type: TypesEnum.LED,
        maximumAmount: 3
      }, {
        type: TypesEnum.RGBLED,
        maximumAmount: 3
      }, {
        type: TypesEnum.LEDMATRIX,
        maximumAmount: 1
      }, {
        type: TypesEnum.LEDMATRIXSEGMENT,
        maximumAmount: 4
      }, {
        type: TypesEnum.TOUCH,
        maximumAmount: 3
      }, {
        type: TypesEnum.BUTTON,
        maximumAmount: 3
      }, {
        type: TypesEnum.PIR,
        maximumAmount: 2
      }, {
        type: TypesEnum.SONAR,
        maximumAmount: 4
      }, {
        type: TypesEnum.LCD,
        maximumAmount: 1
      }, {
        type: TypesEnum.SOUND,
        maximumAmount: 4
      }, {
        type: TypesEnum.LIGHT,
        maximumAmount: 2
      }
    ]
  }

  /**
   * Initializes the robot components menu environment by constructing and displaying the menu. This function
   * has to be called when the social robot scenario is created.
   * @param {DwenguinoSimulationScenarioSocialRobot} socialRobotScenario - The social robot scenario to which the social robot components are added.
   */
  setupEnvironment(socialRobotScenario) {
    this.socialRobotScenario = socialRobotScenario;
    console.debug('setupEnvironment');
    /**
     * TODO: implement: if local storage contains robot components adjust the menu to 
     * display the current number of robot components of each type. 
     * // should actually already be handled by the socialrobotscenario which is used here.
     */
    this.initMenu();
    this.translateRobotComponents();

  }

  /**
   * Load the robot components html menu into the simulator top pane.
   */
  initMenu() {
    $('#db_simulator_top_pane').append('<div id="robot_components_menu" class="scrolling-wrapper-flexbox"></div>');

    // INPUT 

    $('#robot_components_menu').append('<div id="rc_sonar" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_tag" class="rc_tag text-center"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_img" class="rc_img"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_value"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_sound" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_sound').append('<div id="rc_sound_tag" class="rc_tag text-center"></div>');
    $('#rc_sound').append('<div id="rc_sound_img" class="rc_img"></div>');
    $('#rc_sound').append('<div id="rc_sound_options" class="rc_options"></div>');

    // OUTPUT

    $('#robot_components_menu').append('<div id="rc_servo" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_servo').append('<div id="rc_servo_tag" class="rc_tag text-center"></div>');
    $('#rc_servo').append('<div id="rc_servo_img" class="rc_img"></div>');
    $('#rc_servo').append('<div id="rc_servo_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_lcd" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_tag" class="rc_tag text-center"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_img" class="rc_img"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_options" class="rc_options"></div>');
  
    $('#robot_components_menu').append('<div id="rc_ledmatrixsegment" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_ledmatrixsegment').append('<div id="rc_ledmatrixsegment_tag" class="rc_tag text-center"></div>');
    $('#rc_ledmatrixsegment').append('<div id="rc_ledmatrixsegment_img" class="rc_img"></div>');
    $('#rc_ledmatrixsegment').append('<div id="rc_ledmatrixsegment_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_rgbled" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_rgbled').append('<div id="rc_rgbled_tag" class="rc_tag text-center"></div>');
    $('#rc_rgbled').append('<div id="rc_rgbled_img" class="rc_img"></div>');
    $('#rc_rgbled').append('<div id="rc_rgbled_options" class="rc_options"></div>');

    // EXTRA

    $('#robot_components_menu').append('<div id="rc_pir" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_pir').append('<div id="rc_pir_tag" class="rc_tag text-center"></div>');
    $('#rc_pir').append('<div id="rc_pir_img" class="rc_img"></div>');
    $('#rc_pir').append('<div id="rc_pir_value"></div>');
    $('#rc_pir').append('<div id="rc_pir_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_touch" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_touch').append('<div id="rc_touch_tag" class="rc_tag text-center"></div>');
    $('#rc_touch').append('<div id="rc_touch_img" class="rc_img"></div>');
    $('#rc_touch').append('<div id="rc_touch_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_led" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_led').append('<div id="rc_led_tag" class="rc_tag text-center"></div>');
    $('#rc_led').append('<div id="rc_led_img" class="rc_img"></div>');
    $('#rc_led').append('<div id="rc_led_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_ledmatrix" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_ledmatrix').append('<div id="rc_ledmatrix_tag" class="rc_tag text-center"></div>');
    $('#rc_ledmatrix').append('<div id="rc_ledmatrix_img" class="rc_img"></div>');
    $('#rc_ledmatrix').append('<div id="rc_ledmatrix_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_button" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_button').append('<div id="rc_button_tag" class="rc_tag text-center"></div>');
    $('#rc_button').append('<div id="rc_button_img" class="rc_img"></div>');
    $('#rc_button').append('<div id="rc_button_options" class="rc_options"></div>');

    $('#robot_components_menu').append('<div id="rc_light" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_light').append('<div id="rc_light_tag" class="rc_tag text-center"></div>');
    $('#rc_light').append('<div id="rc_light_img" class="rc_img"></div>');
    $('#rc_light').append('<div id="rc_light_options" class="rc_options"></div>');

    this.initButtons();
  }

  /** 
   * Add buttons to the robot components menu to add or remove robot components 
   * in the scenario. Each button has an event handler to handle clicks from the client to add or remove robot component
   * robot components.
   */
  initButtons() {
  
    let options = null;
    for (const [key_type, value_type] of Object.entries(TypesEnum)) {
      options = this.generateButtonTemplate(value_type);
      $('#rc_'+value_type+'_options').append(options);  
    }
  
    let self = this;
    // Event handlers
    $('.btn-number').click(function(e){
      e.preventDefault();
      let fieldName = $(this).attr('data-field');
      let type = $(this).attr('data-type');
      var input = $("input[name='"+fieldName+"']");
      var currentVal = parseInt(input.val());
      if (!isNaN(currentVal)) {
          if(type == 'minus') {
              if(currentVal > input.attr('min')) {
                  input.val(currentVal - 1).change();
                  self.removeRobotComponent(e.target.id);
              } 
              if(parseInt(input.val()) == input.attr('min')) {
                  $(this).attr('disabled', true);
              }

          } else if(type == 'plus') {
              if(currentVal < input.attr('max')) {
                  input.val(currentVal + 1).change();
                  self.addRobotComponent(e.target.id);
              }
              if(parseInt(input.val()) == input.attr('max')) {
                  $(this).attr('disabled', true);
              }
          }
      } else {
          input.val(0);
      }
    });

    $('.input-number').focusin(function(){
        $(this).data('oldValue', $(this).val());
    });

    $('.input-number').change(function() {
        
        let minValue =  parseInt($(this).attr('min'));
        let maxValue =  parseInt($(this).attr('max'));
        let valueCurrent = parseInt($(this).val());
        
        let name = $(this).attr('name');
        if(valueCurrent >= minValue) {
            $(".component_item_input[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            $(this).val($(this).data('oldValue'));
        }
        if(valueCurrent <= maxValue) {
            $(".component_item_input[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
        } else {
            $(this).val($(this).data('oldValue'));
        }
    });

    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
              // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
              // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                  // let it happen, don't do anything
                  return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
  }

  /**
   * Reset the buttons to add or remove robot components to zero.
   */
  resetButtons() {
    for (const [type, t] of Object.entries(TypesEnum)) {
      var input = $("input[name='"+ t +"']");
      input.val(0).change();
    }
  }

  /**
   * 
   * @param {TypesEnum} type 
   * @param {int} number 
   */
  changeValue(type, number) {
    var input = $("input[name='"+ type +"']");
    var currentVal = parseInt(input.val())
    input.val(currentVal+number).change();
  }

  /**
   * This function translates the text of the robot components menu.
   */
  translateRobotComponents() {
    for (const [type, t] of Object.entries(TypesEnum)) {
      if(document.getElementById('rc_' + t + '_tag') != null){
        document.getElementById('rc_' + t + '_tag').textContent = DwenguinoBlocklyLanguageSettings.translateFrom('simulator',[t]);
      } else {
        console.debug('Translation error --- No component of type ', t);
      }
    }
  }

  /**
   * 
   * @param {TypesEnum} type 
   * @returns {string} The html code to be inserted in the simulator top pane
   */
  generateButtonTemplate(type){
    let template = '';
    this._components.forEach(function (component) {
      if(component.type == type){
        template = '<fieldset>' +
        '<button type="button" id="rc_'+type+'_minus_button" class="component_item_input btn-number" disabled="disabled" data-type="minus" data-field="'+type+'">' +
            '<span class="fas fa-minus" id="rc_'+type+'_minus_button">' +
            '</span>' +
            '</button>' +
        '<input type="text" name="'+type+'" class="component_item_input input-number" size="2" value="0" min="0" max="' + component.maximumAmount + '">' +
          '<button type="button" id="rc_'+type+'_plus_button" class="component_item_input btn-number float-right" data-type="plus" data-field="'+type+'">' +
          '<span class="fas fa-plus" id="rc_'+type+'_plus_button">' +
          '</span>' + 
          '</button>' +
          '</fieldset>';
      }
    });
    return template
  }

  /** 
   * This function adds the specified robot component to the 
   * social robot scenario.
   * @param {string} id 
   */
  addRobotComponent(id) {
    let type = this.extractType(id);
    this.socialRobotScenario.addRobotComponent(type);

    // Save robot components when a component is added
    this._eventBus.dispatchEvent(EventsEnum.SAVE);
  }

  /**
   * 
   * @param {String} id | id of a components's add or remove button in the form 'rc_type_plus_button' or 'rc_type_minus_button'.
   * @returns {TypesEnum} The component's type as a lowercase string .
   */
  extractType(id){
    let id_array = id.split('_');
    if(id_array.length >= 2){
      return id_array[1];
    } else {
      console.debug("No component type could be extracted from id ", id);
      return '';
    }
  }

  /**
   * This functions removes the last created specified robot component
   * from the social robot scenario.
   * @param {string} id 
   */
  removeRobotComponent(id) {
    let type = this.extractType(id);
    this.socialRobotScenario.removeRobotComponent(type);

    // Save robot components when a component is deleted
    this._eventBus.dispatchEvent(EventsEnum.SAVE);
  }

};

export default DwenguinoSimulationRobotComponentsMenu;