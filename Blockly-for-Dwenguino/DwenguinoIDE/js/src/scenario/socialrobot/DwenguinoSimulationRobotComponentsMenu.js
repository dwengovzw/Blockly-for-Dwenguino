
import { TypesEnum} from "./RobotComponentsFactory.js"
import { EventsEnum } from "./ScenarioEvent.js"
import { EventBus} from "./EventBus.js"

export default class DwenguinoSimulationRobotComponentsMenu {

  socialRobotScenario = {};
  constructor(eventBus){
    this._eventBus = eventBus;
    this._components = [
      {
        type: TypesEnum.SERVO,
        maximumAmount: 5
      }, {
        type: TypesEnum.LED,
        maximumAmount: 3
      }, {
        type: TypesEnum.PIR,
        maximumAmount: 2
      }, {
        type: TypesEnum.SONAR,
        maximumAmount: 1
      }, {
        type: TypesEnum.LCD,
        maximumAmount: 1
      }, {
        type: TypesEnum.SOUND,
        maximumAmount: 2
      }, {
        type: TypesEnum.LIGHT,
        maximumAmount: 2
      }, {
        type: TypesEnum.DECORATION,
        maximumAmount: 10
      }
    ]
  }

  /** 
  * Initializes the robot components menu environment when loading 
  * the social robot scenario.
  */
  setupEnvironment(socialRobotScenario) {
    this.socialRobotScenario = socialRobotScenario;
    console.log('setupEnvironment');
    /**
     * TODO: implement: if local storage contains robot components adjust the menu to 
     * display the current number of robot components of each type. 
     * // should actually already be handled by the socialrobotscenario which is used here.
     */
    this.initMenu();
    this.translateRobotComponents();

  }

  /**
   * Initialize the robot components menu 
   * when the scenario is loaded. 
   */
  initMenu() {
    $('#db_simulator_top_pane').append('<div id="robot_components_menu" class="scrolling-wrapper-flexbox"></div>');

    $('#robot_components_menu').append('<div id="rc_servo" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_servo').append('<div id="rc_servo_tag" class="rc_tag"></div>');
    $('#rc_servo').append('<div id="rc_servo_img"></div>');
    $('#rc_servo').append('<div id="rc_servo_options"></div>');

    $('#robot_components_menu').append('<div id="rc_led" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_led').append('<div id="rc_led_tag" class="rc_tag"></div>');
    $('#rc_led').append('<div id="rc_led_img"></div>');
    $('#rc_led').append('<div id="rc_led_options"></div>');

    $('#robot_components_menu').append('<div id="rc_pir" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_pir').append('<div id="rc_pir_tag" class="rc_tag"></div>');
    $('#rc_pir').append('<div id="rc_pir_img"></div>');
    $('#rc_pir').append('<div id="rc_pir_value"></div>');
    $('#rc_pir').append('<div id="rc_pir_options"></div>');

    $('#robot_components_menu').append('<div id="rc_sonar" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_tag" class="rc_tag"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_img"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_value"></div>');
    $('#rc_sonar').append('<div id="rc_sonar_options"></div>');

    $('#robot_components_menu').append('<div id="rc_lcd" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_tag" class="rc_tag"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_img"></div>');
    $('#rc_lcd').append('<div id="rc_lcd_options"></div>');

    $('#robot_components_menu').append('<div id="rc_sound" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_sound').append('<div id="rc_sound_tag" class="rc_tag"></div>');
    $('#rc_sound').append('<div id="rc_sound_img"></div>');
    $('#rc_sound').append('<div id="rc_sound_options"></div>');

    $('#robot_components_menu').append('<div id="rc_light" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_light').append('<div id="rc_light_tag" class="rc_tag"></div>');
    $('#rc_light').append('<div id="rc_light_img"></div>');
    $('#rc_light').append('<div id="rc_light_options"></div>');

    $('#robot_components_menu').append('<div id="rc_decoration" class="robot_components_item bg-c-4 card"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_tag" class="rc_tag"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_img"></div>');
    $('#rc_decoration').append('<div id="rc_decoration_options"></div>');

    this.initButtons();
  }

  /** 
   * Add buttons to the robot components menu to add or remove robot components 
   * in the scenario.
   */
  initButtons() {
  
    let servoOptions = this.generateButtonTemplate(TypesEnum.SERVO);
    $('#rc_servo_options').append(servoOptions);

    let ledOptions = this.generateButtonTemplate(TypesEnum.LED);
    $('#rc_led_options').append(ledOptions);

    let pirOptions = this.generateButtonTemplate(TypesEnum.PIR);
    $('#rc_pir_options').append(pirOptions);

    let sonarOptions = this.generateButtonTemplate(TypesEnum.SONAR);
    $('#rc_sonar_options').append(sonarOptions);

    let lcdOptions = this.generateButtonTemplate(TypesEnum.LCD);
    $('#rc_lcd_options').append(lcdOptions);

    let soundOptions = this.generateButtonTemplate(TypesEnum.SOUND);
    $('#rc_sound_options').append(soundOptions);

    let lightOptions = this.generateButtonTemplate(TypesEnum.LIGHT);
    $('#rc_light_options').append(lightOptions);

    // let decorationOptions = this.generateButtonTemplate(RobotComponentTypesEnum.DECORATION);
    // $('$rc_decoration_options').append(decorationOptions);
  
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

  resetButtons() {
    for (const [type, t] of Object.entries(TypesEnum)) {
      var input = $("input[name='"+ t +"']");
      input.val(0).change();
    }
  }

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
      document.getElementById('rc_' + t + '_tag').textContent = MSG.simulator[t];
    }
  }

  generateButtonTemplate(type){
    let template = '';
    this._components.forEach(function (component) {
      if(component.type == type){
        template = '<fieldset>' +
        '<button type="button" id="rc_'+type+'_minus_button" class="component_item_input btn-number" disabled="disabled" data-type="minus" data-field="'+type+'">' +
            '<span class="glyphicon glyphicon-minus" id="rc_'+type+'_minus_button">' +
            '</span>' +
            '</button>' +
        '<input type="text" name="'+type+'" class="component_item_input input-number" size="2" value="0" min="0" max="' + component.maximumAmount + '">' +
          '<button type="button" id="rc_'+type+'_plus_button" class="component_item_input btn-number" data-type="plus" data-field="'+type+'">' +
          '<span class="glyphicon glyphicon-plus" id="rc_'+type+'_plus_button">' +
          '</span>' + 
          '</button>' +
          '</fieldset>';
      }
    });
    return template
  }

  /*
   * This function adds the specified robot component to the 
   * social robot scenario.
   */
  addRobotComponent(id) {
    switch (id) {
      case "rc_servo_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.SERVO);
        break;
      case "rc_led_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.LED);
        break;
      case "rc_pir_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.PIR);
        break;
      case "rc_sonar_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.SONAR);
        break;
      case "rc_decoration_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.DECORATION);
        break;
      case "rc_lcd_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.LCD);
        break;
      case "rc_sound_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.SOUND);
        break;
      case "rc_light_plus_button":
        this.socialRobotScenario.addRobotComponent(TypesEnum.LIGHT);
        break;
      case "default":
        break;
    }

    // Save robot components when a component is added
    this._eventBus.dispatchEvent(EventsEnum.SAVE);
  }

  /*
   * This functions removes the last created specified robot component
   * from the social robot scenario.
   */
  removeRobotComponent(id) {
    switch (id) {
      case "rc_servo_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.SERVO);
        break;
      case "rc_led_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.LED);
        break;
      case "rc_pir_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.PIR);
        break;
      case "rc_sonar_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.SONAR);
        break;
      case "rc_decoration_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.DECORATION);
        break;
      case "rc_lcd_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.LCD);
        break;
      case "rc_sound_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.SOUND);
        break;
      case "rc_light_minus_button":
        this.socialRobotScenario.removeRobotComponent(TypesEnum.LIGHT);
        break;
      case "default":
        break;
    }

    // Save robot components when a component is deleted
    this._eventBus.dispatchEvent(EventsEnum.SAVE);
  }

};

 