import { AbstractRobotComponent } from './abstract_robot_component.js';
import { TypesEnum } from '../robot_components_factory.js';
import BindMethods from "../../../utils/bindmethods.js"

export { SocialRobotLcd }

/**
 * @extends AbstractRobotComponent
 */
class SocialRobotLcd extends AbstractRobotComponent{
    constructor(eventBus, id, visible = true, offsetLeft = 5, offsetTop = 5, htmlClasses = '', simulation_container=null){
        super(simulation_container);
        BindMethods(this);

        this._id = id;
        this._type = TypesEnum.LCD;
        this._offset = { 'left': offsetLeft, 'top': offsetTop };
        this._state = new Array(2);

        this.insertHtml();
        this.toggleVisibility(visible);
    }

    toString(){
        return 'lcd';
    }

    insertHtml(){
        const component_container = $("<div>").attr("id", "sim_lcd" + this.getId()).addClass("sim_element sim_element_lcd draggable").css('top', this.getOffset()['top'] + 'px').css('left', this.getOffset()['left'] + 'px');
        component_container.append("<div>"+ DwenguinoBlocklyLanguageSettings.translateFrom('simulator',[this.getType()]) + " " + this.getId() +"</div>");
        const lcd_container = $("<div>").attr("id", "sim_element_lcd_img");
        component_container.append(lcd_container);
        lcd_container.append('<div class="lcd" id="sim_lcd_row0"></div>');
        lcd_container.append('<div class="lcd" id="sim_lcd_row1"></div>');
        this.simulation_container.append(component_container);

        /*component_container.append("<div id='sim_element_lcd_img'></div>");
        this.simulation_container.append("<div id='sim_lcd" + this.getId() + "' class='sim_element sim_element_lcd draggable'><div><span class='grippy'></span>"+ DwenguinoBlocklyLanguageSettings.translateFrom('simulator',[this.getType()]) + " " + this.getId() +"</div></div>");
        $('#sim_lcd' + this.getId()).css('top', this.getOffset()['top'] + 'px');
        $('#sim_lcd' + this.getId()).css('left', this.getOffset()['left'] + 'px');
        $('#sim_lcd' + this.getId()).append("<div id='sim_element_lcd_img'></div>");
        $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row0"></div>');
        $('#sim_element_lcd_img').append('<div class="lcd" id="sim_lcd_row1"></div>');*/
    }

    removeHtml(){
        $("#sim_lcd" + this.getId() + "").remove();
    }

    toXml(){
        let data = '';
        
        data = data.concat("<Item ");
        data = data.concat(" Type='", this.getType(), "'");
        data = data.concat(" Id='", this.getId(), "'");

        let simId = '#sim_' + this.getType() + this.getId();
        if ($(simId).attr('data-x')) {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']) + parseFloat($(simId).attr('data-x')), "'");
        } else {
            data = data.concat(" OffsetLeft='", parseFloat(this.getOffset()['left']), "'");
        }
        if ($(simId).attr('data-y')) {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']) + parseFloat($(simId).attr('data-y')), "'");
        } else {
            data = data.concat(" OffsetTop='", parseFloat(this.getOffset()['top']), "'");
        }

        data = data.concat(" Classes='", this.getHtmlClasses(), "'");

        data = data.concat('></Item>');

        return data;
    }

    reset(){
        this.setState("", "")
    }

    toggleVisibility(visible){
        if (visible) {
            $('#sim_lcd' + this.getId()).css('visibility', 'visible');
        } else {
            $('#sim_lcd' + this.getId()).css('visibility', 'hidden');
        }
    }

    getId(){
        return this._id;
    }

    getType(){
        return this._type;
    }

    setOffset(offset){
        this._offset = offset;
    }

    getOffset(){
        return this._offset;
    }

    setState(row0, row1){
        this._state[0] = row0;
        this._state[1] = row1;
    }

    getState(){
        return this._state;
    }

}